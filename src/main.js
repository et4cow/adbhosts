import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { program } from 'commander';
import parse from './parse.js';
import readConfig from './readConfig.js';
import combine from './combine.js';
import requestHost from './requestHost.js';
import generateHostsFromFilters from './generateHostsFromFilters.js';
import { glob } from 'glob';
import combineHosts from './combineHosts.js';

const { cwd } = process;
const rootPath = cwd();

async function loadConfig() {
  const configPath = path.resolve(rootPath, './adhosts.config.js');
  const config = await readConfig(configPath);

  return config;
}

async function requestHostFiles() {
  const config = await loadConfig();

  if (Array.isArray(config.hosts)) {
    config.hosts.forEach(async (host) => {
      const gitPath = host.url;
      const hostPath = path.resolve(rootPath, host.host);

      const hostContent = await requestHost(gitPath);
      writeFileSync(hostPath, hostContent, 'utf-8');
    });
  }
}

async function generateRuleFiles() {
  const config = await loadConfig();

  if (Array.isArray(config.hosts)) {
    config.hosts.forEach((host) => {
      const hostPath = path.resolve(rootPath, host.host);
      const rulePath = path.resolve(rootPath, host.rule);

      const hostContent = readFileSync(hostPath, 'utf-8');
      const ruleContent = parse(hostContent);

      writeFileSync(rulePath, ruleContent, 'utf-8');
    });
  }
}

function combineRuleFiles() {
  const rulesPath = path.resolve(rootPath, './rules');
  combine(rulesPath);
}

async function requestAdGuardRules() {
  const config = await loadConfig();

  if (Array.isArray(config.filters)) {
    config.filters.forEach(async (url, index) => {
      const filtersPath = path.resolve(rootPath, `./filters/${index}.filter`);
      const filterContent = await requestHost(url);
      writeFileSync(filtersPath, filterContent, 'utf-8');
    })
  }
}

async function parseFilter() {
  const filterPath = path.resolve(rootPath, './filters/', '**/**.filter')
  const fliterPaths = await glob(filterPath);

  fliterPaths.forEach((filterPath, index) => {
    const filterContent = readFileSync(filterPath, 'utf-8');
    const hostsContent = generateHostsFromFilters(filterContent);

    const hostsPath = path.resolve(rootPath, `./hosts/${index}.hosts`);
    writeFileSync(hostsPath, hostsContent, 'utf-8');
  });
}

program.command('fetch').action(requestHostFiles);
program.command('generate').alias('gen').action(generateRuleFiles);
program.command('combine').action(combineRuleFiles);
program.command('adguard').action(requestAdGuardRules);
program.command('parse-filter').action(parseFilter);
program.command('combine-filter').action(() => combineHosts(rootPath));

program.parse();
