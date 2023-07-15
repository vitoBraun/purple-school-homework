-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'provider';

-- CreateTable
CREATE TABLE "Promo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desription" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
