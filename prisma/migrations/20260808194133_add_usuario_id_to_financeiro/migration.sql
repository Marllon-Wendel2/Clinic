-- AlterTable
ALTER TABLE "financeiro" ADD COLUMN     "usuario_id" TEXT,
ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "odontograma" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "procedimentos" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
