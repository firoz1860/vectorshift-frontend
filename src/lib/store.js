import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { createShape, createPath, createConnection } from './shapes';

const SHAPE_TOOLS = ['rectangle','rounded','circle','cylinder','diamond','parallelogram','cloud','hexagon','arrow','text','sticky'];

export const useStore = create((set, get) => ({
  elements: [],
  selectedId: null,
  editingTextId: null,

  tool: 'select',
  strokeColor: '#1e293b',
  fillColor: '#ffffff',
  strokeWidth: 2,
  fontSize: 16,

  pan: { x: 0, y: 0 },
  zoom: 1,

  boards: [],
  loadingBoards: false,
  currentBoardId: null,
  currentBoardTitle: '',
  boardModified: false,

  showTemplates: false,

  setTool: (tool) => set({ tool, selectedId: tool === 'select' ? get().selectedId : null }),
  setStrokeColor: (c) => set({ strokeColor: c }),
  setFillColor: (c) => set({ fillColor: c }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),
  setFontSize: (s) => set({ fontSize: s }),

  addShapeAt: (type, x, y) => {
    const el = createShape(type, x, y, {
      stroke: get().strokeColor,
      fill: get().fillColor,
      fontSize: get().fontSize,
    });
    set((s) => ({ elements: [...s.elements, el], selectedId: el.id, boardModified: true }));
    return el;
  },
  addPath: (points) => {
    const p = createPath(points, get().strokeColor, get().strokeWidth);
    set((s) => ({ elements: [...s.elements, p], boardModified: true }));
    return p;
  },
  addConnection: (fromId, toId) => {
    const c = createConnection(fromId, toId);
    set((s) => ({ elements: [...s.elements, c], boardModified: true }));
    return c;
  },
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      boardModified: true,
    })),
  deleteElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id && e.fromId !== id && e.toId !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      boardModified: true,
    })),
  clearCanvas: () =>
    set({ elements: [], selectedId: null, editingTextId: null, boardModified: true }),
  selectElement: (id) => set({ selectedId: id, editingTextId: null }),
  setEditingText: (id) => set({ editingTextId: id }),

  setPan: (pan) => set({ pan }),
  setZoom: (zoom) => set({ zoom }),
  resetView: () => set({ pan: { x: 0, y: 0 }, zoom: 1 }),

  toggleTemplates: () => set((s) => ({ showTemplates: !s.showTemplates })),

  loadBoards: async () => {
    set({ loadingBoards: true });
    const { data, error } = await supabase
      .from('boards')
      .select('id, title, thumbnail, category, created_at, updated_at')
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('Failed to load boards:', error);
      set({ loadingBoards: false });
      return;
    }
    set({ boards: data || [], loadingBoards: false });
  },

  saveBoard: async (title, category = 'Custom') => {
    const { elements, currentBoardId } = get();
    const payload = {
      title,
      category,
      canvas_data: { elements },
    };

    if (currentBoardId) {
      const { data, error } = await supabase
        .from('boards')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', currentBoardId)
        .select('id, title, thumbnail, category, created_at, updated_at')
        .single();
      if (error) return { error };
      set((s) => ({
        boards: s.boards.map((b) => (b.id === data.id ? data : b)),
        currentBoardTitle: title,
        boardModified: false,
      }));
      return { data };
    }

    const { data, error } = await supabase
      .from('boards')
      .insert(payload)
      .select('id, title, thumbnail, category, created_at, updated_at')
      .single();
    if (error) return { error };
    set((s) => ({
      boards: [data, ...s.boards],
      currentBoardId: data.id,
      currentBoardTitle: title,
      boardModified: false,
    }));
    return { data };
  },

  loadBoard: async (id) => {
    const { data, error } = await supabase
      .from('boards')
      .select('id, title, canvas_data, category')
      .eq('id', id)
      .single();
    if (error) return { error };
    set({
      elements: data.canvas_data?.elements || [],
      currentBoardId: data.id,
      currentBoardTitle: data.title,
      selectedId: null,
      editingTextId: null,
      boardModified: false,
    });
    return { data };
  },

  deleteBoard: async (id) => {
    const { error } = await supabase.from('boards').delete().eq('id', id);
    if (error) return { error };
    set((s) => ({
      boards: s.boards.filter((b) => b.id !== id),
      ...(s.currentBoardId === id
        ? { currentBoardId: null, currentBoardTitle: '', elements: [], boardModified: false }
        : {}),
    }));
    return {};
  },

  newBoard: () =>
    set({
      elements: [],
      selectedId: null,
      editingTextId: null,
      currentBoardId: null,
      currentBoardTitle: '',
      boardModified: false,
    }),

  loadTemplate: (template) => {
    set({
      elements: template.elements.map((el) => ({ ...el, id: nanoid(8) })),
      currentBoardId: null,
      currentBoardTitle: template.title || '',
      selectedId: null,
      editingTextId: null,
      boardModified: true,
    });
  },
}));
