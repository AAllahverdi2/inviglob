const path = require('path');

module.exports = {
  basePath: '/admin-panel', 
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "./styles/variables.scss";`
  }
};