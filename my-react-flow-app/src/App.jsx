import { ReactFlow, Background, Controls, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import { useEffect, useState } from 'react';
import { buildFlowGraph } from './utils/util';
import { getData } from './utils/data';
import CustomNode from './utils/CustomNode';


const NodeType = {
  customNode: CustomNode
};

function App() {

  useEffect(() => {
    const data = getData();
    const { edges, nodes } = buildFlowGraph(data);
    setNodes(nodes);
    setEdges(edges)
  }, []);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

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
