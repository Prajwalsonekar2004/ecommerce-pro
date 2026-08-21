-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "shoppingPreference" TEXT;
