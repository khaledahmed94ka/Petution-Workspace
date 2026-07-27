/**
 * Utility functions for exporting and importing CSV and JSON data
 */

// Convert array of objects to CSV string and trigger browser download
export function exportToCSV(dataArray, filename = 'export.csv') {
  if (!dataArray || !dataArray.length) {
    alert('No data available to export.');
    return;
  }

  // Extract headers from all objects to cover varying keys
  const headersSet = new Set();
  dataArray.forEach(row => Object.keys(row).forEach(k => headersSet.add(k)));
  const headers = [...headersSet];
  
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of dataArray) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      // Escape double quotes
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\n'); // UTF-8 BOM for Excel compatibility
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Prevent memory leak
}

// Export complete system JSON backup
export function exportSystemBackupJSON(fullState, filename = 'petution_backup.json') {
  const jsonContent = JSON.stringify(fullState, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Prevent memory leak
}

// Parse CSV text into array of objects
export function parseCSVText(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  // Strip UTF-8 BOM if present
  let text = csvText.trim();
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.substring(1);
  }

  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split CSV line handling quoted fields with commas inside
    const cells = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (inQuotes) {
        if (ch === '"') {
          if (j + 1 < line.length && line[j + 1] === '"') {
            current += '"'; // Escaped double quote
            j++;
          } else {
            inQuotes = false; // End of quoted field
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          cells.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
    }
    cells.push(current.trim()); // Push last cell

    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = cells[index] !== undefined ? cells[index] : '';
    });

    results.push(obj);
  }

  return results;
}
