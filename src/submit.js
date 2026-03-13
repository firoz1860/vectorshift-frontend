// submit.js – Part 4: Backend Integration
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes:   state.nodes,
  edges:   state.edges,
  clearAll: state.clearAll,
});

export const SubmitButton = () => {
  const { nodes, edges, clearAll } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('http://localhost:8000/pipelines/parse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearAll();
  };

  return (
    <>
      <div className="submit-bar">
        <span className="submit-bar__info">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} ·{' '}
          {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>

        <button className="clear-btn" onClick={handleClear}>
          Clear canvas
        </button>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <><div className="spinner" /> Analyzing…</>
          ) : (
            <>⚡ Run Analysis</>
          )}
        </button>
      </div>

      {/* Result modal */}
      {result && (
        <div className="result-overlay" onClick={() => setResult(null)}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="result-modal__title">Pipeline Analysis</div>
            <div className="result-modal__subtitle">
              Results from /pipelines/parse endpoint
            </div>
            <div className="result-stats">
              <div className="result-stat">
                <div className="result-stat__value">{result.num_nodes}</div>
                <div className="result-stat__label">Nodes</div>
              </div>
              <div className="result-stat">
                <div className="result-stat__value">{result.num_edges}</div>
                <div className="result-stat__label">Edges</div>
              </div>
            </div>
            <div className={`result-dag result-dag--${result.is_dag}`}>
              {result.is_dag ? '✅ Valid DAG' : '❌ Contains Cycles'}
              <span style={{ fontWeight: 400, opacity: 0.75, fontSize: 11 }}>
                {result.is_dag
                  ? ' — safe to execute'
                  : ' — fix before running'}
              </span>
            </div>
            <button className="result-modal__close" onClick={() => setResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error modal */}
      {error && (
        <div className="result-overlay" onClick={() => setError(null)}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="result-modal__title">⚠️ Connection Error</div>
            <div className="result-modal__subtitle">
              Make sure the FastAPI server is running on port 8000.
            </div>
            <p className="error-code">{error}</p>
            <button className="result-modal__close" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};
