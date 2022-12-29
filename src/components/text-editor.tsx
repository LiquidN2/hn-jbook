import { FC, useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import './text-editor.scss';

const TextEditor: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('Click to edit your text');

  useEffect(() => {
    // Disable editing mode if click outside editor
    const handleClickOutside = (event: MouseEvent) => {
      // true if click inside editor else false
      const isClickingInsideEditor =
        ref.current &&
        event.target &&
        ref.current!.contains(event.target as Node);

      setEditing(isClickingInsideEditor as boolean);
    };

    document.addEventListener('click', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (editing)
    return (
      <div ref={ref} className="md-editor-wrapper md-editor-wrapper--editing">
        <MDEditor
          value={value}
          onChange={(text?: string) => setValue(text || '')}
        />
      </div>
    );

  return (
    <div
      className="md-editor-wrapper md-editor-wrapper--finished card"
      onClick={() => setEditing(true)}
    >
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
