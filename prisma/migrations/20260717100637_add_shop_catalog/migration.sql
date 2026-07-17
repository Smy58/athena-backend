-- CreateTable
CREATE TABLE "ShopTitle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShopTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "PurchaseCategory" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

