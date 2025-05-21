import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/libs/utils";

interface AdminStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export function AdminStatsCard({ title, value, description, icon, color, delay = 0 }: AdminStatsCardProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Animation de comptage
  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.min(Math.floor(start), end));
      
      if (start >= end) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, visible]);

  return (
    <Card className={cn(
      "border-none overflow-hidden transition-all duration-700 transform",
      visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}>
      <CardHeader className={cn("p-4 text-white", color)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-3xl font-bold mb-1">{count}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
