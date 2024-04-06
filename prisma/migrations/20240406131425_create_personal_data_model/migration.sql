-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('CREDIT_ON_DELIVERY', 'DEBIT_ON_DELIVERY', 'PIX', 'MONEY');

-- CreateTable
CREATE TABLE "personal_data" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cep" TEXT,
    "street" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "complement" TEXT,
    "last_payment_method" "PaymentMethods",
    "user_id" TEXT NOT NULL,

    CONSTRAINT "personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_data_user_id_key" ON "personal_data"("user_id");

-- AddForeignKey
ALTER TABLE "personal_data" ADD CONSTRAINT "personal_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
