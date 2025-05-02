
import React, { useState, useEffect } from "react";
import { Team, Player } from "@/types";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamFormProps {
  team?: Partial<Team>;
  onSubmit: (data: Partial<Team>) => void;
  isLoading: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({ team, onSubmit, isLoading }) => {
  const [name, setName] = useState(team?.name || "");
  const [shortName, setShortName] = useState(team?.shortName || "");
  const [logo, setLogo] = useState(team?.logo || "");
  const [players, setPlayers] = useState<Player[]>(team?.players || []);
  const [playerName, setPlayerName] = useState("");
  const [playerRole, setPlayerRole] = useState("");

  // Update form if team prop changes
  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setShortName(team.shortName || "");
      setLogo(team.logo || "");
      setPlayers(team.players || []);
    }
  }, [team]);

  const addPlayer = () => {
    if (!playerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerName,
      role: playerRole,
    };

    setPlayers([...players, newPlayer]);
    setPlayerName("");
    setPlayerRole("");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      shortName,
      logo,
      players,
    });
  };

  const isEditing = !!team?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Team" : "Add Team"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Team Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mumbai Indians"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="shortName" className="text-sm font-medium">
                  Short Name
                </label>
                <Input
                  id="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="MI"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                Logo URL
              </label>
              <Input
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/team-logo.png"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-base font-medium mb-4">Players</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-1">
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Player Name"
                  />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <Input
                    value={playerRole}
                    onChange={(e) => setPlayerRole(e.target.value)}
                    placeholder="Role (Batsman, Bowler, All-rounder)"
                  />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addPlayer}
                    className="w-full"
                  >
                    Add Player
                  </Button>
                </div>
              </div>

              {players.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Name</TableHead>
                        <TableHead className="w-[40%]">Role</TableHead>
                        <TableHead className="w-[10%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.role || "N/A"}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePlayer(player.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
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
              : "Add Team"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
