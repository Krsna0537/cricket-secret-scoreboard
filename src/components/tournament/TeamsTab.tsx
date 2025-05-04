
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tournament, Team } from "@/types";

interface TeamsTabProps {
  tournament: Tournament;
}

export const TeamsTab: React.FC<TeamsTabProps> = ({ tournament }) => {
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  if (tournament.teams.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No teams have been added to this tournament yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Teams</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {tournament.teams.map((team) => (
                <li
                  key={team.id}
                  className={`px-4 py-3 cursor-pointer ${
                    activeTeam?.id === team.id
                      ? "bg-cricket-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTeam(team)}
                >
                  <div className="flex items-center gap-3">
                    {team.logo ? (
                      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-cricket-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-cricket-800">
                          {team.shortName || team.name.substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {team.players.length} Players
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Team Details</h2>
        {activeTeam ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{activeTeam.name}</CardTitle>
                {activeTeam.logo && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={activeTeam.logo}
                      alt={activeTeam.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-2">Players</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTeam.players.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground"
                        >
                          No players added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeTeam.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>
                            {player.role || "Not specified"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>Select a team to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
