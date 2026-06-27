import { ReactFlow, Background, Controls, useNodesState, useEdgesState, NodeMouseHandler, BackgroundVariant} from '@xyflow/react';
import { useEffect, useCallback } from 'react';
import { buildFlowGraph } from '.././utils/util';
import { getData } from '.././utils/data';
import { FlowNode, FlowEdge } from '.././utils/util';
import CustomNode from '.././utils/CustomNode';
import '@xyflow/react/dist/style.css';

const NodeType = {
  customNode: CustomNode
};

function CountryFlow() {

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  useEffect(() => {
    const data = getData();
    const { edges, nodes } = buildFlowGraph(data);
    setNodes(nodes);
    setEdges(edges)
  }, []);

  // const [nodes, setNodes] = useState([]);
  // const [edges, setEdges] = useState([]);

  // 2. The Expand/Collapse Logic
    const handleNodeClick: NodeMouseHandler = useCallback((event, clickedNode) => {
        // Cities have no children, so do nothing
        if (clickedNode.data.type === 'city') return;

        // Check if we are currently expanded
        const isExpanded = clickedNode.data.expanded;

        // 1. RECURSIVE HELPER: Finds children, grandchildren, etc.
    const getAllDescendants = (parentId: string): string[] => {
        const immediateChildren = edges
            .filter((e) => e.source === parentId)
            .map((e) => e.target);
            
        return immediateChildren.reduce((acc, childId) => {
            return [...acc, childId, ...getAllDescendants(childId)];
        }, immediateChildren);
    };

    // 2. Get our ID lists
    const immediateChildIds = edges.filter((e) => e.source === clickedNode.id).map((e) => e.target);
    const allDescendantIds = getAllDescendants(clickedNode.id); // Every node beneath this one

    // --- UPDATE NODES ---
    setNodes((currentNodes) => {
        return currentNodes.map((node) => {
            // A. Toggle the clicked node's expanded state
            if (node.id === clickedNode.id) {
                return { ...node, data: { ...node.data, expanded: !isExpanded } };
            }
            
            // B. Unhide ONLY immediate children if expanding
            if (!isExpanded && immediateChildIds.includes(node.id)) {
                return { ...node, hidden: false };
            }
            
            // C. Hide ALL descendants deeply if collapsing
            if (isExpanded && allDescendantIds.includes(node.id)) {
                return { ...node, hidden: true, data: { ...node.data, expanded: false } };
            }
            
            return node;
        });
    });

    // --- UPDATE EDGES ---
    setEdges((currentEdges) => {
        return currentEdges.map((edge) => {
            // A. Reveal immediate edges if expanding
            if (!isExpanded && edge.source === clickedNode.id) {
                return { ...edge, hidden: false };
            }
            
            // B. Hide ALL descendant edges if collapsing
            // We check if the edge is pointing to ANY descendant
            if (isExpanded && allDescendantIds.includes(edge.target)) {
                return { ...edge, hidden: true };
            }
            
            return edge;
        });
    });

}, [edges, setNodes, setEdges]);

  return (
<div className="App" style={{ width: '100%', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={NodeType} 
        fitView 
        fitViewOptions={{ 
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5
        }}
        defaultEdgeOptions={{
          style: { stroke: '#cbcbd1', strokeWidth: 2 },
        }}
              nodesDraggable={false}
              draggable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={40} size={1}/>
        {/* <Controls /> */}
      </ReactFlow>
  </div>
  );
}

export default CountryFlow
