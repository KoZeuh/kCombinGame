import { Router } from 'express';
import { getUsers, createUser, updateUser, getLeaderboard  } from '../controllers/userController';

const router: Router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.get('/leaderboard', getLeaderboard);

export default router;
