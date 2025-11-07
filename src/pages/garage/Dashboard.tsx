import React, { useState, createElement } from 'react';
import { useJob, Job } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { JobItem } from '../../components/JobItem';
import { JobDetailsModal } from '../../components/JobDetailsModal';
import { GarageQuestionnaireModal } from '../../components/GarageQuestionnaireModal';
import { useToast } from '../../context/ToastContext';
import { SearchIcon, FilterIcon, DownloadIcon, TrendingUpIcon, ClipboardCheckIcon, ClockIcon, StarIcon, PlusIcon, UserPlusIcon } from 'lucide-react';
export const GarageDashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    jobs,
    getGarageJobs,
    updateJobStatus,
    generateApprovalCode
  } = useJob();
  const {
    showToast
  } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newCustomer, setNewCustomer] = useState({
    id: `customer_${Date.now()}`,
    name: '',
    phone: ''
  });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const garageJobs = user ? getGarageJobs(user.id) : [];
  // Filter jobs based on search term and status filter
  const filteredJobs = garageJobs.filter(job => {
    const matchesSearch = searchTerm === '' || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.customerName && job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || job.customerPhoneMask.toLowerCase().includes(searchTerm.toLowerCase()) || job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    } else {
      // status
      const statusOrder = {
        pending_creation: 0,
        pending_approval: 1,
        approved: 2,
        paid: 3,
        completed: 4,
        disputed: 5
      };
      return sortOrder === 'desc' ? statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder] : statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
  });
  // Calculate KPIs
  const totalRequests = garageJobs.length;
  const paidJobs = garageJobs.filter(job => job.status === 'paid' || job.status === 'completed').length;
  const pendingJobs = garageJobs.filter(job => job.status === 'pending_creation' || job.status === 'pending_approval').length;
  const totalEarnings = garageJobs.filter(job => job.status === 'paid' || job.status === 'completed').reduce((sum, job) => sum + job.amount, 0);
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };
  const handleMarkCompleted = async (jobId: string) => {
    try {
      await updateJobStatus(jobId, 'completed');
      showToast('Job marked as completed!', 'success');
    } catch (error) {
      showToast('Failed to update job status. Please try again.', 'error');
    }
  };
  const handleGenerateBarcode = async (job: Job) => {
    try {
      await generateApprovalCode(job.id);
      showToast('Approval code generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate approval code. Please try again.', 'error');
    }
  };
  const handleGenerateBarcodeFromDetails = async (jobId: string) => {
    try {
      await generateApprovalCode(jobId);
      showToast('Approval code generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate approval code. Please try again.', 'error');
    }
  };
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Job ID', 'Customer', 'Description', 'Amount', 'Status', 'Created Date'];
    const rows = filteredJobs.map(job => [job.id, job.customerName || job.customerPhoneMask, job.description, job.amount.toString(), job.status, new Date(job.createdAt).toLocaleDateString()]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    // Create download link
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export successful!', 'success');
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  const handleCreateQuestionnaire = () => {
    if (newCustomer.name && newCustomer.phone) {
      setIsQuestionnaireModalOpen(true);
      setShowNewCustomerForm(false);
    } else {
      setShowNewCustomerForm(true);
    }
  };
  const handleNewCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      showToast('Please provide customer name and phone number', 'error');
      return;
    }
    setIsQuestionnaireModalOpen(true);
    setShowNewCustomerForm(false);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Garage Dashboard</h1>
        <button onClick={handleCreateQuestionnaire} className="bg-[#F2A900] hover:bg-[#E09800] text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Create Questionnaire</span>
        </button>
      </div>

      {/* New Customer Form */}
      {showNewCustomerForm && <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <UserPlusIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
            Add Customer Details
          </h2>
          <form onSubmit={handleNewCustomerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input id="customerName" type="text" value={newCustomer.name} onChange={e => setNewCustomer({
            ...newCustomer,
            name: e.target.value
          })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter customer name" required />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">
                Customer Phone
              </label>
              <input id="customerPhone" type="tel" value={newCustomer.phone} onChange={e => setNewCustomer({
            ...newCustomer,
            phone: e.target.value
          })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="+91 98765 43210" required />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2">
              <button type="button" onClick={() => setShowNewCustomerForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                Continue
              </button>
            </div>
          </form>
        </div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Requests
              </p>
              <p className="text-2xl font-bold">{totalRequests}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <ClipboardCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paid Jobs
              </p>
              <p className="text-2xl font-bold">{paidJobs}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Jobs
              </p>
              <p className="text-2xl font-bold">{pendingJobs}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-bold">
                ₹{totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input type="text" placeholder="Search by description, customer or job ID..." className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">Status:</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter('all')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'all' ? 'bg-[#F2A900] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              All
            </button>
            <button onClick={() => setStatusFilter('pending_creation')} className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'pending_creation' ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              Draft
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
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'amount' | 'status')} className="text-sm border rounded-md p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
            <button onClick={toggleSortOrder} className="p-1">
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
          <button onClick={handleExportCSV} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-md">
            <DownloadIcon className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {sortedJobs.length > 0 ? sortedJobs.map(job => <JobItem key={job.id} job={job} userRole="garage" onViewDetails={handleViewDetails} onMarkCompleted={handleMarkCompleted} onGenerateBarcode={handleGenerateBarcode} />) : <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClipboardCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No jobs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm || statusFilter !== 'all' ? 'No jobs match your current filters' : "You haven't created any questionnaires yet"}
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
      <JobDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} job={selectedJob} onMarkCompleted={handleMarkCompleted} onGenerateBarcode={handleGenerateBarcodeFromDetails} />

      {/* Questionnaire Modal */}
      {isQuestionnaireModalOpen && <GarageQuestionnaireModal isOpen={isQuestionnaireModalOpen} onClose={() => setIsQuestionnaireModalOpen(false)} customerId={newCustomer.id} customerName={newCustomer.name} customerPhone={newCustomer.phone} />}
    </div>;
};