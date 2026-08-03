-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('basic', 'premium');

-- AlterTable
ALTER TABLE "financeiro" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "odontograma" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "procedimentos" ALTER COLUMN "data" SET DEFAULT now()::date;

-- CreateTable
CREATE TABLE "Licenca" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licenca_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Licenca" ADD CONSTRAINT "Licenca_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
