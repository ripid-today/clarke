'use client';

import { useEffect, useRef, useState } from 'react';

type Concept = {
  id: string;
  name: string;
  description: string;
  content: string;
  word_count: number;
};

type Topic = {
  id: string;
  name: string;
  description: string;
  content: string;
  level: number;
  concept_count: number;
};

type Edge = {
  source: string;
  target: string;
  rel_type: string;
};

type NodeData = {
  id: string;
  name: string;
  type: 'Concept' | 'Topic';
  [key: string]: unknown;
};

const EDGE_COLORS: Record<string, string> = {
  SPECIALIZES: '#2ecc71',
  PART_OF: '#9b59b6',
  ENABLES: '#3498db',
  CONTRADICTS: '#e74c3c',
  ANALOG_TO: '#f39c12',
  INDEXED_UNDER: '#bdc3c7',
};

function loadMathJax() {
  if (document.getElementById('mathjax-script')) return;

  const configScript = document.createElement('script');
  configScript.textContent = `
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
      },
      svg: { fontCache: 'global' }
    };
  `;
  document.head.appendChild(configScript);

  const script = document.createElement('script');
  script.id = 'mathjax-script';
  script.async = true;
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  document.head.appendChild(script);
}

function typesetMath() {
  // @ts-expect-error MathJax global
  if (typeof window !== 'undefined' && window.MathJax?.typesetPromise) {
    // @ts-expect-error MathJax global
    window.MathJax.typesetPromise();
  }
}

export default function GraphPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<any>(null);
  const [data, setData] = useState<{ concepts: Concept[]; topics: Topic[]; edges: Edge[] } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerNode, setDrawerNode] = useState<NodeData | null>(null);

  useEffect(() => {
    fetch('/api/graph')
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .catch((err) => console.error('Failed to load graph:', err));
  }, []);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    if (networkRef.current) return;

    let destroyed = false;

    const init = async () => {
      const vis = await import('vis-network/standalone');
      if (destroyed) return;

      const { Network, DataSet } = vis;

      const nodeDataStore: Record<string, NodeData> = {};
      const nodes = new DataSet<any>([]);
      const edges = new DataSet<any>([]);

      for (const t of data.topics) {
        nodeDataStore[t.id] = {
          id: t.id,
          name: t.name,
          type: 'Topic',
          description: t.description,
          content: t.content,
          level: t.level,
          concept_count: t.concept_count,
        };
        nodes.add({
          id: t.id,
          label: t.name,
          title: 'Click to view details',
          color: {
            background: '#e67e22',
            border: '#d35400',
            highlight: { background: '#f39c12', border: '#d35400' },
          },
          shape: 'dot',
          size: 35,
          font: { size: 16, color: '#2c3e50', face: 'Segoe UI' },
        });
      }

      const wordCounts = data.concepts.map((c) => c.word_count || 100);
      const minWc = Math.min(...wordCounts);
      const maxWc = Math.max(...wordCounts);

      function scaleSize(wc: number) {
        if (maxWc === minWc) return 20;
        return 15 + ((wc - minWc) / (maxWc - minWc)) * 20;
      }

      for (const c of data.concepts) {
        const size = scaleSize(c.word_count || 100);
        nodeDataStore[c.id] = {
          id: c.id,
          name: c.name,
          type: 'Concept',
          description: c.description,
          content: c.content,
          word_count: c.word_count,
        };
        nodes.add({
          id: c.id,
          label: c.name,
          title: 'Click to view details',
          color: {
            background: '#3498db',
            border: '#2980b9',
            highlight: { background: '#5dade2', border: '#2980b9' },
          },
          shape: 'dot',
          size,
          font: { size: 13, color: '#2c3e50', face: 'Segoe UI' },
        });
      }

      for (const e of data.edges) {
        const color = EDGE_COLORS[e.rel_type] || '#7f8c8d';
        const dashes = e.rel_type === 'INDEXED_UNDER';
        edges.add({
          from: e.source,
          to: e.target,
          title: e.rel_type,
          color,
          width: e.rel_type !== 'INDEXED_UNDER' ? 2 : 1,
          dashes,
          arrows: 'to',
        });
      }

      const net = new Network(
        containerRef.current,
        { nodes, edges },
        {
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -3000,
              centralGravity: 0.4,
              springLength: 150,
              springConstant: 0.04,
              damping: 0.09,
              avoidOverlap: 0.2,
            },
            stabilization: { iterations: 150 },
          },
          interaction: {
            hover: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: false,
          },
        }
      );

      net.on('click', (params: any) => {
        if (params.nodes && params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          setDrawerNode(nodeDataStore[nodeId] || null);
          setDrawerOpen(true);
        } else {
          setDrawerOpen(false);
        }
      });

      networkRef.current = net;
    };

    init();
    loadMathJax();

    return () => {
      destroyed = true;
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data]);

  useEffect(() => {
    if (drawerOpen) {
      setTimeout(typesetMath, 100);
    }
  }, [drawerOpen, drawerNode]);

  if (!data) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          color: '#7f8c8d',
        }}
      >
        Loading knowledge graph...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '460px',
          height: '100vh',
          background: '#ffffff',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 9999,
          fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8f9fa',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '16px', color: '#2c3e50', fontWeight: 600 }}>
            {drawerNode?.name || 'Node Details'}
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: '#7f8c8d',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {drawerNode &&
            Object.entries(drawerNode)
              .filter(([key]) => key !== 'content')
              .map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null;
                return (
                  <div key={key} style={{ marginBottom: '14px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#7f8c8d',
                        marginBottom: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#2c3e50',
                        lineHeight: 1.5,
                        wordWrap: 'break-word',
                      }}
                    >
                      {String(value)}
                    </div>
                  </div>
                );
              })}

          {drawerNode?.content && (
            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#7f8c8d',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}
              >
                Content
              </div>
              <div style={{ fontSize: '14px', color: '#2c3e50', lineHeight: 1.5, wordWrap: 'break-word' }}>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    margin: 0,
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: '#34495e',
                    background: '#f8f9fa',
                    padding: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ecf0f1',
                    maxHeight: '65vh',
                    overflowY: 'auto',
                  }}
                >
                  {String(drawerNode.content)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
