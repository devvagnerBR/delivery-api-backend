/*
  Warnings:

  - Added the required column `quantity` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "quantity" INTEGER NOT NULL;
