import express from 'express';
import * as Controller from '../controllers/RecommendationController.js';

const router = express.Router();

router.get('/', Controller.getAll);
router.get('/users-json', Controller.getUsersJson);
router.get('/buddy-matches-json', Controller.getBuddyMatchesJson);
router.get('/buddy-matches', Controller.getBuddyMatches);
router.get('/:id', Controller.getById);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.remove);

export default router;
