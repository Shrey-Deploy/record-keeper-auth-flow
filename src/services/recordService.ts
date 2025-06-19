
import { Record, CreateRecordData } from '@/types/record';

// Mock data for demonstration
const mockRecords: Record[] = [
  {
    id: '1',
    property_address: '123 Main St, Los Angeles, CA 90210',
    transaction_date: '2024-01-15',
    borrower_name: 'John Doe',
    loan_officer_name: 'Sarah Johnson',
    nmls_id: 'NMLS123456',
    loan_amount: 450000,
    sales_price: 500000,
    down_payment: 50000,
    loan_term: 30,
    apn: 'APN-001-234-567',
    status: 'Pending',
    entered_by: 'admin',
    entered_by_date: '2024-01-10T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    property_address: '456 Oak Ave, Beverly Hills, CA 90211',
    transaction_date: '2024-01-20',
    borrower_name: 'Jane Smith',
    loan_officer_name: 'Mike Wilson',
    nmls_id: 'NMLS789012',
    loan_amount: 750000,
    sales_price: 850000,
    down_payment: 100000,
    loan_term: 30,
    apn: 'APN-002-345-678',
    status: 'Verified',
    locked_by: 'user_123',
    lock_timestamp: '2024-01-22T14:30:00Z',
    entered_by: 'va_user',
    entered_by_date: '2024-01-18T09:00:00Z',
    reviewed_by: 'admin',
    reviewed_by_date: '2024-01-21T16:00:00Z',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-21T16:00:00Z',
  },
  {
    id: '3',
    property_address: '789 Pine Rd, Santa Monica, CA 90401',
    transaction_date: '2024-01-25',
    borrower_name: 'Robert Brown',
    loan_amount: 320000,
    sales_price: 400000,
    down_payment: 80000,
    apn: 'APN-003-456-789',
    status: 'Flagged',
    entered_by: 'va_user2',
    entered_by_date: '2024-01-23T11:00:00Z',
    created_at: '2024-01-23T11:00:00Z',
    updated_at: '2024-01-23T11:00:00Z',
  },
];

export const recordService = {
  async getRecords(query?: string, page = 1, pageSize = 10) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredRecords = mockRecords;
    
    if (query) {
      filteredRecords = mockRecords.filter(record =>
        record.property_address.toLowerCase().includes(query.toLowerCase()) ||
        record.borrower_name.toLowerCase().includes(query.toLowerCase()) ||
        record.apn.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
    
    return {
      records: paginatedRecords,
      total: filteredRecords.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredRecords.length / pageSize),
    };
  },

  async getRecord(id: string): Promise<Record | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecords.find(record => record.id === id) || null;
  },

  async createRecord(data: CreateRecordData): Promise<Record> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRecord: Record = {
      id: `record_${Date.now()}`,
      ...data,
      status: data.status || 'Pending',
      entered_by: 'current_user',
      entered_by_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockRecords.push(newRecord);
    return newRecord;
  },

  async updateRecord(id: string, data: Partial<Record>): Promise<Record> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const recordIndex = mockRecords.findIndex(record => record.id === id);
    if (recordIndex === -1) {
      throw new Error('Record not found');
    }
    
    mockRecords[recordIndex] = {
      ...mockRecords[recordIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return mockRecords[recordIndex];
  },

  async lockRecord(id: string, userId: string): Promise<Record> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const record = mockRecords.find(r => r.id === id);
    if (!record) {
      throw new Error('Record not found');
    }
    
    if (record.locked_by && record.locked_by !== userId) {
      throw new Error('Record is already locked by another user');
    }
    
    const recordIndex = mockRecords.findIndex(r => r.id === id);
    mockRecords[recordIndex] = {
      ...record,
      locked_by: userId,
      lock_timestamp: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return mockRecords[recordIndex];
  },

  async unlockRecord(id: string): Promise<Record> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const recordIndex = mockRecords.findIndex(r => r.id === id);
    if (recordIndex === -1) {
      throw new Error('Record not found');
    }
    
    mockRecords[recordIndex] = {
      ...mockRecords[recordIndex],
      locked_by: undefined,
      lock_timestamp: undefined,
      updated_at: new Date().toISOString(),
    };
    
    return mockRecords[recordIndex];
  },
};
