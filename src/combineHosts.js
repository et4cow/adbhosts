import path from 'path';
import { glob } from "glob";
import { readFileSync, writeFileSync } from 'fs';

const combineHosts = async (dirname) => {
  let content = '';
  const hostsPathFiles = path.resolve(dirname, '**/**.hosts');
  const hostsPaths = await glob(hostsPathFiles);

  hostsPaths.forEach(path => {
    const hostsContent = readFileSync(path, 'utf-8');
    content += hostsContent;
  })

  const targetPath = path.resolve(dirname, './total.hosts')
  writeFileSync(targetPath, content, 'utf-8');
}

export default combineHosts
