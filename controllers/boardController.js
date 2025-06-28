const Board = require('../models/Board');

exports.createBoard = async (req, res) => {
  try {
    const board = new Board({ title: req.body.title, user: req.user });
    await board.save();
    res.status(201).json(board);
  } catch {
    res.status(500).json({ error: 'Failed to create board' });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user });
    res.json(boards);
  } catch {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json({ msg: 'Board deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete board' });
  }
};
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title: req.body.title },
      { new: true }
    );
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch {
    res.status(500).json({ error: 'Failed to update board' });
  }
};