import React, { useState } from 'react';
import { XIcon, VideoIcon, MicIcon, MicOffIcon, VideoOffIcon, PhoneOffIcon } from 'lucide-react';
import { Garage } from '../context/JobContext';
interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  garage: Garage | null;
}
export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  garage
}) => {
  const [callStage, setCallStage] = useState<'requesting' | 'scheduled' | 'connected'>('requesting');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('');
  if (!isOpen || !garage) return null;
  const handleScheduleCall = () => {
    setCallStage('scheduled');
  };
  const handleConnectNow = () => {
    setCallStage('connected');
  };
  const handleEndCall = () => {
    onClose();
  };
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center">
            <VideoIcon className="h-5 w-5 mr-2 text-[#F2A900]" />
            {callStage === 'connected' ? 'Video Call' : 'Request Video Call'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {callStage === 'requesting' && <>
              <div className="mb-4">
                <p className="text-center">Request a video call with:</p>
                <p className="text-center font-medium text-lg">{garage.name}</p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {garage.address}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Choose when you'd like to connect:
                </p>
                <div className="flex space-x-2">
                  <button onClick={handleConnectNow} className="flex-1 bg-[#F2A900] hover:bg-[#E09800] text-white py-2 rounded-md">
                    Connect Now
                  </button>
                  <button onClick={handleScheduleCall} className="flex-1 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    Schedule
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Video calls allow you to show your vehicle issue directly to the
                garage before visiting.
              </p>
            </>}
          {callStage === 'scheduled' && <>
              <div className="mb-4">
                <p className="text-center mb-4">Schedule a video call with:</p>
                <p className="text-center font-medium">{garage.name}</p>
              </div>
              <div className="mb-6">
                <label htmlFor="scheduledTime" className="block text-sm font-medium mb-1">
                  Select Date & Time
                </label>
                <input id="scheduledTime" type="datetime-local" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button onClick={onClose} disabled={!scheduledTime} className={`px-4 py-2 bg-[#F2A900] text-white rounded-md ${scheduledTime ? 'hover:bg-[#E09800]' : 'opacity-50 cursor-not-allowed'}`}>
                  Schedule Call
                </button>
              </div>
            </>}
          {callStage === 'connected' && <>
              <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden mb-4">
                {isVideoEnabled ? <div className="absolute inset-0 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1560343776-97e7d202ff0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwbWVjaGFuaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Video call" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded text-xs text-white">
                      {garage.name}
                    </div>
                  </div> : <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <VideoOffIcon className="h-12 w-12 text-gray-500" />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded text-xs text-white">
                      {garage.name}
                    </div>
                  </div>}
                <div className="absolute bottom-2 right-2 w-32 h-24 bg-gray-800 border border-gray-700 rounded overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbiUyMGluJTIwY2FyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="Your video" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button onClick={toggleAudio} className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-500'}`}>
                  {isAudioEnabled ? <MicIcon className="h-6 w-6" /> : <MicOffIcon className="h-6 w-6 text-white" />}
                </button>
                <button onClick={handleEndCall} className="p-3 rounded-full bg-red-500">
                  <PhoneOffIcon className="h-6 w-6 text-white" />
                </button>
                <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-500'}`}>
                  {isVideoEnabled ? <VideoIcon className="h-6 w-6" /> : <VideoOffIcon className="h-6 w-6 text-white" />}
                </button>
              </div>
            </>}
        </div>
      </div>
    </div>;
};