import tsConfigPaths from 'tsconfig-paths';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in module ES
const __dirname = dirname(fileURLToPath(import.meta.url));

const baseUrl = resolve(__dirname);
const tsconfigPath = resolve(baseUrl, 'tsconfig.json');
const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

tsConfigPaths.register({
  baseUrl,
  paths: tsconfig.compilerOptions.paths,
});