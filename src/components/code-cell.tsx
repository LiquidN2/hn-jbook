import { FC, MouseEventHandler, useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';

const CodeCell: FC = () => {
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
        initialValue={'Enter your code below'}
        onChange={value => setInput(value)}
      />
      <br />
      <button onClick={onClick}>Submit</button>
      <br />
      <Preview code={code} bundlingError={bundlingError} />
    </div>
  );
};

export default CodeCell;
