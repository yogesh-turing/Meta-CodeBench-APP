// program.js
const { Command } = require('commander');
const { getUsers, filterUsers, searchUsers } = require('./api');

const program = new Command();

program
  .command('users')
  .description('Get a list of all users')
  .action(async () => {
    console.log('Fetching user list...');
    try {
      const users = await getUsers();
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.middleName} ${user.lastName} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

program
  .command('filter')
  .description('Filter users by a specific key and value')
  .option('-q, --query <query>', 'The key to filter by')
  .option('-t, --term <term>', 'The value to filter by')
  .action(async (options) => {
    console.log('Fetching and filtering users...');
    try {
      const users = await filterUsers(options.query, options.term);
      console.log('Users fetched successfully');
      const table = users.map((user) => {
        return {
          Name: `${user.firstName} ${user.lastName}`,
          [options.query.replace('.', ' ').replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())]: user[options.query],
        };
      });
      console.table(table);
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

program
  .command('search <query>')
  .description('Search users by a specific query')
  .action(async (query) => {
    console.log('Searching users...');
    try {
      const users = await searchUsers(query);
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.middleName} ${user.lastName} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

module.exports = { program };