/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `order_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_events" DROP CONSTRAINT "order_events_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_product_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updated_at",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "order_id" TEXT;

-- DropTable
DROP TABLE "order_events";

-- DropTable
DROP TABLE "order_products";

-- DropEnum
DROP TYPE "OrderEventsStatus";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
