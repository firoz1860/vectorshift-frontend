import { useRef, useState, useEffect, useCallback } from 'react';
import { useStore } from '../lib/store';
import { shapePath } from '../lib/svgPaths';
import { Minus, Plus, Maximize } from 'lucide-react';

const SHAPE_TOOLS = ['rectangle','rounded','circle','cylinder','diamond','parallelogram','cloud','hexagon','arrow','text','sticky'];

export default function Canvas() {
  const svgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [panState, setPanState] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const s = useStore();

  const toCanvasCoords = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - s.pan.x) / s.zoom;
    const y = (e.clientY - rect.top - s.pan.y) / s.zoom;
    return { x, y };
  }, [s.pan, s.zoom]);

  const handleMouseDown = (e) => {
    const { x, y } = toCanvasCoords(e);

    if (s.tool === 'pan' || e.button === 1) {
      setPanState({ startX: e.clientX, startY: e.clientY, panX: s.pan.x, panY: s.pan.y });
      return;
    }

    if (s.tool === 'eraser') {
      const target = e.target.closest('[data-element-id]');
      if (target) s.deleteElement(target.getAttribute('data-element-id'));
      return;
    }

    if (s.tool === 'pen') {
      setCurrentPath({
        id: `path-${Date.now()}`,
        type: 'pen',
        points: [{ x, y }],
        stroke: s.strokeColor,
        strokeWidth: s.strokeWidth,
      });
      setIsDrawing(true);
      return;
    }

    if (SHAPE_TOOLS.includes(s.tool)) {
      const el = s.addShapeAt(s.tool, x, y);
      if (s.tool === 'text' || s.tool === 'sticky') {
        s.setEditingText(el.id);
      }
      s.setTool('select');
      return;
    }

    if (s.tool === 'select') {
      if (e.target.tagName === 'svg' || e.target.getAttribute('data-bg') === 'true') {
        s.selectElement(null);
        s.setEditingText(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = toCanvasCoords(e);
    setMousePos({ x, y });

    if (panState) {
      s.setPan({
        x: panState.panX + (e.clientX - panState.startX),
        y: panState.panY + (e.clientY - panState.startY),
      });
      return;
    }

    if (isDrawing && currentPath) {
      setCurrentPath({ ...currentPath, points: [...currentPath.points, { x, y }] });
      return;
    }

    if (dragState) {
      const dx = x - dragState.startX;
      const dy = y - dragState.startY;
      s.updateElement(dragState.id, {
        x: dragState.origX + dx,
        y: dragState.origY + dy,
      });
      return;
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath) {
      if (currentPath.points.length > 1) {
        s.addPath(currentPath.points);
      }
      setCurrentPath(null);
      setIsDrawing(false);
    }
    if (panState) setPanState(null);
    if (dragState) setDragState(null);
  };

  const handleShapeMouseDown = (e, el) => {
    e.stopPropagation();
    if (s.tool === 'eraser') {
      s.deleteElement(el.id);
      return;
    }
    if (s.tool === 'select' || s.tool === 'pan') {
      const { x, y } = toCanvasCoords(e);
      s.selectElement(el.id);
      if (el.type !== 'pen' && el.type !== 'connection') {
        setDragState({ id: el.id, startX: x, startY: y, origX: el.x, origY: el.y });
      }
    }
  };

  const handleShapeDoubleClick = (e, el) => {
    e.stopPropagation();
    const editableTypes = ['text','sticky','rectangle','rounded','circle','cylinder','diamond','parallelogram','cloud','hexagon'];
    if (editableTypes.includes(el.type)) {
      s.setEditingText(el.id);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(4, s.zoom * delta));
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    s.setPan({
      x: mx - ((mx - s.pan.x) / s.zoom) * newZoom,
      y: my - ((my - s.pan.y) / s.zoom) * newZoom,
    });
    s.setZoom(newZoom);
  };

  const handleKeyDown = useCallback((e) => {
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && s.selectedId) {
      s.deleteElement(s.selectedId);
    }
    if (e.key === 'Escape') {
      s.selectElement(null);
      s.setEditingText(null);
      s.setTool('select');
    }
  }, [s]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const cursorClass = {
    select: 'cursor-default',
    pen: 'cursor-crosshair',
    eraser: 'cursor-pointer',
    pan: 'cursor-grab',
  };

  const pathToString = (points) => {
    if (!points || points.length === 0) return '';
    return 'M ' + points.map((p) => `${p.x} ${p.y}`).join(' L ');
  };

  const renderShape = (el) => {
    if (el.type === 'pen') {
      return (
        <path
          key={el.id}
          data-element-id={el.id}
          d={pathToString(el.points)}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          onMouseDown={(e) => handleShapeMouseDown(e, el)}
          style={s.selectedId === el.id ? { filter: 'drop-shadow(0 0 4px rgba(59,130,246,.5))' } : {}}
        />
      );
    }

    if (el.type === 'connection') {
      const from = s.elements.find((e) => e.id === el.fromId);
      const to = s.elements.find((e) => e.id === el.toId);
      if (!from || !to) return null;
      const x1 = from.x + (from.w || 0) / 2;
      const y1 = from.y + (from.h || 0) / 2;
      const x2 = to.x + (to.w || 0) / 2;
      const y2 = to.y + (to.h || 0) / 2;
      const mx = (x1 + x2) / 2;
      const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      return (
        <g key={el.id} data-element-id={el.id}>
          <path d={d} stroke={el.stroke} strokeWidth={el.strokeWidth} fill="none" markerEnd="url(#arrowhead)" onMouseDown={(e) => handleShapeMouseDown(e, el)} />
          {el.label && (
            <text x={mx} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize={12} fill="#64748b" style={{ userSelect: 'none' }}>{el.label}</text>
          )}
        </g>
      );
    }

    const isTextType = el.type === 'text';
    const path = shapePath(el.type, el.x, el.y, el.w, el.h);

    return (
      <g
        key={el.id}
        data-element-id={el.id}
        onMouseDown={(e) => handleShapeMouseDown(e, el)}
        onDoubleClick={(e) => handleShapeDoubleClick(e, el)}
        style={s.selectedId === el.id ? { filter: 'drop-shadow(0 0 3px rgba(59,130,246,.3))' } : {}}
      >
        {el.type !== 'text' && (
          <rect x={el.x - 4} y={el.y - 4} width={el.w + 8} height={el.h + 8} fill="transparent" />
        )}

        {isTextType ? (
          <text x={el.x} y={el.y + el.fontSize} fill={el.fill} fontSize={el.fontSize} fontFamily="Inter, sans-serif" style={{ userSelect: 'none' }}>
            {el.label}
          </text>
        ) : (
          <>
            <path d={path} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill} strokeLinejoin="round" />
            {el.label && (
              <text x={el.x + el.w / 2} y={el.y + el.h / 2 + (el.fontSize || 14) / 3} textAnchor="middle" fill={el.stroke} fontSize={el.fontSize || 14} fontFamily="Inter, sans-serif" style={{ userSelect: 'none' }}>
                {el.label}
              </text>
            )}
          </>
        )}

        {s.selectedId === el.id && el.type !== 'text' && (
          <rect x={el.x - 6} y={el.y - 6} width={el.w + 12} height={el.h + 12} fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 3" rx={4} style={{ pointerEvents: 'none' }} />
        )}
      </g>
    );
  };

  const renderEditingText = () => {
    if (!s.editingTextId) return null;
    const el = s.elements.find((e) => e.id === s.editingTextId);
    if (!el) return null;
    return (
      <foreignObject x={el.x} y={el.y} width={Math.max(el.w || 120, 100)} height={Math.max(el.h || 24, (el.fontSize || 14) + 8)}>
        <textarea
          autoFocus
          value={el.label}
          onChange={(e) => s.updateElement(el.id, { label: e.target.value })}
          onBlur={() => s.setEditingText(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); s.setEditingText(null); }
          }}
          style={{
            width: '100%', height: '100%', border: '1px solid #3b82f6', borderRadius: '4px',
            padding: '4px', fontSize: el.fontSize || 14, fontFamily: 'Inter, sans-serif',
            background: el.fill === 'transparent' || el.fill === '#1e293b' ? '#fff' : el.fill,
            color: el.type === 'text' ? '#1e293b' : el.stroke, outline: 'none', resize: 'none',
            textAlign: el.type === 'text' ? 'left' : 'center',
          }}
        />
      </foreignObject>
    );
  };

  return (
    <div className="canvas-container">
      <svg
        ref={svgRef}
        className={`whiteboard-svg ${cursorClass[s.tool] || 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        <g data-bg="true">
          <rect data-bg="true" x={-10000} y={-10000} width={20000} height={20000} fill="transparent" />
          <pattern data-bg="true" id="dot-grid" width={20 * s.zoom} height={20 * s.zoom} patternUnits="userSpaceOnUse">
            <circle data-bg="true" cx={10 * s.zoom} cy={10 * s.zoom} r={1 * s.zoom} fill="#cbd5e1" />
          </pattern>
          <rect data-bg="true" x={-10000} y={-10000} width={20000} height={20000} fill="url(#dot-grid)" />
        </g>

        <g transform={`translate(${s.pan.x}, ${s.pan.y}) scale(${s.zoom})`}>
          {s.elements.map(renderShape)}
          {currentPath && (
            <path d={pathToString(currentPath.points)} stroke={currentPath.stroke} strokeWidth={currentPath.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {renderEditingText()}
        </g>
      </svg>

      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => s.setZoom(Math.max(0.25, s.zoom * 0.8))} title="Zoom out"><Minus size={16} /></button>
        <span className="zoom-label">{Math.round(s.zoom * 100)}%</span>
        <button className="zoom-btn" onClick={() => s.setZoom(Math.min(4, s.zoom * 1.25))} title="Zoom in"><Plus size={16} /></button>
        <button className="zoom-btn" onClick={s.resetView} title="Reset view"><Maximize size={14} /></button>
      </div>

      <div className="coord-display">{Math.round(mousePos.x)}, {Math.round(mousePos.y)}</div>
    </div>
  );
}
