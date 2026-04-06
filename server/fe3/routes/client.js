const express = require('express');
const router = express.Router();
const { create } = require('xmlbuilder2');
const logger = require('../utils/logger');
const soapBuilder = require('../services/soapBuilder');
const targeting = require('../services/targeting');

router.post('/client.asmx', (req, res) => {
  const soapAction = req.headers['soapaction'] || '';
  logger.logRequest(req, { soapAction });

  let responseXml = '';

  if (soapAction.includes('GetConfig')) {
    responseXml = soapBuilder.buildGetConfig();
  } else if (soapAction.includes('SyncUpdates')) {
    // Attempt to extract from headers first (for custom clients)
    let device = req.headers['x-device-model'];
    let osVersion = req.headers['x-os-version'];

    // Fallback to parsing SOAP body for native emulation
    if (!device || !osVersion) {
      try {
        const doc = create(req.body);
        const docObj = doc.toObject();

        // Traverse the object to find Parameters
        const findParameters = (obj) => {
          if (!obj || typeof obj !== 'object') return null;
          for (const key in obj) {
            if (key.includes('Parameters')) return obj[key];
            const found = findParameters(obj[key]);
            if (found) return found;
          }
          return null;
        };

        const params = findParameters(docObj);
        if (params) {
          device = device || params['DeviceModel'] || params['ws:DeviceModel'] || params['a:DeviceModel'];
          osVersion = osVersion || params['OSVersion'] || params['ws:OSVersion'] || params['a:OSVersion'];

          // Handle cases where values are objects (due to attributes)
          if (typeof device === 'object' && device['#']) device = device['#'];
          if (typeof osVersion === 'object' && osVersion['#']) osVersion = osVersion['#'];
        }
      } catch (err) {
        logger.error('Error parsing SOAP body for SyncUpdates', err);
      }
    }

    // Final fallbacks
    device = device || 'Unknown';
    osVersion = osVersion || '10.0.0.0';

    logger.info(`SyncUpdates requested for device: ${device}, OS: ${osVersion}`);

    const matchedUpdates = targeting.findUpdates(device, osVersion);
    responseXml = soapBuilder.buildSyncUpdates(matchedUpdates);
  } else {
    logger.error('Unsupported SOAP Action', soapAction);
    return res.status(400).send('Unsupported SOAP Action');
  }

  res.setHeader('Content-Type', 'application/soap+xml; charset=utf-8');
  res.send(responseXml);
});

module.exports = router;
