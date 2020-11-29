module.exports = {
  // United Nations consolidated list
  UNOsanc: {
    host: 'scsanctions.un.org', 
    port: 443,
    path: '/resources/xml/en/consolidated.xml',
  },
  // United Nations terror list
  UNOterror: {
    host: 'fiu.gov.ua', 
    port: 443,
    path: '/assets/userfiles/Terror/zBlackListFull.xml',
  },
  // United states sunctions
  USAsanc: {
    host: 'treasury.gov',
    port: 443,
    path: '/ofac/downloads/sdn.xml'
  }
};
