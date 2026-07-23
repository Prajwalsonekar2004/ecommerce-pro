import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // clean database
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
}

// Brand
const blackheadfashion = await prisma.brand.create({
  data: {
    name: "BlackHeadFashion",
    slug: "blackheadfashion",
    logo: "/images/logo/logo.svg",
  },
});

// Categories
const tshirts = await prisma.category.create({
  data: {
    name: "T-Shirts",
    slug: "t-shirts",
    image: "/images/categories/tshirts.jpg",
  },
});

console.log("Brand & Category created");

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
