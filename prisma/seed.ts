import { PrismaClient, Gender, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  // material: string;
  // fit: string;
  // pattern: string;
  // careInstructions: string;
  sku: string;
  gender: Gender;
  thumbnail: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  brandId: string;
  collection: string;
  featured?: boolean;
  newArrival?: boolean;
  isOnSale?: boolean;
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
      // material: data.material,
      // fit: data.fit,
      // pattern: data.pattern,
      // careInstructions: data.careInstructions,
      sku: data.sku,

      thumbnail: data.thumbnail,

      price: data.price,
      comparePrice: data.comparePrice,

      gender: data.gender,
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
      image: "/images/products/tshirts/shirt-7.jpg",
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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9441.PNG",

    price: 1999,
    comparePrice: 2499,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9441.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9442.PNG",

    price: 2999,
    comparePrice: 4999,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9442.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9443.PNG",

    price: 3999,
    comparePrice: 5999,

    categoryId: tshirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: false,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9443.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9444.PNG",

    price: 1999,
    comparePrice: 3999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9444.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9445.PNG",

    price: 2999,
    comparePrice: 3999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9445.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9446.PNG",

    price: 3999,
    comparePrice: 5999,

    categoryId: shirts.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9446.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9447.PNG",

    price: 1999,
    comparePrice: 2999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9447.PNG"],

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
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9448.PNG",

    price: 2999,
    comparePrice: 3999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: false,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9448.PNG"],

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
    name: "Denim Pants",
    slug: "denim-pants",
    description: "Premium jeans crafted for everyday Fashion.",

    sku: "BHF-JN-003",
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9449.PNG",

    price: 3999,
    comparePrice: 4999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9449.PNG"],

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

  await createProduct({
    name: "Black Pants",
    slug: "black-pants",
    description: "Premium jeans crafted for everyday Fashion.",

    sku: "BHF-JN-004",
    gender: Gender.MEN,

    thumbnail: "/images/products/real_products_img/IMG_9450.PNG",

    price: 3999,
    comparePrice: 4999,

    categoryId: jeans.id,
    brandId: blackheadfashion.id,

    collection: "Essentials",

    featured: true,
    newArrival: true,
    isOnSale: false,

    images: ["/images/products/real_products_img/IMG_9450.PNG"],

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
