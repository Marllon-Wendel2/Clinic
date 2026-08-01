/*
  Warnings:

  - The primary key for the `catalogo_procedimentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `consultas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `financeiro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `odontograma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pacientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `procedimentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_dentista_id_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "financeiro" DROP CONSTRAINT "financeiro_consulta_id_fkey";

-- DropForeignKey
ALTER TABLE "financeiro" DROP CONSTRAINT "financeiro_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "odontograma" DROP CONSTRAINT "odontograma_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "pacientes" DROP CONSTRAINT "pacientes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "procedimentos" DROP CONSTRAINT "procedimentos_consulta_id_fkey";

-- DropForeignKey
ALTER TABLE "procedimentos" DROP CONSTRAINT "procedimentos_paciente_id_fkey";

-- AlterTable
ALTER TABLE "catalogo_procedimentos" DROP CONSTRAINT "catalogo_procedimentos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "catalogo_procedimentos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "catalogo_procedimentos_id_seq";

-- AlterTable
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "paciente_id" SET DATA TYPE TEXT,
ALTER COLUMN "dentista_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "consultas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "consultas_id_seq";

-- AlterTable
ALTER TABLE "financeiro" DROP CONSTRAINT "financeiro_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "data" SET DEFAULT now()::date,
ALTER COLUMN "paciente_id" SET DATA TYPE TEXT,
ALTER COLUMN "consulta_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "financeiro_id_seq";

-- AlterTable
ALTER TABLE "odontograma" DROP CONSTRAINT "odontograma_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "paciente_id" SET DATA TYPE TEXT,
ALTER COLUMN "data" SET DEFAULT now()::date,
ADD CONSTRAINT "odontograma_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "odontograma_id_seq";

-- AlterTable
ALTER TABLE "pacientes" DROP CONSTRAINT "pacientes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pacientes_id_seq";

-- AlterTable
ALTER TABLE "procedimentos" DROP CONSTRAINT "procedimentos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "paciente_id" SET DATA TYPE TEXT,
ALTER COLUMN "consulta_id" SET DATA TYPE TEXT,
ALTER COLUMN "data" SET DEFAULT now()::date,
ADD CONSTRAINT "procedimentos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "procedimentos_id_seq";

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "usuarios_id_seq";

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_dentista_id_fkey" FOREIGN KEY ("dentista_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odontograma" ADD CONSTRAINT "odontograma_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
