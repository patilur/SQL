const Blog = require('./Blog');
const Comment = require('./Comment');


Blog.hasMany(Comment, { foreignKey: 'blogId' });
Comment.belongsTo(Blog, { foreignKey: 'blogId' });



module.exports = { Blog, Comment };