const { series } = require('async');
const { exec } = require('child_process');
const path = require('path');

const task = (folder) => async () => {
  const folderPath = path.resolve(__dirname, '..', folder);

  return exec(
    `cd ${folderPath} && npm install @pashkoostap_learning_ticketing/common@latest`,
    () => console.log(`updated ${folder}`)
  );
};

series([task('orders'), task('tickets')]);
