const { Schema, model, Types } = require('mongoose');


const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Username is Required',
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }

    ],
    friends: [this]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});


UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;