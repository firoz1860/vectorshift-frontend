// draggableNode.js
export const DraggableNode = ({ type, label, icon = '⚙️' }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="draggable-chip" draggable onDragStart={onDragStart}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
};
