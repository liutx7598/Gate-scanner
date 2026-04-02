import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const rootDir = process.cwd();
const vendorDir = path.join(rootDir, 'vendors', 'gateio-api');

const quote = (value) => (/\s/.test(value) ? `"${value}"` : value);

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `${command}.cmd ${args.map(quote).join(' ')}`], {
            cwd: vendorDir,
            stdio: 'inherit'
          })
        : spawn(command, args, {
            cwd: vendorDir,
            stdio: 'inherit'
          });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
    });
  });

await run('npm', ['install']);
await run('npx', ['tsc', '-p', 'tsconfig.esm.json']);
await run('npx', ['tsc', '-p', 'tsconfig.cjs.json']);

await mkdir(path.join(vendorDir, 'dist', 'cjs'), { recursive: true });
await mkdir(path.join(vendorDir, 'dist', 'mjs'), { recursive: true });
await writeFile(path.join(vendorDir, 'dist', 'cjs', 'package.json'), '{"type":"commonjs"}\n', 'utf8');
await writeFile(path.join(vendorDir, 'dist', 'mjs', 'package.json'), '{"type":"module"}\n', 'utf8');

console.log('Vendored gateio-api rebuilt successfully.');
