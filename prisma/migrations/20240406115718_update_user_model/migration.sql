/*
  Warnings:

  - A unique constraint covering the columns `[username,client_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,client_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_client_id_key" ON "users"("username", "client_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_client_id_key" ON "users"("email", "client_id");
