const { Thread, Replies } = require('../model.js');
const mongoose = require('mongoose');

const createReplies = async (board, thread_id, text, delete_password, res) => {
  try {
    const newReply = new Replies({
      text: text,
      delete_password: delete_password,
    });

    await Thread.findByIdAndUpdate(thread_id, { bumped_on: new Date() });

    const thread = await Thread.findById(thread_id);
    thread.replies.push(newReply);
    await thread.save();
    res.json(newReply);
  } catch (error) {
    console.error(error);
  }
};

const getReplies = async (board, thread_id, res) => {
  try {
    const thread = await Thread.findById(thread_id)
      .select('-delete_password -reported -replies.delete_password -replies.reported')
      .populate({
        path: 'replies',
        options: { sort: { created_on: 1 } },
      })
      .exec();
    res.json(thread);
  } catch (error) {
    console.error(error);
  }
};

const deleteReplies = async (board, thread_id, reply_id, delete_password, res) => {
  try {
    const thread = await Thread.findById(thread_id);
    const reply = thread.replies.id(reply_id);
    if (reply.delete_password === delete_password) {
      reply.text = "[deleted]";
      await thread.save();
      res.send('success');
    } else {
      res.send('incorrect password');
    }
  } catch (error) {
    console.error(error);
  }
};

const reportReplies = async (board, thread_id, reply_id, res) => {
  try {
    const thread = await Thread.findById(thread_id);
    const reply = thread.replies.id(reply_id);
    reply.reported = true;
    await thread.save();
    res.send('reported');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createReplies, getReplies, deleteReplies, reportReplies };