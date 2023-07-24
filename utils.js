const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

module.exports = function getTemplatePath(pluginPath, defaultTemplate, accessList = []) {
  if (accessList.some(item => fs.existsSync(path.resolve(pluginPath, item)))) {
    return Promise.resolve(pluginPath);
  }
  const files = fs.readdirSync(pluginPath);

  if (!files.length) {
    throw new Error('模版文件不存在');
  }
  if (files.length === 1) {
    return Promise.resolve(path.resolve(pluginPath, files[0]));
  }
  if (files.includes(defaultTemplate)) {
    return Promise.resolve(path.resolve(pluginPath, defaultTemplate));
  }
  return inquirer.prompt({
    type: 'list',
    name: 'template',
    message: '请选择模版目录',
    choices: files.map(item => ({value: item, name: item})),
  }).then(answers => {
    return Promise.resolve(path.resolve(pluginPath, answers.template));
  });
}