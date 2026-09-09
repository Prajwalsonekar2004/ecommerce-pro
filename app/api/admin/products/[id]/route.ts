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

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (admin.error) {
    return admin.error;
  }

  const { id } = await context.params;

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
      isActive,
      images,
      colors,
      sizes,
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return NextResponse.json(
        { error: "Invalid product name." },
        { status: 400 },
      );
    }

    if (slug !== undefined && (typeof slug !== "string" || !slug.trim())) {
      return NextResponse.json(
        { error: "Invalid product slug." },
        { status: 400 },
      );
    }

    if (sku !== undefined && (typeof sku !== "string" || !sku.trim())) {
      return NextResponse.json({ error: "Invalid SKU." }, { status: 400 });
    }

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !categoryId)
    ) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    if (brandId !== undefined && (typeof brandId !== "string" || !brandId)) {
      return NextResponse.json({ error: "Invalid brand." }, { status: 400 });
    }

    if (
      price !== undefined &&
      (typeof price !== "number" || !Number.isFinite(price) || price < 0)
    ) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }

    if (
      stock !== undefined &&
      (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid stock quantity." },
        { status: 400 },
      );
    }

    const existingSlug = slug
      ? await prisma.product.findFirst({
          where: {
            slug: slug.trim(),
            NOT: {
              id,
            },
          },
          select: {
            id: true,
          },
        })
      : null;

    if (existingSlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const existingSku = sku
      ? await prisma.product.findFirst({
          where: {
            sku: sku.trim(),
            NOT: {
              id,
            },
          },
          select: {
            id: true,
          },
        })
      : null;

    if (existingSku) {
      return NextResponse.json(
        { error: "A product with this SKU already exists." },
        { status: 409 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (material !== undefined) {
      updateData.material =
        typeof material === "string" && material.trim()
          ? material.trim()
          : null;
    }

    if (fit !== undefined) {
      updateData.fit =
        typeof fit === "string" && fit.trim() ? fit.trim() : null;
    }

    if (pattern !== undefined) {
      updateData.pattern =
        typeof pattern === "string" && pattern.trim() ? pattern.trim() : null;
    }

    if (careInstructions !== undefined) {
      updateData.careInstructions =
        typeof careInstructions === "string" && careInstructions.trim()
          ? careInstructions.trim()
          : null;
    }

    if (sku !== undefined) updateData.sku = sku.trim();
    if (gender !== undefined) updateData.gender = gender;

    if (thumbnail !== undefined) {
      updateData.thumbnail =
        typeof thumbnail === "string" && thumbnail.trim()
          ? thumbnail.trim()
          : null;
    }

    if (price !== undefined) updateData.price = price;

    if (comparePrice !== undefined) {
      updateData.comparePrice =
        typeof comparePrice === "number" &&
        Number.isFinite(comparePrice) &&
        comparePrice >= 0
          ? comparePrice
          : null;
    }

    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (brandId !== undefined) updateData.brandId = brandId;

    if (collection !== undefined) {
      updateData.collection =
        typeof collection === "string" && collection.trim()
          ? collection.trim()
          : null;
    }

    if (stock !== undefined) updateData.stock = stock;

    if (featured !== undefined) {
      updateData.isFeatured = featured === true;
    }

    if (newArrival !== undefined) {
      updateData.isNewArrival = newArrival === true;
    }

    if (trending !== undefined) {
      updateData.isTrending = trending === true;
    }

    if (isOnSale !== undefined) {
      updateData.isOnSale = isOnSale === true;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === true;
    }

    const product = await prisma.$transaction(async (tx) => {
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

        updateData.images = {
          create: images
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
            })),
        };
      }

      if (Array.isArray(colors)) {
        await tx.productColor.deleteMany({
          where: {
            productId: id,
          },
        });

        updateData.colors = {
          create: colors
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
            })),
        };
      }

      if (Array.isArray(sizes)) {
        await tx.productSize.deleteMany({
          where: {
            productId: id,
          },
        });

        updateData.sizes = {
          create: sizes
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
            })),
        };
      }

      return tx.product.update({
        where: {
          id,
        },
        data: updateData,
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
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Admin product update failed:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Product deactivated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Admin product deactivation failed:", error);

    return NextResponse.json(
      { error: "Unable to deactivate product." },
      { status: 500 },
    );
  }
}
