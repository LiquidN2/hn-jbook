import { FC, MouseEventHandler, useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

import bundle from '../bundler';

import './code-cell.scss';

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
    <Resizable direction="vertical">
      <div className="code-cell-wrapper">
        <CodeEditor
          initialValue={'// Enter your code below\n'}
          onChange={value => setInput(value)}
        />
        <Preview code={code} bundlingError={bundlingError} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
