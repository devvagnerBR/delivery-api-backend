/*
  Warnings:

  - You are about to drop the `personal_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "personal_data" DROP CONSTRAINT "personal_data_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "personal_data";
