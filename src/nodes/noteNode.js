// nodes/noteNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.note || 'Add a note here…');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Note"
      icon="📌"
      color="#f97316"
      minWidth={200}
      minHeight={120}
      inputs={[]}
      outputs={[]}
    >
      <textarea
        className="node-textarea node-textarea--note"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          updateNodeField(id, 'note', e.target.value);
        }}
        placeholder="Write a note…"
        rows={4}
      />
    </BaseNode>
  );
};
