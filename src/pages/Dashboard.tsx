
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { TournamentForm } from "@/components/tournament/TournamentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tournament } from "@/types";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tournaments, isLoading, createTournament, deleteTournament } = useTournament();
  const navigate = useNavigate();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleCreateTournament = async (data: Partial<Tournament>) => {
    await createTournament(data);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (tournamentToDelete) {
      await deleteTournament(tournamentToDelete);
      setTournamentToDelete(null);
    }
  };

  const handleManageTournament = (tournament: Tournament) => {
    navigate(`/tournaments/manage/${tournament.id}`);
  };

  if (!currentUser) {
    return null; // Will redirect through useEffect
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-cricket-700 hover:bg-cricket-800"
              >
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Tournament</DialogTitle>
              </DialogHeader>
              <TournamentForm onSubmit={handleCreateTournament} isLoading={isLoading} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tournaments">
          <TabsList className="mb-6">
            <TabsTrigger value="tournaments">My Tournaments</TabsTrigger>
          </TabsList>
          <TabsContent value="tournaments">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-cricket-700 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading tournaments...</p>
              </div>
            ) : tournaments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <div className="bg-cricket-100 rounded-full p-3 inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cricket-800"
                  >
                    <path d="M6.8 11a7 7 0 0 0 9.3 9.3"/>
                    <path d="m12 6-0.5-4.3a1 1 0 0 0-1-0.8A14.4 14.4 0 0 0 2 9.2v0.4a1 1 0 0 0 0.9 1h0.3a7 7 0 0 0 4.6-1.7"/>
                    <path d="M12 6l2-2a1 1 0 0 1 1.4 0l3.9 3.9a1 1 0 0 1 0 1.4L15 14"/>
                    <path d="m12 6-2 2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Tournaments Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first cricket tournament to get started. You can add teams,
                  schedule matches, and more.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-cricket-700 hover:bg-cricket-800"
                >
                  Create Your First Tournament
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onManage={handleManageTournament}
                    onDelete={(id) => setTournamentToDelete(id)}
                    isAdmin={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Tournament Alert Dialog */}
      <AlertDialog
        open={!!tournamentToDelete}
        onOpenChange={() => setTournamentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tournament and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Dashboard;
