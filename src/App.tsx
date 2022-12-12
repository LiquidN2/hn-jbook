import { FC, ChangeEvent, MouseEvent, useState } from 'react';

const App: FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

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
