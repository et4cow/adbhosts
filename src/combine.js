import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const combine = async (dirname) => {
  const domains = new Set();
  const keywords = new Set();
  const urls = new Set();

  const ruleFiles = path.resolve(dirname, './**/**.rule');
  console.log('ruleFiles', ruleFiles);
  const rulePaths = await glob(ruleFiles);

  const reg = /^(Domain|domain|KeyWord|URL),\ ([a-zA-Z\.0-9\_\-]+)$/;

  rulePaths.forEach((rulePath) => {
    const ruleContent = readFileSync(rulePath, 'utf8');
    const lines = ruleContent.split(/\r?\n/);

    lines.forEach((line) => {
      const matches = reg.exec(line);
      if (matches) {
        const type = matches[1];
        const content = matches[2];

        console.log(type, content);

        switch (type) {
          case 'Domain':
          case 'domain':
            domains.add(content);
            break;
          case 'KeyWord':
            keywords.add(content);
            break;
          case 'URL':
            urls.add(content);
            break;
        }
      }
    });
  });

  let content = '';
  domains.forEach((domain) => {
    content += `Domain, ${domain}\r\n`;
  });

  keywords.forEach((keyword) => {
    content += `KeyWord, ${keyword}\r\n`;
  });

  urls.forEach((url) => {
    content += `URL, ${url}\r\n`;
  });

  const targetPath = path.resolve(dirname, 'total.rules');
  writeFileSync(targetPath, content, 'utf-8');
};

export default combine;
