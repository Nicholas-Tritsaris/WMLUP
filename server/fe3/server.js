const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const config = require('../shared/config.json');

// Ensure clientRoutes is imported AFTER Targeting initializes (optional but safe)
const clientRoutes = require('./routes/client');

const app = express();
const port = config.port || 3000;

// Body parser for SOAP requests
app.use(bodyParser.text({ type: ['application/soap+xml', 'text/xml'] }));

// Middleware for logging
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Use ClientWebService routes
app.use('/ClientWebService', clientRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'WMLUP FE3 Emulation Server Running' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Exception', err);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  logger.info(`WMLUP FE3 Emulation Server starting on port ${port}...`);
  logger.info(`FE3 URL: ${config.fe3_url}`);
  logger.info(`TLU URL: ${config.tlu_url}`);
});
