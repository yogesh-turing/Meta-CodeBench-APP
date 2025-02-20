const { Command } = require('commander');
const { getUsers, filterUsers, searchUsers } = require('./api');

function titleCase(str) {
  return str
    .split(/(?=[A-Z])|\./)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatUserList(users) {
  return users.map((user, index) => {
    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');
    return `${index + 1}. ${fullName} (${user.age})`;
  }).join('\n');
}

const program = new Command()
  .name('user-cli')
  .description('CLI to manage users');

program
  .command('users')
  .description('List all users')
  .action(async () => {
    try {
      console.log('Fetching user list...');
      const users = await getUsers();
      console.log('Users fetched successfully');
      console.log(formatUserList(users));
    } catch (error) {
      console.error('User fetch failed:', error.message);
    }
  });

program
  .command('filter')
  .description('Filter users by a specific field')
  .requiredOption('-q, --query <query>', 'field to query')
  .requiredOption('-t, --term <term>', 'value to filter by')
  .action(async (options) => {
    try {
      console.log('Fetching and filtering users...');
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
    try {
      console.log('Searching users...');
      const users = await searchUsers(query);
      console.log('Users fetched successfully');
      console.log(formatUserList(users));
    } catch (error) {
      console.error('User fetch failed:', error.message);
    }
  });

module.exports = { program };