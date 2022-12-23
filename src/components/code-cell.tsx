import { FC, useEffect, useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

import bundle from '../bundler';

import './code-cell.scss';

const CodeCell: FC = () => {
  const [input, setInput] = useState(''); // Code input
  const [code, setCode] = useState(''); // Compiled code
  const [error, setError] = useState('');

  useEffect(() => {
    if (!input) return;

    // Start code bundling 1 second after typing stop
    const codeBundlingTimer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setError(output.err);
    }, 1000);

    // Clear timer when typing start
    return () => {
      clearTimeout(codeBundlingTimer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div className="code-cell-wrapper">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={'// Enter your code below\n'}
            onChange={value => setInput(value)}
          />
        </Resizable>
        <Preview code={code} bundlingError={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
