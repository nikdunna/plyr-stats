import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/config/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pull updated teamCode if coach (needed for refresh after team creation on dashboard)
  let teamCode;
  if (session.user.role === "COACH") {
    const team = await prisma.team.findFirst({
      where: { coachId: session.user.id },
    });
    teamCode = team?.teamCode;
  }

  // Return updated values to update client manually
  console.log("✅ Refreshing session for", session.user.email);
  return NextResponse.json({
    teamCode,
  });
}
