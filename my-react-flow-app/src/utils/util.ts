import { Edge, MarkerType, Node } from "@xyflow/react";
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
        const countryY = (statePositions.length%2==0) ? (statePositions[middleIndex]?.yPos + statePositions[middleIndex+1]?.yPos)/2 : (statePositions[middleIndex]?.yPos || 0);

        // Create country node with centered position
        const countryNode: FlowNode = {
            id: `country-${country.countryId}`,
            type: 'customNode',
            data: {
                label: country.name,
                type: 'country',
                population: country.population,
                expanded: true,
            } as NodeData,
            position: { x: 0, y: countryY },
            style: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT
            }
        }
        nodes.push(countryNode);

        // Second pass: Create all nodes with calculated positions
        statePositions.forEach((stateInfo) => {
            // First: Calculate district positions to find the middle
            const districtPositions: { district: District, yPos: number, totalHeight: number }[] = [];
            let current_district_y = stateInfo.yPos;

            stateInfo.state?.districts?.forEach(d => {
                // Calculate height needed for this district and its children
                let districtHeight = NODE_HEIGHT + NODE_V_GAP;
                d.cities?.forEach(c => {
                    districtHeight += NODE_HEIGHT + NODE_V_GAP;
                });

                districtPositions.push({ district: d, yPos: current_district_y, totalHeight: districtHeight });
                current_district_y += districtHeight;
            });

            // Find middle district's y position
            const middleDistrictIndex = Math.floor((districtPositions.length - 1) / 2);
            const stateY = (districtPositions.length % 2 == 0) 
                ? (districtPositions[middleDistrictIndex]?.yPos + districtPositions[middleDistrictIndex + 1]?.yPos) / 2
                : (districtPositions[middleDistrictIndex]?.yPos || stateInfo.yPos);

            const stateNode: FlowNode = {
                id: `state-${stateInfo.state.stateId}`,
                type: 'customNode',
                data: {
                    label: stateInfo.state.name,
                    type: 'state',
                    population: stateInfo.state.population,
                    expanded: false
                } as NodeData,
                position: { x: NODE_WIDTH + NODE_H_GAP, y: stateY || current_district_y },
                style: {
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT
                }
            }
            nodes.push(stateNode);

            edges.push({
                id: `country-${country.countryId}-state-${stateInfo.state.stateId}`,
                source: `country-${country.countryId}`,
                target: `state-${stateInfo.state.stateId}`,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 30,
                    height: 20,
                    color: '#64748B',
                    
                },
                style: {
        strokeWidth: 2, // Thicker lines help arrows stand out
        stroke: 'rgb(158, 161, 165)',
    }
            });

            districtPositions.forEach((districtInfo) => {
                // Calculate city positions to find the middle
                const cityPositions: { city: City, yPos: number, totalHeight: number }[] = [];
                let current_city_y = districtInfo.yPos;

                districtInfo?.district?.cities?.forEach(city => {
                    const cityHeight = NODE_HEIGHT + NODE_V_GAP;
                    cityPositions.push({ city, yPos: current_city_y, totalHeight: cityHeight });
                    current_city_y += cityHeight;
                });

                // Find middle city's y position
                const middleCityIndex = Math.floor((cityPositions.length - 1) / 2);
                const districtY = (cityPositions.length % 2 == 0)
                    ? (cityPositions[middleCityIndex]?.yPos + cityPositions[middleCityIndex + 1]?.yPos) / 2
                    : (cityPositions[middleCityIndex]?.yPos || districtInfo.yPos);

                const dNode: FlowNode = {
                    id: `dist-${districtInfo.district.districtId}`,
                    type: 'customNode',
                    data: {
                        label: districtInfo.district.name,
                        type: 'district',
                        population: districtInfo.district.population,
                        expanded: false
                    } as NodeData,
                    position: { x: 2 * (NODE_WIDTH + NODE_H_GAP), y: districtY },
                    style: {
                        width: NODE_WIDTH,
                        height: NODE_HEIGHT
                    },
                    hidden: true,
                }
                nodes.push(dNode);

                edges.push({
                    id: `state-${stateInfo.state.stateId}-dist-${districtInfo.district.districtId}`,
                    source: `state-${stateInfo.state.stateId}`,
                    target: `dist-${districtInfo.district.districtId}`,
                    markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 30,
                    height: 20,
                    color: '#64748B',
                    
                },
                    hidden: true
                });

                cityPositions.forEach(cityInfo => {
                    const cityNode: FlowNode = {
                        id: `city-${cityInfo.city.cityId}`,
                        type: 'customNode',
                        data: {
                            label: cityInfo.city.name,
                            type: 'city',
                            population: cityInfo.city.population,
                        } as NodeData,
                        position: { x: 3 * (NODE_WIDTH + NODE_H_GAP), y: cityInfo.yPos },
                        style: {
                            width: NODE_WIDTH,
                            height: NODE_HEIGHT
                        },
                        hidden: true
                    }
                    nodes.push(cityNode);

                    edges.push({
                        id: `dist-${districtInfo.district.districtId}-city-${cityInfo.city.cityId}`,
                        source: `dist-${districtInfo.district.districtId}`,
                        target: `city-${cityInfo.city.cityId}`,
                         markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 30,
                    height: 20,
                    color: '#64748B',
                    
                },
                        hidden: true
                    })
                })
            });
        })
    })

    return { nodes, edges }
}
        