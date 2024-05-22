const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/kcombingame');

// Schéma et modèle Mongoose
const userSchema = new mongoose.Schema({
    username: String,
    level: Number,
    score: Number,
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
    const users = await User.find().sort({ score: -1, level: -1 });
    res.json(users);
});

app.post('/users', async (req, res) => {
    const { username, level, score } = req.body;
    const user = new User({ username, level, score });

    await user.save();

    res.status(201).json(user);
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { level, score } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const user = await User.findByIdAndUpdate(id, { level, score }, { new: true });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
