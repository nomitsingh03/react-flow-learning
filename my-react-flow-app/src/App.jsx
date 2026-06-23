import { ReactFlow, Background, Controls, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import { useState } from 'react';



function initalEdges() {
  
}

function CustomNode({ data }) {
  // Fallback handling to avoid crashes if data props are missing
  const label = typeof data?.label === "string" ? data.label : "Untitled Node";

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: "#ef6b6b",
        border: "1px solid #ddd",
        minWidth: 120
      }}
    >
      {/* Source and Target handles with safe positioning */}
      <Handle type="target" position={Position.Top} />
      <div style={{ textAlign: "center", fontWeight: "bold" }}>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const NodeType = {
  customNode: CustomNode
};

const initialNodes = [
  {
    id: 'n1',
    position: { x: 500, y: 0 },
    data: { label: 'Node 1' },
    type: 'customNode',
  },
  {
    id: 'n2',
    position: { x: 700, y: 200 },
    data: { label: 'Node 2' },
    type: 'customNode',
  },

  {
    id: 'n3',
    position: { x: 300, y: 200 },
    data: { label: 'Node 3' },
    type: 'customNode',
  },
];

function App() {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  return (
<div className="App" style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={NodeType} >
   <Background />
  {/* <Controls /> */}
 </ReactFlow>
  </div>
  );
}

export default App
