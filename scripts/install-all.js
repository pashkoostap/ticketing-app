const { series } = require('async');
const { exec } = require('child_process');
const path = require('path');

const task = (folder) => async () => {
  const folderPath = path.resolve(__dirname, '..', folder);
  const commands = [
    `cd ${folderPath}`,
    'rm -rf node_modules',
    'rm -rf package-lock.json',
    'npm install',
  ];

  return exec(commands.join('&&'), () => console.log(`installed ${folder}`));
};

series([
  task('orders'),
  task('tickets'),
  task('auth'),
  task('client'),
  task('payments'),
  task('expiration'),
]);
