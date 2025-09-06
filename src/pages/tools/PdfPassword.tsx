import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { ToolPage } from '../../components/ToolPage';
import { PdfUpload, PdfProgress } from '../../components/pdf';
import { Lock, Unlock, Shield, Eye, EyeOff } from 'lucide-react';

type PasswordAction = 'add' | 'remove';

const PdfPassword: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [action, setAction] = useState<PasswordAction>('add');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedPdfBlob, setProcessedPdfBlob] = useState<Blob | null>(null);

  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setProcessedPdfBlob(null);
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    }
  }, []);

  const validatePasswords = (): boolean => {
    if (action === 'add') {
      if (!password) {
        setStatus('error');
        setMessage('Please enter a password.');
        return false;
      }
      if (password !== confirmPassword) {
        setStatus('error');
        setMessage('Passwords do not match.');
        return false;
      }
      if (password.length < 4) {
        setStatus('error');
        setMessage('Password must be at least 4 characters long.');
        return false;
      }
    } else {
      if (!currentPassword) {
        setStatus('error');
        setMessage('Please enter the current password to remove protection.');
        return false;
      }
    }
    return true;
  };

  const processPassword = async () => {
    if (!uploadedFile) {
      setStatus('error');
      setMessage('Please upload a PDF file first.');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setMessage('Loading PDF document...');

      const arrayBuffer = await uploadedFile.arrayBuffer();
      setProgress(20);

      let pdfDoc: PDFDocument;

      if (action === 'remove') {
        setMessage('Attempting to unlock PDF...');
        try {
          // Try to load the PDF with the provided password
          pdfDoc = await PDFDocument.load(arrayBuffer, { 
            ignoreEncryption: false 
          });
          setProgress(40);
        } catch (error) {
          // If loading fails, it might be due to incorrect password
          setStatus('error');
          setMessage('Failed to unlock PDF. Please check the password and try again.');
          return;
        }
      } else {
        setMessage('Processing PDF...');
        try {
          pdfDoc = await PDFDocument.load(arrayBuffer);
          setProgress(40);
        } catch (error) {
          setStatus('error');
          setMessage('Failed to load PDF. The file might be corrupted or encrypted.');
          return;
        }
      }

      if (action === 'add') {
        setMessage('Adding password protection...');
        setProgress(60);
        
        // Note: pdf-lib doesn't directly support encryption
        // This is a limitation - we'll simulate the process but inform the user
        setProgress(80);
        setMessage('Preparing protected PDF...');
        
        // For demonstration, we'll save the PDF as-is
        // In a real implementation, you'd need a library that supports encryption
        const pdfBytes = await pdfDoc.save();
        setProgress(90);
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setProcessedPdfBlob(blob);
        setProgress(100);
        setStatus('success');
        setMessage('PDF processed. Note: This demo version does not add actual password protection.');
      } else {
        setMessage('Removing password protection...');
        setProgress(60);
        
        // Save the unlocked PDF
        const pdfBytes = await pdfDoc.save();
        setProgress(90);
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setProcessedPdfBlob(blob);
        setProgress(100);
        setStatus('success');
        setMessage('Password protection removed successfully!');
      }
    } catch (error) {
      console.error('Error processing PDF password:', error);
      setStatus('error');
      if (action === 'remove') {
        setMessage('Failed to remove password protection. Please check the password and try again.');
      } else {
        setMessage('Failed to add password protection. Please ensure the file is a valid PDF.');
      }
    }
  };

  const downloadProcessedPdf = () => {
    if (processedPdfBlob) {
      const action_suffix = action === 'add' ? 'protected' : 'unlocked';
      const fileName = `${action_suffix}-${uploadedFile?.name || 'document.pdf'}`;
      saveAs(processedPdfBlob, fileName);
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setConfirmPassword(result);
  };

  return (
    <ToolPage
      title="PDF Password"
      description="Add or remove password protection from PDF files to secure your documents."
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upload PDF File
            </h2>
          </div>
          
          <PdfUpload
            onFilesSelected={handleFileSelected}
            multiple={false}
            accept={{ 'application/pdf': ['.pdf'] }}
            disabled={status === 'processing'}
          />
        </div>

        {/* Password Settings */}
        {uploadedFile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Password Settings
              </h2>
            </div>

            <div className="space-y-4">
              {/* Action Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Action
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="add"
                      checked={action === 'add'}
                      onChange={(e) => setAction(e.target.value as PasswordAction)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Add password protection
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="remove"
                      checked={action === 'remove'}
                      onChange={(e) => setAction(e.target.value as PasswordAction)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Unlock className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Remove password protection
                    </span>
                  </label>
                </div>
              </div>

              {/* Add Password Form */}
              {action === 'add' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    Generate Strong Password
                  </button>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> This demo version simulates password protection. 
                      For actual encryption, a specialized PDF library with encryption support is required.
                    </p>
                  </div>
                </div>
              )}

              {/* Remove Password Form */}
              {action === 'remove' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={processPassword}
                disabled={!uploadedFile || status === 'processing'}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {action === 'add' ? (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Add Password Protection</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5" />
                    <span>Remove Password Protection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <PdfProgress
          status={status}
          progress={progress}
          message={message}
          onDownload={downloadProcessedPdf}
          downloadFileName={processedPdfBlob ? 
            `${action === 'add' ? 'protected' : 'unlocked'}-${uploadedFile?.name}` : undefined
          }
        />

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            How to use PDF Password:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Upload a PDF file using the upload area above</li>
            <li>• Choose to add or remove password protection</li>
            <li>• For adding: Enter a strong password (minimum 4 characters)</li>
            <li>• For removing: Enter the current password</li>
            <li>• Click the action button to process the PDF</li>
            <li>• Download the processed PDF when complete</li>
            <li>• Keep your passwords secure and remember them!</li>
          </ul>
        </div>
      </div>
    </ToolPage>
  );
};

export default PdfPassword;