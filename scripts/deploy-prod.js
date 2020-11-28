const { series } = require('async');
const { exec } = require('child_process');

const task = (command) => async () => {
  return exec(command, () => `Done: ${command}`);
};

series([
  task('kubectl config use-context cloud_okteto_com'),
  task('kubectl delete --all deployment --namespace=pashkoostap'),
  task('kubectl apply ./infra/k8s-prod'),
]);
