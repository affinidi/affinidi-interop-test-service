const { createProxyMiddleware } = require('http-proxy-middleware');

let target 
if (process.env.REACT_APP_ENVIRONMENT === 'local') target = 'http://localhost:3000'
else if (process.env.REACT_APP_ENVIRONMENT === 'docker') target = 'http://server:3000'

module.exports = function(app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};