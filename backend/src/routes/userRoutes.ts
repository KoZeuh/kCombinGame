import { Router } from 'express';
import { getUser, createUser, updateUser, getLeaderboard  } from '../controllers/userController';

const router: Router = Router();

router.get('/user/get/:id', getUser);
router.post('/user/update', updateUser);
router.post('/user/create', createUser);

router.get('/leaderboard', getLeaderboard);

export default router;
