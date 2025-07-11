import fs from 'fs/promises';
import path from 'path';

const distDir = path.resolve('dist');

const aliasMap = {
  '@db/': 'src/database',
  '@utils/': 'src/utils',
  '@routes/': 'routes',
  '@fetchers/': 'src/datafetchers',
  '@data/': 'data',
  '@listeners/': 'src/Listeners',
  '@socket/': 'src/Socketio',
};

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

async function fixFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let modified = false;

  for (const [alias, realPath] of Object.entries(aliasMap)) {
    const importRegex = new RegExp(`from ['"]${alias}`, 'g');
    if (importRegex.test(content)) {
      const fileDir = path.dirname(filePath);
      const targetAbsolute = path.resolve(distDir, realPath);
      let relativePath = path.relative(fileDir, targetAbsolute);
      if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
      relativePath = toPosix(relativePath);
      content = content.replace(importRegex, `from '${relativePath}`);
      modified = true;

      console.log(`Fixed alias '${alias}' to '${relativePath}' in file ${filePath}`);
    }
  }

  if (modified) {
    await fs.writeFile(filePath, content, 'utf8');
  }
}

async function walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      await fixFile(fullPath);
    }
  }
}

walkDir(distDir).catch(err => {
  console.error('Error fixing aliases:', err);
  process.exit(1);
});
