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

    // Fetch data locally if previously fetched
    build.onLoad({ filter: /.*/ }, async args => {
      try {
        const cachedResult = await localforage.getItem(args.path);
        return cachedResult ? (cachedResult as esbuild.OnLoadResult) : null;
      } catch (err: any) {
        throw err;
      }
    });

    // Fetch CSS modules
    build.onLoad({ filter: /.css$/ }, async args => {
      try {
        // Fetch from unpkg.com if not cached locally (indexedDB)
        const { data, request } = await axios.get(args.path);

        // Escape special chars (blank space, double quote & single quote)
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        // Convert CSS to JS script which appends CSS to style element in the HTML doc head
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const onLoadResult: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Save data to indexedDB (via localforage)
        await localforage.setItem(args.path, onLoadResult);

        return onLoadResult;
      } catch (err: any) {
        throw err;
      }
    });

    // Fetch JS modules
    build.onLoad({ filter: /.*/ }, async args => {
      try {
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
        throw err;
      }
    });
  },
});
