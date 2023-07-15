-- AlterTable
ALTER TABLE "ItemModel" ADD COLUMN     "creatorId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ItemModel" ADD CONSTRAINT "ItemModel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
