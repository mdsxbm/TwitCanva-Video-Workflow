/**
 * useGenerationRecovery.ts
 * 
 * Custom hook that checks for nodes in 'loading' status and polls
 * the backend to see if their generation has finished.
 */

import { useEffect, useCallback } from 'react';
import { NodeData, NodeStatus } from '../types';

interface UseGenerationRecoveryOptions {
    nodes: NodeData[];
    updateNode: (id: string, updates: Partial<NodeData>) => void;
}

export const useGenerationRecovery = ({
    nodes,
    updateNode
}: UseGenerationRecoveryOptions) => {

    const checkStatus = useCallback(async (nodeId: string) => {
        try {
            console.log(`[Recovery] Checking status for node ${nodeId}...`);
            const response = await fetch(`/api/generation-status/${nodeId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success' && data.resultUrl) {
                    console.log(`[Recovery] SUCCESS: Found result for node ${nodeId}:`, data.resultUrl);

                    // Update node with success status and result URL
                    // Note: We don't have the aspect ratio or last frame, but the node will
                    // attempt to load the image and we can detect it then if needed, 
                    // or just show the result.
                    updateNode(nodeId, {
                        status: NodeStatus.SUCCESS,
                        resultUrl: data.resultUrl,
                        errorMessage: undefined
                    });
                }
            }
        } catch (error) {
            console.error(`[Recovery] Error checking status for node ${nodeId}:`, error);
        }
    }, [updateNode]);

    useEffect(() => {
        // Find all nodes that are currently loading
        const loadingNodes = nodes.filter(n => n.status === NodeStatus.LOADING);

        if (loadingNodes.length === 0) return;

        console.log(`[Recovery] Monitoring ${loadingNodes.length} loading nodes for results...`);

        // Check each loading node immediately and then every 10 seconds
        const checkAll = () => {
            loadingNodes.forEach(node => checkStatus(node.id));
        };

        checkAll(); // Initial check

        const interval = setInterval(checkAll, 10000); // Check every 10s

        return () => clearInterval(interval);
    }, [nodes, checkStatus]);
};
