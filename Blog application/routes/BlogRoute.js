const express = require('express');
const router = express.Router();
const blogController = require('../controller/BlogController');

router.post('/addBlog', blogController.addBlog);
router.post('/addComment', blogController.addComment);
router.delete('/deleteComment/:id', blogController.deleteComment);
router.get('/getblogs', blogController.getBlogs);
router.get('/getComments/:blogId', blogController.getComments);

module.exports = router;