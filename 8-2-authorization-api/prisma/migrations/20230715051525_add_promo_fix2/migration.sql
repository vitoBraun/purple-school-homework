/*
  Warnings:

  - You are about to drop the column `creatorId` on the `PromoModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorEmail` to the `PromoModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PromoModel" DROP CONSTRAINT "PromoModel_creatorId_fkey";

-- AlterTable
ALTER TABLE "PromoModel" DROP COLUMN "creatorId",
ADD COLUMN     "creatorEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- AddForeignKey
ALTER TABLE "PromoModel" ADD CONSTRAINT "PromoModel_creatorEmail_fkey" FOREIGN KEY ("creatorEmail") REFERENCES "UserModel"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
