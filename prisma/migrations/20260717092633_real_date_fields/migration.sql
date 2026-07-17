-- AlterTable
ALTER TABLE "Game" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "Quest" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleHistory" DROP COLUMN "day",
DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;

