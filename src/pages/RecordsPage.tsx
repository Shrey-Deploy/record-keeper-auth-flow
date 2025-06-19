
import React, { useState, useEffect } from 'react';
import { useNavig ate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { recordService } from '@/services/recordService';
import { Record } from '@/types/record';
import Header from '@/components/layout/Header';
import RecordCard from '@/components/records/RecordCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const RecordsPage: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchRecords = async (query = '', page = 1) => {
    setLoading(true);
    try {
      const response = await recordService.getRecords(query, page, pageSize);
      setRecords(response.records);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleRecordClick = async (record: Record) => {
    try {
      if (record.locked_by && record.locked_by !== user?.id) {
        toast({
          title: "Record Locked",
          description: "This record is currently locked by another user",
          variant: "destructive",
        });
        return;
      }

      // Try to lock the record
      await recordService.lockRecord(record.id, user?.id || '');
      navigate(`/records/${record.id}/edit`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to lock record. It may be locked by another user.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords(searchQuery, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Records</h2>
            <p className="text-gray-600 mt-1">
              {total} {total === 1 ? 'record' : 'records'} found
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/records/create')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Record
          </Button>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <Input
              type="text"
              placeholder="Search by address, borrower name, or APN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button 
              type="submit"
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first record'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/records/create')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Record
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onClick={handleRecordClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => handlePageChange(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecordsPage;
