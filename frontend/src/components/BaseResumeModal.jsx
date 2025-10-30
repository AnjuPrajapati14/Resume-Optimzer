import React, { useState, useEffect } from 'react';
import { X, Save, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const BaseResumeModal = ({ isOpen, onClose, onUpdate }) => {
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      console.log('BaseResumeModal opened for first time, loading resume...');
      loadBaseResume();
      setIsInitialized(true);
    } else if (!isOpen && isInitialized) {
      // Reset when modal closes
      console.log('BaseResumeModal closed, resetting state...');
      setIsInitialized(false);
    }
  }, [isOpen]);

  const loadBaseResume = () => {
    const savedResume = localStorage.getItem('flashfire-base-resume');
    const defaultResume = `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

EXPERIENCE
Software Developer at Tech Corp (2022-Present)
- Developed web applications using React and Node.js
- Collaborated with cross-functional teams
- Maintained code quality and documentation

Junior Developer at StartupXYZ (2020-2022)
- Built responsive websites
- Worked with databases and APIs
- Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS
- JavaScript, React, Node.js
- HTML, CSS, MongoDB
- Git, Agile methodologies`;

    const content = savedResume || defaultResume;
    console.log('Loading base resume content:', content.substring(0, 50) + '...');
    setResumeContent(content);
    setOriginalContent(content);
    setHasChanges(false);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setResumeContent(newContent);
    const hasChanged = newContent !== originalContent;
    setHasChanges(hasChanged);
    console.log('Content changed, has changes:', hasChanged, 'isInitialized:', isInitialized);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving base resume:', resumeContent.substring(0, 50) + '...');
      localStorage.setItem('flashfire-base-resume', resumeContent);
      setOriginalContent(resumeContent);
      setHasChanges(false);
      
      if (onUpdate) {
        onUpdate({
          _id: 'global-base-resume',
          baseResume: resumeContent
        });
      }
      
      toast.success('Base resume updated successfully');
      console.log('Base resume saved to localStorage');
      
      // Close modal after successful save
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to update base resume');
      console.error('Error updating base resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    toast.info('To download as PDF, copy the text and use an online PDF converter like docs.google.com or word processor.');
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setIsInitialized(false);
        setHasChanges(false);
        onClose();
      }
    } else {
      setIsInitialized(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        className="modal-content bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Base Resume
              </h2>
              <p className="text-sm text-gray-600">
                Update your master resume template
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Content
            </label>
            <textarea
              value={resumeContent}
              onChange={handleContentChange}
              className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
              placeholder="Enter your resume content here..."
            />
          </div>

          {hasChanges && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                You have unsaved changes. Don't forget to save before closing.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium transition-colors ${
                hasChanges 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {hasChanges ? 'Save Changes' : 'Update Resume'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseResumeModal;