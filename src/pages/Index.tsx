import { useState, useEffect } from "react";
import { HaircutCard, Haircut } from "@/components/HaircutCard";
import { DayCounter } from "@/components/DayCounter";
import { AddHaircutForm } from "@/components/AddHaircutForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, User, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data for initial load
  useEffect(() => {
    const mockHaircuts: Haircut[] = [
      {
        id: "1",
        date: "2024-01-15",
        location: "Tony's Barbershop",
        photos: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop"],
        notes: "Classic fade, really happy with how it turned out!",
        daysAgo: 5
      },
      {
        id: "2", 
        date: "2023-12-20",
        location: "Downtown Hair Studio",
        photos: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop"],
        notes: "Tried something new with the styling",
        daysAgo: 31
      }
    ];
    setHaircuts(mockHaircuts);
  }, []);

  const calculateDaysSince = (date: string) => {
    const haircutDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - haircutDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const addHaircut = (newHaircut: Omit<Haircut, 'id' | 'daysAgo'>) => {
    const haircut: Haircut = {
      ...newHaircut,
      id: Date.now().toString(),
      daysAgo: calculateDaysSince(newHaircut.date)
    };
    setHaircuts(prev => [haircut, ...prev].map(h => ({
      ...h,
      daysAgo: calculateDaysSince(h.date)
    })));
    setShowAddForm(false);
  };

  const deleteHaircut = (id: string) => {
    setHaircuts(prev => prev.filter(h => h.id !== id));
  };

  const daysSinceLastCut = haircuts.length > 0 
    ? Math.min(...haircuts.map(h => h.daysAgo))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scissors className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HairTracker</h1>
                <p className="text-sm text-muted-foreground">Track your haircut journey</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Haircut
              </Button>
              
              <Link to="/profile">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Day Counter */}
        <div className="max-w-md mx-auto">
          <DayCounter daysSinceLastCut={daysSinceLastCut} />
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="max-w-2xl mx-auto">
            <AddHaircutForm 
              onAdd={addHaircut}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Haircuts List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Haircuts</h2>
            <span className="text-sm text-muted-foreground">
              {haircuts.length} {haircuts.length === 1 ? 'haircut' : 'haircuts'} recorded
            </span>
          </div>

          {haircuts.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-muted/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Scissors className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No haircuts yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your haircuts to see your journey!</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Haircut
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {haircuts.map((haircut) => (
                <HaircutCard 
                  key={haircut.id}
                  haircut={haircut}
                  onDelete={deleteHaircut}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
