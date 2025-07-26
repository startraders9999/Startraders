const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://startraders-fullstack-9ayr.onrender.com', // <-- Updated to new backend URL
      changeOrigin: true,
    })
  );
};
