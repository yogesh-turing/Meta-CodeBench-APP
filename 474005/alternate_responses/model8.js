// api.js (no changes)

// program.js
const { Command } = require('commander');
const { getUsers, filterUsers, searchUsers } = require('./api');

const program = new Command();

program
  .command('users')
  .description('List all users')
  .action(async () => {
    console.log('Fetching user list...');
    try {
      const users = await getUsers();
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

program
  .command('filter')
  .description('Filter users by a specific key and value')
  .option('-q, --query <key>', 'Key to filter by')
  .option('-t, --term <value>', 'Value to filter by')
  .action(async (options) => {
    console.log('Fetching and filtering users...');
    try {
      const users = await filterUsers(options.query, options.term);
      console.log('Users fetched successfully');
      const table = users.map((user) => ({
        Name: `${user.firstName} ${user.lastName}`,
        [options.query.replace('.', ' ').replace(/(\w)([A-Z])/g, '$1 $2').trim()]: user[options.query],
      }));
      console.table(table);
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

program
  .command('search <query>')
  .description('Search users by a query')
  .action(async (query) => {
    console.log('Searching users...');
    try {
      const users = await searchUsers(query);
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

module.exports = { program };