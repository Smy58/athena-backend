-- CreateTable
CREATE TABLE "ShopSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShopSection_pkey" PRIMARY KEY ("id")
);

-- Seed the two existing categories as real sections (preserves existing ShopItem/Purchase data)
INSERT INTO "ShopSection" ("id", "name", "icon", "order") VALUES
  ('potions', 'Зелья', '🧪', 0),
  ('snacks', 'Пойки', '🍪', 1);

-- AlterTable: ShopItem — add sectionId, backfill from category, then drop category
ALTER TABLE "ShopItem" ADD COLUMN "sectionId" TEXT;
UPDATE "ShopItem" SET "sectionId" = CASE WHEN "category" = 'POTION' THEN 'potions' ELSE 'snacks' END;
ALTER TABLE "ShopItem" ALTER COLUMN "sectionId" SET NOT NULL;
ALTER TABLE "ShopItem" DROP COLUMN "category";
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ShopSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Purchase — add sectionId snapshot, backfill from category, then drop category (no FK — historical snapshot)
ALTER TABLE "Purchase" ADD COLUMN "sectionId" TEXT;
UPDATE "Purchase" SET "sectionId" = CASE WHEN "category" = 'POTION' THEN 'potions' ELSE 'snacks' END;
ALTER TABLE "Purchase" ALTER COLUMN "sectionId" SET NOT NULL;
ALTER TABLE "Purchase" DROP COLUMN "category";

-- DropEnum
DROP TYPE "PurchaseCategory";
