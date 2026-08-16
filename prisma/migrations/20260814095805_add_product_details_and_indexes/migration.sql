-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "careInstructions" TEXT,
ADD COLUMN     "fit" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "pattern" TEXT;

-- CreateIndex
CREATE INDEX "Product_gender_idx" ON "public"."Product"("gender");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "public"."Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "public"."Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "public"."Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_isNewArrival_idx" ON "public"."Product"("isNewArrival");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "public"."Product"("createdAt");
