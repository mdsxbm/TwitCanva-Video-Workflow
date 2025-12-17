/**
 * useImageEditorSelection.ts
 * 
 * Manages element selection, dragging, and resizing for the image editor.
 * Handles select mode interactions with arrows and other elements.
 */

import { useState, useRef, useCallback } from 'react';
import { EditorElement } from '../components/modals/imageEditor/imageEditor.types';

// ============================================================================
// TYPES
// ============================================================================

interface UseImageEditorSelectionProps {
    selectCanvasRef: React.RefObject<HTMLCanvasElement>;
    elements: EditorElement[];
    setElements: React.Dispatch<React.SetStateAction<EditorElement[]>>;
    saveState: () => void;
}

interface UseImageEditorSelectionReturn {
    // State
    isSelectMode: boolean;
    setIsSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
    selectedElementId: string | null;
    setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
    isDraggingElement: boolean;
    isResizing: boolean;
    resizeHandle: 'start' | 'end' | null;
    // Handlers
    handleSelectMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleSelectMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleSelectMouseUp: () => void;
    // Helpers
    getElementAtPosition: (x: number, y: number) => EditorElement | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate distance from a point to a line segment
 */
export const pointToLineDistance = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    return Math.hypot(px - xx, py - yy);
};

// ============================================================================
// HOOK
// ============================================================================

export const useImageEditorSelection = ({
    selectCanvasRef,
    elements,
    setElements,
    saveState
}: UseImageEditorSelectionProps): UseImageEditorSelectionReturn => {
    // --- State ---
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [isDraggingElement, setIsDraggingElement] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<'start' | 'end' | null>(null);

    // --- Refs ---
    const dragStartRef = useRef<{
        x: number;
        y: number;
        elementStartX: number;
        elementStartY: number;
        elementEndX: number;
        elementEndY: number;
    } | null>(null);

    // --- Helper Functions ---

    /**
     * Find element at given position (hit detection)
     */
    const getElementAtPosition = useCallback((x: number, y: number): EditorElement | null => {
        // Check elements in reverse order (top elements first)
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (el.type === 'arrow') {
                // Check distance from line
                const dist = pointToLineDistance(x, y, el.startX, el.startY, el.endX, el.endY);
                if (dist < 10) return el;
                // Check start and end points
                if (Math.hypot(x - el.startX, y - el.startY) < 15) return el;
                if (Math.hypot(x - el.endX, y - el.endY) < 15) return el;
            }
        }
        return null;
    }, [elements]);

    /**
     * Get resize handle at position
     */
    const getResizeHandleAtPosition = useCallback((
        x: number,
        y: number,
        element: EditorElement
    ): 'start' | 'end' | null => {
        if (Math.hypot(x - element.startX, y - element.startY) < 12) return 'start';
        if (Math.hypot(x - element.endX, y - element.endY) < 12) return 'end';
        return null;
    }, []);

    // --- Mouse Handlers ---

    const handleSelectMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isSelectMode) return;
        const canvas = selectCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on resize handle of selected element
        if (selectedElementId) {
            const selectedEl = elements.find(el => el.id === selectedElementId);
            if (selectedEl) {
                const handle = getResizeHandleAtPosition(x, y, selectedEl);
                if (handle) {
                    saveState();
                    setIsResizing(true);
                    setResizeHandle(handle);
                    dragStartRef.current = {
                        x, y,
                        elementStartX: selectedEl.startX,
                        elementStartY: selectedEl.startY,
                        elementEndX: selectedEl.endX,
                        elementEndY: selectedEl.endY
                    };
                    return;
                }
            }
        }

        // Check if clicking on an element
        const element = getElementAtPosition(x, y);
        if (element) {
            saveState();
            setSelectedElementId(element.id);
            setIsDraggingElement(true);
            dragStartRef.current = {
                x, y,
                elementStartX: element.startX,
                elementStartY: element.startY,
                elementEndX: element.endX,
                elementEndY: element.endY
            };
        } else {
            setSelectedElementId(null);
        }
    }, [isSelectMode, selectCanvasRef, selectedElementId, elements, getResizeHandleAtPosition, getElementAtPosition, saveState]);

    const handleSelectMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isSelectMode) return;
        const canvas = selectCanvasRef.current;
        if (!canvas || !dragStartRef.current || !selectedElementId) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - dragStartRef.current.x;
        const dy = y - dragStartRef.current.y;

        if (isResizing && resizeHandle) {
            // Resize the element
            setElements(prev => prev.map(el => {
                if (el.id !== selectedElementId) return el;
                if (resizeHandle === 'start') {
                    return { ...el, startX: dragStartRef.current!.elementStartX + dx, startY: dragStartRef.current!.elementStartY + dy };
                } else {
                    return { ...el, endX: dragStartRef.current!.elementEndX + dx, endY: dragStartRef.current!.elementEndY + dy };
                }
            }));
        } else if (isDraggingElement) {
            // Move the element
            setElements(prev => prev.map(el => {
                if (el.id !== selectedElementId) return el;
                return {
                    ...el,
                    startX: dragStartRef.current!.elementStartX + dx,
                    startY: dragStartRef.current!.elementStartY + dy,
                    endX: dragStartRef.current!.elementEndX + dx,
                    endY: dragStartRef.current!.elementEndY + dy
                };
            }));
        }
    }, [isSelectMode, selectCanvasRef, selectedElementId, isResizing, resizeHandle, isDraggingElement, setElements]);

    const handleSelectMouseUp = useCallback(() => {
        setIsDraggingElement(false);
        setIsResizing(false);
        setResizeHandle(null);
        dragStartRef.current = null;
    }, []);

    return {
        isSelectMode,
        setIsSelectMode,
        selectedElementId,
        setSelectedElementId,
        isDraggingElement,
        isResizing,
        resizeHandle,
        handleSelectMouseDown,
        handleSelectMouseMove,
        handleSelectMouseUp,
        getElementAtPosition
    };
};
