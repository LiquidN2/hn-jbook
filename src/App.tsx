import {
  FC,
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as esbuild from 'esbuild-wasm';

const App: FC = () => {
  const ref = useRef<any | null>(null);
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

      ref.current = esbuild;
    } catch (err: any) {
      throw '💥 Unable to start Esbuild service';
    }
  };

  useEffect(() => {
    startService().catch((err: any) => console.error(err));
  }, []);

  const onClick: MouseEventHandler<HTMLButtonElement> = async _e => {
    if (!ref.current || !input) return;

    try {
      console.log('🕧 transforming input...');
      const result = await ref.current.transform(input, {
        loader: 'jsx',
        target: 'es2015',
      } as esbuild.TransformOptions);

      console.log('✅ transformation successful');
      setCode(result.code);
    } catch (err: any) {
      console.error('💥 Unable to transform script');
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
      <button onClick={onClick}>Submit</button>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
