const Thread = require('../model.js').Thread;
const mongoose = require('mongoose');

const createThread = async (board, text, delete_password, res) => {
  try {
    const newThread = new Thread({
      board,
      text,
      delete_password,
      replies: [],
    });

    await newThread.save();
    res.json(newThread);
  } catch (error) {
    console.error(error);
  }
};

const getThread = async (board, res) => {
  try {
    const threads = await Thread.find({ board })
      .sort({ bumped_on: -1 })
      .limit(10)
      .select('-reported -delete_password -replies.delete_password -replies.reported')
      .exec();

    const threadsArray = threads.map((thread) => {
      return {
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies,
        replycount: thread.replies.length,
      };
    });

    res.json(threadsArray);
  } catch (error) {
    console.log(error);
  }
};

const deleteThread = async (board, thread_id, delete_password, res) => {
  try {
    const thread = await Thread.findById(thread_id);
    if (thread.delete_password === delete_password) {
      await thread.deleteOne({ board: thread.board });
      res.send('success');
    } else {
      res.send('incorrect password');
    }
  } catch (error) {
    console.error(error);
  }
};

const reportThread = async (board, thread_id, res) => {
  try {
    const thread = await Thread.findOneAndUpdate(
      { _id: thread_id },
      { $set: { report: true } },
      { new: true }
    );

    res.send('reported');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createThread, getThread, deleteThread, reportThread };