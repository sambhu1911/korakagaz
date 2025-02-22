const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const currentUsername = 'sambhu nath sahu '; // Replace with actual current username from listUsers.js
    const newUsername = 'sambhu nath'; // Your new username
    const newPassword = 'sambhu2004'; // Your new password

    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      console.log(`User '${currentUsername}' not found`);
      return mongoose.connection.close();
    }

    user.username = newUsername;
    user.password = newPassword;
    await user.save();

    console.log(`User updated: Username: ${newUsername}, Password: ${newPassword}`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err);
    mongoose.connection.close();
  });