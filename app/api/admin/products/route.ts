import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          displayOrder: "asc",
        },
        take: 1,
      },
      category: {
        select: {
          name: true,
        },
      },
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    products,
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      material,
      fit,
      pattern,
      careInstructions,
      sku,
      gender,
      thumbnail,
      price,
      comparePrice,
      categoryId,
      brandId,
      collection,
      stock,
      featured,
      newArrival,
      trending,
      isOnSale,
      images = [],
      colors = [],
      sizes = [],
    } = body;

    if (
      !name ||
      !slug ||
      !description ||
      !sku ||
      !gender ||
      !categoryId ||
      !brandId ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required product fields." },
        { status: 400 },
      );
    }

    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof sku !== "string" ||
      typeof categoryId !== "string" ||
      typeof brandId !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid product data." },
        { status: 400 },
      );
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }

    if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Invalid stock quantity." },
        { status: 400 },
      );
    }

    const existingSlug = await prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const existingSku = await prisma.product.findUnique({
      where: {
        sku,
      },
      select: {
        id: true,
      },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: "A product with this SKU already exists." },
        { status: 409 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),

        material:
          typeof material === "string" && material.trim()
            ? material.trim()
            : null,

        fit: typeof fit === "string" && fit.trim() ? fit.trim() : null,

        pattern:
          typeof pattern === "string" && pattern.trim() ? pattern.trim() : null,

        careInstructions:
          typeof careInstructions === "string" && careInstructions.trim()
            ? careInstructions.trim()
            : null,

        sku: sku.trim(),

        gender,

        thumbnail:
          typeof thumbnail === "string" && thumbnail.trim()
            ? thumbnail.trim()
            : null,

        price,

        comparePrice:
          typeof comparePrice === "number" &&
          Number.isFinite(comparePrice) &&
          comparePrice >= 0
            ? comparePrice
            : null,

        categoryId,
        brandId,

        collection:
          typeof collection === "string" && collection.trim()
            ? collection.trim()
            : null,

        stock,

        rating: 0,
        reviewCount: 0,

        isFeatured: featured === true,
        isNewArrival: newArrival === true,
        isTrending: trending === true,
        isOnSale: isOnSale === true,

        images: {
          create: Array.isArray(images)
            ? images
                .filter(
                  (image) =>
                    image && typeof image.url === "string" && image.url.trim(),
                )
                .map((image, index) => ({
                  url: image.url.trim(),
                  alt:
                    typeof image.alt === "string" && image.alt.trim()
                      ? image.alt.trim()
                      : null,
                  displayOrder: index,
                  isPrimary: image.isPrimary === true || index === 0,
                }))
            : [],
        },

        colors: {
          create: Array.isArray(colors)
            ? colors
                .filter(
                  (color) =>
                    color &&
                    typeof color.name === "string" &&
                    typeof color.hexCode === "string" &&
                    color.name.trim() &&
                    color.hexCode.trim(),
                )
                .map((color, index) => ({
                  name: color.name.trim(),
                  hexCode: color.hexCode.trim(),
                  displayOrder: index,
                }))
            : [],
        },

        sizes: {
          create: Array.isArray(sizes)
            ? sizes
                .filter(
                  (size) =>
                    size &&
                    typeof size.size === "string" &&
                    Number.isInteger(size.quantity) &&
                    size.quantity >= 0,
                )
                .map((size) => ({
                  size: size.size,
                  quantity: size.quantity,
                }))
            : [],
        },
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
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin product creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create product." },
      { status: 500 },
    );
  }
}
