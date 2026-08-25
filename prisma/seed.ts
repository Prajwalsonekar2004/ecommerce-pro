import { PrismaClient, Gender, Size } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertProduct(data: {
  name: string;
  slug: string;
  description: string;

  material?: string;
  fit?: string;
  pattern?: string;
  careInstructions?: string;

  sku: string;
  gender: Gender;

  thumbnail?: string;

  price: number;
  comparePrice?: number;

  categoryId: string;
  brandId: string;

  collection?: string;

  stock: number;
  rating?: number;
  reviewCount?: number;

  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  isOnSale?: boolean;

  images: {
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }[];

  colors: {
    name: string;
    hexCode: string;
  }[];

  sizes: {
    size: Size;
    quantity: number;
  }[];
}) {
  return prisma.$transaction(async (tx) => {
    const existingProduct = await tx.product.findUnique({
      where: {
        slug: data.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingProduct) {
      await tx.productImage.deleteMany({
        where: {
          productId: existingProduct.id,
        },
      });

      await tx.productColor.deleteMany({
        where: {
          productId: existingProduct.id,
        },
      });

      await tx.productSize.deleteMany({
        where: {
          productId: existingProduct.id,
        },
      });

      return tx.product.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          name: data.name,
          description: data.description,

          material: data.material,
          fit: data.fit,
          pattern: data.pattern,
          careInstructions: data.careInstructions,

          sku: data.sku,
          gender: data.gender,

          thumbnail: data.thumbnail,

          price: data.price,
          comparePrice: data.comparePrice,

          categoryId: data.categoryId,
          brandId: data.brandId,

          collection: data.collection,

          stock: data.stock,
          rating: data.rating ?? 0,
          reviewCount: data.reviewCount ?? 0,

          isFeatured: data.featured ?? false,
          isNewArrival: data.newArrival ?? false,
          isTrending: data.trending ?? false,
          isOnSale: data.isOnSale ?? false,

          images: {
            create: data.images.map((image, index) => ({
              url: image.url,
              alt: image.alt,
              displayOrder: index,
              isPrimary: image.isPrimary ?? index === 0,
            })),
          },

          colors: {
            create: data.colors.map((color, index) => ({
              name: color.name,
              hexCode: color.hexCode,
              displayOrder: index,
            })),
          },

          sizes: {
            create: data.sizes.map((size) => ({
              size: size.size,
              quantity: size.quantity,
            })),
          },
        },
      });
    }

    return tx.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,

        material: data.material,
        fit: data.fit,
        pattern: data.pattern,
        careInstructions: data.careInstructions,

        sku: data.sku,
        gender: data.gender,

        thumbnail: data.thumbnail,

        price: data.price,
        comparePrice: data.comparePrice,

        categoryId: data.categoryId,
        brandId: data.brandId,

        collection: data.collection,

        stock: data.stock,
        rating: data.rating ?? 0,
        reviewCount: data.reviewCount ?? 0,

        isFeatured: data.featured ?? false,
        isNewArrival: data.newArrival ?? false,
        isTrending: data.trending ?? false,
        isOnSale: data.isOnSale ?? false,

        images: {
          create: data.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            displayOrder: index,
            isPrimary: image.isPrimary ?? index === 0,
          })),
        },

        colors: {
          create: data.colors.map((color, index) => ({
            name: color.name,
            hexCode: color.hexCode,
            displayOrder: index,
          })),
        },

        sizes: {
          create: data.sizes.map((size) => ({
            size: size.size,
            quantity: size.quantity,
          })),
        },
      },
    });
  });
}

async function main() {
  console.log("Cleaning database...");

  console.log("Creating brand...");

  const blackheadfashion = await prisma.brand.upsert({
    where: {
      slug: "blackheadfashion",
    },
    update: {
      name: "BlackHeadFashion",
      logo: "/images/logo/logo.svg",
      isActive: true,
    },
    create: {
      name: "BlackHeadFashion",
      slug: "blackheadfashion",
      logo: "/images/logo/logo.svg",
    },
  });

  console.log("Creating categories...");

  const tshirts = await prisma.category.upsert({
    where: {
      slug: "t-shirts",
    },
    update: {
      name: "T-Shirts",
      image: "/images/products/tshirts/shirt-7.jpg",
      isActive: true,
    },
    create: {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "/images/products/tshirts/shirt-7.jpg",
    },
  });

  const shirts = await prisma.category.upsert({
    where: {
      slug: "shirts",
    },
    update: {
      name: "Shirts",
      image: "/images/categories/shirts.jpg",
      isActive: true,
    },
    create: {
      name: "Shirts",
      slug: "shirts",
      image: "/images/categories/shirts.jpg",
    },
  });

  const jeans = await prisma.category.upsert({
    where: {
      slug: "jeans",
    },
    update: {
      name: "Jeans",
      image: "/images/categories/jeans.jpg",
      isActive: true,
    },
    create: {
      name: "Jeans",
      slug: "jeans",
      image: "/images/categories/jeans.jpg",
    },
  });

  console.log("Creating products...");

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9441.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9442.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9443.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9444.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9445.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9446.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9447.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9448.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9449.PNG",
        isPrimary: true,
      },
    ],

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

  await upsertProduct({
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

    stock: 50,

    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],

    images: [
      {
        url: "/images/products/real_products_img/IMG_9450.PNG",
        isPrimary: true,
      },
    ],

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
