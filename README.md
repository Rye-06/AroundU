# AroundU

## Inspiration

Starting university can feel exciting, but it can also be isolating. Many students want to make friends, join activities, or find study partners, but it is often hard to discover people nearby who share the same interests.

Some students want to play pickup sports but cannot find others at a similar skill level. Others prefer group settings or want motivated study partners, but do not know where to start. Even on busy campuses, students can struggle to find community.

This inspired us to build an app that **helps students find informal communities on campus** based on proximity. It would help them make it easier to meet people, join activities, and build connections in a simple and low-pressure way.

## What it does

This app helps university students find people and activities around them on campus in a simple and low-pressure way. Students can create quick events happening in the next **15 to 20 minutes**, like studying, grabbing food, playing sports, or walking somewhere. Anyone nearby will get a notification and can choose to join. Students can also see other events happening around them in real time.

The app also uses AI to help students find compatible people. Instead of filling out long forms, users write a short paragraph about themselves. The AI analyzes their interests, personality, and energy level to suggest potential connections such as study buddies, classmates, or friends with similar hobbies.

A live campus heatmap shows where activity is occurring, enabling students to discover nearby events, groups, and communities. Students can also use features like skill swapping, anonymous icebreakers to start conversations, or finding classmates nearby to form quick study groups.

The goal is to make it easier for students to meet people, join activities, and build community on campus based on **proximity and shared interests**.

## How we built it

We used ReactJS, HTML, CSS, and TailwindCSS for the frontend. We used JavaScript, Supabase, NodeJS, Python, Hugging Face, OpenAI, Scikit Learn, NumPy, and Transformers for the backend. Antigravity was used as our IDE.

## Challenges we ran into

There were several challenges we ran into. On the front-end, we encountered issues with planning out the UI/UX and getting the map to properly display user data. We also spent a lot of time fixing the messaging feature and UI.

On the back-end, we encountered issues with creating and mapping out the models and their relationships with each other. 

To create the gen AI pipeline, we encountered issues with the model being too one-dimensional, with the embeddings. So, to fix this, we added a second layer of OpenAI to the model to allow weighted analysis of the compatibility score between two people.

## Accomplishments that we're proud of

We're proud to have created a live heat map and event pop-up feature that meets our product requirements. We are also proud of our gen AI pipeline (specifically HuggingFace) that would match users to other users and events that suited their personalities and requirements.

## What we learned

Using Supabase for backend server needs, UI/UX design, and the importance of walks/breaks after hours of work to refresh the mind. 

We learned how to use the Hugging Face model and create a weighted AI model to analyze the compatibility score between two people.

## What's next for AroundU

Incorporation of:
- Group finder
- Skill swap- connecting users with skills desired by each other
- Study buddy finder
- Campus Heatmap & Social Radar
- AI-based potential engagement rating for people posting an event, suggesting likely interest in the event based on the sentiment and interests of nearby users.

We would also like to improve compatibility scoring by adding a complex internal CNN system with vector databases.

Our platform uses AI to estimate potential engagement for events by analyzing the interests and sentiment of nearby users. When someone posts an event, the system predicts likely interest and recommends activity categories to improve turnout. To support shy users, we introduce a gamified Rewards and Challenges system. Interacting with users who connect less earns higher rewards, encouraging more outgoing participants to approach them and helping break social barriers. Instead of long forms, users write a short paragraph about themselves (e.g., “I’m an extroverted CS student who loves startups and the gym.”). An LLM extracts interests, personality traits, energy level, and compatibility signals to enable smarter recommendations and better connections.

For the backend, we need to make it more scalable and production-ready. This includes adding RLS, proper use of authentication, and adding indexes to the database for faster calls. We also want to restructure the DB architecture in order to expedite the database reading.



# Setup Instructions

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f1e46c9b-7121-47e2-93d3-aa99ca79ebfe

## Run Locally

**Prerequisites:**  Node.js, sentence-transformers, numpy, scikit-learn, openai, transformers


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set `VITE_GOOGLE_MAPS_API_KEY` in your environment file for Campus Map Google Maps rendering.
4. Run the app:
   `npm run dev`
