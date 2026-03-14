<div align="center">

<img src="https://img.shields.io/badge/VectorShift-Pipeline%20Designer-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="VectorShift" />

# ⚡ VectorShift — Frontend

**A visual, drag-and-drop pipeline builder built with React + ReactFlow**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-11.8.3-FF0072?style=flat-square&logo=reactflow&logoColor=white)](https://reactflow.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.4.7-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🌐 Live Demo](https://vectorshift-frontend-one.vercel.app/) · [🐛 Report Bug](https://github.com/firoz1860/vectorshift-frontend/issues) · [✨ Request Feature](https://github.com/firoz1860/vectorshift-frontend/issues)

</div>

---

## 📸 Screenshots

<div align="center">

![alt text](image.png)

### Pipeline Canvas
![Pipeline Canvas](https://placehold.co/900x500/f0f4ff/6366f1?text=Pipeline+Canvas+—+Drag+%26+Drop+Nodes)

### Node Types
![Node Types](https://placehold.co/900x200/ffffff/0f172a?text=Input+%7C+Output+%7C+LLM+%7C+Text+%7C+API+%7C+Filter+%7C+Note+%7C+Transform+%7C+Conditional)

### Analysis Result Modal
![Result Modal](https://placehold.co/400x300/ffffff/6366f1?text=Pipeline+Analysis+Modal+—+Nodes+%2F+Edges+%2F+DAG+Result)

</div>

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML shell
└── src/
    ├── nodes/
    │   ├── BaseNode.js         # ⭐ Core abstraction — all nodes extend this
    │   ├── inputNode.js        # 📥 Input node
    │   ├── llmNode.js          # 🤖 LLM node
    │   ├── outputNode.js       # 📤 Output node
    │   ├── textNode.js         # 📝 Text node (dynamic resize + variable handles)
    │   ├── apiNode.js          # 🌐 API Call node
    │   ├── filterNode.js       # 🔍 Filter node
    │   ├── noteNode.js         # 📌 Sticky Note node
    │   ├── transformNode.js    # 🔄 Transform node
    │   └── conditionalNode.js  # 🔀 Conditional node
    ├── App.js                  # Root component
    ├── draggableNode.js        # Toolbar chip component
    ├── index.css               # Global styles + CSS variables
    ├── index.js                # React entry point
    ├── store.js                # Zustand global state
    ├── submit.js               # Submit bar + backend fetch + result modal
    ├── toolbar.js              # Top toolbar with all node chips
    └── ui.js                   # ReactFlow canvas
```

---

## ✨ Features

### Part 1 — Node Abstraction
All nodes are built from a single `BaseNode` component. Adding a new node takes ~25 lines instead of ~80.

```jsx
// Creating a new node is this simple:
<BaseNode
  id={id}
  title="My Node"
  icon="🔧"
  color="#6366f1"
  inputs={[{ id: 'data', label: 'Data In' }]}
  outputs={[{ id: 'result', label: 'Result' }]}
>
  {/* your fields here */}
</BaseNode>
```

### Part 2 — Styling
- 🎨 Soft indigo-tinted background (`#f0f4ff`) — never black
- 🔤 DM Sans + JetBrains Mono fonts
- 🎯 Per-node accent color on header stripe
- 📱 Fully responsive — works on all screen sizes
- ✨ Animated edges, glass-blur modals, hover effects

### Part 3 — Text Node Logic
- **Auto-resize** — node width and height grow as you type
- **Variable detection** — typing `{{varName}}` instantly creates a new left-side handle
- **Live preview** — pink variable tags show all detected variables

```
Type: "Hello {{name}}, your score is {{score}}"
→ Creates two handles: [name] and [score]
```

### Part 4 — Backend Integration
- Sends `nodes[]` and `edges[]` to `/pipelines/parse` on submit
- Shows animated result modal with node count, edge count, DAG status
- Error modal with guidance if backend is unreachable

---

## 🚀 Getting Started

### Prerequisites
```
Node.js >= 18.x
npm >= 9.x
```

### Installation & Run

```powershell
# 1. Clone the repo
git clone https://github.com/firoz1860/vectorshift-frontend.git
cd vectorshift-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the `frontend/` root:

```env
REACT_APP_API_URL=http://localhost:8000
```

For production (`.env.production`):
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🧩 All Node Types

| Icon | Type | Label | Inputs | Outputs | Color |
|------|------|-------|--------|---------|-------|
| 📥 | `customInput` | Input | — | `value` | ![#10b981](https://placehold.co/12x12/10b981/10b981.png) Green |
| 📤 | `customOutput` | Output | `value` | — | ![#f59e0b](https://placehold.co/12x12/f59e0b/f59e0b.png) Amber |
| 🤖 | `llm` | LLM | `system`, `prompt` | `response` | ![#6366f1](https://placehold.co/12x12/6366f1/6366f1.png) Indigo |
| 📝 | `text` | Text | `{{vars}}` dynamic | `output` | ![#ec4899](https://placehold.co/12x12/ec4899/ec4899.png) Pink |
| 🌐 | `api` | API Call | `body`, `headers` | `response`, `status` | ![#0ea5e9](https://placehold.co/12x12/0ea5e9/0ea5e9.png) Sky |
| 🔍 | `filter` | Filter | `data` | `pass`, `fail` | ![#8b5cf6](https://placehold.co/12x12/8b5cf6/8b5cf6.png) Violet |
| 📌 | `note` | Note | — | — | ![#f97316](https://placehold.co/12x12/f97316/f97316.png) Orange |
| 🔄 | `transform` | Transform | `input` | `output` | ![#14b8a6](https://placehold.co/12x12/14b8a6/14b8a6.png) Teal |
| 🔀 | `conditional` | Conditional | `value` | `true`, `false` | ![#ef4444](https://placehold.co/12x12/ef4444/ef4444.png) Red |

---

## 🎮 How to Use

```
1. Drag a node chip from the toolbar onto the canvas
2. Drag from a source handle (●  right side) to a target handle (○  left side) to connect
3. Fill in node fields — names, URLs, expressions, etc.
4. Click ⚡ Run Analysis to submit to the backend
5. View the result modal showing node count, edge count, and DAG status
6. Press Delete key or click × to remove a selected node
7. Click Clear canvas to reset everything
```

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Framework |
| ReactFlow | 11.8.3 | Node-based canvas |
| Zustand | 4.4.7 | Global state management |
| DM Sans | Google Fonts | UI typography |
| JetBrains Mono | Google Fonts | Code fields |

---

## ☁️ Deployment (Vercel)

```powershell
# Push to GitHub — Vercel auto-deploys on every push
git add .
git commit -m "your message"
git push
```

**Vercel settings:**

| Field | Value |
|-------|-------|
| Root Directory | `frontend` |
| Framework | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Env Variable | `REACT_APP_API_URL` = your Render URL |

---

## 🐛 Known Issues & Fixes

| Issue | Fix |
|-------|-----|
| Vercel build fails with ESLint errors | `CI=true` treats warnings as errors — all imports must be used |
| Missing babel plugin warning | Added `@babel/plugin-proposal-private-property-in-object` to devDependencies |
| Canvas not filling height | `html, body, #root { height: 100% }` + `flex: 1; min-height: 0` on canvas |

---

## 📄 License

MIT © [VectorShift](https://github.com/firoz1860)
