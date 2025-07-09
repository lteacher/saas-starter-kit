#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

function toTitleCase(kebabName) {
  return kebabName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getProjectNameFromPackageJson() {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.name || 'my-saas-app';
  } catch {
    return 'my-saas-app';
  }
}

function replaceInContent(content, projectName) {
  const titleName = toTitleCase(projectName);

  return (
    content
      // Package scope replacements
      .replace(/@saas-starter/g, `@${projectName}`)
      // Project name replacements
      .replace(/saas-starter-kit/g, projectName)
      // Docker container names
      .replace(/saas-starter-mongodb/g, `${projectName}-mongodb`)
      // Title replacements
      .replace(/SaaS Starter Kit/g, titleName)
      // API specific replacements
      .replace(/'SaaS Starter Kit API'/g, `'${titleName} API'`)
      .replace(/"SaaS Starter Kit API"/g, `"${titleName} API"`)
      .replace(/🚀 SaaS Starter Kit API/g, `🚀 ${titleName} API`)
      // Package.json description
      .replace(
        /"description": "SaaS Starter Kit - Qwik Frontend"/,
        `"description": "${titleName} - Qwik Frontend"`,
      )
  );
}

function updateFilesRecursively(dir, projectName) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', '.git', '.edgedb', 'dist', 'build', 'tmp', 'scripts'].includes(item)) {
        updateFilesRecursively(fullPath, projectName);
      }
    } else if (stat.isFile()) {
      // Skip the root package.json (already renamed by Bun)
      if (fullPath === join(projectRoot, 'package.json')) {
        continue;
      }

      // Update text files
      const textExtensions = [
        '.json',
        '.md',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.html',
        '.txt',
        '.toml',
        '.env',
        '.example',
      ];
      const ext = item.substring(item.lastIndexOf('.'));
      const isBinaryFile = item.includes('bun.lock') || item.includes('.lock');

      if ((textExtensions.includes(ext) || item.startsWith('.env')) && !isBinaryFile) {
        try {
          const content = readFileSync(fullPath, 'utf8');
          const updated = replaceInContent(content, projectName);

          if (content !== updated) {
            writeFileSync(fullPath, updated);
            console.log(`✓ Updated ${fullPath.replace(projectRoot + '/', '')}`);
          }
        } catch (error) {
          console.log(`⚠ Skipped ${fullPath.replace(projectRoot + '/', '')} (${error.message})`);
        }
      }
    }
  }
}

function cleanup() {
  try {
    // Remove the template.json file
    const templateJsonPath = join(projectRoot, 'template.json');
    unlinkSync(templateJsonPath);
    console.log('✓ Removed template.json');
  } catch {}

  console.log('✓ Template cleanup complete');
}

function main() {
  console.log('🔧 Setting up your SaaS project...\n');

  // Get project name from the already-renamed package.json
  const projectName = getProjectNameFromPackageJson();
  console.log(`📁 Project name: "${projectName}"`);
  console.log(`🔄 Updating workspace packages...\n`);

  // Update all files except root package.json
  updateFilesRecursively(projectRoot, projectName);

  // Copy .env files
  console.log('\n📋 Setting up environment files...');
  try {
    copyFileSync(join(projectRoot, 'apps/ui/.env.example'), join(projectRoot, 'apps/ui/.env'));
    console.log('✓ Created apps/ui/.env');
  } catch {
    console.log('⚠ Could not create apps/ui/.env');
  }

  try {
    copyFileSync(
      join(projectRoot, 'services/api/.env.example'),
      join(projectRoot, 'services/api/.env'),
    );
    console.log('✓ Created services/api/.env');
  } catch {
    console.log('⚠ Could not create services/api/.env');
  }

  // Clean up template files
  cleanup();

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run `bun install` to install dependencies');
  console.log('2. Configure your .env files as needed');
  console.log('3. Start database: bun run --filter=@*/db db:start');
  console.log('4. Run migrations: bun run --filter=@*/db db:migrate');
  console.log('5. Start development: bun dev');
  console.log('   - Frontend: http://localhost:5173');
  console.log('   - API: http://localhost:3000\n');
}

main();
