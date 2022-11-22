import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class ReportsService {
  create(reportDto: CreateUserDto) {
    return 'ok';
  }
}
