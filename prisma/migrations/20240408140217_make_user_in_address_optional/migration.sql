-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "address_id" TEXT;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
