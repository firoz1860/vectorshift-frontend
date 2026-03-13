import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
 
export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
 
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
 
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
 
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
 
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
 
  onConnect: (connection) =>
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          style: { stroke: '#6366f1', strokeWidth: 2 },
        },
        get().edges
      ),
    }),
 
  updateNodeField: (nodeId, fieldName, fieldValue) =>
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    }),
 
  removeNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    }),
 
  clearAll: () =>
    set({ nodes: [], edges: [], nodeIDs: {} }),
}));


// // store.js
// import { create } from 'zustand';
// import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

// export const useStore = create((set, get) => ({
//   nodes: [],
//   edges: [],
//   nodeIDs: {},

//   getNodeID: (type) => {
//     const newIDs = { ...get().nodeIDs };
//     if (newIDs[type] === undefined) newIDs[type] = 0;
//     newIDs[type] += 1;
//     set({ nodeIDs: newIDs });
//     return `${type}-${newIDs[type]}`;
//   },

//   addNode: (node) => set({ nodes: [...get().nodes, node] }),

//   onNodesChange: (changes) =>
//     set({ nodes: applyNodeChanges(changes, get().nodes) }),

//   onEdgesChange: (changes) =>
//     set({ edges: applyEdgeChanges(changes, get().edges) }),

//   onConnect: (connection) =>
//     set({
//       edges: addEdge(
//         {
//           ...connection,
//           type: 'smoothstep',
//           animated: true,
//           markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
//           style: { stroke: '#6366f1', strokeWidth: 2 },
//         },
//         get().edges
//       ),
//     }),

//   updateNodeField: (nodeId, fieldName, fieldValue) =>
//     set({
//       nodes: get().nodes.map((node) => {
//         if (node.id === nodeId) {
//           node.data = { ...node.data, [fieldName]: fieldValue };
//         }
//         return node;
//       }),
//     }),
// }));
