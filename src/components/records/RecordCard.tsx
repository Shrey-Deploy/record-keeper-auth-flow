
import React from 'react';
import { Record } from '@/types/record';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface RecordCardProps {
  record: Record;
  onClick: (record: Record) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Flagged':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
      onClick={() => onClick(record)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {record.property_address}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Borrower: {record.borrower_name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {record.locked_by && (
              <Lock className="w-4 h-4 text-amber-500" />
            )}
            <Badge className={getStatusColor(record.status)}>
              {record.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Loan Amount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(record.loan_amount)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Sales Price</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(record.sales_price)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Transaction Date</p>
            <p className="font-medium text-gray-900">
              {new Date(record.transaction_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">APN</p>
            <p className="font-medium text-gray-900">{record.apn}</p>
          </div>
        </div>
        
        {record.loan_officer_name && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Loan Officer: <span className="text-gray-700 font-medium">{record.loan_officer_name}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordCard;
