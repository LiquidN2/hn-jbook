import { FC, ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';

const App: FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    try {
      console.log('🕧 Starting Esbuild service...');
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.4/esbuild.wasm',
      });

      console.log('✅ Esbuild started');
      console.log(esbuild);
    } catch (err: any) {
      throw '💥 Unable to start Esbuild service';
    }
  };

  useEffect(() => {
    startService().catch((err: any) => console.error(err));
  }, []);

  return (
    <div>
      <textarea
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setInput(e.target.value)
        }
      ></textarea>
      <button
        onClick={(_e: MouseEvent<HTMLButtonElement>) => console.log(input)}
      >
        Submit
      </button>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
