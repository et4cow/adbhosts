import path from 'path';
import { glob } from "glob";
import { readFileSync, writeFileSync } from 'fs';

const combineHosts = async (dirname) => {
  let content = '\r\n';
  const hostsPathFiles = path.resolve(dirname, '**/**.hosts');
  const hostsPaths = await glob(hostsPathFiles);

  hostsPaths.forEach(path => {
    const hostsContent = readFileSync(path, 'utf-8');
    content += hostsContent + '\r\n';
  })

  const lines = content.split(/\r?\n/);
  const lineSet = new Set();
  lines.forEach(line => {
    if (line[0] !== '#') {
      lineSet.add(line);
    }
  });

  const targetPath = path.resolve(dirname, './total.hosts')
  writeFileSync(targetPath, [...lineSet].join('\r\n'), 'utf-8');
}

export default combineHosts
