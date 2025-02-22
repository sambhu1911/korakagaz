const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const currentUsername = 'admin'; // Current admin username
    const newUsername = 'sambhu nath sahu'; // New username
    const newPassword = '12345678'; // New password

    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      console.log(`User '${currentUsername}' not found`);
      return mongoose.connection.close();
    }

    user.username = "sambhu nath sahu";
    user.password = "12345678";
    await user.save();

    console.log(`Admin updated: Username: ${'sambhu'}, Password: ${'1234'}`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err);
    mongoose.connection.close();
  });