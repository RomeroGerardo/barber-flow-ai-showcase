import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DemoTopbar() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar clientes, citas..." 
            className="pl-9 bg-background/50 border-border"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Barbero" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">BF</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block">Demo User</span>
        </div>
      </div>
    </header>
  );
}
