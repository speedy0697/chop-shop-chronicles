import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Calendar, Scissors, Camera } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    joinDate: string;
    totalHaircuts: number;
    averageDaysBetween: number;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-subtle border-border/50">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </Badge>
          </div>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">{user.totalHaircuts}</div>
          <div className="text-sm text-muted-foreground">Total Haircuts</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">{user.averageDaysBetween}</div>
          <div className="text-sm text-muted-foreground">Avg Days Between</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Camera className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">{user.totalHaircuts * 2}</div>
          <div className="text-sm text-muted-foreground">Photos Uploaded</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account & Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Google Sign-In</p>
              <p className="text-sm text-muted-foreground">Connect your Google account for easy access</p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your haircut data</p>
            </div>
            <Button variant="outline">
              Export
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};