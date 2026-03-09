import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import * as ExcelJS from 'exceljs';
import { Company } from '../master/companies/company.entity';
import { ScrapedList } from './entities/scraped-list.entity';
import { ScrapedLead } from './entities/scraped-lead.entity';

// =========================================================
// UTM CONFIG — change these default values as needed
// =========================================================
export interface UtmConfig {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const DEFAULT_UTM: UtmConfig = {
  utm_source: 'google_maps',
  utm_medium: 'organic',
  utm_campaign: 'gmb_leads',
  utm_content: 'listing',
  utm_term: '',
};

// =========================================================
// LEAD INTERFACE
// =========================================================
export interface GoogleMapLead {
  name: string;
  rating: number | null;
  reviewCount: number | null;
  category: string | null;
  address: string | null;
  openStatus: string | null;
  closeTime: string | null;
  contactNo: string | null;
  website: string | null;
  websiteWithUtm: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  directionsUrl: string | null;
  profileImage: string | null;
  googleMapsLink: string | null;
  placeId: string | null;
  clickId: string | null;
  clickMetadata: string | null;
}

@Injectable()
export class GoogleMapsScraperService {
  private readonly logger = new Logger(GoogleMapsScraperService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ScrapedList)
    private readonly scrapedListRepository: Repository<ScrapedList>,
    @InjectRepository(ScrapedLead)
    private readonly scrapedLeadRepository: Repository<ScrapedLead>,
  ) {}

