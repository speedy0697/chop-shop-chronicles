import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "2024-01-15",
    totalHaircuts: 12,
    averageDaysBetween: 24,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <UserProfile user={mockUser} />
      </div>
    </div>
  );
};

export default Profile;