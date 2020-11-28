const { series } = require('async');
const { exec } = require('child_process');

const task = () => async () => {
  const commands = [
    'kubectl config use-context cloud_okteto_com',
    'kubectl delete --all deployment --namespace=pashkoostap',
    'kubectl apply -f ./infra/k8s-prod',
  ];

  return exec(commands.join(' && '), () =>
    console.log(`Deploy prod completed`)
  );
};

series([task()]);
