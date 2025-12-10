/**
 * Entry point para desenvolvimento com Electron
 * Isto deve ser executado como: electron -r ts-node/register .
 *
 * O Electron-cli procurará pelo "main" definido no package.json
 * que aponta para "dist/main/main.js" ou este arquivo
 */

process.env.NODE_ENV = 'development';

require('ts-node').register({
  project: './tsconfig.main.json',
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

require('./main');
