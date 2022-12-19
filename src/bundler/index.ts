import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

interface BundledOutput {
  code: string;
  err: string;
}

let service: typeof esbuild | undefined;

export default async (rawCode: string): Promise<BundledOutput> => {
  // Check if esbuild service has been initialized
  if (!service) {
    console.log('🕧 Starting Esbuild service...');
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.9/esbuild.wasm',
    });

    console.log('✅ Esbuild started');
    service = esbuild;
  }

  try {
    console.log('🕧 Bundling input...');
    const result = await service.build({
      entryPoints: ['index.js'], // dummy entry point for unpkgPathPlugin to load
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode.trim())],
      define: { global: 'window' },
    });

    return {
      code: result.outputFiles[0].text as string,
      err: '',
    };
  } catch (err: any) {
    if (err instanceof Error) {
      return {
        code: '',
        err: err.message,
      };
    }

    throw err;
  }
};
