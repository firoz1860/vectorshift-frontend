// nodes/filterNode.js  – Node 2 of 5 new nodes
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Filter"
      icon="🔍"
      color="#8b5cf6"
      inputs={[{ id: 'data', label: 'Data In' }]}
      outputs={[
        { id: 'pass', label: 'Passed'  },
        { id: 'fail', label: 'Filtered' },
      ]}
    >
      <NodeField label="Condition">
        <input
          className="node-input"
          type="text"
          placeholder='e.g. value > 10'
          value={condition}
          onChange={e => { setCondition(e.target.value); updateNodeField(id, 'condition', e.target.value); }}
        />
      </NodeField>
      <p className="node-hint">Items matching the condition pass through; others are filtered out.</p>
    </BaseNode>
  );
};
