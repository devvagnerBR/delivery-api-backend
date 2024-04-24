/*
  Warnings:

  - A unique constraint covering the columns `[phone,client_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_phone_client_id_key" ON "users"("phone", "client_id");
