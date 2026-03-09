const Blog = require('../model/Blog');
const Comment = require('../model/Comment');


const addBlog = async (req, res) => {
    const { blogTitle, blogAuthor, blogContent } = req.body;

    try {
        const blog = await Blog.create({
            blogTitle,
            blogAuthor,
            blogContent
        })
        res.status(201).json(blog);
    }
    catch (err) {
        res.status(500).send('Unable to make entry');
    }
}

const addComment = async (req, res) => {
    const { Comment_text, blogId } = req.body;

    try {
        const comment = await Comment.create({
            Comment_text, blogId
        })
        res.status(201).json(comment);
    }
    catch (err) {
        res.status(500).send('Unable to make entry');
    }
}

const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Comment.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).send("Comment not found");
        }

        res.status(200).send("Comment deleted successfully");
    }
    catch (err) {
        res.status(500).send("Unable to delete comment");
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            include: Comment
        });

        res.status(200).json(blogs);
    }
    catch (err) {
        res.status(500).send('Unable to fetch blogs');
    }
}

const getComments = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { blogId }
        });

        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).send("Unable to fetch comments");
    }
}

module.exports = {

    addBlog, addComment, deleteComment, getBlogs, getComments
}