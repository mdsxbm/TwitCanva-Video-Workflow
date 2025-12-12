/**
 * ChatPanel.tsx
 * 
 * Agent chat panel that slides in from the right side.
 * Shows greeting, inspiration suggestions, and chat input.
 * Supports drag-drop of image/video nodes from canvas.
 */

import React, { useState } from 'react';
import { X, History, MessageCircle, Paperclip, Globe, Settings, Send, Sparkles } from 'lucide-react';

interface AttachedMedia {
    type: 'image' | 'video';
    url: string;
    nodeId: string;
}

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    isDraggingNode?: boolean;
    onNodeDrop?: (nodeId: string, url: string, type: 'image' | 'video') => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
    isOpen,
    onClose,
    userName = 'Creator',
    isDraggingNode = false,
    onNodeDrop
}) => {
    const [message, setMessage] = useState('');
    const [showTip, setShowTip] = useState(true);
    const [attachedMedia, setAttachedMedia] = useState<AttachedMedia | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // Only set false if leaving the panel entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        // Get data from drag event
        const nodeData = e.dataTransfer.getData('application/json');
        if (nodeData) {
            try {
                const { nodeId, url, type } = JSON.parse(nodeData);
                if (url && (type === 'image' || type === 'video')) {
                    setAttachedMedia({ type, url, nodeId });
                }
            } catch (err) {
                console.error('Failed to parse dropped node data:', err);
            }
        }
    };

    const removeAttachment = () => {
        setAttachedMedia(null);
    };

    const handleSend = () => {
        if (message.trim() || attachedMedia) {
            console.log('Sending:', { message, attachedMedia });
            // TODO: Implement actual send logic
            setMessage('');
            setAttachedMedia(null);
        }
    };

    if (!isOpen) return null;

    const showHighlight = isDraggingNode || isDragOver;

    return (
        <div
            className={`fixed top-0 right-0 w-[400px] h-full bg-[#1a1a1a] border-l flex flex-col z-40 shadow-2xl transition-all duration-200 ${showHighlight ? 'border-cyan-500 border-2' : 'border-neutral-800'
                }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Drag Overlay */}
            {showHighlight && (
                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none z-10 flex items-center justify-center">
                    <div className="bg-cyan-500/20 border-2 border-dashed border-cyan-400 rounded-2xl px-8 py-6 text-center">
                        <Sparkles className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
                        <p className="text-cyan-300 font-medium">Drop image/video here</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                    <History size={18} className="text-neutral-400" />
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Greeting */}
                <h1 className="text-2xl font-bold text-white mb-1">
                    Hi, {userName}
                </h1>
                <p className="text-cyan-400 text-lg mb-6">
                    Looking for inspiration?
                </p>

                {/* Tip Card */}
                {showTip && (
                    <div className="bg-neutral-800/50 rounded-2xl p-4 mb-4">
                        <div className="bg-neutral-700/50 rounded-xl h-24 mb-3 flex items-center justify-center">
                            <div className="text-neutral-500 text-sm">Preview Area</div>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                            Drag image/video nodes into the chat dialog to unlock advanced features like prompt generation based on node content, providing more inspiration for your creativity~
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowTip(false)}
                                className="px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-800">
                <div className="bg-neutral-800 rounded-2xl p-3">
                    {/* Attached Media Preview */}
                    {attachedMedia && (
                        <div className="relative inline-block mb-3">
                            {attachedMedia.type === 'image' ? (
                                <img
                                    src={attachedMedia.url}
                                    alt="Attached"
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            ) : (
                                <video
                                    src={attachedMedia.url}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            )}
                            <button
                                onClick={removeAttachment}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-xs"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Start your journey of inspiration"
                        className="w-full bg-transparent text-white text-sm placeholder:text-neutral-500 outline-none mb-3 resize-none min-h-[24px] max-h-[120px]"
                        rows={1}
                        style={{ scrollbarWidth: 'none' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const newHeight = Math.min(target.scrollHeight, 120);
                            target.style.height = newHeight + 'px';
                            target.style.overflowY = target.scrollHeight > 120 ? 'auto' : 'hidden';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-neutral-300 transition-colors">
                                <MessageCircle size={14} />
                                Chat Mode
                                <span className="text-neutral-500">▾</span>
                            </button>
                            <button className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400">
                                <Paperclip size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400">
                                <Globe size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400">
                                <Settings size={16} />
                            </button>
                            <button
                                onClick={handleSend}
                                className="p-2 bg-cyan-500 hover:bg-cyan-400 rounded-full transition-colors text-white"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ChatBubble - Floating button to open chat
 */
interface ChatBubbleProps {
    onClick: () => void;
    isOpen: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, isOpen }) => {
    if (isOpen) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all hover:scale-110 z-50"
        >
            <Sparkles size={22} className="text-white" />
        </button>
    );
};
