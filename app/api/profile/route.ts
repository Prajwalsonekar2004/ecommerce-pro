import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        shoppingPreference: true,
        dateOfBirth: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      profile,
    });
  } catch (error) {
    console.error("GET /api/profile failed:", error);

    return NextResponse.json(
      { error: "Unable to load profile." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { firstName, lastName, shoppingPreference, dateOfBirth } = body;

    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 },
      );
    }

    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: "Last name is required." },
        { status: 400 },
      );
    }

    if (
      shoppingPreference !== "Men" &&
      shoppingPreference !== "Women" &&
      shoppingPreference !== "Everyone"
    ) {
      return NextResponse.json(
        { error: "Please select a valid shopping preference." },
        { status: 400 },
      );
    }

    if (!dateOfBirth) {
      return NextResponse.json(
        { error: "Date of birth is required." },
        { status: 400 },
      );
    }

    const parsedDateOfBirth = new Date(dateOfBirth);

    if (Number.isNaN(parsedDateOfBirth.getTime())) {
      return NextResponse.json(
        { error: "Please enter a valid date of birth." },
        { status: 400 },
      );
    }

    const profile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        shoppingPreference,
        dateOfBirth: parsedDateOfBirth,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        shoppingPreference: true,
        dateOfBirth: true,
      },
    });

    return NextResponse.json({
      profile,
    });
  } catch (error) {
    console.error("PATCH /api/profile failed:", error);

    return NextResponse.json(
      { error: "Unable to save profile." },
      { status: 500 },
    );
  }
}
