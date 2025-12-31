"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Search, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "tgif-chat-conversations";
const CURRENT_CONV_KEY = "tgif-chat-current";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getStoredConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function getCurrentConversationId(): string | null {
  return localStorage.getItem(CURRENT_CONV_KEY);
}

function setCurrentConversationId(id: string | null) {
  if (id) {
    localStorage.setItem(CURRENT_CONV_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_CONV_KEY);
  }
}

export function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = getStoredConversations();
    setConversations(stored);
    
    const currentId = getCurrentConversationId();
    if (currentId) {
      const current = stored.find((c) => c.id === currentId);
      if (current) {
        setCurrentConversation(current);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const startNewConversation = () => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New conversation",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentConversation(newConv);
    setCurrentConversationId(newConv.id);
    setShowHistory(false);
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
    setCurrentConversationId(conv.id);
    setShowHistory(false);
  };

  const deleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== convId);
    setConversations(updated);
    saveConversations(updated);
    
    if (currentConversation?.id === convId) {
      setCurrentConversation(null);
      setCurrentConversationId(null);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    let conv = currentConversation;
    if (!conv) {
      conv = {
        id: generateId(),
        title: inputValue.trim().slice(0, 50),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const updatedConv: Conversation = {
      ...conv,
      messages: [...conv.messages, userMessage],
      updatedAt: new Date().toISOString(),
      title: conv.messages.length === 0 ? inputValue.trim().slice(0, 50) : conv.title,
    };

    setCurrentConversation(updatedConv);
    setCurrentConversationId(updatedConv.id);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/brain/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need: inputValue.trim() }),
      });

      let assistantContent: string;
      if (response.ok) {
        const data = await response.json();
        assistantContent = data.response || data.answer || data.message || JSON.stringify(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === "brain_unavailable") {
          assistantContent = "The TGIF brain service is currently unavailable. Please try again later or contact support if the issue persists.";
        } else {
          assistantContent = `Error: ${errorData.error || "Failed to get response"}`;
        }
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toISOString(),
      };

      const finalConv: Conversation = {
        ...updatedConv,
        messages: [...updatedConv.messages, assistantMessage],
        updatedAt: new Date().toISOString(),
      };

      setCurrentConversation(finalConv);

      // Update conversations list
      const existingIndex = conversations.findIndex((c) => c.id === finalConv.id);
      let newConversations: Conversation[];
      if (existingIndex >= 0) {
        newConversations = [...conversations];
        newConversations[existingIndex] = finalConv;
      } else {
        newConversations = [finalConv, ...conversations];
      }
      setConversations(newConversations);
      saveConversations(newConversations);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "Failed to connect to the server. Please check your connection and try again.",
        timestamp: new Date().toISOString(),
      };

      const finalConv: Conversation = {
        ...updatedConv,
        messages: [...updatedConv.messages, errorMessage],
        updatedAt: new Date().toISOString(),
      };

      setCurrentConversation(finalConv);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="chat-toggle"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-96 transform bg-background border-l border-border shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">TGIF Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                {showHistory ? "Chat" : "History"}
              </Button>
              <Button variant="ghost" size="sm" onClick={startNewConversation}>
                New
              </Button>
            </div>
          </div>

          {showHistory ? (
            /* History View */
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filteredConversations.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No conversations yet
                    </p>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => selectConversation(conv)}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2 cursor-pointer hover:bg-accent group",
                          currentConversation?.id === conv.id && "bg-accent"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => deleteConversation(conv.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Chat View */
            <>
              <ScrollArea className="flex-1 p-4">
                {!currentConversation || currentConversation.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions about TGIF rollouts, franchise groups, deliverables, or anything else.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-[10px] opacity-60 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about TGIF..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="chat-input"
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    data-testid="chat-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay when open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
