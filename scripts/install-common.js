const { series } = require('async');
const { exec } = require('child_process');
const path = require('path');

const task = (folder) => async () => {
  const folderPath = path.resolve(__dirname, '..', folder);
  const commands = [
    `cd ${folderPath}`,
    'npm install @pashkoostap-learning/ticketing-common@latest',
  ];

  return exec(commands.join('&&'), () => console.log(`updated ${folder}`));
};

series([
  task('orders'),
  task('tickets'),
  task('auth'),
  task('payments'),
  task('expiration'),
]);
