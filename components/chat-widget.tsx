"use client"

import * as React from "react"
import { Send, MessageSquare, X, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy BarberFlow. ¿En qué puedo ayudarte hoy?' }
    ])
    const [inputValue, setInputValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { role: 'user', content: inputValue.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Include history (simplified: last 10 messages)
            const history = messages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: history
                })
            });

            if (!response.ok) throw new Error("Failed to send");
            const data = await response.json();

            const botMsg: Message = { role: 'assistant', content: data.response };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema de conexión. Intenta de nuevo." }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-primary/20">
                    <CardHeader className="p-4 border-b flex flex-row justify-between items-center bg-primary/5">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/bot-avatar.png" />
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-sm font-medium">BarberFlow AI</CardTitle>
                                <p className="text-xs text-muted-foreground">En línea</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4" ref={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-2 max-w-[80%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "rounded-lg p-3 text-sm whitespace-pre-wrap",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 mr-auto max-w-[80%]">
                                        <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="flex w-full items-center gap-2"
                        >
                            <Input
                                placeholder="Escribe un mensaje..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-xl animate-bounce-subtle"
                >
                    <MessageSquare className="h-7 w-7" />
                </Button>
            )}
        </div>
    )
}
