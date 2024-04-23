/*
  Warnings:

  - Added the required column `payment_method` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment_method" "PaymentMethods" NOT NULL;
