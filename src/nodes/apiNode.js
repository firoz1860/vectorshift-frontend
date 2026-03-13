// nodes/apiNode.js  – Node 1 of 5 new nodes
import { useState } from 'react';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

export const ApiNode = ({ id, data }) => {
  const [url, setUrl]         = useState(data?.url    || 'https://api.example.com');
  const [method, setMethod]   = useState(data?.method || 'GET');
  const updateNodeField = useStore(s => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="API Call"
      icon="🌐"
      color="#0ea5e9"
      inputs={[
        { id: 'body',    label: 'Request Body' },
        { id: 'headers', label: 'Headers'      },
      ]}
      outputs={[
        { id: 'response', label: 'Response' },
        { id: 'status',   label: 'Status'   },
      ]}
    >
      <NodeField label="URL">
        <input
          className="node-input"
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }}
        />
      </NodeField>
      <NodeField label="Method">
        <select
          className="node-select"
          value={method}
          onChange={e => { setMethod(e.target.value); updateNodeField(id, 'method', e.target.value); }}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
