-- CreateTable
CREATE TABLE "ItemModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "storeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ItemModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCategory" (
    "itemId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryModelToItemModel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_itemId_categoryId_key" ON "ItemCategory"("itemId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryModelToItemModel_AB_unique" ON "_CategoryModelToItemModel"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryModelToItemModel_B_index" ON "_CategoryModelToItemModel"("B");

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryModelToItemModel" ADD CONSTRAINT "_CategoryModelToItemModel_A_fkey" FOREIGN KEY ("A") REFERENCES "CategoryModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryModelToItemModel" ADD CONSTRAINT "_CategoryModelToItemModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
