const router = require('express').Router();
const { Thought, User } = require('../../models');

// get all Thought API route
router.get('/', (req, res) => {
    Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// get Thought by id
router.get('/:id', ({ params }, res) => {
    Thought.findOne({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// POST Thought route
router.post('/', ({ body }, res) => {
    Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: _id } }, { runValidators: true, new: true });
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
});

// PUT Thought route
router.put('/:id', ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
});

// Delete Thought route
router.delete('/:id', ({ params }, res) => {
    Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate({ _id: body.userId }, { $pull: { thoughts: params.id } }, { new: true });
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
});



// Thought Reaction Route
// api/thoughts/:thoughtId/reactions
router.post('/:thoughtId/reactions', ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body } }, { runValidators: true, new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Thought Reaction By Id Route
//api/thoughts/:thoughtId/reactions/reactionId
router.delete('/:thoughtId/reactions/:reactionId', ({ params }, res) => {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId } } }, { runValidators: true, new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;