import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageParserService } from '../../services/image-parser.service';
import { MessageService } from 'primeng/api';
import { IParseImageResponse } from '../../models/image-parser.model';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';

interface ExtractedItem {
  product: string;
  price: number;
  quantity: number;
  total?: number;
  upc?: string;
  category?: string;
}

@Component({
  selector: 'app-image-parser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    TooltipModule,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './image-parser.component.html',
  styleUrl: './image-parser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageParserComponent {
  private readonly service = inject(ImageParserService);
  private readonly messageService = inject(MessageService);

  uploadedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  extractionKeys = signal<string[]>(['']);
  isLoading = signal(false);
  parsedResult = signal<IParseImageResponse | null>(null);
  tableData = signal<ExtractedItem[]>([]);

  validKeys = computed(() =>
    this.extractionKeys()
      .filter((k) => k.trim() !== '')
      .join(',')
  );

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  addKeyInput() {
    this.extractionKeys.update((keys) => [...keys, '']);
  }

  onKeyInput(index: number, value: string) {
    this.extractionKeys.update((keys) => {
      const newKeys = [...keys];
      newKeys[index] = value;
      return newKeys;
    });

    if (index === this.extractionKeys().length - 1 && value.trim().length > 0) {
      this.addKeyInput();
    }
  }

  removeKey(index: number) {
    if (this.extractionKeys().length === 1) {
      this.extractionKeys.set(['']);
      return;
    }
    this.extractionKeys.update((keys) => keys.filter((_, i) => i !== index));
  }

  clearAllKeys() {
    this.extractionKeys.set(['']);
  }

  processImage() {
    const file = this.uploadedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.parsedResult.set(null);
    this.tableData.set([]);

    this.service.createSession().subscribe({
      next: (chat) => {
        const chatId = chat?.id || chat?.ChatId;
        if (!chatId) {
          console.error('No Chat ID found in session response:', chat);
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Session Error',
            detail: 'Could not create a valid session.',
          });
          return;
        }

        this.service.parseImage(chatId, file, this.validKeys()).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.parsedResult.set(res);
            
            // Parse the result and convert to table data
            if (res.parsedData) {
              this.parseAndConvertToTable(res.parsedData);
            }
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Image analyzed successfully.',
            });
          },
          error: (err) => {
            console.error('API Error:', err);
            this.handleErrorWithMockData();
          },
        });
      },
      error: (err) => {
        console.error('Session Error:', err);
        this.handleErrorWithMockData();
      },
    });
  }

  private parseAndConvertToTable(parsedData: string): void {
    console.log('Raw parsed data:', parsedData);
    
    try {
      // Try to parse as JSON first
      const data: any = JSON.parse(parsedData);
      
      let items: ExtractedItem[] = [];
      
      // Check different JSON structures
      if (Array.isArray(data)) {
        items = data.map((item: any) => this.mapToExtractedItem(item));
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items.map((item: any) => this.mapToExtractedItem(item));
      } else if (data.products && Array.isArray(data.products)) {
        items = data.products.map((item: any) => this.mapToExtractedItem(item));
      } else if (data.extracted_info && data.extracted_info.items) {
        items = data.extracted_info.items.map((item: any) => this.mapToExtractedItem(item));
      } else if (data.AllText) {
        // If it has AllText property (from the screenshot), parse it
        items = this.parseWalmartReceiptText(data.AllText);
      }
      
      // If JSON parsing didn't yield results, try parsing as raw text
      if (items.length === 0) {
        items = this.parseWalmartReceiptText(parsedData);
      }
      
      this.tableData.set(items);
      console.log('Parsed items:', items);
      
    } catch (error) {
      console.log('Parsing as raw text instead of JSON');
      // If not valid JSON, parse as raw text
      const items = this.parseWalmartReceiptText(parsedData);
      this.tableData.set(items);
    }
  }

  private mapToExtractedItem(data: any): ExtractedItem {
    return {
      product: data.product || data.name || data.item || 'Unknown Product',
      price: data.price || data.Price || data.unitPrice || 0,
      quantity: data.quantity || data.qty || data.count || 1,
      total: data.total || data.Total || (data.price && data.quantity ? data.price * data.quantity : undefined),
      upc: data.upc || data.UPC || data.barcode || data.barcodeNumber,
      category: data.category || data.type || this.determineCategory(data.product || '')
    };
  }

  private parseWalmartReceiptText(text: string): ExtractedItem[] {
    const items: ExtractedItem[] = [];
    const lines = text.split('\n');
    
    console.log('Parsing Walmart receipt text, lines:', lines.length);
    
    lines.forEach((line: string, index: number) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Skip header lines and store info
      if (trimmedLine.includes('Walmart') || 
          trimmedLine.includes('Save money') ||
          trimmedLine.includes('BLUEBELL') ||
          trimmedLine.includes('PHILADELPHIA') ||
          trimmedLine.includes('STE') ||
          trimmedLine.includes('OPE') ||
          trimmedLine.includes('TEE')) {
        return;
      }
      
      // Try to parse Walmart receipt item patterns
      // Pattern 1: "PET TOY 084747571658 1.97 X"
      // Pattern 2: "TLOPPY PUPPY 004747516946 1.97 X"
      // Pattern 3: "2.5 SQUALK 0646908588 5.92 X"
      // Pattern 4: "HRYPID SPORES 088491226837 F 3.08 O"
      
      const item = this.parseWalmartLine(trimmedLine, index);
      if (item) {
        items.push(item);
      }
    });
    
    // If no items found with pattern matching, try to extract any product-price combinations
    if (items.length === 0) {
      this.extractProductPricePairs(text, items);
    }
    
    return items;
  }

  private parseWalmartLine(line: string, index: number): ExtractedItem | null {
    // Remove any leading/trailing spaces and normalize
    const cleanLine = line.trim();
    
    // Pattern for: PRODUCT UPC PRICE X (or other quantity indicator)
    const pattern1 = /^([A-Z\s\.]+?)\s+(\d{10,14})\s+([\d\.]+)\s*([A-Z])?$/;
    const match1 = cleanLine.match(pattern1);
    
    if (match1) {
      const [, product, upc, priceStr, quantityIndicator] = match1;
      const price = parseFloat(priceStr);
      let quantity = 1;
      
      // Parse quantity from indicator
      if (quantityIndicator === 'X') {
        quantity = 1;
      } else if (!isNaN(parseFloat(quantityIndicator))) {
        quantity = parseFloat(quantityIndicator);
      }
      
      return {
        product: product.trim(),
        price: price,
        quantity: quantity,
        total: price * quantity,
        upc: upc,
        category: this.determineCategory(product)
      };
    }
    
    // Pattern for: PRODUCT PRICE X (no UPC)
    const pattern2 = /^([A-Z\s\.]+?)\s+([\d\.]+)\s*([A-Z])?$/;
    const match2 = cleanLine.match(pattern2);
    
    if (match2) {
      const [, product, priceStr, quantityIndicator] = match2;
      const price = parseFloat(priceStr);
      let quantity = 1;
      
      if (quantityIndicator === 'X') {
        quantity = 1;
      } else if (!isNaN(parseFloat(quantityIndicator))) {
        quantity = parseFloat(quantityIndicator);
      }
      
      return {
        product: product.trim(),
        price: price,
        quantity: quantity,
        total: price * quantity,
        category: this.determineCategory(product)
      };
    }
    
    // Pattern for: NUMBER PRODUCT PRICE X (e.g., "2.5 SQUALK 5.92 X")
    const pattern3 = /^([\d\.]+)\s+([A-Z\s]+?)\s+([\d\.]+)\s*([A-Z])?$/;
    const match3 = cleanLine.match(pattern3);
    
    if (match3) {
      const [, quantityStr, product, priceStr] = match3;
      const quantity = parseFloat(quantityStr);
      const price = parseFloat(priceStr);
      
      return {
        product: product.trim(),
        price: price,
        quantity: quantity,
        total: price * quantity,
        category: this.determineCategory(product)
      };
    }
    
    // Try to extract any product and price from the line
    const priceMatch = cleanLine.match(/(\d+\.\d{2})/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      const product = cleanLine.replace(priceMatch[0], '').replace(/\d{10,14}/g, '').trim();
      
      if (product && product.length > 2) {
        return {
          product: product,
          price: price,
          quantity: 1,
          total: price,
          category: this.determineCategory(product)
        };
      }
    }
    
    return null;
  }

  private extractProductPricePairs(text: string, items: ExtractedItem[]): void {
    // Try to find product-price patterns in the text
    const lines = text.split('\n');
    
    lines.forEach((line: string) => {
      const words = line.split(/\s+/);
      
      for (let i = 0; i < words.length - 1; i++) {
        // Look for price patterns ($XX.XX or XX.XX)
        const priceMatch = words[i].match(/^(\d+\.\d{2})$/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          
          // Look backward for product name
          let product = '';
          for (let j = Math.max(0, i - 3); j < i; j++) {
            if (words[j].length > 2 && !words[j].match(/^\d/)) {
              product += words[j] + ' ';
            }
          }
          
          if (product.trim()) {
            items.push({
              product: product.trim(),
              price: price,
              quantity: 1,
              total: price,
              category: this.determineCategory(product)
            });
          }
        }
      }
    });
  }

  private determineCategory(product: string): string {
    const lowerProduct = product.toLowerCase();
    
    if (lowerProduct.includes('toy') || lowerProduct.includes('puppy')) return 'Toys';
    if (lowerProduct.includes('pet')) return 'Pet Supplies';
    if (lowerProduct.includes('food') || lowerProduct.includes('eat')) return 'Food';
    if (lowerProduct.includes('fruit') || lowerProduct.includes('orange')) return 'Produce';
    if (lowerProduct.includes('vegetable') || lowerProduct.includes('carrot')) return 'Produce';
    if (lowerProduct.includes('spores') || lowerProduct.includes('cleaning')) return 'Household';
    if (lowerProduct.includes('calzone')) return 'Frozen Food';
    if (lowerProduct.includes('dairy')) return 'Dairy';
    
    return 'General Merchandise';
  }

  private generateMockWalmartData(): ExtractedItem[] {
    return [
      { product: 'PET TOY', price: 1.97, quantity: 1, total: 1.97, category: 'Pet Supplies' },
      { product: 'TLOPPY PUPPY', price: 1.97, quantity: 1, total: 1.97, category: 'Toys' },
      { product: 'SSSUPPEE S', price: 4.97, quantity: 1, total: 4.97, category: 'General Merchandise' },
      { product: 'SQUALK', price: 5.92, quantity: 2.5, total: 14.80, category: 'General Merchandise' },
      { product: 'WUKTY DWEE', price: 2.77, quantity: 1, total: 2.77, category: 'General Merchandise' },
      { product: 'DOF TEEAT', price: 2.92, quantity: 1, total: 2.92, category: 'Food' },
      { product: 'PED PCI 1', price: 0.50, quantity: 2, total: 1.00, category: 'Electronics' },
      { product: 'HRYPID SPORES', price: 3.08, quantity: 1, total: 3.08, category: 'Household' },
      { product: 'TRENCI DENSING', price: 1.98, quantity: 1, total: 1.98, category: 'Household' },
      { product: 'ORANGES', price: 5.47, quantity: 3, total: 16.41, category: 'Produce' },
      { product: 'CARROTS', price: 1.48, quantity: 1, total: 1.48, category: 'Produce' },
      { product: 'COLLARDS', price: 1.24, quantity: 1, total: 1.24, category: 'Produce' },
      { product: 'CALZONE', price: 0.00, quantity: 1, total: 0.00, category: 'Frozen Food' },
    ];
  }

  private handleErrorWithMockData(): void {
    console.warn('Backend issue, showing mock data...');
    setTimeout(() => {
      this.isLoading.set(false);
      
      const mockItems = this.generateMockWalmartData();
      const mockResult: IParseImageResponse = {
        inputId: 'mock-id-' + Math.random().toString(36).substring(2, 11),
        parsedData: JSON.stringify({
          AllText: "Walmart\nSave money. Live better.\n( 398 ) 399 - 399]\nWANDER DIANA EARNEST\n231 BLUEBELL DR SM\nEM PHILADELPHIA ON 44663\nSTE 02135 OPE 000044 TEE 44 TEE 61361\nPET TOY 084747571658 1.97 X\nTLOPPY PUPPY 004747516946 1.97 X\nSSSUPPEE S 079080312053 4.97 X\n2.5 SQUALK 0646908588 5.92 X\nWUKTY DWEE 068111108795 2.77 X\nDOF TEEAT 007110913654 2.92 X\nPED PCI 1 002318011802 0.50 X\nPED PCI 1 002318011802 0.50 X\nCUIDV 23100 052330937090 1.00-O\nHRYPID SPORES 088491226837 F 3.08 O\nTRENCI DENSING 004112100655 F 1.98 O\n3 ORANGES 001466835001 F 5.47 N\nCARROTS 00338506602 T 1.48 N\nCOLLARDS 000000004514X1 1.24 N\nCALZONE 005208362080 F",
          extracted_info: {
            items: mockItems
          }
        }, null, 2)
      };
      
      this.parsedResult.set(mockResult);
      this.tableData.set(mockItems);

      this.messageService.add({
        severity: 'warn',
        summary: 'Dev Mode',
        detail: 'Server error, showing mock data.',
      });
    }, 1500);
  }

  clear(): void {
    this.uploadedFile.set(null);
    this.imagePreview.set(null);
    this.parsedResult.set(null);
    this.tableData.set([]);
    this.extractionKeys.set(['']);
  }

  copyToClipboard(): void {
    const result = this.parsedResult()?.parsedData;
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Copied',
          detail: 'JSON result copied to clipboard.',
        });
      });
    }
  }

  exportToCSV(): void {
    const items = this.tableData();
    if (items.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No table data to export.',
      });
      return;
    }

    const headers = ['Product', 'Price', 'Quantity', 'Total', 'Category', 'UPC'];
    const csvRows = [
      headers.join(','),
      ...items.map((item: ExtractedItem) => [
        `"${item.product.replace(/"/g, '""')}"`,
        item.price.toFixed(2),
        item.quantity,
        item.total ? item.total.toFixed(2) : (item.price * item.quantity).toFixed(2),
        item.category || 'N/A',
        item.upc || 'N/A'
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walmart-receipt-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: `Exported ${items.length} items to CSV.`,
    });
  }

  manuallyConvertToTable(): void {
    const result = this.parsedResult();
    if (!result?.parsedData) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No parsed data available to convert.',
      });
      return;
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Converting',
      detail: 'Attempting to convert text to table format...',
    });
    
    this.parseAndConvertToTable(result.parsedData);
    
    if (this.tableData().length > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Converted ${this.tableData().length} items to table format.`,
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Items Found',
        detail: 'Could not extract table items from the data.',
      });
    }
  }
}