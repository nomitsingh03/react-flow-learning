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
  if (!population) return '#e2e8f0'; // Default gray for unknown
  if (population > 10000000) return '#b91c1c'; // Deep Red (>100M)
  if (population > 1000000) return '#dc2626';  // Red (>10M)
  if (population > 100000) return '#ea580c';   // Orange-Red (>5M)
  if (population > 10000) return '#f97316';   // Orange (>1M)
  if (population > 1000) return '#eab308';    // Yellow (>500k)
  return '#22c55e';                             // Green (<500k)
};

const CustomNode = ({ data }: CustomNodeProps) => {
    const backgroundColor = getColorByPopulation(data.population);
    return (
        <div style={{
            background: backgroundColor,
            // padding: '10px',
            borderRadius: '8px',
            width: "100%",
            minHeight: 30,
        }}>
            {data.type !== 'country' && (
                <Handle id="top" type="target" position={Position.Left}
                    style={{ background: "#64748B", width: 6, height: 6 }} />
            )}
            <div style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0' }}>
                {data.label}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              Pop: {data.population.toLocaleString()}
            </div>
            {data.type !== 'city' && (
                <Handle id="right" type="source" position={Position.Right}
                    style={{ background: "#64748B", width: 6, height: 6 }} />
            )}

        </div>
    )
}

export default memo(CustomNode);