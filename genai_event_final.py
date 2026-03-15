import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
import os
from transformers.utils import logging
import re

with open("events.json", "r") as f:
    events_data = json.load(f)["data"]

with open("users.json", "r") as f:
    users = json.load(f)


def profile_to_text(user):
    p = user["user_profile"]
    return f"Interests: {', '.join(p['interests'])}"

def event_to_text(event):
    return f"Interests: {', '.join(event.get('interest_tag', []))}"

logging.set_verbosity_error()
model = SentenceTransformer("all-MiniLM-L6-v2")

event_texts = [event_to_text(e) for e in events_data]
event_embeddings = model.encode(event_texts)


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "test"),
    base_url="https://qyt7893blb71b5d3.us-east-2.aws.endpoints.huggingface.cloud/v1"
)

def explain_match(user, event):
    prompt = f"""
    Evaluate compatibility between a person and an event based on their interests.

    Consider overlap between interests.

    Scoring guide:
    0.0 = no relation
    0.3 = weak relation
    0.5 = moderate relation
    0.7 = strong relation
    1.0 = perfect match

    Person interests:
    {profile_to_text(user)}

    Event interests:
    {', '.join(event.get('interest_tag', []))}

    Return ONLY JSON:
    {{
        "score": number between 0 and 1
    }}
    """

    try:
        resp = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "Return ONLY JSON with a single numeric 'score' between 0 and 1."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=10000
        )

        content = getattr(resp.choices[0].message, "content", None)
        if not content:
            content = getattr(resp.choices[0], "text", "")
          
        try:
            return json.loads(content)
        except:
            match = re.search(r'"score"\s*:\s*([0-9.]+)', content)
            if match:
                return {"score": float(match.group(1))}
    except Exception as e:
        print("LLM call error:", e)

    return {"score": None}

def get_user_event_compatibility(user, user_embedding, events, event_embeddings):
    scores = {}
    for i, event in enumerate(events):
        event_embedding = event_embeddings[i]
        embed_score = float(cosine_similarity([user_embedding], [event_embedding])[0][0])

        # LLM score
        llm_data = explain_match(user, event)
        llm_score = float(llm_data["score"]) if llm_data.get("score") is not None else 0

        final_score = min(1, 0.35 + (0.7 * embed_score + 0.3 * llm_score))

        scores[event["title"]] = {
            "embedding_score": embed_score,
            "llm_score": llm_score,
            "final_score": final_score
        }

    scores = dict(sorted(scores.items(), key=lambda x: x[1]["final_score"], reverse=True))
    return scores

# -----------------------------
# Run System
# -----------------------------

def main(user_name):

    user = next(u for u in users if u["name"] == user_name)

    user_embedding = model.encode(profile_to_text(user))

    scores = get_user_event_compatibility(
        user,
        user_embedding,
        events_data,
        event_embeddings
    )

    print(f"\nCompatibility scores for {user_name}:")

    for event_name, data in scores.items():
        print(f"\n{event_name}")
        print(f"Embedding Score: {data['embedding_score']:.2f}")
        print(f"LLM Score: {data['llm_score']:.2f}")
        print(f"Final Score: {data['final_score']:.2f}")

    return scores

main("Jennifer")