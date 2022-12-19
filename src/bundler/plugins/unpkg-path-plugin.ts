import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // Resolving for dummy path 'index.js'
    build.onResolve({ filter: /^index\.js$/ }, args => ({
      path: args.path,
      namespace: 'a',
    }));

    // Resolving relative path './' and '../'
    // args.resolveDir is provided by onLoad plugin
    build.onResolve({ filter: /^\.+\// }, args => ({
      path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
      namespace: 'a',
    }));

    // Resolving module's path (i.e 'lodash', 'react', etc.)
    build.onResolve({ filter: /.*/ }, args => ({
      path: `https://unpkg.com/${args.path}`,
      namespace: 'a',
    }));
  },
});
