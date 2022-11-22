import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReports(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
