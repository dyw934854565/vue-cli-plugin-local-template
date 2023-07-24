const process = require('child_process');

module.exports = (api) => {
  api.registerCommand(
    'init',
    {
      description: '执行本地的插件命令',
      usage: 'vue-cli-service init',
    },
    (...args) => {
      process.execSync('npx vue invoke local-template', { stdio: 'inherit', cwd: api.getCwd() });
    }
  )
}