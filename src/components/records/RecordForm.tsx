
import React, { useState, useEffect } from 'react';
import { Record, CreateRecordData } from '@/types/record';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface RecordFormProps {
  record?: Record;
  onSubmit: (data: CreateRecordData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
  submitButtonText: string;
}

const RecordForm: React.FC<RecordFormProps> = ({
  record,
  onSubmit,
  onCancel,
  isLoading = false,
  title,
  submitButtonText,
}) => {
  const [formData, setFormData] = useState<CreateRecordData>({
    property_address: '',
    transaction_date: '',
    borrower_name: '',
    loan_officer_name: '',
    nmls_id: '',
    loan_amount: 0,
    sales_price: 0,
    down_payment: 0,
    loan_term: 30,
    apn: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        property_address: record.property_address,
        transaction_date: record.transaction_date,
        borrower_name: record.borrower_name,
        loan_officer_name: record.loan_officer_name || '',
        nmls_id: record.nmls_id || '',
        loan_amount: record.loan_amount,
        sales_price: record.sales_price,
        down_payment: record.down_payment,
        loan_term: record.loan_term || 30,
        apn: record.apn,
        status: record.status,
      });
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.property_address.trim()) {
      toast({
        title: "Error",
        description: "Property address is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.borrower_name.trim()) {
      toast({
        title: "Error",
        description: "Borrower name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.apn.trim()) {
      toast({
        title: "Error",
        description: "APN is required",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.loan_amount <= 0) {
      toast({
        title: "Error",
        description: "Loan amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.sales_price <= 0) {
      toast({
        title: "Error",
        description: "Sales price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save record",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CreateRecordData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property_address" className="text-sm font-medium text-gray-700">
                Property Address *
              </Label>
              <Input
                id="property_address"
                type="text"
                value={formData.property_address}
                onChange={(e) => handleInputChange('property_address', e.target.value)}
                placeholder="123 Main St, City, State ZIP"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_date" className="text-sm font-medium text-gray-700">
                Transaction Date *
              </Label>
              <Input
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="borrower_name" className="text-sm font-medium text-gray-700">
                Borrower Name *
              </Label>
              <Input
                id="borrower_name"
                type="text"
                value={formData.borrower_name}
                onChange={(e) => handleInputChange('borrower_name', e.target.value)}
                placeholder="John Doe"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_officer_name" className="text-sm font-medium text-gray-700">
                Loan Officer Name
              </Label>
              <Input
                id="loan_officer_name"
                type="text"
                value={formData.loan_officer_name}
                onChange={(e) => handleInputChange('loan_officer_name', e.target.value)}
                placeholder="Sarah Johnson"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nmls_id" className="text-sm font-medium text-gray-700">
                NMLS ID
              </Label>
              <Input
                id="nmls_id"
                type="text"
                value={formData.nmls_id}
                onChange={(e) => handleInputChange('nmls_id', e.target.value)}
                placeholder="NMLS123456"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apn" className="text-sm font-medium text-gray-700">
                APN *
              </Label>
              <Input
                id="apn"
                type="text"
                value={formData.apn}
                onChange={(e) => handleInputChange('apn', e.target.value)}
                placeholder="APN-001-234-567"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_amount" className="text-sm font-medium text-gray-700">
                Loan Amount *
              </Label>
              <Input
                id="loan_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.loan_amount}
                onChange={(e) => handleInputChange('loan_amount', parseFloat(e.target.value) || 0)}
                placeholder="450000"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales_price" className="text-sm font-medium text-gray-700">
                Sales Price *
              </Label>
              <Input
                id="sales_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.sales_price}
                onChange={(e) => handleInputChange('sales_price', parseFloat(e.target.value) || 0)}
                placeholder="500000"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="down_payment" className="text-sm font-medium text-gray-700">
                Down Payment *
              </Label>
              <Input
                id="down_payment"
                type="number"
                min="0"
                step="0.01"
                value={formData.down_payment}
                onChange={(e) => handleInputChange('down_payment', parseFloat(e.target.value) || 0)}
                placeholder="50000"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_term" className="text-sm font-medium text-gray-700">
                Loan Term (years)
              </Label>
              <Input
                id="loan_term"
                type="number"
                min="1"
                max="50"
                value={formData.loan_term}
                onChange={(e) => handleInputChange('loan_term', parseInt(e.target.value) || 30)}
                placeholder="30"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Pending' | 'Verified' | 'Flagged') => handleInputChange('status', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : submitButtonText}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecordForm;
