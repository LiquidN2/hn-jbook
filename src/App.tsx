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

const App: FC = () => {
  const ref = useRef<typeof esbuild | null>(null);
  const [input, setInput] = useState(
    'var message = require("nested-test-pkg"); console.log(message);'
  );
  const [code, setCode] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  const startService = async () => {
    try {
      console.log('🕧 Starting Esbuild service...');
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.4/esbuild.wasm',
      });

      console.log('✅ Esbuild started');

      ref.current = esbuild;
    } catch (err: any) {
      throw '💥 Unable to start Esbuild service';
    }
  };

  useEffect(() => {
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
        plugins: [unpkgPathPlugin(input.trim())],
      });

      console.log('✅ Bundling successful');
      setCode(result.outputFiles[0].text);
    } catch (err: any) {
      console.error('💥 Unable to bundle script');
    }
  };

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
      <pre>{code}</pre>
    </div>
  );
};

export default App;
