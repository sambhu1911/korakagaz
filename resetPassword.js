const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const currentUsername = 'sambhu'; // Replace with username from listUsers.js
    const newPassword = 'mypassword456'; // Your new password

    const user = await User.findOne({ username: 'sambhu' });
    if (!user) {
      console.log(`User '${currentUsername}' not found`);
      return mongoose.connection.close();
    }

    user.password = newPassword;
    await user.save();

    console.log(`Password reset for ${currentUsername} to ${newPassword}`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err);
    mongoose.connection.close();
  });