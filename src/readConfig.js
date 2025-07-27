// import { readFileSync } from 'node:fs';

const readConfig = async (configPath) => {
  const configContent = await import(configPath);// readFileSync(configPath, 'utf-8');
  const result = configContent.default; // JSON.parse(configContent);
  return result;
};

export default readConfig;
