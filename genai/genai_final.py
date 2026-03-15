import argparse
import json
import os
import sys

from openai import OpenAI
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers.utils import logging


def profile_to_text(user):

    p = user["user_profile"]

    text = f"""
    Major: {p['major']}
    Year: {p['year_of_study']}
    Age: {p['age']}
    Gender: {p['gender']}
    MBTI: {p['mbti']}
    Mood: {p['mood']}
    Fitness: {p['fitness']}

    Personality:
    Extroversion {p['personality']['extroversion']}
    Group preference {p['personality']['group_preference']}
    Energy {p['personality']['energy_level']}

    Interests: {", ".join(p['interests'])}
    Classes: {", ".join(p['class'])}
    Clubs: {", ".join(p['club'])}
    """

    return text


logging.set_verbosity_error()
MODEL = SentenceTransformer("all-MiniLM-L6-v2")


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "test"),
    base_url="https://vjioo4r1vyvcozuj.us-east-2.aws.endpoints.huggingface.cloud/v1"
)

def explain_match(userA, userB):

    prompt = f"""
    Evaluate the friendship compatibility of these two people. Do not include reasoning.

    Person A:
    {profile_to_text(userA)}

    Person B:
    {profile_to_text(userB)}

    Focus on compatibility in:
    - interests
    - personality
    - extroversion
    - energy level
    - activities
    - mbti
    - mood
    - fitness
    - year of study
    - major
    - club
    - class
    - age

    Specifically, weigh Interests, Personality, Activities, and MBTI more strongly.

    Return your answer in the following JSON format:

    {{
      "score": number between 0 and 1,
    }}
    """

    try:
        resp = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You analyze friendship compatibility and output JSON. Return ONLY JSON. Do not include reasoning.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=2400,
        )
    except Exception:
        return {
            "score": None,
        }

    choice = resp.choices[0]

    content = None

    if hasattr(choice, "message") and choice.message:
        content = choice.message.content
    elif hasattr(choice, "text"):
        content = choice.text

    if content:
        try:
            return json.loads(content)
        except Exception:
            return {
                "score": None,
            }

    return {
        "score": None,
    }

# -----------------------------
# Run system
# -----------------------------

def get_user_compatibility(user_name, users, embeddings):
    """
    Returns a dictionary of {other_user_name: similarity_score} for all other users.
    """

    try:
        user_idx = next(i for i, u in enumerate(users) if u["name"] == user_name)
    except StopIteration:
        raise ValueError(f"User {user_name} not found.")

    user_embedding = embeddings[user_idx]
    similarity_matrix = cosine_similarity([user_embedding], embeddings)[0]
    
    score_dict_final = {}

    userA = users[user_idx]

    for i, u in enumerate(users):
        if i == user_idx:
            continue

        userB = users[i]

        # embedding similarity score
        embed_score = float(similarity_matrix[i])

        # LLM compatibility score
        explanation_data = explain_match(userA, userB)

        llm_score = 0
        if isinstance(explanation_data, dict) and explanation_data.get("score") is not None:
            llm_score = float(explanation_data["score"])

        # combine scores (weighted)
        final_score = 0.7 * embed_score + 0.3 * llm_score

        score_dict_final[userB["name"]] = {
            "embedding_score": embed_score,
            "llm_score": llm_score,
            "final_score": final_score,
        }

    score_dict_final = dict(
        sorted(score_dict_final.items(), key=lambda x: x[1]["final_score"], reverse=True)
    )

    return score_dict_final

def run_compatibility(user_name, users):
    profile_texts = [profile_to_text(u) for u in users]
    embeddings = MODEL.encode(profile_texts)
    return get_user_compatibility(user_name, users, embeddings)


def main(user_name, users, print_readable=True) -> dict:
    scores = run_compatibility(user_name, users)

    if print_readable:
        print(f"Compatibility scores for {user_name}:")
        for other_user, data in scores.items():
            print(f"\n{other_user}")
            print(f"Embedding Score: {data['embedding_score']:.2f}")
            print(f"LLM Score: {data['llm_score']:.2f}")
            print(f"Final Score: {data['final_score']:.2f}")

    return scores


def _load_default_users():
    with open("users.json", "r", encoding="utf-8") as f:
        return json.load(f)


def _run_cli():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stdin", action="store_true", help="Read payload JSON from stdin")
    parser.add_argument("--current-user", type=str, default="Jennifer")
    args = parser.parse_args()

    if args.stdin:
        payload = json.load(sys.stdin)
        users = payload.get("users", [])
        current_user = payload.get("current_user_name", args.current_user)
        scores = main(current_user, users, print_readable=False)
        print(json.dumps(scores))
        return

    users = _load_default_users()
    main(args.current_user, users, print_readable=True)


if __name__ == "__main__":
    _run_cli()