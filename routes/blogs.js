const express = require('express');

const Blog = require('./../models/Blog');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const uploads = multer({
    storage: storage,
    limits: {
        fileSize:1024*1024*3
    }
});


router.get('/new', (req, res) => {
    res.render('new');
});
router.get('/:slug', async (req, res) => {
    let blog = await Blog.findOne({
        slug: req.params.slug
    });
    if (blog) {
        res.render('show', {
            blog: blog
        });
    } else {
        res.redirect('/');
    }
});
router.post('/', uploads.single('image'), async (req, res) => {
    let blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        img: req.file.filename
    });
    try {
        blog = await blog.save();
        res.redirect(`blogs/${blog.slug}`);
    } catch (error) {
        console.log(error);
    }
});
router.get('/edit/:id', async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    res.render('edit', {
        blog: blog
    });
});

router.put('/:id', async (req, res) => {
    req.blog = await Blog.findById(req.params.id);
    let blog = req.blog;
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.description = req.body.description
    try {
        blog = await blog.save();
        res.redirect(`/blogs/${blog.slug}`);
    } catch (error) {
        console.log(error);
        res.redirect(`/blogs/edit/${blog.id}`);
    }
});
router.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;