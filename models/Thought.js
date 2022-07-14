const { Schema, model } = require('mongoose');
const dateTimeFormat = require('../utils/dateTimeFormat');
const reactionSchema = require('./Reaction');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: [1, 'Enter text for Thoughts!'],
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateTimeFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;