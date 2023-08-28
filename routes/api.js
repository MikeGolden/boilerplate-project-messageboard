'use strict';
const mongoose = require('mongoose');
const { createThread, getThread, deleteThread, reportThread } = require('../handler/threadHandler.js');
const { createReplies, getReplies, deleteReplies, reportReplies } = require('../handler/repliesHandler.js');

module.exports = function (app) {
  app.route('/api/threads/:board')
    .post((req, res) => {
      const { board } = req.params;
      const { text, delete_password } = req.body;
      createThread(board, text, delete_password, res);
    })
    .get((req, res) => {
      const { board } = req.params;
      getThread(board, res);
    })
    .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, delete_password } = req.body;
      deleteThread(board, thread_id, delete_password, res);
    })
    .put((req, res) => {
      const { board } = req.params;
      const { thread_id } = req.body;
      reportThread(board, thread_id, res);
    });

  app.route('/api/replies/:board')
    .post((req, res) => {
      const { board } = req.params;
      const { thread_id, text, delete_password } = req.body;
      createReplies(board, thread_id, text, delete_password, res);
    })
    .get((req, res) => {
      const { board } = req.params;
      const { thread_id } = req.query;
      getReplies(board, thread_id, res);
    })
    .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, reply_id, delete_password } = req.body;
      deleteReplies(board, thread_id, reply_id, delete_password, res);
    })
    .put((req, res) => {
      const { board } = req.params;
      const { thread_id, reply_id } = req.body;
      reportReplies(board, thread_id, reply_id, res);
    });
};