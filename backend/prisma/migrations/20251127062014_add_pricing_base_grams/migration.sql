-- AlterTable
ALTER TABLE "items" ADD COLUMN     "isWeighted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricingBaseGrams" INTEGER;
