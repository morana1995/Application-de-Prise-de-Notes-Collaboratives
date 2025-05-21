"use client";

import { useState, useEffect } from "react";
import { Note, Category } from "@/libs/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Filter } from "lucide-react";

interface AdminActivityChartProps {
  activities: Note[];
  categories: Category[];
}

interface ChartDay {
  date: Date;
  day: string;
  fullDate: string;
  count: number;
}

export function AdminActivityChart({ activities, categories }: AdminActivityChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const filteredActivities = selectedCategory === "all"
      ? activities
      : activities.filter(note => note.categoryId === selectedCategory);

    const last7Days = Array(7).fill(0).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date,
        day: format(date, "EEE", { locale: fr }),
        fullDate: format(date, "yyyy-MM-dd"),
        count: 0,
      };
    });

    filteredActivities.forEach(note => {
      const noteDate = format(new Date(note.updatedAt), "yyyy-MM-dd");
      const dayData = last7Days.find(day => day.fullDate === noteDate);
      if (dayData) {
        dayData.count++;
      }
    });

    setChartData(last7Days);
  }, [activities, selectedCategory]);

  const colors = ["#9b87f5", "#8B5CF6", "#7E69AB", "#33C3F0", "#0EA5E9"];

  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ChartContainer config={{ primary: { theme: { light: "#9b87f5", dark: "#9b87f5" } } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
                name="Notes modifiées"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {chartData.length > 0 && chartData.every((day) => day.count === 0) && (
        <div className="text-center text-gray-500 mt-4">
          Aucune activité pour la période sélectionnée
        </div>
      )}
    </div>
  );
}
