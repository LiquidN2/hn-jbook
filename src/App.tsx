import {
  FC,
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App: FC = () => {
  const ref = useRef<typeof esbuild | null>(null);
  const iframe = useRef<any>(null);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  const startService = async () => {
    try {
      console.log('🕧 Starting Esbuild service...');
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.7/esbuild.wasm',
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

    try {
      console.log('🕧 Bundling input...');
      const result = await ref.current.build({
        entryPoints: ['index.js'], // dummy entry point for unpkgPathPlugin to load
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input.trim())],
        define: { global: 'window' },
      });

      console.log('✅ Bundling successful');
      setCode(result.outputFiles[0].text);

      iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
    } catch (err: any) {
      console.error('💥 Unable to bundle script');
    }
  };

  const html = `
    <html lang='en'>
      <head><title>Code Preview</title></head>
      <body>
        <div id='root' />
        <script>
          window.addEventListener('message', event => {
            eval(event.data);  
          }, false)
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setInput(e.target.value)
        }
        cols={50}
        rows={10}
      />
      <br />
      <button onClick={onClick} disabled={isDisabledSubmit}>
        Submit
      </button>
      <br />
      <iframe sandbox={'allow-scripts'} srcDoc={html} ref={iframe} />
    </div>
  );
};

export default App;
