/*
  Warnings:

  - Changed the type of `userId` on the `CartItemModel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CartItemModel" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItemModel_userId_key" ON "CartItemModel"("userId");
