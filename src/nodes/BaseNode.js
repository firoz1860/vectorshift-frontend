// nodes/BaseNode.js
// Core abstraction for all pipeline nodes

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

/**
 * BaseNode – shared shell for every node type.
 *
 * Props:
 *  id        – ReactFlow node id
 *  title     – Header label
 *  icon      – Emoji icon
 *  color     – Accent colour (header stripe + handles)
 *  width     – Controlled width (TextNode uses this for auto-resize)
 *  minWidth  – Minimum width (default 220)
 *  minHeight – Minimum height (default 100)
 *  inputs    – [{ id, label, style? }]  → left-side target handles
 *  outputs   – [{ id, label, style? }]  → right-side source handles
 *  children  – Node body content
 */
export const BaseNode = ({
  id,
  title,
  icon = '⚙️',
  color = '#6366f1',
  width,
  minWidth = 220,
  minHeight = 100,
  inputs = [],
  outputs = [],
  children,
}) => {
  const removeNode = useStore((s) => s.removeNode);
  const nodeWidth = width || minWidth;

  return (
    <div
      className="base-node"
      style={{ width: nodeWidth, minHeight, '--node-accent': color }}
    >
      {/* Target handles – left side */}
      {inputs.map((h, i) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          style={h.style || { top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
          className="node-handle node-handle--target"
          title={h.label || h.id}
        />
      ))}

      {/* Header */}
      <div className="base-node__header" style={{ borderTopColor: color }}>
        <span className="base-node__icon">{icon}</span>
        <span className="base-node__title">{title}</span>
        <div className="base-node__dot" style={{ background: color }} />
        {/* Delete button */}
        <button
          className="base-node__delete"
          title="Delete node"
          onClick={(e) => {
            e.stopPropagation();
            removeNode(id);
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="base-node__body">{children}</div>

      {/* Source handles – right side */}
      {outputs.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          style={h.style || { top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
          className="node-handle node-handle--source"
          title={h.label || h.id}
        />
      ))}
    </div>
  );
};

/** Labelled field row helper */
export const NodeField = ({ label, children }) => (
  <div className="node-field">
    <label className="node-field__label">{label}</label>
    <div className="node-field__control">{children}</div>
  </div>
);
