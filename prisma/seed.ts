import { PrismaClient, Gender, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  sku: string;
  thumbnail: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  brandId: string;
  collection: string;
  featured?: boolean;
  newArrival?: boolean;
  images: string[];
  colors: {
    name: string;
    hexCode: string;
  }[];
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      sku: data.sku,

      thumbnail: data.thumbnail,

      price: data.price,
      comparePrice: data.comparePrice,

      gender: Gender.MEN,
      collection: data.collection,

      stock: 50,
      rating: 4.8,
      reviewCount: 150,

      isFeatured: data.featured ?? false,
      isNewArrival: data.newArrival ?? false,

      brandId: data.brandId,
      categoryId: data.categoryId,

      images: {
        create: data.images.map((url, index) => ({
          url,
          displayOrder: index,
          isPrimary: index === 0,
        })),
      },

      colors: {
        create: data.colors.map((color, index) => ({
          ...color,
          displayOrder: index,
        })),
      },

      sizes: {
        create: [
          {
            size: Size.S,
            quantity: 20,
          },
          {
            size: Size.M,
            quantity: 20,
          },
          {
            size: Size.L,
            quantity: 20,
          },
          {
            size: Size.XL,
            quantity: 20,
          },
        ],
      },
    },
  });
}

async function main() {
  console.log("Cleaning database...");

  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  console.log("Creating brand...");

  const blackheadfashion = await prisma.brand.create({
    data: {
      name: "BlackHeadFashion",
      slug: "blackheadfashion",
      logo: "/images/logo/logo.svg",
    },
  });

  console.log("Creating categories...");

  const tshirts = await prisma.category.create({
    data: {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "/images/categories/tshirts.jpg",
    },
  });

  const shirts = await prisma.category.create({
    data: {
      name: "Shirts",
      slug: "shirts",
      image: "/images/categories/shirts.jpg",
    },
  });

  const jeans = await prisma.category.create({
    data: {
      name: "Jeans",
      slug: "jeans",
      image: "/images/categories/jeans.jpg",
    },
  });

  console.log("Creating products...");

  await createProduct({
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee-black",
    description:
      "Premium heavyweight oversized t-shirt crafted for everyday comfort.",

    sku: "BHF-TS-001",

    thumbnail: "/images/products/tshirts/tshirt-1.jpg",

    price: 1999,
    comparePrice: 2499,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,

    images: ["/images/products/tshirts/tshirt-1.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Classic Heavy Tee",
    slug: "classic-heavy-tee",
    description:
      "Premium heavyweight oversized t-shirt crafted for everyday comfort.",

    sku: "BHF-TS-002",

    thumbnail: "/images/products/tshirts/tshirt-2.jpg",

    price: 2999,
    comparePrice: 4999,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,

    images: ["/images/products/tshirts/tshirt-2.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Minimal Logo Tee",
    slug: "minimal-logo-tee",
    description:
      "Premium heavyweight oversized t-shirt crafted for everyday comfort.",

    sku: "BHF-TS-003",

    thumbnail: "/images/products/tshirts/tshirt-3.jpg",

    price: 3999,
    comparePrice: 5999,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: false,
    newArrival: true,

    images: ["/images/products/tshirts/tshirt-3.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Oxford Shirt",
    slug: "oxford-shirt",
    description: "Premium shirt crafted for everyday Fashion.",

    sku: "BHF-SH-001",

    thumbnail: "/images/products/shirts/shirt-1.jpg",

    price: 1999,
    comparePrice: 3999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,

    images: ["/images/products/shirts/shirt-1.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Casual Shirt",
    slug: "casual-linen-shirt",
    description: "Premium shirt crafted for everyday Fashion.",

    sku: "BHF-SH-002",

    thumbnail: "/images/products/shirts/shirt-2.jpg",

    price: 2999,
    comparePrice: 3999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,

    images: ["/images/products/shirts/shirt-2.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Formal Shirt",
    slug: "formal-shirt",
    description: "Premium shirt crafted for everyday Fashion.",

    sku: "BHF-SH-003",

    thumbnail: "/images/products/shirts/shirt-3.jpg",

    price: 3999,
    comparePrice: 5999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,

    images: ["/images/products/shirts/shirt-3.jpg"],

    colors: [
      {
        name: "Black",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Slim Fit Jeans",
    slug: "slim-fit-jeans",
    description: "Premium jeans crafted for everyday Fashion.",

    sku: "BHF-JN-001",

    thumbnail: "/images/products/jeans/jeans-1.jpg",

    price: 1999,
    comparePrice: 2999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,

    images: ["/images/products/jeans/jeans-1.jpg"],

    colors: [
      {
        name: "Blue",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Relaxed Fit Jeans",
    slug: "relaxed-fit-jeans",
    description: "Premium jeans crafted for everyday Fashion.",

    sku: "BHF-JN-002",

    thumbnail: "/images/products/jeans/jeans-2.jpg",

    price: 2999,
    comparePrice: 3999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,

    images: ["/images/products/jeans/jeans-2.jpg"],

    colors: [
      {
        name: "Blue",
        hexCode: "#000000",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  await createProduct({
    name: "Cargo Pants",
    slug: "cargo-pants",
    description: "Premium jeans crafted for everyday Fashion.",

    sku: "BHF-JN-003",

    thumbnail: "/images/products/jeans/jeans-3.jpg",

    price: 3999,
    comparePrice: 4999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,

    images: ["/images/products/jeans/jeans-3.jpg"],

    colors: [
      {
        name: "Blue",
        hexCode: "#1D4ED8",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
      },
    ],
  });

  console.log("Seed completed.");
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