  // =========================================================
  // SLUGIFY (Helper for code generation)
  // =========================================================
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }

  // =========================================================
  // BUILD UTM URL
  // =========================================================
  private buildUtmUrl(website: string | null, utm: UtmConfig): string | null {
    if (!website) return null;

    try {
      const url = new URL(website);
      if (utm.utm_source) url.searchParams.set('utm_source', utm.utm_source);
      if (utm.utm_medium) url.searchParams.set('utm_medium', utm.utm_medium);
      if (utm.utm_campaign) url.searchParams.set('utm_campaign', utm.utm_campaign);
      if (utm.utm_content) url.searchParams.set('utm_content', utm.utm_content);
      if (utm.utm_term) url.searchParams.set('utm_term', utm.utm_term);
      return url.toString();
    } catch {
      const separator = website.includes('?') ? '&' : '?';
      const params = new URLSearchParams();
      if (utm.utm_source) params.set('utm_source', utm.utm_source);
      if (utm.utm_medium) params.set('utm_medium', utm.utm_medium);
      if (utm.utm_campaign) params.set('utm_campaign', utm.utm_campaign);
      if (utm.utm_content) params.set('utm_content', utm.utm_content);
      if (utm.utm_term) params.set('utm_term', utm.utm_term);
      return `${website}${separator}${params.toString()}`;
    }
  }

  // =========================================================
  // EXTRACT PLACE ID FROM GOOGLE MAPS URL
  // =========================================================
  private extractPlaceId(mapsUrl: string | null): string | null {
    if (!mapsUrl) return null;

    const match1 = mapsUrl.match(/!1s([^!]+)!/);
    if (match1) return decodeURIComponent(match1[1]);

    const match2 = mapsUrl.match(/data=.*?!1s([^!&]+)/);
    if (match2) return decodeURIComponent(match2[1]);

    return null;
  }

  // =========================================================
  // EXTRACT CLICK ID FROM JSLOG ATTRIBUTE
  // =========================================================
  private extractClickId(jslog: string | undefined): {
    clickId: string | null;
    clickMetadata: string | null;
  } {
    if (!jslog) return { clickId: null, clickMetadata: null };

    const clickId = jslog.split(';')[0]?.trim() || null;
    const metaMatch = jslog.match(/metadata:([A-Za-z0-9+/=]+)/);
    const clickMetadata = metaMatch ? metaMatch[1] : null;

    return { clickId, clickMetadata };
  }

  // =========================================================
  // READ HTML FILE
  // =========================================================
  async parseLeadsFromFile(
    filePath: string,
    utm: UtmConfig = DEFAULT_UTM,
  ): Promise<GoogleMapLead[]> {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }
    const html = fs.readFileSync(absolutePath, 'utf-8');
    return this.parseLeads(html, utm);
  }

  // =========================================================
  // PARSE HTML
  //
  // Google Maps card structure (relevant parts):
  //
  // <div role="article">
  //   <a class="hfpxzc" href="...maps link..." jslog="...">  ← maps link + click tracking
  //   <div class="UaQhfb">
  //     <div class="qBF1Pd">NAME</div>                       ← name
  //     <div class="W4Efsd">                                 ← OUTER info wrapper
  //       <div class="AJB7ye">                               ← rating block
  //         <span class="ZkP5Je" aria-label="X stars Y Reviews">
  //       </div>
  //       <div class="W4Efsd">                               ← category + address row
  //         <span><span>CATEGORY</span></span>
  //         <span> · <span>ADDRESS</span></span>
  //       </div>
  //       <div class="W4Efsd">                               ← hours + phone row
  //         <span><span>
  //           <span style="color:green">Open</span>          ← open status (green/amber)
  //           <span style="font-weight:400"> · Closes 6 pm</span>
  //         </span></span>
  //         <span> · <span class="UsdlK">PHONE</span></span>
  //       </div>
  //     </div>
  //   </div>
  //   <a data-value="Website" href="...">                    ← website
  //   <button data-value="Directions">                       ← has directions
  //   <img class="Jn12ke">                                   ← profile image
  // </div>
  // =========================================================
  parseLeads(html: string, utm: UtmConfig = DEFAULT_UTM): GoogleMapLead[] {
    const $ = cheerio.load(html);
    const leads: GoogleMapLead[] = [];
    this.logger.log(`Parsing HTML of length ${html.length}`);

    const articles = $('[role="article"]');
    this.logger.log(`Found ${articles.length} elements with role="article"`);

    articles.each((_, el) => {
      try {
        const card = $(el);

        // ── Name ──────────────────────────────────────────────────────────────
        const name =
          card.find('.qBF1Pd').first().text().trim() ||
          card.attr('aria-label')?.trim() ||
          null;

        // ── Rating & Reviews ──────────────────────────────────────────────────
        // FIX: Target .ZkP5Je specifically instead of any [role="img"][aria-label]
        // to avoid accidentally matching other aria-labelled images on the card.
        const ratingLabel = card.find('.ZkP5Je').first().attr('aria-label') || '';
        const ratingMatch = ratingLabel.match(/([\d.]+)\s+stars?\s+([\d,]+)\s+Reviews?/i);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
        const reviewCount = ratingMatch
          ? parseInt(ratingMatch[2].replace(',', ''), 10)
          : null;

        // ── Category & Address ────────────────────────────────────────────────
        // FIX: The outer .W4Efsd wraps the entire info section. Category and
        // address live in the FIRST *inner* .W4Efsd (direct child of the outer).
        // We target it directly so that removing .AJB7ye (rating) and .ZkP5Je
        // from the outer doesn't accidentally wipe category/address content.
        //
        // Structure:
        //   <div class="W4Efsd">           ← outer (index 0 in card.find)
        //     <div class="AJB7ye">…</div>  ← rating — skip
        //     <div class="W4Efsd">…</div>  ← category + address row  ← we want this
        //     <div class="W4Efsd">…</div>  ← hours + phone row
        //   </div>
        const outerInfoBlock = card.find('.UaQhfb .W4Efsd').first();
        const categoryAddressRow = outerInfoBlock.children('.W4Efsd').first();

        let category: string | null = null;
        let address: string | null = null;

        if (categoryAddressRow.length) {
          // First <span><span> pair → category
          const spans = categoryAddressRow.children('span');
          spans.each((i, spanEl) => {
            const text = $(spanEl).text().trim().replace(/^[·\s]+/, '').trim();
            if (!text) return;
            if (i === 0 && !category) {
              // category is the first non-empty inner span text
              category = $(spanEl).find('span').first().text().trim() || text;
            } else if (i > 0 && !address) {
              // address is typically in subsequent span(s), strip leading " · "
              const inner = $(spanEl).find('span').last().text().trim();
              address = inner || text;
            }
          });
        }

        // ── Open Status & Close Time ──────────────────────────────────────────
        // FIX: The hours row is the SECOND inner .W4Efsd inside the outer block.
        // The original code used card.find('.W4Efsd').eq(1) which returns the
        // second element in the *flat* list of ALL .W4Efsd descendants — that
        // turned out to be the category/address row, not the hours row.
        const hoursRow = outerInfoBlock.children('.W4Efsd').eq(1);

        // Open status: coloured span (green = open, amber = closes soon, red = closed)
        // Match any inline color style that Google uses for open/closed indicators.
        let openStatus: string | null = null;
        hoursRow.find('span[style]').each((_, spanEl) => {
          const style = $(spanEl).attr('style') || '';
          if (style.includes('color:') || style.includes('color :')) {
            const text = $(spanEl).text().trim();
            if (text) {
              openStatus = text;
              return false; // break
            }
          }
        });

        // FIX: Close time lives in a plain <span style="font-weight: 400;">
        // alongside the coloured status span. Strip the leading " · " separator.
        let closeTime: string | null = null;
        hoursRow.find('span[style]').each((_, spanEl) => {
          const style = $(spanEl).attr('style') || '';
          const text = $(spanEl).text().trim();
          // We want the weight-400 span that is NOT the coloured status span
          if (
            style.includes('font-weight: 400') &&
            !style.includes('color') &&
            text
          ) {
            closeTime = text.replace(/^[·\s]+/, '').trim() || null;
            return false; // break
          }
        });

        // ── Contact ───────────────────────────────────────────────────────────
        const contactNo = card.find('.UsdlK').first().text().trim() || null;

        // ── Website ───────────────────────────────────────────────────────────
        const website =
          card.find('a[data-value="Website"]').attr('href') || null;

        // ── Website with UTM params ───────────────────────────────────────────
        const websiteWithUtm = this.buildUtmUrl(website, utm);

        // ── Directions URL ────────────────────────────────────────────────────
        const hasDirections =
          card.find('button[data-value="Directions"]').length > 0;
        const directionsUrl =
          hasDirections && address
            ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
            : null;

        // ── Profile Image ─────────────────────────────────────────────────────
        const profileImage = card.find('img.Jn12ke').attr('src') || null;

        // ── Google Maps Link ──────────────────────────────────────────────────
        const googleMapsLink = card.find('a.hfpxzc').attr('href') || null;

        // ── Place ID ──────────────────────────────────────────────────────────
        const placeId = this.extractPlaceId(googleMapsLink);

        // ── Click ID ──────────────────────────────────────────────────────────
        const jslog = card.find('a.hfpxzc').attr('jslog');
        const { clickId, clickMetadata } = this.extractClickId(jslog);

        if (name) {
          leads.push({
            name,
            rating,
            reviewCount,
            category,
            address,
            openStatus,
            closeTime,
            contactNo,
            website,
            websiteWithUtm,
            utm_source: utm.utm_source ?? null,
            utm_medium: utm.utm_medium ?? null,
            utm_campaign: utm.utm_campaign ?? null,
            utm_content: utm.utm_content ?? null,
            utm_term: utm.utm_term ?? null,
            directionsUrl,
            profileImage,
            googleMapsLink,
            placeId,
            clickId,
            clickMetadata,
          });
        }
      } catch (err) {
        this.logger.warn(`Skipped a card: ${(err as Error).message}`);
      }
    });

    this.logger.log(`Parsed ${leads.length} leads`);
    return leads;
  }

  // =========================================================
  // EXPORT TO EXCEL
  // =========================================================
  async exportLeadsToExcel(
    leads: GoogleMapLead[],
    outputPath: string,
  ): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Google Maps Leads');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 35 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Review Count', key: 'reviewCount', width: 15 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Address', key: 'address', width: 50 },
      { header: 'Open Status', key: 'openStatus', width: 15 },
      { header: 'Close Time', key: 'closeTime', width: 20 },
      { header: 'Contact No', key: 'contactNo', width: 20 },
      { header: 'Website', key: 'website', width: 40 },
      { header: 'Website (with UTM)', key: 'websiteWithUtm', width: 80 },
      { header: 'UTM Source', key: 'utm_source', width: 20 },
      { header: 'UTM Medium', key: 'utm_medium', width: 20 },
      { header: 'UTM Campaign', key: 'utm_campaign', width: 25 },
      { header: 'UTM Content', key: 'utm_content', width: 20 },
      { header: 'UTM Term', key: 'utm_term', width: 20 },
      { header: 'Directions URL', key: 'directionsUrl', width: 45 },
      { header: 'Google Maps Link', key: 'googleMapsLink', width: 60 },
      { header: 'Place ID', key: 'placeId', width: 40 },
      { header: 'Click ID', key: 'clickId', width: 15 },
      { header: 'Click Metadata', key: 'clickMetadata', width: 50 },
      { header: 'Profile Image', key: 'profileImage', width: 45 },
    ];

    // ── Header row style ────────────────────────────────────
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 22;

    // ── UTM columns — dark green header ────────────────────
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ];
    utmKeys.forEach((key) => {
      const colLetter = sheet.getColumn(key).letter;
      sheet.getCell(`${colLetter}1`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF375623' },
      };
    });

    sheet.autoFilter = { from: 'A1', to: 'U1' };

    // ── Data rows with alternate shading ───────────────────
    leads.forEach((lead, index) => {
      const row = sheet.addRow(lead);
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' },
        };
      }
    });

    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    await workbook.xlsx.writeFile(outputPath);
    this.logger.log(`Excel exported -> ${outputPath}`);
    return outputPath;
  }

  // =========================================================
  // SAVE LEADS TO DATABASE
  // =========================================================
  async saveLeadsToDatabase(
    leads: GoogleMapLead[],
    location: string = 'Export',
    excelFileUrl: string = '',
  ): Promise<void> {
    try {
      const list = this.scrapedListRepository.create({
        name: `Scrape - ${location} - ${new Date().toISOString()}`,
        location: location,
        total_leads: leads.length,
        excel_file_url: excelFileUrl,
      });
      const savedList = await this.scrapedListRepository.save(list);

      const leadsToSave = this.scrapedLeadRepository.create(
        leads.map((lead) => ({
          scraped_list_id: savedList.id,
          name: lead.name,
          rating: lead.rating,
          review_count: lead.reviewCount,
          category: lead.category,
          address: lead.address,
          open_status: lead.openStatus,
          close_time: lead.closeTime,
          contact_no: lead.contactNo,
          website: lead.website,
          website_with_utm: lead.websiteWithUtm,
          utm_source: lead.utm_source,
          utm_medium: lead.utm_medium,
          utm_campaign: lead.utm_campaign,
          utm_content: lead.utm_content,
          utm_term: lead.utm_term,
          directions_url: lead.directionsUrl,
          profile_image: lead.profileImage,
          google_maps_link: lead.googleMapsLink,
          place_id: lead.placeId,
          click_id: lead.clickId,
          click_metadata: lead.clickMetadata,
        })),
      );

      await this.scrapedLeadRepository.save(leadsToSave, { chunk: 100 });
      this.logger.log(
        `Saved ScrapedList ID ${savedList.id} with ${leads.length} leads.`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to save leads to database: ${(err as Error).message}`,
      );
    }
  }

  // =========================================================
  // MAIN FUNCTION (CALL THIS)
  // =========================================================
  async parseHtmlToExcel(
    htmlPath: string,
    outputExcel?: string,
    utm: UtmConfig = DEFAULT_UTM,
  ): Promise<{ totalLeads: number; file: string }> {
    const leads = await this.parseLeadsFromFile(htmlPath, utm);

    const excelPath =
      outputExcel ||
      path.join(process.cwd(), `google_maps_leads_${Date.now()}.xlsx`);

    await this.exportLeadsToExcel(leads, excelPath);
    await this.saveLeadsToDatabase(leads, 'HTML File Import', excelPath);

    return { totalLeads: leads.length, file: excelPath };
  }

  // =========================================================
  // SCRAPE FROM RAW HTML STRING
  // =========================================================
  async scrapeHtmlToExcel(
    html: string,
    outputExcel?: string,
    utm: UtmConfig = DEFAULT_UTM,
    location: string = 'Direct HTML Scrape',
  ): Promise<{ totalLeads: number; file: string }> {
    const leads = await this.parseLeads(html, utm);

    const excelPath =
      outputExcel ||
      path.join(process.cwd(), `leads_export_${Date.now()}.xlsx`);

    await this.exportLeadsToExcel(leads, excelPath);
    await this.saveLeadsToDatabase(leads, location, excelPath);

    return { totalLeads: leads.length, file: excelPath };
  }

  // =========================================================
  // GET LISTS API HANDLERS
  // =========================================================
  async getAllScrapedLists(): Promise<ScrapedList[]> {
    return this.scrapedListRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async getScrapedListById(id: number): Promise<ScrapedList | null> {
    return this.scrapedListRepository.findOne({
      where: { id },
      relations: ['leads'],
    });
  }

  async deleteScrapedList(id: number): Promise<void> {
    const list = await this.scrapedListRepository.findOne({ where: { id } });
    if (!list) {
      throw new Error(`Scraped list with ID ${id} not found`);
    }
    await this.scrapedListRepository.remove(list);
    this.logger.log(`Deleted ScrapedList ID ${id}`);
  }
}