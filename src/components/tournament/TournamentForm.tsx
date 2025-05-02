
import React, { useState, useEffect } from "react";
import { Tournament, TournamentFormat } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TournamentFormProps {
  tournament?: Partial<Tournament>;
  onSubmit: (data: Partial<Tournament>) => void;
  isLoading: boolean;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({
  tournament,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(tournament?.name || "");
  const [format, setFormat] = useState<TournamentFormat>(
    tournament?.format || TournamentFormat.LEAGUE
  );
  const [logo, setLogo] = useState(tournament?.logo || "");
  const [startDate, setStartDate] = useState(tournament?.startDate || "");
  const [endDate, setEndDate] = useState(tournament?.endDate || "");
  const [location, setLocation] = useState(tournament?.location || "");
  const [description, setDescription] = useState(tournament?.description || "");

  // Update form if tournament prop changes
  useEffect(() => {
    if (tournament) {
      setName(tournament.name || "");
      setFormat(tournament.format || TournamentFormat.LEAGUE);
      setLogo(tournament.logo || "");
      setStartDate(tournament.startDate || "");
      setEndDate(tournament.endDate || "");
      setLocation(tournament.location || "");
      setDescription(tournament.description || "");
    }
  }, [tournament]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      format,
      logo,
      startDate,
      endDate,
      location,
      description,
    });
  };

  const isEditing = !!tournament?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Tournament" : "Create Tournament"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tournament Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="2023 Champions Trophy"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="format" className="text-sm font-medium">
              Tournament Format
            </label>
            <Select 
              value={format} 
              onValueChange={(value: TournamentFormat) => setFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TournamentFormat.LEAGUE}>League</SelectItem>
                <SelectItem value={TournamentFormat.KNOCKOUT}>Knockout</SelectItem>
                <SelectItem value={TournamentFormat.GROUP_KNOCKOUT}>
                  Group + Knockout
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-medium">
              Logo URL
            </label>
            <Input
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Mumbai, India"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the tournament..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="submit"
            className="bg-cricket-700 hover:bg-cricket-800"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Tournament"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
