/** Minimal CSV parser supporting quotes and commas. */
export function parseCsv(text: string): Array<Record<string, string>> {
  const rows = splitCsvRows(text);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0]!.map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (!header) {
        return;
      }
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  }).filter((row) => Object.values(row).some((value) => value.length > 0));
}

function splitCsvRows(text: string): string[][] {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]!;
    const next = normalized[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((item) => item.some((value) => value.trim().length > 0));
}

export const LISTINGS_CSV_TEMPLATE = `name,phone,email,company,city,nature,category,service,status
Rajesh Patel,9876543210,rajesh@example.com,SafeGuard Fire,Ahmedabad,Manufacture,Fire Extinguisher,ABC extinguisher supply,approved
Amit Sharma,9123456780,,Delhi Fire Alarms,Delhi,Fire Contractor,Fire Alarm,Alarm installation,pending
`;
