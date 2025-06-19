
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { recordService } from '@/services/recordService';
import { Record, CreateRecordData } from '@/types/record';
import Header from '@/components/layout/Header';
import RecordForm from '@/components/records/RecordForm';
import { toast } from '@/hooks/use-toast';

const EditRecordPage: React.FC = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) {
        navigate('/records');
        return;
      }

      try {
        const fetchedRecord = await recordService.getRecord(id);
        if (!fetchedRecord) {
          toast({
            title: "Error",
            description: "Record not found",
            variant: "destructive",
          });
          navigate('/records');
          return;
        }

        // Check if record is locked by another user
        if (fetchedRecord.locked_by && fetchedRecord.locked_by !== user?.id) {
          toast({
            title: "Record Locked",
            description: "This record is currently locked by another user",
            variant: "destructive",
          });
          navigate('/records');
          return;
        }

        setRecord(fetchedRecord);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch record",
          variant: "destructive",
        });
        navigate('/records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate, user?.id]);

  const handleSubmit = async (data: CreateRecordData) => {
    if (!id) return;

    try {
      await recordService.updateRecord(id, data);
      // Unlock the record after successful update
      await recordService.unlockRecord(id);
      toast({
        title: "Success",
        description: "Record updated successfully!",
      });
      navigate('/records');
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleCancel = async () => {
    if (id && record?.locked_by === user?.id) {
      try {
        await recordService.unlockRecord(id);
      } catch (error) {
        console.error('Failed to unlock record:', error);
      }
    }
    navigate('/records');
  };

  // Cleanup: unlock record when component unmounts
  useEffect(() => {
    return () => {
      if (id && record?.locked_by === user?.id) {
        recordService.unlockRecord(id).catch(console.error);
      }
    };
  }, [id, record?.locked_by, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Edit Record</h2>
          <p className="text-gray-600 mt-1">
            Update the property record information
          </p>
        </div>

        <RecordForm
          record={record}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          title="Edit Record"
          submitButtonText="Update Record"
        />
      </div>
    </div>
  );
};

export default EditRecordPage;
