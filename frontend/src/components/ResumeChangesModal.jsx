import React from 'react';
import { X, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7500/api';

const ResumeChangesModal = ({ isOpen, onClose, job }) => {
  const handleDownloadOptimizedPDF = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/jobs/${job._id}/download?type=optimized`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${job.clientName}_${job.companyName}_Optimized_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Optimized resume PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header with Close Button at Top Right */}
        <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Resume Changes for {job.position} at {job.companyName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {job.changesSummary && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Changes Summary
              </h3>
              <p className="text-sm text-blue-700">{job.changesSummary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[50vh]">
            {/* Original Resume */}
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Original Resume
              </h3>
              <div className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto shadow-inner">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {job.baseResume}
                </pre>
              </div>
            </div>

            {/* Optimized Resume */}
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Optimized Resume
              </h3>
              <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg overflow-y-auto shadow-inner">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {job.optimizedResume}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Download Button - Fixed at bottom */}
        <div className="border-t border-gray-200 p-6 bg-white rounded-b-lg flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={handleDownloadOptimizedPDF}
              className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Optimized PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeChangesModal;
