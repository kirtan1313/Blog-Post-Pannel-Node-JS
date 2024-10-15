const blog_Models = require('../Modules/BlogModels')
const username = require('../Modules/Authontication');
const { render } = require('ejs');
const fs = require('fs');
const addTopicModel = require('../Modules/addTopicModels');
const Comment = require('../Modules/Comment'); 
const Blog = require('../Modules/BlogModels');
const User = require('../Modules/userSchema'); 

const addBlogFormController = (req, res) => {
    res.render('addBlogForm');
}

const getBlogController = async (req, res) => {
    try {
        const blogs = await blog_Models.find({}).populate({
            path: 'comments',
            populate: {
                path: 'user', 
                model: 'User',
                select: 'username' 
            }
        });
        const bloggers = await username.find({});

        console.log("Blogs with comments:", blogs);
        console.log("Bloggers:", bloggers);

        res.render('allBlogs', { blogs: blogs, bloggers: bloggers });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.redirect('/error');
    }
};

const myBlogerController = async (req, res) => {
    const bloggerEmail = req.user.email;
    const bloggersData = await blog_Models.find({ userEmail: bloggerEmail });
    console.log("bloggersData", bloggersData);

    res.render('my_blogs', { blogs: bloggersData });
}

const createBlogController = async (req, res) => {
    const authenticatedEmail = req.user.email;

    const newBlog = new blog_Models({
        title: req.body.title,
        content: req.body.content,
        path: req.file ? req.file.path : '',
        userEmail: authenticatedEmail
    })

    await newBlog.save()
    res.redirect('/')
}

const editBlogController = async (req, res) => {
    const blogId = req.params.id;
    const editBlog = await blog_Models.findById(blogId)
    console.log("blogId", editBlog);

    res.render('edit_blogs', { editBlog })
}

const updateBlogController = async (req, res) => {
    const updateid = req.params.id
    const updateBlog = await blog_Models.findById(updateid)
    if (req.file) {
        fs.unlink(updateBlog.path, (err) => {
            console.log(err);
        })
    }

    updateBlog.title = req.body.title
    updateBlog.content = req.body.content
    if (req.file) {
        updateBlog.path = req.file.path
    }

    const updateData = await blog_Models.findByIdAndUpdate(updateid, updateBlog, { new: true })
    res.redirect('/myBlogs');
}

const deleteBlogController = async (req, res) => {
    const deleteId = req.params.id;
    const deletedata = await blog_Models.findById(deleteId)

    fs.unlink(deletedata.path, (err) => {
        console.log(err);
    })

    const deleteBlog = await blog_Models.findByIdAndDelete(deleteId)
    res.redirect('/myBlogs');
}

const add_topic = async (req, res) => {
    try {
        const topics = await addTopicModel.find(); 
        const user = req.user; 
        res.render('addTopic', { topics, user });
    } catch (err) {
        console.log(err)
        res.redirect('/error'); 
    }
}

const addTopic = async (req, res) => {
    const { topic } = req.body;
    const userId = req.user ? req.user._id : null;

    if(topic && userId) {
        try {
            const newTopic = new addTopicModel({
                topic,
                userId
            });
            console.log('newtopic', newTopic);
            
            await newTopic.save(); 
            res.redirect('/addTopic'); 
        } catch (err) {
            console.log(err);
            res.redirect('/error');
        }
    } else {
        res.redirect('/addTopic'); 
    }
};

const deleteTopic = async (req, res) => {
    const { topicId } = req.body; 

    try {
        const topicToDelete = await addTopicModel.findById(topicId);

        if (topicToDelete) {
            const userId = req.user ? req.user._id : null; 

            if (topicToDelete.userId.toString() === userId.toString()) {
                res.redirect('/addTopic'); 
            } else {
                res.redirect('/unauthorized'); 
            }
        } else {
            res.redirect('/notfound');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/error'); 
    }
};

const addComment = async (req, res) => {
    const { text, comments } = req.body;
    const blogId = req.params.id;

    if (!text) {
        return res.redirect(`/allblog?error=Comment text is required`); 
    }

    try {
        const comment = new Comment({
            user: req.user._id,
            blog: blogId,
            text,
            comments
        });

        await comment.save();
        await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });
        res.redirect(`/allblog`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.redirect('/error');
    }
};

const getComments = async (req, res) => {
    const blogId = req.params.id;

    try {
        const comments = await Comment.find({ blog: blogId }).populate('user', 'username');
        res.render('comments', { comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.redirect('/error'); 
    }
};

module.exports = {
    addBlogFormController,
    createBlogController,
    getBlogController,
    myBlogerController,
    editBlogController,
    updateBlogController,
    deleteBlogController,
    add_topic,
    addTopic,
    deleteTopic,
    addComment,         
    getComments 
};
