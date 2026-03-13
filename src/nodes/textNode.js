// nodes/textNode.js
// Part 3: auto-resize + {{variable}} → dynamic target handles
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode, NodeField } from './BaseNode';
import { useStore } from '../store';

const MIN_W = 220;
const MIN_H = 110;
const PAD   = 28;
const CW    = 7.5;
const LH    = 20;

const extractVars = (text) => {
  const re = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let m;
  while ((m = re.exec(text)) !== null) vars.add(m[1]);
  return [...vars];
};

const calcDims = (text, varCount) => {
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map((l) => l.length), 0);
  const w = Math.max(MIN_W, maxLen * CW + PAD * 2 + 16);
  const h = Math.max(MIN_H + varCount * 26, lines.length * LH + 90 + varCount * 26);
  return { w, h };
};

export const TextNode = ({ id, data }) => {
  const [text, setText]         = useState(data?.text || '{{input}}');
  const [vars, setVars]         = useState([]);
  const [dims, setDims]         = useState({ w: MIN_W, h: MIN_H });
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    const v = extractVars(text);
    setVars(v);
    setDims(calcDims(text, v.length));
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  const dynamicInputs = vars.map((v, i) => ({
    id:    `var-${v}`,
    label: v,
    style: { top: `${58 + i * 26}px`, transform: 'translateY(-50%)' },
  }));

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="📝"
      color="#ec4899"
      width={dims.w}
      minHeight={dims.h}
      inputs={dynamicInputs}
      outputs={[{ id: 'output', label: 'Text Output' }]}
    >
      <NodeField label="Text">
        <textarea
          className="node-textarea"
          value={text}
          onChange={handleChange}
          style={{
            width:     dims.w - PAD * 2 - 4,
            minHeight: Math.max(52, dims.h - 88),
            resize:    'none',
          }}
        />
      </NodeField>
      {vars.length > 0 && (
        <div className="node-vars">
          {vars.map((v) => (
            <span key={v} className="node-var-tag">{`{{${v}}}`}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};
