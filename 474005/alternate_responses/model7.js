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
  .description('Filter users based on a query')
  .option('-q, --query <query>', 'Query to filter users')
  .option('-t, --term <term>', 'Term to filter users')
  .action(async (options) => {
    console.log('Fetching and filtering users...');
    try {
      const users = await filterUsers(options.query, options.term);
      console.log('Users fetched successfully');
      const table = users.map((user) => ({
        Name: `${user.firstName} ${user.lastName}`,
        [options.query.replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase())]: user[options.query],
      }));
      console.table(table);
    } catch (error) {
      console.error('User fetch failed');
      console.error(error);
    }
  });

program
  .command('search <query>')
  .description('Search users based on a query')
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