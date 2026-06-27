import { Handle, Position } from '@xyflow/react';
import React, { memo } from 'react';

// Custom Goal Node
export const GoalNode = memo(({ data }: any) => {
  const { goal, onGoalChange, onStart, isRunning } = data;

  return (
    <div className="custom-flow-node node-goal">
      <div className="node-title-bar">
        <span>🎯</span> Goal Setting
      </div>
      <div className="node-form-group">
        <label className="node-label" htmlFor="goal-input">Goal Keyword</label>
        <input
          id="goal-input"
          type="text"
          className="node-input"
          placeholder="e.g. computer, keyboard"
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          disabled={isRunning}
        />
      </div>
      <button
        className="node-button"
        onClick={onStart}
        disabled={isRunning || !goal.trim()}
        style={{ width: '100%' }}
      >
        {isRunning ? 'Running...' : '🚀 Start AI Agent'}
      </button>
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
});

GoalNode.displayName = 'GoalNode';

// Custom Processing Node
export const ProcessingNode = memo(({ data }: any) => {
  const { attempt, status, responseText } = data;

  return (
    <div className="custom-flow-node node-processing">
      <Handle type="target" position={Position.Top} id="in" />
      <div className="node-title-bar">
        <span>🤖</span> AI Generator (Attempt #{attempt})
      </div>
      
      {status === 'processing' ? (
        <div className="thinking-state">
          <div className="thinking-spinner"></div>
          <div className="thinking-text">Thinking & Generating...</div>
        </div>
      ) : (
        <div>
          <div className="node-label">Generated Response:</div>
          <div className="generated-preview">
            {responseText || 'Evaluating response...'}
          </div>
        </div>
      )}
      
      {status === 'completed' && (
        <Handle type="source" position={Position.Bottom} id="out" />
      )}
    </div>
  );
});

ProcessingNode.displayName = 'ProcessingNode';

// Custom Correct Node
export const CorrectNode = memo(({ data }: any) => {
  const { responseText } = data;

  return (
    <div className="custom-flow-node node-correct">
      <Handle type="target" position={Position.Top} id="in" />
      <div className="node-title-bar">
        <span>🎉</span> Success
      </div>
      <div className="success-badge">
        <span>✓</span> Goal Matched
      </div>
      <div className="success-response">
        {responseText}
      </div>
    </div>
  );
});

CorrectNode.displayName = 'CorrectNode';

// Custom Incorrect Node
export const IncorrectNode = memo(({ data }: any) => {
  const { responseText } = data;

  return (
    <div className="custom-flow-node node-incorrect">
      <Handle type="target" position={Position.Top} id="in" />
      <div className="node-title-bar">
        <span>❌</span> Incorrect Attempt
      </div>
      <div className="failure-badge">
        <span>𐄂</span> Goal Mismatched
      </div>
      <div className="failure-response">
        {responseText}
      </div>
    </div>
  );
});

IncorrectNode.displayName = 'IncorrectNode';
