
const path = require('path');
const inquirer = require('inquirer');
const templateRelativePath = './template';
const ejs = require('ejs');
const fs = require('fs');
const getTemplatePath = require('../utils.js');
module.exports = (api, options) => {
  const templatePath = api.resolve(templateRelativePath);

  function getAnswers(pluginPath) {
    const options = {};
    try {
      const prompts = require(path.resolve(pluginPath, 'prompts.js'))
      return inquirer.prompt(prompts, options)
    } catch (e) {
      return Promise.resolve(options);
    }
  }

  return getTemplatePath(templatePath, '', ['./prompts.js', './generator/index.js']).then((pluginPath) => {
    return getAnswers(pluginPath).then(answers => {

      // 模版新文件支持变量名，已存在文件不修改
      api.postProcessFiles((files) => {
        Object.keys(files).forEach((name) => {
          if (fs.existsSync(path.resolve(process.cwd(), name))) {
            return;
          }
          const content = files[name];
          delete files[name];
          const targetName = ejs.render(name, answers);
          files[targetName] = content;
        });
      });
      const generator = require(path.resolve(pluginPath, 'generator/index.js'));
      return generator(api, answers);
    });
  });
}
