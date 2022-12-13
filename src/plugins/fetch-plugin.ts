import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage'; // indexedDB helper

export const fetchPlugin = (input: string) => ({
  name: 'fetch-plugin',
  setup(build: esbuild.PluginBuild) {
    // Load input as content for index.js
    build.onLoad({ filter: /^index.js/ }, _args => ({
      loader: 'jsx',
      contents: input,
    }));

    // Fetch data for JS modules
    build.onLoad({ filter: /.*/ }, async args => {
      try {
        // Fetch from indexedDB if previously requested
        const cachedOnLoadResult = await localforage.getItem(args.path);
        if (cachedOnLoadResult)
          return cachedOnLoadResult as esbuild.OnLoadResult;

        // Fetch from unpkg.com if not cached locally (indexedDB)
        const { data, request } = await axios.get(args.path);
        const onLoadResult: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Save data to indexedDB (via localforage)
        await localforage.setItem(args.path, onLoadResult);

        // Return load result
        return onLoadResult;
      } catch (err: any) {
        console.error('💥 Unable to fetch data', err);
      }
    });
  },
});
