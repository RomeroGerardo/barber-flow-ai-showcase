import { Scissors, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10 rounded-xl",
    md: "w-12 h-12 rounded-xl md:w-16 md:h-16 md:rounded-2xl",
    lg: "w-16 h-16 rounded-2xl md:w-20 md:h-20 md:rounded-[20px]",
    xl: "w-20 h-20 rounded-[20px]",
  };

  const iconClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6 md:w-8 md:h-8",
    lg: "w-8 h-8 md:w-10 md:h-10",
    xl: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
    xl: "text-3xl md:text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-primary via-primary to-emerald-400 shadow-[0_0_20px_rgba(45,212,191,0.5)] border border-primary-foreground/20", 
          sizeClasses[size]
        )}
      >
        <Scissors className={cn("text-primary-foreground transform -rotate-12", iconClasses[size])} strokeWidth={2.5} />
        <div className="absolute -bottom-1.5 -right-1.5 bg-background rounded-full p-1 border border-primary/20 shadow-sm">
          <Sparkles className={cn("text-primary animate-pulse", size === "sm" ? "w-3 h-3" : "w-4 h-4 md:w-5 md:h-5")} />
        </div>
      </div>
      {showText && (
        <span className={cn("font-extrabold tracking-tight text-foreground", textClasses[size])}>
          Barber<span className="text-primary font-medium">Flow</span>
        </span>
      )}
    </div>
  );
}
