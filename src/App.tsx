import { FC, MouseEventHandler, useState } from 'react';

import bundle from './bundler';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

import 'bulmaswatch/darkly/bulmaswatch.min.css';

const App: FC = () => {
  const [input, setInput] = useState(''); // Code input
  const [code, setCode] = useState(''); // Compiled code
  const [bundlingError, setBundlingError] = useState<any>(null);

  const onClick: MouseEventHandler<HTMLButtonElement> = async _e => {
    const { code: bundledCode, err } = await bundle(input);
    setCode(bundledCode);
    setBundlingError(err);
  };

  return (
    <div>
      <CodeEditor
        initialValue={'// Enter your code here'}
        onChange={value => setInput(value)}
      />
      <br />
      <button onClick={onClick}>Submit</button>
      <br />
      <Preview code={code} bundlingError={bundlingError} />
    </div>
  );
};

export default App;
