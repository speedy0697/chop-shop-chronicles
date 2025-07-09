import { Card } from "@/components/ui/card";
import { Scissors } from "lucide-react";

interface DayCounterProps {
  daysSinceLastCut: number;
}

export const DayCounter = ({ daysSinceLastCut }: DayCounterProps) => {
  const getMotivationalMessage = (days: number) => {
    if (days === 0) return "Fresh cut! Looking sharp! ✨";
    if (days <= 7) return "Still looking fresh! 🔥";
    if (days <= 14) return "Getting a bit shaggy but still good!";
    if (days <= 21) return "Time to start thinking about a trim...";
    if (days <= 30) return "Getting pretty long now! 📏";
    return "Time for a haircut! ✂️";
  };

  const getProgressColor = (days: number) => {
    if (days <= 7) return "text-green-600";
    if (days <= 14) return "text-yellow-600";
    if (days <= 21) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-primary text-primary-foreground shadow-glow">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Scissors className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-5xl font-bold tracking-tight">
            {daysSinceLastCut}
          </div>
          <div className="text-lg font-medium opacity-90">
            {daysSinceLastCut === 1 ? 'day' : 'days'} since last haircut
          </div>
          <div className="text-sm opacity-80 mt-3">
            {getMotivationalMessage(daysSinceLastCut)}
          </div>
        </div>
      </div>
    </Card>
  );
};