import { useState, useEffect } from "react";
import { HaircutCard, Haircut } from "@/components/HaircutCard";
import { DayCounter } from "@/components/DayCounter";
import { AddHaircutForm } from "@/components/AddHaircutForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, User, Scissors, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchHaircuts();
  }, [session, navigate]);

  const fetchHaircuts = async () => {
    try {
      const { data, error } = await supabase
        .from("haircuts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load haircuts",
        });
      } else {
        const formattedHaircuts = (data || []).map(haircut => ({
          id: haircut.id,
          date: haircut.date,
          location: haircut.location,
          notes: haircut.notes || "",
          photos: haircut.photo_urls || [],
          daysAgo: calculateDaysSince(haircut.date)
        }));
        setHaircuts(formattedHaircuts);
      }
    } catch (error) {
      console.error("Error fetching haircuts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysSince = (date: string) => {
    const haircutDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - haircutDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const addHaircut = async (newHaircut: Omit<Haircut, 'id' | 'daysAgo'>) => {
    try {
      const { error } = await supabase
        .from("haircuts")
        .insert([{
          user_id: user?.id,
          date: newHaircut.date,
          location: newHaircut.location,
          notes: newHaircut.notes,
          photo_urls: newHaircut.photos || []
        }]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add haircut",
        });
      } else {
        toast({
          title: "Success",
          description: "Haircut added successfully!",
        });
        setShowAddForm(false);
        fetchHaircuts();
      }
    } catch (error) {
      console.error("Error adding haircut:", error);
    }
  };

  const deleteHaircut = async (id: string) => {
    try {
      const { error } = await supabase
        .from("haircuts")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete haircut",
        });
      } else {
        toast({
          title: "Success",
          description: "Haircut deleted successfully!",
        });
        fetchHaircuts();
      }
    } catch (error) {
      console.error("Error deleting haircut:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    } else {
      navigate("/auth");
    }
  };

  const daysSinceLastCut = haircuts.length > 0 
    ? Math.min(...haircuts.map(h => h.daysAgo))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your haircuts...</p>
        </div>
      </div>
    );
  }

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
              <ThemeToggle />
              
              <Button 
                onClick={() => setShowAddForm(true)}
                className="shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Haircut
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
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
