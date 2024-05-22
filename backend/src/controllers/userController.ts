import { Request, Response } from 'express';
import { User, IUser } from '../interfaces/user';
import mongoose from 'mongoose';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "err.message" });
  }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, level, score } = req.body;

    let user = await User.findOne({ username });

    if (user) {
      res.status(201).json(user);

      return;
    }

    user = new User({ username, level, score });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "err.message" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "err.message" });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ score: -1, level: -1 }).limit(3);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "err.message" });
  }
};