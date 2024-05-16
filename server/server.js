// server/server.js

import express from 'express';
import { use, authenticate } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connect } from 'mongoose';
import { findOneAndUpdate } from './models/User'; // Assuming your User schema is in a models folder

const app = express();

// MongoDB connection
connect('mongodb+srv://sakcdasanayaka01:<dasanayaka5674>@cluster0.m0de3uc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Passport setup
use(new GoogleStrategy({
    clientID: '38761488151-n5hkia5ll5jb5po67odqt2meolk4n5vs.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    // Create or update user in MongoDB
    findOneAndUpdate(
        { googleId: profile.id },
        { name: profile.displayName, email: profile.emails[0].value },
        { upsert: true, new: true },
        (err, user) => done(err, user)
    );
}));

app.get('/auth/google', authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to frontend app
        res.redirect('http://localhost:3000/');
    });

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

export default app; // Export the app for testing purposes or further modularization
