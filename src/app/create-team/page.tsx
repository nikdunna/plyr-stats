"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTeamPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTeamCode, setGeneratedTeamCode] = useState("");

  useEffect(() => {
    // Check if user is a coach
    if (session?.user && session.user.role !== "COACH") {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          coachId: session?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data.error);
      } else {
        // UPDATING CLIENT SESSION WITH TEAM CODE
        if (data.teamCode) {
          await update(data.session);
          setGeneratedTeamCode(data.teamCode);
          console.log("✅ Team created:", data.team);
        } else {
          console.warn("No team code found in refresh");
        }
      }
    } catch (err) {
      console.error("❌ Error creating team:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user || session.user.role !== "COACH") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      {generatedTeamCode ? ( // If team is created, show the team code card
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Your Team</CardTitle>
            <CardDescription>
              Your team has been created, welcome to PlyrStats!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h1>
              Your team code is:{" "}
              <span className="font-bold text-indigo-500">
                {generatedTeamCode}
              </span>
              <br />
              <br />
              <p className="text-sm text-gray-500">
                Share this code with your players to get started. You can view
                this code at anytime in your profile.
              </p>
            </h1>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Your Team</CardTitle>
            <CardDescription>
              Set up your volleyball team to start tracking player statistics
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="teamName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Team Name
                  </label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
