
import React, { useState, useEffect } from "react";
import { Match, MatchStatus, Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchFormProps {
  match?: Partial<Match>;
  teams: Team[];
  onSubmit: (data: Partial<Match>) => void;
  isLoading: boolean;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  match,
  teams,
  onSubmit,
  isLoading,
}) => {
  const [team1Id, setTeam1Id] = useState(match?.team1Id || "");
  const [team2Id, setTeam2Id] = useState(match?.team2Id || "");
  const [date, setDate] = useState(match?.date || "");
  const [time, setTime] = useState(match?.time || "");
  const [venue, setVenue] = useState(match?.venue || "");
  const [status, setStatus] = useState<MatchStatus>(
    match?.status || MatchStatus.UPCOMING
  );

  // Update form if match prop changes
  useEffect(() => {
    if (match) {
      setTeam1Id(match.team1Id || "");
      setTeam2Id(match.team2Id || "");
      setDate(match.date || "");
      setTime(match.time || "");
      setVenue(match.venue || "");
      setStatus(match.status || MatchStatus.UPCOMING);
    }
  }, [match]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (team1Id === team2Id && team1Id !== "") {
      alert("Team 1 and Team 2 cannot be the same");
      return;
    }
    
    onSubmit({
      team1Id,
      team2Id,
      date,
      time,
      venue,
      status,
    });
  };

  const isEditing = !!match?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Match" : "Create Match"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="team1" className="text-sm font-medium">
              Team 1
            </label>
            <Select value={team1Id} onValueChange={setTeam1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="team2" className="text-sm font-medium">
              Team 2
            </label>
            <Select value={team2Id} onValueChange={setTeam2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="venue" className="text-sm font-medium">
              Venue
            </label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Wankhede Stadium, Mumbai"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value: MatchStatus) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MatchStatus.UPCOMING}>Upcoming</SelectItem>
                <SelectItem value={MatchStatus.LIVE}>Live</SelectItem>
                <SelectItem value={MatchStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={MatchStatus.ABANDONED}>Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="submit"
            className="bg-cricket-700 hover:bg-cricket-800"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create Match"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
