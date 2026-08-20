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

    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      addresses,
    });
  } catch (error) {
    console.error("GET /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to load addresses." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      fullName,
      phone,
      pincode,
      houseNo,
      addressLine,
      city,
      state,
      isDefault,
    } = body;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !pincode?.trim() ||
      !houseNo?.trim() ||
      !addressLine?.trim() ||
      !city?.trim() ||
      !state?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.address.count({
        where: {
          userId: user.id,
        },
      });

      const makeDefault = Boolean(isDefault) || existingCount === 0;

      if (makeDefault) {
        await tx.address.updateMany({
          where: {
            userId: user.id,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.create({
        data: {
          userId: user.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          pincode: pincode.trim(),
          houseNo: houseNo.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          isDefault: makeDefault,
        },
      });
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("POST /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to save address." },
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

    const {
      addressId,
      fullName,
      phone,
      pincode,
      houseNo,
      addressLine,
      city,
      state,
      isDefault,
    } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required." },
        { status: 400 },
      );
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      if (Boolean(isDefault)) {
        await tx.address.updateMany({
          where: {
            userId: user.id,
            isDefault: true,
            id: {
              not: addressId,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.update({
        where: {
          id: addressId,
        },
        data: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          pincode: pincode.trim(),
          houseNo: houseNo.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          isDefault: Boolean(isDefault),
        },
      });
    });

    return NextResponse.json({
      address,
    });
  } catch (error) {
    console.error("PATCH /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to update address." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.addressId) {
      return NextResponse.json(
        { error: "Address ID is required." },
        { status: 400 },
      );
    }

    const address = await prisma.address.findFirst({
      where: {
        id: body.addressId,
        userId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    }

    await prisma.address.delete({
      where: {
        id: address.id,
      },
    });

    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to delete address." },
      { status: 500 },
    );
  }
}
