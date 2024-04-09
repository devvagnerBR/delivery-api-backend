-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_client_id_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
