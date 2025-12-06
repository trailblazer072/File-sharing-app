import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import fileService from '../services/fileService';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateFiles = (newFiles) => {
        const MAX_SIZE = 100 * 1024 * 1024; // 100MB
        const validFiles = [];
        let hasError = false;

        newFiles.forEach(file => {
            if (file.size > MAX_SIZE) {
                hasError = true;
            } else {
                validFiles.push(file);
            }
        });

        if (hasError) {
            setError("Some files were skipped because they exceed the 100MB limit.");
        } else {
            setError(null);
        }

        setFiles(validFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        validateFiles(droppedFiles);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        validateFiles(selectedFiles);
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file); // 'files' must match backend field name
        });

        try {
            await fileService.uploadFiles(formData, (percent) => {
                setProgress(percent);
            });
            onUploadSuccess();
            onClose();
            setFiles([]); // Reset
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to upload files. Please try again.");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-[#2d2d2d] w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-semibold dark:text-white">Upload Files</h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error}
                                    </div>
                                )}

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                                        ${isDragging
                                            ? 'border-primary bg-blue-50 dark:bg-blue-900/10'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                                        }
                                    `}
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <input
                                        type="file"
                                        id="fileInput"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="p-4 bg-gray-100 dark:bg-[#3d3d3d] rounded-full">
                                            <Upload className="text-primary" size={32} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-200">Click to upload or drag and drop</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Files up to 100MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* File List Preview */}
                                {files.length > 0 && (
                                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-[#3d3d3d] rounded-lg">
                                                <File size={16} className="text-gray-500" />
                                                <span className="text-sm truncate flex-1 dark:text-gray-200">{file.name}</span>
                                                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Progress Bar */}
                                {uploading && (
                                    <div className="mt-4">
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-center mt-1 text-gray-500">Uploading... {progress}%</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gray-50 dark:bg-[#1e1e1e] flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded-lg font-medium transition-colors"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={uploadFiles}
                                    disabled={files.length === 0 || uploading}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {uploading && <Loader2 className="animate-spin mr-2" size={16} />}
                                    Upload {files.length > 0 ? `(${files.length})` : ''}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UploadModal;
