/*
  Warnings:

  - You are about to drop the `Promo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_creatorId_fkey";

-- DropTable
DROP TABLE "Promo";

-- CreateTable
CREATE TABLE "PromoModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desription" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "PromoModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoModel" ADD CONSTRAINT "PromoModel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
