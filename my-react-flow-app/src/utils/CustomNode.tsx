import { Handle, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { FlowNode } from "./util";
import { City, District, State, Country } from "./data";

export type NodeData = {
    label: string;
    type: 'city' | 'district' | 'state' | 'country';
    population: number;
}

type CustomNodeProps = NodeProps & {
    data: NodeData;
}

const getColorByPopulation = (population: number) => {
  if (!population) return '#7d53e0'; // Default gray for unknown
  if (population > 10000000) return '#b91c1c'; // Deep Red (>100M)
  if (population > 1000000) return '#7e5e13';  // Red (>10M)
  if (population > 100000) return '#1ea066';   // Orange-Red (>5M)
  if (population > 10000) return '#3262b5';   // Orange (>1M)
  if (population > 1000) return '#a7851d';    // Yellow (>500k)
  return '#0d7f37';                             // Green (<500k)
};

const CustomNode = ({ data }: CustomNodeProps) => {
    const backgroundColor = getColorByPopulation(data.population);
    return (
        <div style={{
            background: backgroundColor,
            // padding: '10px',
            color: "black",
            borderRadius: '8px',
            width: "100%",
            minHeight: 30,
        }}>
            {data.type !== 'country' && (
                <Handle id="top" type="target" position={Position.Left}
                   style={{ 
            opacity: 0,    // Hides the handle box completely
            width: 1,      // Makes it as thin as possible
            border: 'none', 
            left: 0        // Keeps it perfectly flush with the left side of your node
        }}/>
            )}
            <div style={{ fontSize: '14px', fontWeight: 'bold', margin: 'px 0' }}>
                {data.label}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              Pop: {data.population.toLocaleString()}
            </div>
            {data.type !== 'city' && (
                <Handle id="right" type="source" position={Position.Right}
                    style={{ background: "#64748B", width: 4, height: 4 }} />
            )}

        </div>
    )
}

export default memo(CustomNode);