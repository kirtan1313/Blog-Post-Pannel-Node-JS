const blog_Models = require('../Modules/BlogModels')
const username = require('../Modules/Authontication');
const { render } = require('ejs');
const fs = require('fs');
const addTopicModel = require('../Modules/addTopicModels');

const addBlogFormController = (req, res) => {
    res.render('addBlogForm');
}

const getBlogController = async (req, res) => {
    const blogs = await blog_Models.find({});
    const bloggers = await username.find({});

    console.log("Blogs:", blogs);
    console.log("Bloggers:", bloggers);

    res.render('allBlogs', { blogs: blogs, bloggers: bloggers });
}

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
        const topics = await addTopicModel.find(); // Fetch topics from MongoDB
        res.render('addTopic', { topics }); // Pass the topics to the view
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving topics');
    }
}

const addTopic = async (req, res) => {
    const { topic } = req.body;
    if (topic) {
        try {
            const newTopic = new addTopicModel({ topic }); // Create a new topic document
            console.log('newtopic',newTopic);
            
            await newTopic.save(); // Save to MongoDB
            res.redirect('/addTopic'); // Redirect to the same page
        } catch (err) {
            console.log(err);
            res.status(500).send('Error adding topic');
        }
    } else {
        res.redirect('/addTopic'); // If no topic is provided, just redirect back
    }
}

const deleteTopic = async (req, res) => {
    const { index } = req.body;
    try {
        const topics = await addTopicModel.find(); // Fetch current topics
        const topicToDelete = topics[index]; // Find the topic based on index
        if (topicToDelete) {
            await addTopicModel.findByIdAndDelete(topicToDelete._id); // Delete topic by id
            res.redirect('/addTopic'); // Redirect back to the list of topics
        } else {
            res.status(404).send('Topic not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting topic');
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
    deleteTopic
};