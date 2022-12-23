import { FC, MouseEventHandler, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';

import './code-editor.scss';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const ref = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onMount: OnMount = (editor, monaco) => {
    ref.current = editor;

    // Instantiate the highlighter
    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      parse,
      traverse,
      editor
    );

    // Activate highlighting (debounceTime default: 100ms)
    monacoJSXHighlighter.highlightOnDidChangeModelContent(100);

    // Activate JSX commenting
    monacoJSXHighlighter.addJSXCommentCommand();
  };

  const onFormatClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!ref.current) return;

    // Get the current value of the editor
    const unformattedCode = ref.current?.getValue();
    if (!unformattedCode) return;

    // Format the value
    const formattedCode = prettier
      .format(unformattedCode, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    // Set the formatted value in the editor
    ref.current?.setValue(formattedCode);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-success is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
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
