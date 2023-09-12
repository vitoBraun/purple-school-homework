/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_itemId_fkey";

-- DropTable
DROP TABLE "CartItem";

-- CreateTable
CREATE TABLE "CartItemModel" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "CartItemModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItemModel_userId_key" ON "CartItemModel"("userId");

-- AddForeignKey
ALTER TABLE "CartItemModel" ADD CONSTRAINT "CartItemModel_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
