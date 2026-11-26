"use client"

import * as React from "react"
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your Sport Organizer assistant. How can I help you today?",
    timestamp: new Date(),
  },
]

const quickReplies = [
  "Create a tournament",
  "Manage my teams",
  "View upcoming matches",
  "How do standings work?",
  "Contact support",
]

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const content = inputValue.trim()
    if (!content || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const botResponse = getBotResponse(content)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("tournament") || input.includes("create")) {
      return "To create a tournament, go to the Tournaments page and click 'Create Tournament'. You'll need to provide details like sport type, dates, location, and team requirements."
    }
    if (input.includes("team") || input.includes("roster")) {
      return "You can manage teams from the Teams page. Create a new team, invite members, and assign roles like captain or coach."
    }
    if (input.includes("match") || input.includes("fixture") || input.includes("schedule")) {
      return "Matches are scheduled within tournaments. Organizers can create fixtures, set dates/times, and publish results. Check the Matches page for your upcoming games."
    }
    if (input.includes("standing") || input.includes("leaderboard") || input.includes("stats")) {
      return "Standings are automatically calculated based on match results. Points are awarded for wins/draws, and tiebreakers include goal difference and head-to-head records."
    }
    if (input.includes("support") || input.includes("help") || input.includes("contact")) {
      return "For support, visit our Help Center or use the Contact Us form in the footer. You can also email support@sportorganizer.com"
    }
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! How can I assist you with your tournament management today?"
    }

    return "I'm here to help with Sport Organizer! You can ask me about tournaments, teams, matches, standings, or general platform questions."
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    handleSendMessage()
  }

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg",
          "transition-all duration-300 hover:scale-105 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "md:bottom-8 md:right-8 lg:bottom-10 lg:right-10",
          "safe-area-inset-bottom safe-area-inset-right",
          isOpen && "rotate-45"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageSquare className="h-7 w-7 transition-transform duration-300" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-40 max-w-sm md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 safe-area-inset-bottom safe-area-inset-right"
          role="dialog"
          aria-label="Chat assistant"
        >
          <Card className="overflow-hidden shadow-2xl border-border animate-slide-up">
            <CardHeader className="bg-primary px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-primary-foreground">
                      Sport Organizer Assistant
                    </CardTitle>
                    <p className="text-xs text-primary-foreground/80">Online • Typically replies in seconds</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md p-1 text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea
                ref={scrollAreaRef}
                className="h-[380px] p-4"
                style={{ scrollbarWidth: "thin" }}
              >
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2 max-w-[85%]",
                        message.role === "user" && "self-end flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary-light text-primary"
                        )}
                        aria-hidden="true"
                      >
                        {message.role === "user" ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs text-right",
                            message.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2 rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-border p-4">
                {messages.length <= 1 && (
                  <div className="mb-3 flex flex-wrap gap-2" role="list" aria-label="Quick replies">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                        onClick={() => handleQuickReply(reply)}
                        role="listitem"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isLoading}
                    aria-label="Chat message input"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  )
}