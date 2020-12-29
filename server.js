const express = require('express');

const mongoose = require('mongoose');

const blogRouter = require('./routes/blogs');

const Blog = require('./models/Blog');

const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost/crudblog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: false
}));

app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    let blogs = await Blog.find().sort({ createdAt: 'desc' });
    
    res.render('index', {
        blogs: blogs
    });

});
app.use(express.static("public"));

app.use('/blogs', blogRouter);

app.listen(3000);