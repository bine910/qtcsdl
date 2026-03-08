import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) { }

  @Post()
  async runQuery(@Body() dto: QueryDto) {
    if (!dto || !dto.query) {
      throw new BadRequestException('Missing "query" field in request body. Plase ensure you are sending {"query": "YOUR_SQL"} in raw JSON format (Content-Type: application/json).');
    }

    try {
      return await this.queryService.executeQuery(dto.query);
    } catch (error) {
      console.error('Query execution error:', error);
      throw new BadRequestException(error.message || 'Database execution failed');
    }
  }
}
