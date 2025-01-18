const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const compileTemplate = (templateName, variables) => {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${templateName}.hbs`,
    );

    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);

    return template(variables);
  } catch (error) {
    throw new Error('Failed to compile template');
  }
};

module.exports = {compileTemplate};
