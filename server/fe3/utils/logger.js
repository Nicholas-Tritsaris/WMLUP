const logger = {
  info: (message, data = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`, data);
  },
  error: (message, error = '') => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error);
  },
  logRequest: (req, details = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] REQUEST: ${req.method} ${req.url}`, details);
  }
};

module.exports = logger;
