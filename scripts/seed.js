require('dotenv').config();
const mongoose = require('mongoose');
const {faker} = require('@faker-js/faker');
const connectDB = require('../src/config/db');
const User = require('../src/models/user.model');
const {hashPassword} = require('../src/utils/bcrypt/passwordBcrypt');

(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected for seeding');

    const USER_COUNT = process.env.USER_COUNT;
    const genders = ['male', 'female'];
    const skillsList = [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'HTML',
      'CSS',
      'Git',
      'Docker',
      'TypeScript',
      'Python',
      'Next.js',
      'Redux',
      'AWS',
      'Figma',
    ];

    const users = [];
    let skippedCount = 0;

    console.log(`Generating ${USER_COUNT} users...`);

    for (let i = 0; i < USER_COUNT; i++) {
      const gender = faker.helpers.arrayElement(genders);
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName(gender);
      const email = faker.internet.email({firstName, lastName}).toLowerCase();

      const existingUser = await User.findOne({email});
      if (existingUser) {
        skippedCount++;
        console.log(
          `[${i + 1}/${USER_COUNT}] Skipping existing email: ${email}`,
        );
        continue;
      }

      const rawPassword = `${firstName}@123`;
      const hashed = await hashPassword(rawPassword);
      const age = faker.number.int({min: 18, max: 50});

      const imageId = faker.number.int({min: 0, max: 99});
      const photoUrl = process.env.AVATAR_BASE_URL
        ? `${process.env.AVATAR_BASE_URL}/${gender}/512/${imageId}.jpg`
        : process.env.DEFAULT_PHOTO_URL;

      const user = {
        firstName,
        lastName,
        email,
        password: hashed,
        age,
        gender,
        about: faker.person.bio(),
        skills: faker.helpers.arrayElements(
          skillsList,
          faker.number.int({min: 3, max: 6}),
        ),
        isVerified: faker.datatype.boolean(),
        photoUrl,
      };

      users.push(user);
    }

    if (users.length > 0) {
      console.log(`Attempting to insert ${users.length} users...`);
      await User.insertMany(users);
      console.log(`Successfully inserted ${users.length} new users`);
    } else {
      console.log('No new users to insert.');
    }

    if (skippedCount > 0) {
      console.log(`Skipped ${skippedCount} existing users`);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
})();
