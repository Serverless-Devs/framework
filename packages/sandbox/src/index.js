const { spawnSync } = require('child_process');

spawnSync(`npm run server`, { shell: true, stdio: 'inherit' });
