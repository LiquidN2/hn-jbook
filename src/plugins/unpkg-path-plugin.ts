import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // Resolving for dummy path 'index.js'
    build.onResolve({ filter: /^index\.js$/ }, (args: any) => ({
      path: args.path,
      namespace: 'a',
    }));

    // Resolving relative path './' and '../'
    // args.resolveDir is provided by onLoad plugin
    build.onResolve({ filter: /^\.+\// }, (args: any) => ({
      path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
      namespace: 'a',
    }));

    // Resolving package path (i.e 'lodash', 'react', etc.)
    build.onResolve({ filter: /.*/ }, (args: any) => ({
      path: `https://unpkg.com/${args.path}`,
      namespace: 'a',
    }));
  },
});
