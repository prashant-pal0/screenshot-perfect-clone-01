const fs = require('fs');
const ExcelJS = require('exceljs');

async function checkExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('test_output.xlsx');
  const sheet = workbook.getWorksheet('Google Maps Leads');
  
  console.log('Row count (including header):', sheet.rowCount);
  const row2 = sheet.getRow(2);
  console.log('Row 2 Name:', row2.getCell(1).value);
  console.log('Row 2 Rating:', row2.getCell(2).value);
  console.log('Row 2 Category:', row2.getCell(4).value);
}

checkExcel().catch(console.error);
