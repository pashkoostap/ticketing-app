const { series } = require('async');
const { exec } = require('child_process');

const common = ' npm install @pashkoostap_learning_ticketing/common@latest';

series([
  () => {
    exec(`cd ./orders && ${common}`);
    console.log('updated orders');
  },
  () => {
    exec(`cd ./tickets && ${common}`);
    console.log('updated tickets');
  },
]);
