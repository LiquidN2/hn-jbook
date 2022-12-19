import { FC, MouseEventHandler, useState } from 'react';

import bundle from './bundler';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

import 'bulmaswatch/darkly/bulmaswatch.min.css';

const App: FC = () => {
  const [input, setInput] = useState(''); // Code input
  const [code, setCode] = useState(''); // Compiled code

  const onClick: MouseEventHandler<HTMLButtonElement> = async _e => {
    const result = await bundle(input);
    setCode(result.code);
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
      <Preview code={code} />
    </div>
  );
};

export default App;
