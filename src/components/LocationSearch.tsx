import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: any;
  }
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LocationSearch({ value, onChange, placeholder = "e.g., Tony's Barbershop" }: LocationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyBGne_b-_8WxQSCrsf0WSxCfPpvwTA2-iI", // Temporary API key - user should add their own
          version: "weekly",
          libraries: ["places"],
        });

        await loader.load();
        
        const service = new (window as any).google.maps.places.AutocompleteService();
        setAutocompleteService(service);
      } catch (error) {
        console.log("Google Maps failed to load, falling back to text input");
      }
    };

    initGoogleMaps();
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    if (autocompleteService && inputValue.length > 2) {
      autocompleteService.getPlacePredictions(
        {
          input: inputValue,
          types: ['establishment', 'geocode'],
        },
        (predictions: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions);
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handlePredictionSelect = (prediction: any) => {
    onChange(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="location" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
          placeholder={placeholder}
          required
        />
        
        {showPredictions && predictions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                onClick={() => handlePredictionSelect(prediction)}
              >
                <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                <div className="text-sm text-muted-foreground">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}