# CampusPulse API

Welcome to the CampusPulse API! This backend service is built with Node.js, Express, and Supabase.

## Base URL
All requests should be prefixed to your local host port (usually `http://localhost:3000`).

---

## Models & Endpoints

The API is fully RESTful and provides CRUD access to the following top-level resources:

- **Users** (`/users`)
- **Events** (`/events`)
- **Event Participants** (`/event-participants`)
- **Recommendations** (`/recommendations`)
- **Interests** (`/interests`)

Each resource shares the identical set of RESTful actions mapping to the Supabase database.

### 1. Retrieve all records
**`GET /<resource>`**
- Fetches all records from the respective table.
- Example: `GET /events`

### 2. Retrieve a single record
**`GET /<resource>/:id`**
- Fetches a specific record by its UUID.
- Example: `GET /users/3f6b6d52-4f9c-4d1a-8b4a-2c0c1c7d1c72`

### 3. Create a record
**`POST /<resource>`**
- Creates a new record. Returns the newly created record layout.
- Example: `POST /interests`

### 4. Update a record
**`PUT /<resource>/:id`**
- Updates a given record by its UUID based on the provided JSON payload.
- Example: `PUT /events/123e4567-e89b-12d3...`

### 5. Delete a record
**`DELETE /<resource>/:id`**
- Permanently drops the record from the database. Returns a `204 No Content` on success.
- Example: `DELETE /event-participants/3f6b6d52-4...`

---

## ⚡ Special Focus: User Profiling Workflow (`POST /users`)

The `POST /users` endpoint acts exclusively as an aggregated builder pattern to construct an entire normalized profile bridging multiple junction tables on the fly. 

**Endpoint:** `POST /users`

#### Example Body Payload:
```json
{
  "name": "Alice",
  "bio": "Hi, I am a first year CS major looking to make some friends and play volleyball!",
  "profile": {
    "year_of_study": 1,
    "major": "Computer Science",
    "mbti": "ENFP",
    "mood": "energetic",
    "fitness": "active",
    "extroversion": 3,
    "group_preference": "medium_group",
    "energy_level": "moderate"
  },
  "classes": ["CSC108", "MAT137"],
  "clubs": ["AI Club", "Volleyball Club"],
  "interests": ["volleyball", "gym", "anime"]
}
```

#### What runs automatically on the backend during creation:
1. **Inserts Base User**: Randomly generates a UUID and inserts `name` and `bio` into the `users` table.
2. **Attaches Profile Details**: Connects properties (e.g., mbti, fitness) to the `user_profiles` table.
3. **Tags & Junctions**: Identifies un-inserted classes, clubs, and interests, performs an upsert into their primary dictionary tables (ignoring duplicates), fetches their newly linked primary IDs, and finally inserts them mapped to the user within the `user_classes`, `user_clubs`, and `user_interests` bridging tables.

---

## Usage Requirements
- Running Postgres / Supabase Backend.
- `dotenv` securely mapped internally mapping to the respective Supabase keys. 
