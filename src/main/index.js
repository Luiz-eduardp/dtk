/**
 * index.js - Entry point para Electron (JavaScript puro)
 * 
 * Este arquivo é o entry point principal do Electron.
 * Para desenvolvimento, ele carrega ts-node e importa main.ts
 * Para produção, será substituído por um arquivo compilado
 */
/* eslint-disable @typescript-eslint/no-var-requires, global-require */

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('ts-node').register({
    project: './tsconfig.main.json',
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });

  require('./main.ts');
} else {
  try {
    require('./main.js');
  } catch (err) {
    console.error('Error loading main.js. Make sure to run: npm run build:main');
    throw err;
  }
}
