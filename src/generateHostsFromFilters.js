const generateHostsFromFilters = (content) => {
  const lines = [];
  const notUsedLines = [];
  const online = (line) => {
    let used = false;

    const matches = /^\|\|([a-z0-9A-Z\.\-\_]*)(\^|\^\$all|\^\$third\-party|\^\$document,popup|\^\$document)?$/.exec(line);
    if (matches) {
      const dns = matches[1];

      if (!/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})?$/.test(dns)) {
        lines.push(`127.0.0.1 ${dns}`);
        used = true;
      }

    }

    if (!used) {
      notUsedLines.push(`# 127.0.0.1 ${line}`);
    }
  }

  content.split(/\r?\n/).forEach(online);
  return lines.join('\r\n') + '\r\n' + notUsedLines.join('\r\n');
}

export default generateHostsFromFilters;
