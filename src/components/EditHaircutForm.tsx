import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Camera, Plus, X } from "lucide-react";
import { Haircut } from "./HaircutCard";
import { LocationSearch } from "./LocationSearch";
import heic2any from "heic2any";

interface EditHaircutFormProps {
  haircut: Haircut;
  onSave: (haircut: Haircut) => void;
  onCancel: () => void;
}

export const EditHaircutForm = ({ haircut, onSave, onCancel }: EditHaircutFormProps) => {
  const [formData, setFormData] = useState({
    date: haircut.date,
    location: haircut.location,
    notes: haircut.notes || '',
  });
  const [photos, setPhotos] = useState<string[]>(haircut.photos || []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        try {
          let processedFile = file;
          
          // Check if file is HEIC/HEIF and convert it
          const isHeicFile = file.name.toLowerCase().endsWith('.heic') || 
                            file.name.toLowerCase().endsWith('.heif') ||
                            file.type === 'image/heic' || 
                            file.type === 'image/heif';
          
          if (isHeicFile) {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.8
            });
            
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            processedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
              type: 'image/jpeg'
            });
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPhotos(prev => [...prev, e.target!.result as string]);
            }
          };
          reader.readAsDataURL(processedFile);
        } catch (error) {
          console.error('Error processing image:', error);
          // If conversion fails, try to process the original file anyway
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPhotos(prev => [...prev, e.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.trim()) return;

    // Calculate days ago for the updated date
    const today = new Date();
    const haircutDate = new Date(formData.date);
    const timeDiff = today.getTime() - haircutDate.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));

    onSave({
      ...haircut,
      ...formData,
      photos,
      daysAgo,
    });
  };

  return (
    <Card className="p-6 border-border/50 shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Haircut</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <LocationSearch
            value={formData.location}
            onChange={(location) => setFormData(prev => ({ ...prev, location }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add any notes about your haircut..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos
          </Label>
          
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img 
                  src={photo} 
                  alt={`Upload ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground" />
              <input
                type="file"
                accept="image/*,.heic,.heif,.HEIC,.HEIF"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};