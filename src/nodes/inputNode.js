// nodes/inputNode.js
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="📥"
      color="#10b981"
      outputs={[{ id: 'value', label: 'Value' }]}
    >
      <NodeField label="Name">
        <input
          className="node-input"
          type="text"
          value={currName}
          onChange={e => { setCurrName(e.target.value); updateNodeField(id, 'inputName', e.target.value); }}
        />
      </NodeField>
      <NodeField label="Type">
        <select
          className="node-select"
          value={inputType}
          onChange={e => { setInputType(e.target.value); updateNodeField(id, 'inputType', e.target.value); }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
          <option value="Number">Number</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
