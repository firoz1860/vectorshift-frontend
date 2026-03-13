// nodes/conditionalNode.js  – Node 5 of 5 new nodes
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const [expr, setExpr] = useState(data?.expr || '');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Conditional"
      icon="🔀"
      color="#ef4444"
      inputs={[{ id: 'value', label: 'Input Value' }]}
      outputs={[
        { id: 'true',  label: 'True'  },
        { id: 'false', label: 'False' },
      ]}
    >
      <NodeField label="Expression">
        <input
          className="node-input"
          type="text"
          placeholder='e.g. value === "yes"'
          value={expr}
          onChange={e => { setExpr(e.target.value); updateNodeField(id, 'expr', e.target.value); }}
        />
      </NodeField>
      <p className="node-hint">Routes to True or False branch based on expression.</p>
    </BaseNode>
  );
};
