import { FC, MouseEventHandler, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const ref = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onMount: OnMount = (editor, monaco) => {
    ref.current = editor;
  };

  const onFormatClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!ref.current) return;

    // Get the current value of the editor
    const unformattedCode = ref.current?.getValue();

    // Format the value
    const formattedCode = prettier.format(unformattedCode, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    // Set the formatted value in the editor
    ref.current?.setValue(formattedCode);
  };

  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
      <Editor
        height="20vh"
        language="javascript"
        theme="vs-dark"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          tabSize: 2,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onMount={onMount}
        defaultValue={initialValue}
        onChange={(value, _event) => onChange(value || '')}
      />
    </div>
  );
};

export default CodeEditor;
