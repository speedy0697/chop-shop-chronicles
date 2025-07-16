import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, MoreVertical, Trash2, Pen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditHaircutForm } from "./EditHaircutForm";

export interface Haircut {
  id: string;
  date: string;
  location: string;
  photos: string[];
  notes?: string;
  daysAgo: number;
}

interface HaircutCardProps {
  haircut: Haircut;
  onEdit?: (haircut: Haircut) => void;
  onDelete?: (id: string) => void;
}

export const HaircutCard = ({ haircut, onEdit, onDelete }: HaircutCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageClick = () => {
    setShowEditForm(true);
  };

  const handleEdit = (updatedHaircut: Haircut) => {
    if (onEdit) {
      onEdit(updatedHaircut);
    }
    setShowEditForm(false);
  };

  if (showEditForm) {
    return (
      <EditHaircutForm
        haircut={haircut}
        onSave={handleEdit}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Card className="overflow-hidden bg-card hover:shadow-soft transition-all duration-300 border-border/50">
      <div className="relative">
        {haircut.photos.length > 0 && (
          <div className="aspect-square overflow-hidden">
            <img 
              src={haircut.photos[0]} 
              alt="Haircut"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                <Pen className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {haircut.daysAgo === 0 ? 'Today' : `${haircut.daysAgo} days ago`}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(haircut.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{haircut.location}</span>
        </div>

        {haircut.notes && (
          <p className="text-sm text-foreground mt-2 line-clamp-2">
            {haircut.notes}
          </p>
        )}

        {haircut.photos.length > 1 && (
          <div className="flex gap-2 mt-3">
            {haircut.photos.slice(1, 4).map((photo, index) => (
              <div key={index} className="w-12 h-12 rounded-md overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Haircut ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {haircut.photos.length > 4 && (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{haircut.photos.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Haircut</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this haircut? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.(haircut.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};