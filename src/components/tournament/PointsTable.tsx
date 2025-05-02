
import React, { useMemo } from "react";
import { Tournament, Team, Match, MatchStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PointsTableProps {
  tournament: Tournament;
}

interface TeamStats {
  id: string;
  name: string;
  matchesPlayed: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
}

export const PointsTable: React.FC<PointsTableProps> = ({ tournament }) => {
  const pointsData = useMemo(() => {
    const { teams, matches } = tournament;
    const completedMatches = matches.filter(
      (match) => match.status === MatchStatus.COMPLETED
    );

    // Initialize stats for all teams
    const teamStats: Record<string, TeamStats> = {};
    teams.forEach((team) => {
      teamStats[team.id] = {
        id: team.id,
        name: team.name,
        matchesPlayed: 0,
        won: 0,
        lost: 0,
        tied: 0,
        noResult: 0,
        points: 0,
        netRunRate: 0,
      };
    });

    // Calculate stats based on completed matches
    completedMatches.forEach((match) => {
      const team1Stats = teamStats[match.team1Id];
      const team2Stats = teamStats[match.team2Id];

      if (!team1Stats || !team2Stats) return;

      // Match played by both teams
      team1Stats.matchesPlayed++;
      team2Stats.matchesPlayed++;

      // Handle results
      if (match.winner === "tie") {
        team1Stats.tied++;
        team2Stats.tied++;
        team1Stats.points += 1; // 1 point for tie
        team2Stats.points += 1; // 1 point for tie
      } else if (match.winner === "no-result") {
        team1Stats.noResult++;
        team2Stats.noResult++;
        team1Stats.points += 1; // 1 point for no-result
        team2Stats.points += 1; // 1 point for no-result
      } else if (match.winner === match.team1Id) {
        team1Stats.won++;
        team2Stats.lost++;
        team1Stats.points += 2; // 2 points for win
      } else if (match.winner === match.team2Id) {
        team1Stats.lost++;
        team2Stats.won++;
        team2Stats.points += 2; // 2 points for win
      }

      // Calculate Net Run Rate
      // This is a simplified version - in real cricket, NRR calculation is more complex
      if (match.inning1 && match.inning2) {
        let team1Runs = 0;
        let team1Overs = 0;
        let team2Runs = 0;
        let team2Overs = 0;

        if (match.inning1.teamId === match.team1Id) {
          team1Runs += match.inning1.runs;
          team1Overs += match.inning1.overs;
          team2Runs += match.inning2.runs;
          team2Overs += match.inning2.overs;
        } else {
          team1Runs += match.inning2.runs;
          team1Overs += match.inning2.overs;
          team2Runs += match.inning1.runs;
          team2Overs += match.inning1.overs;
        }

        if (team1Overs > 0) {
          team1Stats.netRunRate += team1Runs / team1Overs - team2Runs / (team2Overs || 1);
        }
        if (team2Overs > 0) {
          team2Stats.netRunRate += team2Runs / team2Overs - team1Runs / (team1Overs || 1);
        }
      }
    });

    // Normalize Net Run Rate by number of matches played
    Object.values(teamStats).forEach(team => {
      if (team.matchesPlayed > 0) {
        team.netRunRate = parseFloat((team.netRunRate / team.matchesPlayed).toFixed(2));
      }
    });

    // Sort teams by points, then by Net Run Rate
    return Object.values(teamStats).sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points; // higher points first
      }
      return b.netRunRate - a.netRunRate; // higher NRR first
    });
  }, [tournament]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">T</TableHead>
                <TableHead className="text-center">NR</TableHead>
                <TableHead className="text-center">Pts</TableHead>
                <TableHead className="text-center">NRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointsData.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell className="text-center">{team.matchesPlayed}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">{team.tied}</TableCell>
                  <TableCell className="text-center">{team.noResult}</TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                  <TableCell className="text-center">{team.netRunRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
