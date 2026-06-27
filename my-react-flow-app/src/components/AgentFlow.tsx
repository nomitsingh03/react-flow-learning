import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge
} from '@xyflow/react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoalNode, ProcessingNode, CorrectNode, IncorrectNode } from './AgentNodes';
import '@xyflow/react/dist/style.css';
import './AgentFlow.css';

const nodeTypes = {
  goalNode: GoalNode,
  processingNode: ProcessingNode,
  correctNode: CorrectNode,
  incorrectNode: IncorrectNode,
};

const WRONG_RESPONSES = [
  "Hello, I am processing your request but I haven't found the correct pattern yet.",
  "Let's try to look at the general concept of software development and workflow automation.",
  "Modern web applications are built using react, vite, and CSS variables for design consistency.",
  "The quick brown fox jumps over the lazy dog in search of a good challenge.",
  "Designing state machines requires mappinginputs, outputs, and transitions correctly.",
  "Did you know that JavaScript was created in just 10 days by Brendan Eich?",
  "A database is an organized collection of structured information, or data, stored electronically.",
];

function AgentFlow() {
  const [goal, setGoal] = useState('strawberry');
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Use refs to access current state in async timeout loops
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isRunningRef = useRef(isRunning);
  const goalRef = useRef(goal);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    goalRef.current = goal;
  }, [goal]);

  // Initial node setup
  const initFlow = useCallback(() => {
    const initialNodes = [
      {
        id: 'goal-node',
        type: 'goalNode',
        position: { x: 300, y: 50 },
        data: {
          goal: goalRef.current,
          onGoalChange: (newGoal: string) => {
            setGoal(newGoal);
          },
          onStart: startAgentLoop,
          isRunning: isRunningRef.current,
        },
      },
    ];
    setNodes(initialNodes);
    setEdges([]);
  }, [setNodes, setEdges]);

  // Synchronize GoalNode's state with react state changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === 'goal-node') {
          return {
            ...n,
            data: {
              ...n.data,
              goal,
              isRunning,
            },
          };
        }
        return n;
      })
    );
  }, [goal, isRunning, setNodes]);

  // Initialize flow on mount
  useEffect(() => {
    initFlow();
  }, []);

  const startAgentLoop = () => {
    if (!goal.trim()) return;
    setIsRunning(true);

    // Reset flow nodes to just the GoalNode
    const initialNodes = [
      {
        id: 'goal-node',
        type: 'goalNode',
        position: { x: 300, y: 50 },
        data: {
          goal: goal,
          onGoalChange: (newGoal: string) => {
            setGoal(newGoal);
          },
          onStart: startAgentLoop,
          isRunning: true,
        },
      },
    ];
    setNodes(initialNodes);
    setEdges([]);

    // Trigger attempt 1 after a brief start delay
    setTimeout(() => {
      runAttempt(1, { x: 300, y: 220 }, 'goal-node');
    }, 1000);
  };

  const runAttempt = (attemptNum: number, position: { x: number; y: number }, sourceId: string) => {
    const nodeId = `attempt-${attemptNum}`;
    
    // 1. Create a processing node
    const newProcessingNode = {
      id: nodeId,
      type: 'processingNode',
      position,
      data: {
        attempt: attemptNum,
        status: 'processing',
        responseText: '',
      },
    };

    const newEdge = {
      id: `edge-${sourceId}-${nodeId}`,
      source: sourceId,
      target: nodeId,
      animated: true,
      style: { stroke: '#c084fc', strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newProcessingNode]);
    setEdges((eds) => [...eds, newEdge]);

    // Simulate AI thinking and generating
    setTimeout(() => {
      // Decide if this attempt succeeds or fails
      // We will force success on attempt 3 or 4, or randomly match with 25% chance starting from attempt 2
      const currentGoal = goalRef.current.toLowerCase();
      let matched = false;
      let generatedText = '';

      const forceSuccess = attemptNum >= 3;
      if (forceSuccess) {
        matched = true;
        generatedText = `Successfully matched the goal! I have created a comprehensive analysis about the ${goalRef.current} model.`;
      } else {
        // Generate a random wrong response
        const randomBase = WRONG_RESPONSES[(attemptNum - 1) % WRONG_RESPONSES.length];
        
        // Double check it doesn't accidentally contain the goal
        if (randomBase.toLowerCase().includes(currentGoal)) {
          matched = true;
          generatedText = randomBase;
        } else {
          generatedText = randomBase;
        }
      }

      // Update current processing node status to completed
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'completed',
                responseText: generatedText,
              },
            };
          }
          return node;
        })
      );

      // Branch based on match
      setTimeout(() => {
        if (matched) {
          // Spawn Correct Node
          const correctNodeId = `correct-${attemptNum}`;
          const correctNode = {
            id: correctNodeId,
            type: 'correctNode',
            position: { x: position.x, y: position.y + 180 },
            data: {
              responseText: generatedText,
            },
          };

          const correctEdge = {
            id: `edge-${nodeId}-${correctNodeId}`,
            source: nodeId,
            target: correctNodeId,
            animated: true,
            style: { stroke: '#34d399', strokeWidth: 3 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#34d399',
            },
          };

          setNodes((nds) => [...nds, correctNode]);
          setEdges((eds) => [...eds, correctEdge]);
          setIsRunning(false);
        } else {
          // Spawn Incorrect Node & Next Processing Node
          const incorrectNodeId = `incorrect-${attemptNum}`;
          
          const incorrectNode = {
            id: incorrectNodeId,
            type: 'incorrectNode',
            position: { x: position.x - 180, y: position.y + 180 },
            data: {
              responseText: generatedText,
            },
          };

          const nextAttemptPos = { x: position.x + 180, y: position.y + 180 };

          const incorrectEdge = {
            id: `edge-${nodeId}-${incorrectNodeId}`,
            source: nodeId,
            target: incorrectNodeId,
            style: { stroke: '#f87171', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#f87171',
            },
          };

          setNodes((nds) => [...nds, incorrectNode]);
          setEdges((eds) => [...eds, incorrectEdge]);

          // Trigger next attempt
          runAttempt(attemptNum + 1, nextAttemptPos, nodeId);
        }
      }, 1000);
    }, 2000);
  };

  const handleReset = () => {
    setIsRunning(false);
    // Give state updates time to flush
    setTimeout(() => {
      initFlow();
    }, 100);
  };

  return (
    <div className="agent-flow-container">
      <header className="agent-flow-header">
        <h1 className="agent-flow-title">AI Agent Iterative loop</h1>
        <div className="agent-flow-controls">
          <button 
            className="node-button" 
            style={{ background: '#374151', border: '1px solid #4b5563' }}
            onClick={handleReset}
          >
            🔄 Reset Canvas
          </button>
        </div>
      </header>

      <div style={{ flex: 1, width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#1e293b" gap={24} size={1} />
          <Controls style={{ background: '#1e293b', border: '1px solid #475569', color: '#f3f4f6' }} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default AgentFlow;
