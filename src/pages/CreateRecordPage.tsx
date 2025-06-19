
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { recordService } from '@/services/recordService';
import { CreateRecordData } from '@/types/record';
import Header from '@/components/layout/Header';
import RecordForm from '@/components/records/RecordForm';
import { toast } from '@/hooks/use-toast';

const CreateRecordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateRecordData) => {
    try {
      await recordService.createRecord(data);
      toast({
        title: "Success",
        description: "Record created successfully!",
      });
      navigate('/records');
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleCancel = () => {
    navigate('/records');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Record</h2>
          <p className="text-gray-600 mt-1">
            Add a new property record to the system
          </p>
        </div>

        <RecordForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          title="New Record"
          submitButtonText="Create Record"
        />
      </div>
    </div>
  );
};

export default CreateRecordPage;
