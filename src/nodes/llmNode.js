// nodes/llmNode.js
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="🤖"
      color="#6366f1"
      inputs={[
        { id: 'system', label: 'System Prompt' },
        { id: 'prompt', label: 'User Prompt' },
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
    >
      <NodeField label="Model">
        <select
          className="node-select"
          value={model}
          onChange={e => { setModel(e.target.value); updateNodeField(id, 'model', e.target.value); }}
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
        </select>
      </NodeField>
      <p className="node-hint">Connect a system prompt and user prompt to generate a response.</p>
    </BaseNode>
  );
};
