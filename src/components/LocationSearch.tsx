import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LocationSearch({ value, onChange, placeholder = "e.g., Tony's Barbershop" }: LocationSearchProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location
      </Label>
      <Input
        id="location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}