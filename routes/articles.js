const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  console.log('Not authenticated, redirecting to login');
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  console.log('Not admin, redirecting to home');
  res.redirect('/articles/home');
};

router.get('/home', async (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';
  let query = {};
  if (search) {
    query = { $or: [{ title: new RegExp(search, 'i') }, { content: new RegExp(search, 'i') }] };
  }
  if (category) {
    query.category = category;
  }
  const articles = await Article.find(query).populate('author');
  const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(3);
  res.render('home', { articles, session: req.session, search, category, recentArticles });
});

router.get('/article/:id', async (req, res) => {
  const article = await Article.findById(req.params.id).populate('comments');
  res.render('article', { article, session: req.session });
});

router.post('/article/:id/comment', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    article: req.params.id
  });
  await comment.save();
  await Article.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
  res.redirect(`/articles/article/${req.params.id}`);
});

router.get('/dashboard', isAuthenticated, async (req, res) => {
  const articles = await Article.find({ author: req.session.userId });
  res.render('dashboard', { articles, session: req.session });
});

router.post('/create', isAdmin, async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
    author: req.session.userId
  });
  await article.save();
  res.redirect('/articles/dashboard');
});

router.post('/edit/:id', isAdmin, async (req, res) => {
  const update = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
  };
  await Article.findByIdAndUpdate(req.params.id, update);
  res.redirect('/articles/dashboard');
});

router.post('/delete/:id', isAdmin, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/articles/dashboard');
});

module.exports = router;