require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const Article = require('./models/Article');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

app.get('/', (req, res) => res.redirect('/articles/home'));
app.get('/resources', async (req, res) => {
  const articles = await Article.find().limit(5); // Still needed for Resources page articles
  res.render('resources', { session: req.session, articles });
});
app.get('/about', (req, res) => res.render('about', { session: req.session }));
app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.redirect('/auth/login');
  res.render('profile', { session: req.session });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));