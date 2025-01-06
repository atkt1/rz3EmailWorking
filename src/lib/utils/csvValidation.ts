import Papa from 'papaparse';

export async function validateCsvContent(content: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      complete: (results) => {
        try {
          const orderIds = results.data
            .flat()
            .filter(Boolean)
            .map(id => id.toString().trim());

          // Validate order IDs
          const invalidIds = orderIds.filter(id => !isValidOrderId(id));
          if (invalidIds.length > 0) {
            throw new Error(`Invalid order IDs found: ${invalidIds.join(', ')}`);
          }

          // Return all valid IDs, duplicates will be handled by the database
          resolve(orderIds);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`))
    });
  });
}

function isValidOrderId(orderId: string): boolean {
  // Add validation rules based on marketplace requirements
  return orderId.length >= 3 && orderId.length <= 30 && /^[A-Za-z0-9-]+$/.test(orderId);
}
