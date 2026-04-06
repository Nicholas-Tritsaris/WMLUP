const { create } = require('xmlbuilder2');
const config = require('../../shared/config.json');

const soapBuilder = {
  buildGetConfig: () => {
    const root = create({ version: '1.0', encoding: 'utf-8' })
      .ele('soap:Envelope', {
        'xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('soap:Body')
        .ele('GetConfigResponse', { xmlns: 'http://www.microsoft.com/SoftwareDistribution/Server/ClientWebService' })
          .ele('GetConfigResult')
            .ele('ProtocolVersion').txt('1.0').up()
            .ele('ConfigLastChanged').txt('2024-01-01T00:00:00Z').up()
          .up()
        .up()
      .up();
    return root.end({ prettyPrint: true });
  },

  buildSyncUpdates: (updates) => {
    const root = create({ version: '1.0', encoding: 'utf-8' })
      .ele('soap:Envelope', {
        'xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
      })
      .ele('soap:Body')
        .ele('SyncUpdatesResponse', { xmlns: 'http://www.microsoft.com/SoftwareDistribution/Server/ClientWebService' })
          .ele('SyncUpdatesResult')
            .ele('NewUpdates');

    updates.forEach(update => {
      root.ele('Update')
        .ele('ID').txt(update.id).up()
        .ele('Title').txt(update.title).up()
        .ele('Description').txt(update.description).up()
        .ele('DownloadUrl').txt(`${config.tlu_url}/updates/${update.file}`).up()
        .ele('Size').txt(update.size).up()
      .up();
    });

    return root.end({ prettyPrint: true });
  }
};

module.exports = soapBuilder;
