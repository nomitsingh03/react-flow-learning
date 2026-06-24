import { Edge, Node } from "@xyflow/react";
import { City, countries, Country, District, State } from "./data";
import CustomNode, { NodeData } from "./CustomNode";

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge;

export const NODE_HEIGHT = 40;
export const NODE_WIDTH = 200;
export const NODE_H_GAP = 100;
export const NODE_V_GAP = 30;

export const NodeTypes = {
    customNode: CustomNode
}

export const buildFlowGraph = (countries: Country[]): { nodes: FlowNode[], edges: FlowEdge[] } => {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    countries.forEach(country => {
        // First pass: Calculate state positions to find the middle
        const statePositions: { state: State, yPos: number, totalHeight: number }[] = [];
        let current_y = 0;

        country.states?.forEach((state) => {
            // Calculate height needed for this state and its children
            let stateHeight = NODE_HEIGHT + NODE_V_GAP;
            state?.districts?.forEach(d => {
                stateHeight += (NODE_HEIGHT + NODE_V_GAP) * (d.cities?.length || 1);
                stateHeight += NODE_V_GAP;
            });

            statePositions.push({ state, yPos: current_y, totalHeight: stateHeight });
            current_y += stateHeight;
        });

        // Find middle state's y position
        const middleIndex = Math.floor((statePositions.length-1) / 2);
        const countryY = statePositions[middleIndex]?.yPos || 0;

        // Create country node with centered position
        const countryNode: FlowNode = {
            id: `country-${country.countryId}`,
            type: 'customNode',
            data: {
                label: country.name,
                type: 'country',
                population: country.population
            },
            position: { x: 0, y: countryY },
            style: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT
            }
        }
        nodes.push(countryNode);

        // Second pass: Create all nodes with calculated positions
        statePositions.forEach((stateInfo) => {
            let state_gap = stateInfo.yPos;

            const stateNode: FlowNode = {
                id: `state-${stateInfo.state.stateId}`,
                type: 'customNode',
                data: {
                    label: stateInfo.state.name,
                    type: 'state',
                    population: stateInfo.state.population
                },
                position: { x: NODE_WIDTH + NODE_H_GAP, y: stateInfo.yPos },
                style: {
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT
                }
            }
            nodes.push(stateNode);

            edges.push({
                id: `country-${country.countryId}-state-${stateInfo.state.stateId}`,
                source: `country-${country.countryId}`,
                target: `state-${stateInfo.state.stateId}`
            });

            stateInfo.state?.districts?.forEach(d => {
                const dNode: FlowNode = {
                    id: `dist-${d.districtId}`,
                    type: 'customNode',
                    data: {
                        label: d.name,
                        type: 'district',
                        population: d.population
                    },
                    position: { x: 2 * (NODE_WIDTH + NODE_H_GAP), y: state_gap },
                    style: {
                        width: NODE_WIDTH,
                        height: NODE_HEIGHT
                    }
                }
                nodes.push(dNode);

                edges.push({
                    id: `state-${stateInfo.state.stateId}-dist-${d.districtId}`,
                    source: `state-${stateInfo.state.stateId}`,
                    target: `dist-${d.districtId}`
                });

                let city_gap = state_gap;
                d.cities?.forEach(city => {
                    const cityNode: FlowNode = {
                        id: `city-${city.cityId}`,
                        type: 'customNode',
                        data: {
                            label: city.name,
                            type: 'city',
                            population: city.population
                        },
                        position: { x: 3 * (NODE_WIDTH + NODE_H_GAP), y: city_gap },
                        style: {
                            width: NODE_WIDTH,
                            height: NODE_HEIGHT
                        }
                    }
                    nodes.push(cityNode);
                    city_gap += NODE_V_GAP + NODE_HEIGHT;

                    edges.push({
                        id: `dist-${d.districtId}-city-${city.cityId}`,
                        source: `dist-${d.districtId}`,
                        target: `city-${city.cityId}`
                    })
                })

                state_gap = city_gap + NODE_V_GAP;
            });
        })
    })

    return { nodes, edges }
}
        