-- AlterTable
ALTER TABLE "financeiro" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "odontograma" ADD COLUMN     "dentista_id" TEXT,
ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "procedimentos" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AddForeignKey
ALTER TABLE "odontograma" ADD CONSTRAINT "odontograma_dentista_id_fkey" FOREIGN KEY ("dentista_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
