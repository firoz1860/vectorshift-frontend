// ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode }       from './nodes/inputNode';
import { LLMNode }         from './nodes/llmNode';
import { OutputNode }      from './nodes/outputNode';
import { TextNode }        from './nodes/textNode';
import { ApiNode }         from './nodes/apiNode';
import { FilterNode }      from './nodes/filterNode';
import { NoteNode }        from './nodes/noteNode';
import { TransformNode }   from './nodes/transformNode';
import { ConditionalNode } from './nodes/conditionalNode';

import 'reactflow/dist/style.css';

const gridSize   = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  api:          ApiNode,
  filter:       FilterNode,
  note:         NoteNode,
  transform:    TransformNode,
  conditional:  ConditionalNode,
};

const NODE_COLORS = {
  customInput: '#10b981', llm: '#6366f1', customOutput: '#f59e0b',
  text: '#ec4899', api: '#0ea5e9', filter: '#8b5cf6',
  note: '#f97316', transform: '#14b8a6', conditional: '#ef4444',
};

const selector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect:     state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const nodeID = getNodeID(nodeType);
      addNode({ id: nodeID, type: nodeType, position, data: { id: nodeID, nodeType } });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        fitView
        deleteKeyCode="Delete"
      >
        <Background color="#c7d2fe" gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(n) => NODE_COLORS[n.type] || '#6366f1'}
          maskColor="rgba(240,244,255,0.6)"
        />
      </ReactFlow>
    </div>
  );
};
