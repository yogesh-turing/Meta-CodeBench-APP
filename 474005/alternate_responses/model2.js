const { Command } = require('commander');
const { getUsers, filterUsers, searchUsers } = require('./api');

function formatName(user) {
  const middleName = user.middleName ? ` ${user.middleName} ` : ' ';
  return `${user.firstName}${middleName}${user.lastName}`;
}

function titleCase(str) {
  return str.split(/[._]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const program = new Command()
  .name('user-cli')
  .description('CLI to manage users');

program
  .command('users')
  .description('List all users')
  .action(async () => {
    console.log('Fetching user list...');
    try {
      const users = await getUsers();
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${formatName(user)} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed:', error.message);
    }
  });

program
  .command('filter')
  .description('Filter users by property')
  .requiredOption('-q, --query <query>', 'property to filter by')
  .requiredOption('-t, --term <term>', 'value to filter for')
  .action(async (options) => {
    console.log('Fetching and filtering users...');
    try {
      const users = await filterUsers(options.query, options.term);
      console.log('Users fetched successfully');
      
      const tableData = users.map(user => ({
        'Name': `${user.firstName} ${user.lastName}`,
        [titleCase(options.query)]: options.query.includes('.')
          ? options.query.split('.').reduce((obj, key) => obj[key], user)
          : user[options.query]
      }));

      console.table(tableData);
    } catch (error) {
      console.error('User fetch failed:', error.message);
    }
  });

program
  .command('search')
  .description('Search users')
  .argument('<query>', 'search query')
  .action(async (query) => {
    console.log('Searching users...');
    try {
      const users = await searchUsers(query);
      console.log('Users fetched successfully');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${formatName(user)} (${user.age})`);
      });
    } catch (error) {
      console.error('User fetch failed:', error.message);
    }
  });

module.exports = { program };