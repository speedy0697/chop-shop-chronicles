import { useEffect, useState } from "react";
import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [haircuts, setHaircuts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchUserData();
  }, [session, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      // Fetch user haircuts
      const { data: haircutsData } = await supabase
        .from("haircuts")
        .select("*")
        .order("date", { ascending: false });

      setProfile(profileData);
      setHaircuts(haircutsData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageDays = () => {
    if (haircuts.length < 2) return 0;
    
    const dates = haircuts.map(h => new Date(h.date)).sort((a, b) => b.getTime() - a.getTime());
    let totalDays = 0;
    
    for (let i = 0; i < dates.length - 1; i++) {
      const daysDiff = Math.floor((dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
      totalDays += daysDiff;
    }
    
    return Math.round(totalDays / (dates.length - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userData = {
    name: profile?.display_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    joinDate: user?.created_at || "",
    totalHaircuts: haircuts.length,
    averageDaysBetween: calculateAverageDays(),
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Profile</h1>
          </div>
          <ThemeToggle />
        </div>

        <UserProfile user={userData} />
      </div>
    </div>
  );
};

export default Profile;