const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Post = require('../models/Post.model');
const User = require('../models/User.model');

router.post('/', async (req, res) => {
    const { imageUrl, caption, owner } = req.body; 

    try {
        const newPost = new Post({
            imageUrl,
            caption,
            owner
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error creating post');
    }
});

router.get('/', async (req, res) => {
    try {
        // Fetch all posts, and populate the owner field to show the username
        const posts = await Post.find().populate('owner', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching posts');
    }
});

router.put('/:id/give-mici', async (req, res) => {
    const { userId } = req.body; 
    const postId = req.params.id;

    // Start a Mongoose session to guarantee both updates happen or neither does.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find the user (the Mici giver)
        const user = await User.findById(userId).session(session);
        // 2. Find the post (the Mici receiver)
        const post = await Post.findById(postId).session(session);

        if (!user || !post) {
            throw new Error('User or Post not found.');
        }

        // 3. Check for balance
        if (user.miciBalance <= 0) {
            // Mici inflation prevention!
            throw new Error("Nu mai ai mici!(Saracule)");
        }

        // 4. Perform the Transaction
        user.miciBalance -= 1;        // Deduct 1 from Giver
        post.miciReceived += 1;       // Add 1 to Post

        await user.save({ session });
        await post.save({ session });

        // Commit transaction if both saves succeed
        await session.commitTransaction();
        
        // Respond with the new data for the frontend to update the UI
        res.json({ 
            message: "Mancam MICI azi!", 
            currentBalance: user.miciBalance,
            postLikes: post.miciReceived 
        });

    } catch (err) {
        // Rollback transaction if any step failed
        await session.abortTransaction();
        console.error('Mici Transaction Error:', err.message);
        res.status(400).json({ error: err.message });
        
    } finally {
        session.endSession();
    }
});


module.exports = router;