const blockIps = [
  '0.0.0.0',
  '127.0.0.1',
  'localhost',
  'localhost.localdomain',
  'local',
];

const parse = (content) => {
  const lines = [];

  const online = (line) => {
    // Remove all comment text from the line
    const lineSansComments = line.replace(/#.*/, '');
    const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments);
    if (matches && matches.length === 3) {
      // Found a hosts entry
      const ip = matches[1];
      const host = matches[2];

      if (blockIps.includes(ip) && !blockIps.includes(host)) {
        lines.push(`Domain, ${host}`);
      }
    }
  };

  content.split(/\r?\n/).forEach(online);
  return lines.join('\r\n');
};

export default parse;
