import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import { debugNote } from '../utils/deug';

interface BundledOutput {
  code: string;
  err: string;
}

let service: typeof esbuild | undefined;

export default async (rawCode: string): Promise<BundledOutput> => {
  // Check if esbuild service has been initialized
  if (!service) {
    debugNote('🕧 Starting Esbuild service...');
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.9/esbuild.wasm',
    });

    debugNote('✅ Esbuild started');
    service = esbuild;
  }

  try {
    debugNote('🕧 Bundling input...');
    const result = await service.build({
      entryPoints: ['index.js'], // dummy entry point for unpkgPathPlugin to load
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode.trim())],
      define: { global: 'window' },
    });

    debugNote('✅ Bundling successful');
    return {
      code: result.outputFiles[0].text as string,
      err: '',
    };
  } catch (err: any) {
    debugNote('💥 Bundling error');
    if (err instanceof Error) {
      return {
        code: '',
        err: err.message,
      };
    }

    throw err;
  }
};
