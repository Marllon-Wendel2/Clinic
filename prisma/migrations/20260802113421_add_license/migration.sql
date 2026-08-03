-- AlterTable
ALTER TABLE "financeiro" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "odontograma" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "procedimentos" ALTER COLUMN "data" SET DEFAULT now()::date;
