/*
  Warnings:

  - The `status` column on the `consultas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `financeiro` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tipo` on the `financeiro` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `usuarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "consultas" DROP COLUMN "status",
ADD COLUMN     "status" "ConsultaStatus" NOT NULL DEFAULT 'agendado';

-- AlterTable
ALTER TABLE "financeiro" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "FinanceiroTipo" NOT NULL,
ALTER COLUMN "data" SET DEFAULT now()::date,
DROP COLUMN "status",
ADD COLUMN     "status" "FinanceiroStatus" NOT NULL DEFAULT 'pago';

-- AlterTable
ALTER TABLE "odontograma" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "procedimentos" ALTER COLUMN "data" SET DEFAULT now()::date;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;
