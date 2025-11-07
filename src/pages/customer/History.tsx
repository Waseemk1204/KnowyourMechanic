import React, { useState } from 'react';
import { useJob, Job } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { JobItem } from '../../components/JobItem';
import { JobDetailsModal } from '../../components/JobDetailsModal';
import { CustomerApprovalModal } from '../../components/CustomerApprovalModal';
import { useToast } from '../../context/ToastContext';
import { SearchIcon, FilterIcon, CheckCircleIcon, QrCodeIcon } from 'lucide-react';
export const CustomerHistory: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    jobs,
    getCustomerJobs,
    updateJobStatus,
    approveJob
  } = useJob();
  const {
    showToast
  } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  const customerJobs = user ? getCustomerJobs(user.id) : [];
  // Filter jobs based on search term and status filter
  const filteredJobs = customerJobs.filter(job => {
    const matchesSearch = searchTerm === '' || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.garageName?.toLowerCase().includes(searchTerm.toLowerCase()) || job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Sort jobs by date (newest first)
  const sortedJobs = [...filteredJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };
  const handleApproveJob = async (jobId: string) => {
    if (!user?.id) return;
    try {
      await approveJob(jobId, user.id);
      showToast('Questionnaire approved successfully!', 'success');
    } catch (error) {
      showToast('Failed to approve questionnaire. Please try again.', 'error');
    }
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <button onClick={() => setIsApprovalModalOpen(true)} className="bg-[#F2A900] hover:bg-[#E09800] text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <QrCodeIcon className="h-5 w-5" />
          <span>Scan Questionnaire</span>
        </button>
      </div>
      {/* Search and Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input type="text" placeholder="Search by description, garage or job ID..." className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">Status:</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter('all')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'all' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              All
            </button>
            <button onClick={() => setStatusFilter('pending_approval')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'pending_approval' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              Awaiting Approval
            </button>
            <button onClick={() => setStatusFilter('approved')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              Approved
            </button>
            <button onClick={() => setStatusFilter('paid')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              Paid
            </button>
            <button onClick={() => setStatusFilter('completed')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'completed' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              Completed
            </button>
          </div>
        </div>
      </div>
      {/* Job List */}
      <div className="space-y-4">
        {sortedJobs.length > 0 ? sortedJobs.map(job => <JobItem key={job.id} job={job} userRole="customer" onViewDetails={handleViewDetails} />) : <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No bookings found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm || statusFilter !== 'all' ? 'No bookings match your current filters' : "You haven't made any bookings yet"}
            </p>
            {(searchTerm || statusFilter !== 'all') && <button onClick={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }} className="mt-4 text-[#F2A900] hover:underline">
                Clear filters
              </button>}
          </div>}
      </div>
      {/* Job Details Modal */}
      <JobDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} job={selectedJob} onApprove={handleApproveJob} />
      {/* Customer Approval Modal */}
      <CustomerApprovalModal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} customerId={user?.id || ''} />
    </div>;
};