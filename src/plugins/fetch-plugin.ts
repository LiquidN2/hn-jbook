import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

export const fetchPlugin = (input: string) => ({
  name: 'fetch-plugin',
  setup(build: esbuild.PluginBuild) {
    // Load input as content for index.js
    build.onLoad({ filter: /^index.js/ }, _args => ({
      loader: 'jsx',
      contents: input,
    }));

    // Fetch data for other paths
    build.onLoad({ filter: /.*/ }, async args => {
      try {
        const { data, request } = await axios.get(args.path);

        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
      } catch (err: any) {
        console.error('💥 Unable to fetch data from unpkg');
      }
    });
  },
});
