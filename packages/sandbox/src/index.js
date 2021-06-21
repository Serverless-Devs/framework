const { spawnSync } = require('child_process');
const minimist = require('minimist');
const path = require('path');
const filePath = path.resolve(__dirname, './sandbox.js');
const args = minimist(process.argv.slice(2));

spawnSync(`npx nodemon -e html,css,js,ts,json ${filePath}`, {
  shell: true,
  stdio: 'inherit',
  env: { ...process.env, ...args },
});
