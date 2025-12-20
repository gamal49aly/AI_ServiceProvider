import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageParserService } from '../../services/image-parser.service';
import { MessageService } from 'primeng/api';
import {
  ParseImageResponseDto,
  ImageParserChat,
  ImageParserHistoryRow,
} from '../../models/image-parser.model';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

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
    DrawerModule,
    DividerModule,
    BadgeModule,
  ],
  providers: [MessageService],
  templateUrl: './image-parser.component.html',
  styleUrl: './image-parser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageParserComponent implements OnInit {
  private readonly service = inject(ImageParserService);
  private readonly messageService = inject(MessageService);

  // ==========================================
  // State & Properties
  // ==========================================
  uploadedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  extractionKeys = signal<string[]>(['']);
  isLoading = signal(false);
  parsedResult = signal<ParseImageResponseDto | null>(null);
  tableData = signal<any[]>([]);
  dynamicColumns = signal<string[]>([]);

  // Session & History State
  chats = signal<ImageParserChat[]>([]);
  history = signal<ImageParserHistoryRow[]>([]);
  selectedChatId = signal<string | null>(null);
  showHistoryDrawer = signal(false);
  isLoadingHistory = signal(false);

  activeChat = computed(() => {
    const id = this.selectedChatId();
    if (!id) return null;
    return this.chats().find((c) => c.id === id) || null;
  });

  validKeys = computed(() =>
    this.extractionKeys()
      .filter((k) => k.trim() !== '')
      .join(',')
  );

  formattedJson = computed(() => {
    const raw = this.parsedResult()?.parsedData;
    if (!raw) return '';

    try {
      // Use the existing cleaning logic
      const cleaned = this.cleanJsonString(raw);
      const parsed = JSON.parse(cleaned);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Fallback to raw if parsing fails
      return raw;
    }
  });

  // ==========================================
  // Lifecycle Hooks
  // ==========================================
  ngOnInit(): void {
    this.loadChats();
  }

  // ==========================================
  // Session & Chat Management
  // ==========================================
  loadChats(): void {
    this.service.getChats().subscribe({
      next: (chats) => this.chats.set(chats),
      error: (err) => console.error('Error loading chats:', err),
    });
  }

  selectChat(chatId: string): void {
    this.selectedChatId.set(chatId);
    this.showHistoryDrawer.set(false);
    this.loadHistory(chatId);
  }

  createNewSession(): void {
    this.service.createSession().subscribe({
      next: (chat) => {
        const chatId = chat?.id;
        if (chatId) {
          this.selectedChatId.set(chatId);
          this.loadChats(); // Refresh list to show new session
          this.history.set([]);
          this.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'New Session',
            detail: 'Started a fresh image parsing session.',
          });
        }
      },
      error: (err) => {
        console.error('Error creating session:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Session Error',
          detail: 'Failed to create a new session.',
        });
      },
    });
  }

  // ==========================================
  // History Management
  // ==========================================
  loadHistory(chatId: string): void {
    this.isLoadingHistory.set(true);
    this.service.getHistory(chatId).subscribe({
      next: (history) => {
        this.history.set(history);
        this.isLoadingHistory.set(false);
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoadingHistory.set(false);
      },
    });
  }

  viewHistoryRecord(record: ImageParserHistoryRow): void {
    // Populate UI with historical record
    this.imagePreview.set(record.imageUrl);
    this.extractionKeys.set(
      record.jsonSchema ? record.jsonSchema.split(',') : ['']
    );
    this.parsedResult.set({
      inputId: record.inputId,
      parsedData: record.parsedData || '',
    });

    if (record.parsedData) {
      this.parseAndConvertToTable(record.parsedData);
    } else {
      this.tableData.set([]);
    }
  }

  // ==========================================
  // File & UI Event Handlers
  // ==========================================
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

  clear(): void {
    this.uploadedFile.set(null);
    this.imagePreview.set(null);
    this.parsedResult.set(null);
    this.tableData.set([]);
    this.extractionKeys.set(['']);
    this.history.set([]);
  }

  // ==========================================
  // Image Processing Logic
  // ==========================================
  processImage() {
    const file = this.uploadedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.parsedResult.set(null);
    this.tableData.set([]);

    if (this.selectedChatId()) {
      this.executeParse(this.selectedChatId()!, file);
    } else {
      this.service.createSession().subscribe({
        next: (chat) => {
          const chatId = chat?.id;
          if (!chatId) {
            this.handleSessionError();
            return;
          }
          this.selectedChatId.set(chatId);
          this.loadChats(); // Refresh list
          this.executeParse(chatId, file);
        },
        error: (err) => {
          console.error('Session Error:', err);
          this.handleErrorWithMockData();
        },
      });
    }
  }

  private executeParse(chatId: string, file: File): void {
    this.service.parseImage(chatId, file, this.validKeys()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.parsedResult.set(res);

        if (res.parsedData) {
          this.parseAndConvertToTable(res.parsedData);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image analyzed successfully.',
        });

        // Refresh history for current chat
        this.loadHistory(chatId);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.handleErrorWithMockData();
      },
    });
  }

  private handleSessionError(): void {
    console.error('No Chat ID found in session response');
    this.isLoading.set(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Session Error',
      detail: 'Could not create a valid session.',
    });
  }

  // ==========================================
  // Parsing & Data Conversion Helpers
  // ==========================================
  private parseAndConvertToTable(parsedData: string): void {
    console.log('Raw parsed data:', parsedData);
    const cleanedData = this.cleanJsonString(parsedData);
    console.log('Cleaned data:', cleanedData);

    try {
      const data: any = JSON.parse(cleanedData);
      this.processParsedObject(data);
    } catch (error) {
      console.log('Parsing as raw text instead of JSON');
      this.tableData.set([]);
    }
  }

  private processParsedObject(data: any): void {
    let listData: any[] | null = null;

    if (Array.isArray(data)) {
      listData = data;
    } else if (data.items && Array.isArray(data.items)) {
      listData = data.items;
    } else if (data.data && Array.isArray(data.data)) {
      listData = data.data;
    } else if (
      data.extracted_info &&
      Array.isArray(data.extracted_info.items)
    ) {
      listData = data.extracted_info.items;
    }

    if (listData && listData.length > 0) {
      const firstItem = listData[0];
      this.dynamicColumns.set(Object.keys(firstItem));
      this.tableData.set(listData);
    } else if (typeof data === 'object' && data !== null) {
      this.dynamicColumns.set(['Field', 'Value']);
      const keyValuePairs = Object.entries(data).map(([key, value]) => ({
        Field: key,
        Value: typeof value === 'object' ? JSON.stringify(value) : value,
      }));
      this.tableData.set(keyValuePairs);
    }
  }

  private cleanJsonString(str: string): string {
    if (!str) return '';
    // Remove markdown code blocks if present
    let cleaned = str.replace(/```json\n?|```/g, '').trim();
    // Also remove any leading/trailing non-json characters (like conversational text)
    const jsonStart = cleaned.indexOf('{');
    const jsonArrayStart = cleaned.indexOf('[');

    let startIndex = -1;
    if (jsonStart !== -1 && jsonArrayStart !== -1) {
      startIndex = Math.min(jsonStart, jsonArrayStart);
    } else {
      startIndex = jsonStart !== -1 ? jsonStart : jsonArrayStart;
    }

    if (startIndex !== -1) {
      const lastBracket = cleaned.lastIndexOf('}');
      const lastArrayBracket = cleaned.lastIndexOf(']');
      const endIndex = Math.max(lastBracket, lastArrayBracket);

      if (endIndex !== -1 && endIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
      }
    }

    return cleaned;
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

    const headers = this.dynamicColumns();
    const csvRows = [
      headers.join(','),
      ...items.map((item: any) =>
        headers
          .map((header) => {
            const val = item[header];
            return typeof val === 'string'
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          })
          .join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: `Exported ${items.length} items to CSV.`,
    });
  }

  // ==========================================
  // Error Handling & Mock Data
  // ==========================================
  private handleErrorWithMockData(): void {
    console.warn('Backend issue, showing mock data...');
    setTimeout(() => {
      this.isLoading.set(false);

      const mockData = this.generateMockData();
      const mockResult: ParseImageResponseDto = {
        inputId: 'mock-id-' + Math.random().toString(36).substring(2, 11),
        parsedData: JSON.stringify(
          {
            title: 'GENERAL PURPOSE PARSER',
            status: 'Server having difficulty',
            capabilities: 'HANDLES ANY IMAGE DATA',
          },
          null,
          2
        ),
      };

      this.parsedResult.set(mockResult);
      this.dynamicColumns.set(['Field', 'Value']);
      this.tableData.set(mockData);

      this.messageService.add({
        severity: 'warn',
        summary: 'Dev Mode',
        detail: 'Server error, showing mock data.',
      });
    }, 1500);
  }

  private generateMockData(): any[] {
    return [
      { Field: 'status', Value: 'Server having difficulty' },
      { Field: 'title', Value: 'GENERAL PURPOSE PARSER' },
      { Field: 'capabilities', Value: 'HANDLES ANY IMAGE DATA' },
    ];
  }
}
