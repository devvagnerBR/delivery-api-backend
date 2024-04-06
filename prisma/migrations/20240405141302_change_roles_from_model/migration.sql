-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
