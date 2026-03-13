// nodes/transformNode.js  – Node 4 of 5 new nodes
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

const TRANSFORMS = ['Uppercase', 'Lowercase', 'Trim', 'Reverse', 'JSON Parse', 'JSON Stringify', 'Base64 Encode', 'Base64 Decode'];

export const TransformNode = ({ id, data }) => {
  const [transform, setTransform] = useState(data?.transform || 'Uppercase');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon="🔄"
      color="#14b8a6"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[{ id: 'output', label: 'Output' }]}
    >
      <NodeField label="Operation">
        <select
          className="node-select"
          value={transform}
          onChange={e => { setTransform(e.target.value); updateNodeField(id, 'transform', e.target.value); }}
        >
          {TRANSFORMS.map(t => <option key={t}>{t}</option>)}
        </select>
      </NodeField>
      <p className="node-hint">Applies the selected transformation to the input value.</p>
    </BaseNode>
  );
};
