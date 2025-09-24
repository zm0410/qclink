const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('data.xlsx');
const sheet_name_list = workbook.SheetNames;
const sheet = workbook.Sheets[sheet_name_list[0]];
const json_data = XLSX.utils.sheet_to_json(sheet);

fs.writeFileSync('data.json', JSON.stringify(json_data, null, 2));