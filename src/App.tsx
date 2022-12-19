import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

import CodeEditor from './components/code-editor';
import Preview from './components/preview';

import 'bulmaswatch/darkly/bulmaswatch.min.css';

const App: FC = () => {
  const ref = useRef<typeof esbuild | null>(null);
  const [input, setInput] = useState(''); // Code input
  const [code, setCode] = useState(''); // Compiled code
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  const startService = async () => {
    try {
      console.log('🕧 Starting Esbuild service...');
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.9/esbuild.wasm',
      });

      console.log('✅ Esbuild started');

      ref.current = esbuild;
    } catch (err: any) {
      throw '💥 Unable to start Esbuild service';
    }
  };

  useEffect(() => {
    if (ref.current) return;

    startService()
      .then(() => setIsDisabledSubmit(false))
      .catch((err: any) => console.error(err));
  }, []);

  const onClick: MouseEventHandler<HTMLButtonElement> = async _e => {
    if (!ref.current || !input) return;

    // Bundle code
    try {
      console.log('🕧 Bundling input...');
      const result = await ref.current.build({
        entryPoints: ['index.js'], // dummy entry point for unpkgPathPlugin to load
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input.trim())],
        define: { global: 'window' },
      });

      // Send the bundled code to iframe for code exec
      // iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
      setCode(result.outputFiles[0].text);
    } catch (err: any) {
      console.error('💥 Unable to bundle script');
    }
  };

  return (
    <div>
      <CodeEditor
        initialValue={'// Enter your code here'}
        onChange={value => setInput(value)}
      />
      <br />
      <button onClick={onClick} disabled={isDisabledSubmit}>
        Submit
      </button>
      <br />
      <Preview code={code} />
    </div>
  );
};

export default App;
