// google-maps-scraper.controller.ts
import { Controller, Post, Body, Res, Get, Param, NotFoundException, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ServerResponse } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { GoogleMapsScraperService } from './google-maps-scraper.service';

class ParseFileDto {
  @ApiProperty({
    description: 'Path to Google Maps HTML file',
    example: 'google.html',
    required: false,
  })
  filePath?: string;

  @ApiProperty({
    description: 'HTML content to parse directly',
    example: '<html>...</html>',
    required: false,
  })
  html?: string;

  @ApiProperty({
    description: 'Location or name of the scrape',
    example: 'New York Restaurants',
    required: false,
  })
  location?: string;
}

@ApiTags('Google Maps Scraper')
@Controller('scraper')
export class GoogleMapsScraperController {
  constructor(private readonly scraperService: GoogleMapsScraperService) { }

  // =========================================================
  // SINGLE API → HTML → EXCEL DOWNLOAD
  // =========================================================
  @Post('excel')
  @ApiOperation({ summary: 'Upload HTML path and download Excel leads' })
  @ApiBody({ type: ParseFileDto })
  async generateExcel(@Body() body: ParseFileDto, @Res() res: ServerResponse) {
    const result = await this.scraperService.parseHtmlToExcel(body.filePath || 'google.html');

    const filePath = path.resolve(result.file);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${path.basename(filePath)}`,
    );

    fs.createReadStream(filePath).pipe(res);
  }

  @Post('scrape-html')
  @ApiOperation({ summary: 'Scrape HTML content and download Excel leads' })
  @ApiBody({ type: ParseFileDto })
  async scrapeHtml(@Body() body: ParseFileDto, @Res() res: ServerResponse) {
    const location = body.location || 'Direct HTML Scrape';
    console.log(body.html);
    const result = await this.scraperService.scrapeHtmlToExcel(body.html || '', undefined, undefined, location);

    const filePath = path.resolve(result.file);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${path.basename(filePath)}`,
    );

    fs.createReadStream(filePath).pipe(res);
  }

  // =========================================================
  // FETCH SAVED DATA
  // =========================================================
  @Get('lists')
  @ApiOperation({ summary: 'Get all scraped lists' })
  async getAllLists() {
    return this.scraperService.getAllScrapedLists();
  }

  @Get('lists/:id/leads')
  @ApiOperation({ summary: 'Get details and leads of a specific list' })
  async getListDetails(@Param('id') id: number) {
    const list = await this.scraperService.getScrapedListById(id);
    if (!list) {
      throw new NotFoundException(`Scraped list with ID ${id} not found`);
    }
    return list;
  }

  @Delete('lists/:id')
  @ApiOperation({ summary: 'Delete a scraped list and its leads' })
  async deleteList(@Param('id') id: number) {
    try {
      await this.scraperService.deleteScrapedList(id);
      return { success: true, message: `Scraped list ${id} deleted successfully.` };
    } catch (err) {
      throw new NotFoundException((err as Error).message);
    }
  }
}