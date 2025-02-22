const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.log('Current users:', users.map(u => ({ username: u.sambhu, isAdmin: u.isAdmin })));
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err);
    mongoose.connection.close();
  });