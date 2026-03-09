let blogContainer = document.getElementById("blogContainer");

// Load blogs when page loads
window.addEventListener("DOMContentLoaded", () => {

    axios.get("http://localhost:3000/blogs/getblogs")
        .then((res) => {

            const blogs = res.data;

            blogs.forEach(blog => {
                displayBlogOnScreen(blog);
            });

        })
        .catch(err => console.log(err));

});


// Form submit
function onSubmitHandler(event) {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    if (!title || !author || !content) {
        alert("Please fill all fields");
        return;
    }

    const blogDetails = {
        blogTitle: title,
        blogAuthor: author,
        blogContent: content
    };

    axios.post("http://localhost:3000/blogs/addBlog", blogDetails)
        .then((response) => {

            displayBlogOnScreen(response.data);

            clearForm();

        })
        .catch(err => console.log(err));

}



function displayBlogOnScreen(blog) {

    const parentNode = document.getElementById("blogContainer");

    const div = document.createElement("div");

    div.id = blog.id;

    div.innerHTML = `
        <h4>${blog.blogTitle}</h4>
        <p>Author : ${blog.blogAuthor}</p>
        <p>${blog.blogContent}</p>

        <h5>Comments</h5>

        <input type="text" id="comment-${blog.id}" placeholder="Write a comment">
        <button onclick="addComment(${blog.id})">Add</button>

        <ul id="commentList-${blog.id}"></ul>

        <hr>
    `;

    parentNode.appendChild(div);

    // display existing comments
    if (blog.Comments) {

        blog.Comments.forEach(comment => {
            displayComment(blog.id, comment);
        });

    }

}



function addComment(blogId) {

    const commentInput = document.getElementById(`comment-${blogId}`).value;

    if (!commentInput) {
        alert("Write a comment");
        return;
    }

    const commentDetails = {
        Comment_text: commentInput,
        blogId: blogId
    };

    axios.post("http://localhost:3000/blogs/addComment", commentDetails)
        .then((res) => {

            displayComment(blogId, res.data);

            document.getElementById(`comment-${blogId}`).value = "";

        })
        .catch(err => console.log(err));

}



function displayComment(blogId, comment) {

    const parentNode = document.getElementById(`commentList-${blogId}`);

    const li = document.createElement("li");

    li.id = comment.id;

    li.innerHTML = `${comment.Comment_text}`;

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {

        axios.delete(`http://localhost:3000/blogs/deleteComment/${comment.id}`)
            .then(() => {

                removeCommentFromScreen(comment.id);

            })
            .catch(err => console.log(err));

    };

    li.appendChild(deleteBtn);

    parentNode.appendChild(li);

}



function removeCommentFromScreen(commentId) {

    const childNode = document.getElementById(commentId);

    if (childNode) {
        childNode.remove();
    }

}



function clearForm() {

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("content").value = "";

}