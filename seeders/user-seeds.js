'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      email: 'root@example.com',
      avatar: 'https://loremflickr.com/320/240/people?random=100',
      introduction: faker.lorem.text(),
      role: 'admin',
      cover: 'https://loremflickr.com/320/240/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      account: 'user1',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      email: 'user1@example.com',
      avatar: 'https://loremflickr.com/320/240/people?random=100',
      introduction: faker.lorem.text(),
      role: '',
      cover: 'https://loremflickr.com/320/240/nature?random=100',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};