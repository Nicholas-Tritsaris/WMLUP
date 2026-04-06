const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Cache updates in memory
let cachedUpdates = [];
const updatesFilePath = path.join(__dirname, '../data/updates.json');

const loadUpdates = () => {
  try {
    const updatesData = fs.readFileSync(updatesFilePath, 'utf8');
    cachedUpdates = JSON.parse(updatesData);
    logger.info(`Targeting Engine: Loaded ${cachedUpdates.length} updates into memory.`);
  } catch (error) {
    logger.error('Error loading updates.json', error);
  }
};

// Watch for file changes to refresh the cache
fs.watchFile(updatesFilePath, (curr, prev) => {
  logger.info('updates.json changed. Refreshing cache...');
  loadUpdates();
});

// Initial load
loadUpdates();

const targeting = {
  findUpdates: function(device, osVersion) {
    try {
      const matchedUpdates = cachedUpdates.filter(update => {
        const deviceMatch = update.device === device;
        const versionMatch = targeting.isVersionInRange(osVersion, update.min_version, update.max_version);
        logger.info(`Checking update ${update.id}: deviceMatch=${deviceMatch}, versionMatch=${versionMatch}`);
        return deviceMatch && versionMatch;
      });

      logger.info(`Targeting result for ${device} (${osVersion}): Found ${matchedUpdates.length} updates`);
      return matchedUpdates;
    } catch (error) {
      logger.error('Error in targeting engine', error);
      return [];
    }
  },

  isVersionInRange: function(version, min, max) {
    const v = targeting.parseVersion(version);
    const minV = targeting.parseVersion(min);
    const maxV = targeting.parseVersion(max);

    // Check if v >= minV
    let isGreaterOrEqualThanMin = true;
    for (let i = 0; i < 4; i++) {
      if (v[i] > minV[i]) {
        isGreaterOrEqualThanMin = true;
        break;
      }
      if (v[i] < minV[i]) {
        isGreaterOrEqualThanMin = false;
        break;
      }
    }

    if (!isGreaterOrEqualThanMin) return false;

    // Check if v <= maxV
    let isLessOrEqualThanMax = true;
    for (let i = 0; i < 4; i++) {
      if (v[i] < maxV[i]) {
        isLessOrEqualThanMax = true;
        break;
      }
      if (v[i] > maxV[i]) {
        isLessOrEqualThanMax = false;
        break;
      }
    }

    return isLessOrEqualThanMax;
  },

  parseVersion: function(vString) {
    // Ensure 4 components
    let parts = vString.split('.').map(num => parseInt(num, 10));
    while (parts.length < 4) parts.push(0);
    return parts;
  }
};

module.exports = targeting;
