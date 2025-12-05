import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ mustChangePassword: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mustChangePassword: true },
    });

    return NextResponse.json({
      mustChangePassword: user?.mustChangePassword ?? false,
    });
  } catch (error) {
    console.error("Check password change error:", error);
    return NextResponse.json({ mustChangePassword: false });
  }
}
