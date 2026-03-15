import express from 'express';
import type { Application } from 'express';
import { supabase } from './supabase.js';

import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import eventParticipantRoutes from './routes/eventParticipants.js';
import recommendationRoutes from './routes/recommendations.js';
import interestRoutes from './routes/interests.js';
import chatRoutes from './routes/chats.js';
import messageRoutes from './routes/messages.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/event-participants', eventParticipantRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/interests', interestRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});