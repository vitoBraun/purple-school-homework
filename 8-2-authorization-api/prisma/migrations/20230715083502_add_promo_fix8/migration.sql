/*
  Warnings:

  - Added the required column `creatorId` to the `PromoModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PromoModel" DROP CONSTRAINT "PromoModel_creatorEmail_fkey";

-- DropIndex
DROP INDEX "PromoModel_creatorEmail_idx";

-- AlterTable
ALTER TABLE "PromoModel" ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PromoModel" ADD CONSTRAINT "PromoModel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
