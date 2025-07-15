import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CalendarDays, MapPin, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterOptions {
  location: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  notes: string;
}

interface HaircutFiltersProps {
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
}

export function HaircutFilters({ onFilter, onClear }: HaircutFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    startDate: undefined,
    endDate: undefined,
    notes: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      location: "",
      startDate: undefined,
      endDate: undefined,
      notes: "",
    };
    setFilters(emptyFilters);
    onClear();
    setShowFilters(false);
  };

  const hasActiveFilters = filters.location || filters.startDate || filters.endDate || filters.notes;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Filter Haircuts
          {hasActiveFilters && (
            <span className="bg-background text-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              ●
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filter Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  placeholder="Filter by barber/salon name..."
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                />
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Date Range
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.startDate ? format(filters.startDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => updateFilter("startDate", date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.endDate ? format(filters.endDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => updateFilter("endDate", date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Notes Filter */}
            <div className="space-y-2">
              <Label>Search Notes</Label>
              <Textarea
                placeholder="Search in notes..."
                value={filters.notes}
                onChange={(e) => updateFilter("notes", e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}