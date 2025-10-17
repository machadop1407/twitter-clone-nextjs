-- DropIndex
DROP INDEX "public"."user_username_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;
