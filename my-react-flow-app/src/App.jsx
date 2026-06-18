import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import { useState } from 'react';

const initialNodes = [
  {
    id: 'n1',
    position: { x: 500, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 700, y: 200 },
    data: { label: 'Node 2' },
    type: 'output',
  },

  {
    id: 'n3',
    position: { x: 300, y: 200 },
    data: { label: 'Node 3' },
    type: 'default',
  },
];

const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'smoothstep',
    label: 'connects with',
  },
  {
    id: 'n2-n3',
    source: 'n2',
    target: 'n3',
    type: '',
    label: 'checkt1',
  }
  ,{
    id: 'n1-n3',
    source: 'n1',
    target: 'n3',
    type: 'smoothstep',
    label: 'checkt2'
  }
];

function App() {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  return (
<div className="App" style={{ width: '100vw', height: '100vh' }}>
     <ReactFlow nodes={nodes} edges={edges}>
   <Background />
  {/* <Controls /> */}
 </ReactFlow>
  </div>
  );
}

export default App
