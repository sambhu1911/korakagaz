const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany({});
    await User.create({ username: 'admin', password: 'password123', isAdmin: true });
    console.log('Admin user created (username: admin, password: password123)');
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err);
    mongoose.connection.close();
  });