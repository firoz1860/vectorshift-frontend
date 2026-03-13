// toolbar.js
import { DraggableNode } from './draggableNode';

const NODE_DEFS = [
  { type: 'customInput',  label: 'Input',       icon: '📥' },
  { type: 'customOutput', label: 'Output',      icon: '📤' },
  { type: 'llm',          label: 'LLM',         icon: '🤖' },
  { type: 'text',         label: 'Text',        icon: '📝' },
  { type: 'api',          label: 'API Call',    icon: '🌐' },
  { type: 'filter',       label: 'Filter',      icon: '🔍' },
  { type: 'note',         label: 'Note',        icon: '📌' },
  { type: 'transform',    label: 'Transform',   icon: '🔄' },
  { type: 'conditional',  label: 'Conditional', icon: '🔀' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <div className="toolbar__brand">
      <div className="toolbar__brand-logo">⚡</div>
      <span>VectorShift</span>
    </div>
    <div className="toolbar__divider" />
    <span className="toolbar__label">Nodes</span>
    <div className="toolbar__nodes">
      {NODE_DEFS.map((n) => (
        <DraggableNode key={n.type} type={n.type} label={n.label} icon={n.icon} />
      ))}
    </div>
  </div>
);
