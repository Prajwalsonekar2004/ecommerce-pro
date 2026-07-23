import { PrismaClient, Gender, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete old data
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  // Brand
  const blackheadfashion = await prisma.brand.create({
    data: {
      name: "BlackHeadFashion",
      slug: "blackheadfashion",
      logo: "/images/logo/logo.svg",
    },
  });

  // Category
  const tshirts = await prisma.category.create({
    data: {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "/images/categories/tshirts.jpg",
    },
  });

  // Product
  const oversizedTee = await prisma.product.create({
    data: {
      name: "Essential Oversized Tee",
      slug: "essential-oversized-tee-black",
      description:
        "Premium heavyweight oversized t-shirt crafted for everyday comfort.",
      sku: "BHF-TS-0001",
      price: 1999,
      comparePrice: 2499,
      gender: Gender.MEN,
      collection: "Essentials",
      stock: 50,
      rating: 4.9,
      reviewCount: 248,
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      brandId: blackheadfashion.id,
      categoryId: tshirts.id,
    },
  });

  // Images
  await prisma.productImage.createMany({
    data: [
      {
        url: "/images/products/tshirts/tshirt-1.jpg",
        alt: "Essential Oversized Tee Front",
        isPrimary: true,
        productId: oversizedTee.id,
      },
      {
        url: "/images/products/tshirts/tshirt-1.jpg",
        alt: "Essential Oversized Tee Back",
        productId: oversizedTee.id,
      },
    ],
  });

  // Colors
  await prisma.productColor.createMany({
    data: [
      {
        name: "Black",
        hexCode: "#000000",
        productId: oversizedTee.id,
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        productId: oversizedTee.id,
      },
    ],
  });

  // Sizes
  await prisma.productSize.createMany({
    data: [
      {
        size: Size.S,
        quantity: 15,
        productId: oversizedTee.id,
      },
      {
        size: Size.M,
        quantity: 20,
        productId: oversizedTee.id,
      },
      {
        size: Size.L,
        quantity: 10,
        productId: oversizedTee.id,
      },
      {
        size: Size.XL,
        quantity: 5,
        productId: oversizedTee.id,
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
