
import React, { useState } from "react";
import { Tournament } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ShareTournamentProps {
  tournament: Tournament;
}

export const ShareTournament: React.FC<ShareTournamentProps> = ({ tournament }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const tournamentUrl = `${window.location.origin}/access`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast({ title: "Copied!", description: "Tournament details copied to clipboard" });
        setTimeout(() => setCopied(false), 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const copySecretCode = () => {
    copyToClipboard(tournament.secretCode);
  };

  const copyLinkAndCode = () => {
    const fullMessage = `You're invited to view the "${tournament.name}" cricket tournament!\n\nAccess it here: ${tournamentUrl}\n\nEnter code: ${tournament.secretCode}`;
    copyToClipboard(fullMessage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Tournament</CardTitle>
        <CardDescription>
          Share these details with anyone you want to give access to this tournament.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Secret Code</label>
          <div className="flex gap-2">
            <Input
              value={tournament.secretCode}
              readOnly
              className="font-mono bg-gray-50"
            />
            <Button variant="outline" onClick={copySecretCode} className="shrink-0">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this code can access your tournament.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Access URL</label>
          <div className="flex gap-2">
            <Input value={tournamentUrl} readOnly className="bg-gray-50" />
          </div>
          <p className="text-xs text-muted-foreground">
            Share this URL along with the code above.
          </p>
        </div>

        <Button
          onClick={copyLinkAndCode}
          className="w-full bg-cricket-700 hover:bg-cricket-800"
        >
          Copy Link & Code to Share
        </Button>
      </CardContent>
    </Card>
  );
};
