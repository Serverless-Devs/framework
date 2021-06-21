const { spawnSync } = require('child_process');
const path = require('path');
const filePath = path.resolve(__dirname, './sandbox.js');
spawnSync(`npx nodemon -e html,css,js,ts,json ${filePath}`, { shell: true, stdio: 'inherit' });
