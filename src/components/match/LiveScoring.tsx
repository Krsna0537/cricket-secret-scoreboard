
import React, { useState, useEffect } from "react";
import { Match, Team, Inning, MatchStatus, MatchResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LiveScoringProps {
  match: Match;
  teams: Team[];
  onUpdate: (matchId: string, matchUpdate: Partial<Match>) => void;
  isLoading: boolean;
}

export const LiveScoring: React.FC<LiveScoringProps> = ({
  match,
  teams,
  onUpdate,
  isLoading,
}) => {
  const team1 = teams.find((t) => t.id === match.team1Id);
  const team2 = teams.find((t) => t.id === match.team2Id);

  const [inning1, setInning1] = useState<Inning>(
    match.inning1 || { teamId: match.team1Id, runs: 0, wickets: 0, overs: 0 }
  );
  const [inning2, setInning2] = useState<Inning>(
    match.inning2 || { teamId: match.team2Id, runs: 0, wickets: 0, overs: 0 }
  );
  const [currentInning, setCurrentInning] = useState<1 | 2>(
    match.inning2 ? 2 : 1
  );
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [winner, setWinner] = useState(match.winner || "");
  const [resultSummary, setResultSummary] = useState(match.result?.summary || "");

  useEffect(() => {
    setInning1(match.inning1 || { teamId: match.team1Id, runs: 0, wickets: 0, overs: 0 });
    setInning2(match.inning2 || { teamId: match.team2Id, runs: 0, wickets: 0, overs: 0 });
    setCurrentInning(match.inning2 ? 2 : 1);
    setStatus(match.status);
    setWinner(match.winner || "");
    setResultSummary(match.result?.summary || "");
  }, [match]);

  const handleScoreChange = (
    inning: 1 | 2,
    field: keyof Inning,
    value: number
  ) => {
    if (inning === 1) {
      setInning1({ ...inning1, [field]: value });
    } else {
      setInning2({ ...inning2, [field]: value });
    }
  };

  const handleStatusChange = (newStatus: MatchStatus) => {
    setStatus(newStatus);
    
    // If status is set to COMPLETED, create a default result based on scores
    if (newStatus === MatchStatus.COMPLETED && !winner) {
      const team1Score = inning1.runs;
      const team2Score = inning2.runs;
      
      if (team1Score > team2Score) {
        setWinner(match.team1Id);
        const margin = team1Score - team2Score;
        setResultSummary(`${team1?.name} won by ${margin} runs`);
      } else if (team2Score > team1Score) {
        setWinner(match.team2Id);
        const wicketsLeft = 10 - inning2.wickets;
        setResultSummary(`${team2?.name} won by ${wicketsLeft} wickets`);
      } else {
        setResultSummary("Match tied");
      }
    }
  };

  const startInning2 = () => {
    setCurrentInning(2);
  };

  const saveChanges = () => {
    const matchResult: MatchResult = {
      winnerId: winner,
      summary: resultSummary,
    };
    
    onUpdate(match.id, {
      inning1,
      inning2: currentInning === 2 ? inning2 : undefined,
      status,
      winner,
      result: matchResult,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Live Scoring</span>
          <Select value={status} onValueChange={(value: MatchStatus) => handleStatusChange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MatchStatus.UPCOMING}>Upcoming</SelectItem>
              <SelectItem value={MatchStatus.LIVE}>Live</SelectItem>
              <SelectItem value={MatchStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={MatchStatus.ABANDONED}>Abandoned</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inning 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">
              Inning 1 - {team1?.name || "Team 1"}
            </h3>
            {currentInning === 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={startInning2}
                disabled={inning1.overs === 0}
              >
                End Inning
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Runs</label>
              <Input
                type="number"
                min="0"
                value={inning1.runs}
                onChange={(e) =>
                  handleScoreChange(1, "runs", parseInt(e.target.value) || 0)
                }
                disabled={currentInning !== 1}
                className="text-center"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Wickets</label>
              <Input
                type="number"
                min="0"
                max="10"
                value={inning1.wickets}
                onChange={(e) =>
                  handleScoreChange(1, "wickets", parseInt(e.target.value) || 0)
                }
                disabled={currentInning !== 1}
                className="text-center"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Overs</label>
              <Input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={inning1.overs}
                onChange={(e) =>
                  handleScoreChange(
                    1,
                    "overs",
                    parseFloat(e.target.value) || 0
                  )
                }
                disabled={currentInning !== 1}
                className="text-center"
              />
            </div>
          </div>
        </div>

        {/* Inning 2 */}
        {currentInning === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-medium">
              Inning 2 - {team2?.name || "Team 2"}
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Runs</label>
                <Input
                  type="number"
                  min="0"
                  value={inning2.runs}
                  onChange={(e) =>
                    handleScoreChange(2, "runs", parseInt(e.target.value) || 0)
                  }
                  className="text-center"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Wickets</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={inning2.wickets}
                  onChange={(e) =>
                    handleScoreChange(
                      2,
                      "wickets",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="text-center"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Overs</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={inning2.overs}
                  onChange={(e) =>
                    handleScoreChange(
                      2,
                      "overs",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Match Result (for completed matches) */}
        {status === MatchStatus.COMPLETED && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-base font-medium">Match Result</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Winner</label>
                <Select value={winner} onValueChange={setWinner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={match.team1Id}>
                      {team1?.name || "Team 1"}
                    </SelectItem>
                    <SelectItem value={match.team2Id}>
                      {team2?.name || "Team 2"}
                    </SelectItem>
                    <SelectItem value="tie">Tie</SelectItem>
                    <SelectItem value="no-result">No Result</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Result Summary
                </label>
                <Input
                  value={resultSummary}
                  onChange={(e) => setResultSummary(e.target.value)}
                  placeholder="e.g. Team A won by 5 wickets"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            onClick={saveChanges}
            disabled={isLoading}
            className="bg-cricket-700 hover:bg-cricket-800"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
