import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (admin.error) {
    return admin.error;
  }

  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        colors: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        sizes: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error("Admin product fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch product." },
      { status: 500 },
    );
  }
}
