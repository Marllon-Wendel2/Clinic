import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { DashboardService } from "./dashboard.service";
import * as dashboardQueryDto from "./dto/dashboard-query.dto";
import { Roles } from "src/decorators/roles.decorator";
import { Premium } from "src/license/decorators/premium.decorator";
import { PremiumGuard } from "src/license/guards/premium.guard";


@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles('admin', 'dentist')
  async getDashboard(@Query(dashboardQueryDto.DashboardQueryPipe) query: dashboardQueryDto.DashboardQueryDto) {
    return this.dashboardService.getDashboard(query);
  }

  @Get('summary')
  @Roles('admin', 'dentist')
  @Premium()
  @UseGuards(PremiumGuard)
  async getSummary() {
    return this.dashboardService.getSummary();
  }
}
