-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'dentist');

-- CreateEnum
CREATE TYPE "ConsultaStatus" AS ENUM ('agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou');

-- CreateEnum
CREATE TYPE "FinanceiroTipo" AS ENUM ('receita', 'despesa');

-- CreateEnum
CREATE TYPE "FinanceiroStatus" AS ENUM ('pago', 'pendente', 'cancelado', 'atrasado');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cro" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "data_nascimento" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "cep" TEXT,
    "observacoes" TEXT,
    "alergias" TEXT,
    "medicamentos" TEXT,
    "doencas" TEXT,
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL DEFAULT 30,
    "status" TEXT NOT NULL DEFAULT 'agendado',
    "procedimento" TEXT,
    "observacoes" TEXT,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dentista_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimentos" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "consulta_id" INTEGER,
    "dente" TEXT,
    "procedimento" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "data" TEXT NOT NULL DEFAULT now()::date,
    "status" TEXT NOT NULL DEFAULT 'concluido',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procedimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odontograma" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "dente" TEXT NOT NULL,
    "face" TEXT,
    "condicao" TEXT NOT NULL,
    "observacao" TEXT,
    "data" TEXT NOT NULL DEFAULT now()::date,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "odontograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financeiro" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TEXT NOT NULL DEFAULT now()::date,
    "categoria" TEXT,
    "paciente_id" INTEGER,
    "consulta_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pago',
    "forma_pagamento" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_procedimentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogo_procedimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_procedimentos_nome_key" ON "catalogo_procedimentos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "config_chave_key" ON "config"("chave");

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
