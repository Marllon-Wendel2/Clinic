import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Conexao com o banco de dados estabelecida com sucesso");
    } catch (error) {
      this.logger.error("Falha ao conectar com o banco de dados", error);
      throw error;
    }
  }

  async enableShutdownHooks() {
    process.on("beforeExit", async () => {
      this.logger.log("Desconectando do banco de dados...");
      await this.$disconnect();
    });
  }
}