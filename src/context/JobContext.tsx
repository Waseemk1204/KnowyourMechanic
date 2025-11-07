import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
export interface Garage {
  id: string;
  shopCode: string;
  name: string;
  owner: string;
  phone: string;
  lat: number;
  lon: number;
  services: string[];
  rating: number;
  joiningDate: string;
  address?: string;
  distance?: number;
}
export interface Job {
  id: string;
  garageId: string;
  garageName?: string;
  customerId: string;
  customerName?: string;
  customerPhoneMask: string;
  description: string;
  amount: number;
  status: 'pending_creation' | 'pending_approval' | 'approved' | 'paid' | 'completed' | 'disputed' | 'under_investigation';
  createdAt: string;
  approvalCode?: string;
  approvedAt?: string;
  paidAt?: string;
  completedAt?: string;
  reportReason?: string;
  reportDetails?: string;
  reportedAt?: string;
}
interface JobContextType {
  garages: Garage[];
  jobs: Job[];
  selectedGarage: Garage | null;
  setSelectedGarage: (garage: Garage | null) => void;
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'approvalCode'>) => Promise<Job>;
  updateJobStatus: (jobId: string, status: Job['status'], timestamp?: string) => Promise<void>;
  getGarageJobs: (garageId: string) => Job[];
  getCustomerJobs: (customerId: string) => Job[];
  processPayment: (jobId: string) => Promise<{
    success: boolean;
    receiptUrl?: string;
  }>;
  generateApprovalCode: (jobId: string) => Promise<string>;
  approveJob: (jobId: string, customerId: string) => Promise<void>;
  reportJob: (jobId: string, reason: string, details: string) => Promise<void>;
}
const JobContext = createContext<JobContextType>({
  garages: [],
  jobs: [],
  selectedGarage: null,
  setSelectedGarage: () => {},
  createJob: async () => ({
    id: '',
    garageId: '',
    customerId: '',
    customerPhoneMask: '',
    description: '',
    amount: 0,
    status: 'pending_creation',
    createdAt: ''
  }),
  updateJobStatus: async () => {},
  getGarageJobs: () => [],
  getCustomerJobs: () => [],
  processPayment: async () => ({
    success: false
  }),
  generateApprovalCode: async () => '',
  approveJob: async () => {},
  reportJob: async () => {}
});
export const useJob = () => useContext(JobContext);
export const JobProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  // Sample garage data centered around Pune, India
  const initialGarages: Garage[] = [{
    id: 'garage_001',
    shopCode: 'KNM-PNE-001',
    name: 'Shiv Auto Care',
    owner: 'Rohit Sharma',
    phone: '+91-9876543210',
    lat: 18.5285,
    lon: 73.8478,
    services: ['brakes', 'oil-change', 'engine'],
    rating: 4.6,
    joiningDate: '2023-08-01',
    address: 'Kothrud, Pune',
    distance: 2.3
  }, {
    id: 'garage_002',
    shopCode: 'KNM-PNE-002',
    name: 'Quick Car Services',
    owner: 'Amit Patel',
    phone: '+91-9876543211',
    lat: 18.5204,
    lon: 73.8567,
    services: ['brakes', 'suspension', 'electronics'],
    rating: 4.2,
    joiningDate: '2023-06-15',
    address: 'Deccan, Pune',
    distance: 0.5
  }, {
    id: 'garage_003',
    shopCode: 'KNM-PNE-003',
    name: 'Auto Tech Solutions',
    owner: 'Sunil Verma',
    phone: '+91-9876543212',
    lat: 18.5123,
    lon: 73.8394,
    services: ['engine', 'transmission', 'diagnostics'],
    rating: 4.8,
    joiningDate: '2023-04-10',
    address: 'Shivaji Nagar, Pune',
    distance: 3.1
  }, {
    id: 'garage_004',
    shopCode: 'KNM-PNE-004',
    name: 'Premier Auto Works',
    owner: 'Rahul Desai',
    phone: '+91-9876543213',
    lat: 18.5531,
    lon: 73.8704,
    services: ['oil-change', 'air-conditioning', 'batteries'],
    rating: 3.9,
    joiningDate: '2023-09-20',
    address: 'Viman Nagar, Pune',
    distance: 7.2
  }, {
    id: 'garage_005',
    shopCode: 'KNM-PNE-005',
    name: 'Wheels & Deals',
    owner: 'Priya Joshi',
    phone: '+91-9876543214',
    lat: 18.4922,
    lon: 73.8234,
    services: ['tires', 'wheel-alignment', 'balancing'],
    rating: 4.4,
    joiningDate: '2023-02-28',
    address: 'Sinhagad Road, Pune',
    distance: 5.8
  }];
  // Sample job data
  const initialJobs: Job[] = [{
    id: 'job_1001',
    garageId: 'garage_001',
    garageName: 'Shiv Auto Care',
    customerId: 'customer_001',
    customerName: 'Rahul Kumar',
    customerPhoneMask: '+91-98xxxxx901',
    description: 'Brake pads grinding noise, check and replace if needed',
    amount: 2500,
    status: 'paid',
    createdAt: '2023-09-03T10:24:00Z',
    paidAt: '2023-09-03T10:25:12Z'
  }, {
    id: 'job_1002',
    garageId: 'garage_001',
    garageName: 'Shiv Auto Care',
    customerId: 'customer_002',
    customerName: 'Amit Singh',
    customerPhoneMask: '+91-98xxxxx902',
    description: 'Engine overheating, coolant leak suspected',
    amount: 3500,
    status: 'completed',
    createdAt: '2023-09-02T14:10:00Z',
    paidAt: '2023-09-02T14:15:32Z',
    completedAt: '2023-09-04T16:30:00Z'
  }, {
    id: 'job_1003',
    garageId: 'garage_002',
    garageName: 'Quick Car Services',
    customerId: 'customer_001',
    customerName: 'Rahul Kumar',
    customerPhoneMask: '+91-98xxxxx901',
    description: 'Oil change and general inspection',
    amount: 1800,
    status: 'completed',
    createdAt: '2023-08-28T09:45:00Z',
    approvedAt: '2023-08-28T09:47:22Z',
    paidAt: '2023-08-28T10:15:00Z',
    completedAt: '2023-08-28T11:30:00Z'
  }, {
    id: 'job_1004',
    garageId: 'garage_003',
    garageName: 'Auto Tech Solutions',
    customerId: 'customer_003',
    customerName: 'Priya Sharma',
    customerPhoneMask: '+91-98xxxxx903',
    description: 'Car not starting, battery check needed',
    amount: 1200,
    status: 'pending_approval',
    createdAt: '2023-09-05T08:30:00Z',
    approvalCode: 'JOB1004-ABCD'
  }];
  const [garages, setGarages] = useState<Garage[]>(initialGarages);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const {
    user
  } = useAuth();
  // Load data from localStorage on initial render
  useEffect(() => {
    const storedGarages = localStorage.getItem('garages');
    const storedJobs = localStorage.getItem('jobs');
    if (storedGarages) {
      setGarages(JSON.parse(storedGarages));
    } else {
      localStorage.setItem('garages', JSON.stringify(initialGarages));
    }
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }
  }, []);
  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);
  // Create a new job (by garage)
  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'approvalCode'>): Promise<Job> => {
    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...jobData,
      status: 'pending_creation',
      createdAt: new Date().toISOString()
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
    return newJob;
  };
  // Generate approval code for a job
  const generateApprovalCode = async (jobId: string): Promise<string> => {
    // Generate a random code
    const code = `${jobId.split('_')[1]}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    // Update the job with the approval code and change status
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          approvalCode: code,
          status: 'pending_approval'
        };
      }
      return job;
    }));
    return code;
  };
  // Approve a job (by customer)
  const approveJob = async (jobId: string, customerId: string): Promise<void> => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId && job.status === 'pending_approval') {
        return {
          ...job,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          customerId
        };
      }
      return job;
    }));
  };
  // Report a job (by customer)
  const reportJob = async (jobId: string, reason: string, details: string): Promise<void> => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'under_investigation',
          reportReason: reason,
          reportDetails: details,
          reportedAt: new Date().toISOString()
        };
      }
      return job;
    }));
  };
  // Update job status
  const updateJobStatus = async (jobId: string, status: Job['status'], timestamp?: string) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        const updatedJob = {
          ...job,
          status
        };
        // Add timestamp based on status
        if (status === 'approved' && !job.approvedAt) {
          updatedJob.approvedAt = timestamp || new Date().toISOString();
        } else if (status === 'paid' && !job.paidAt) {
          updatedJob.paidAt = timestamp || new Date().toISOString();
        } else if (status === 'completed' && !job.completedAt) {
          updatedJob.completedAt = timestamp || new Date().toISOString();
        }
        return updatedJob;
      }
      return job;
    }));
  };
  // Get jobs for a specific garage
  const getGarageJobs = (garageId: string): Job[] => {
    return jobs.filter(job => job.garageId === garageId);
  };
  // Get jobs for a specific customer
  const getCustomerJobs = (customerId: string): Job[] => {
    return jobs.filter(job => job.customerId === customerId);
  };
  // Process payment (mock implementation)
  const processPayment = async (jobId: string): Promise<{
    success: boolean;
    receiptUrl?: string;
  }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Find the job
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      return {
        success: false
      };
    }
    // Update job status to paid
    await updateJobStatus(jobId, 'paid');
    // Return success with mock receipt URL
    return {
      success: true,
      receiptUrl: `https://example.com/receipts/${jobId}`
    };
  };
  return <JobContext.Provider value={{
    garages,
    jobs,
    selectedGarage,
    setSelectedGarage,
    createJob,
    updateJobStatus,
    getGarageJobs,
    getCustomerJobs,
    processPayment,
    generateApprovalCode,
    approveJob,
    reportJob
  }}>
      {children}
    </JobContext.Provider>;
};