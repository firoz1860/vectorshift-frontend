// nodes/outputNode.js
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="📤"
      color="#f59e0b"
      inputs={[{ id: 'value', label: 'Value' }]}
    >
      <NodeField label="Name">
        <input
          className="node-input"
          type="text"
          value={currName}
          onChange={e => { setCurrName(e.target.value); updateNodeField(id, 'outputName', e.target.value); }}
        />
      </NodeField>
      <NodeField label="Type">
        <select
          className="node-select"
          value={outputType}
          onChange={e => { setOutputType(e.target.value); updateNodeField(id, 'outputType', e.target.value); }}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="File">File</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
