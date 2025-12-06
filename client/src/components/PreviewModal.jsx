import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Info, Calendar, FileText, HardDrive } from 'lucide-react';

const PreviewModal = ({ file, isOpen, onClose, onDownload, onShare, isSharedView, onRemove }) => {
    if (!file) return null;

    const isImage = file.mimeType?.startsWith('image/');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col md:flex-row">

                            {/* Preview Area (Left/Top) */}
                            <div className="flex-1 bg-gray-100 dark:bg-[#121212] flex items-center justify-center p-8 relative min-h-[300px]">
                                {isImage ? (
                                    <img
                                        src={file.downloadUrl || '#'}
                                        alt={file.filename}
                                        className="max-w-full max-h-full object-contain shadow-lg"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <FileText size={64} />
                                        <p className="mt-4 text-lg">No preview available</p>
                                    </div>
                                )}

                                <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 md:hidden">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Details Sidebar (Right/Bottom) */}
                            <div className="w-full md:w-80 bg-white dark:bg-[#1e1e1e] border-l border-gray-100 dark:border-gray-800 flex flex-col">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 break-all">{file.originalName || file.filename}</h3>
                                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-[#2d2d2d] text-xs font-medium text-gray-500 dark:text-gray-400 rounded-md uppercase">
                                            {file.originalName.split('.').pop()}
                                        </span>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hidden md:block">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => onDownload(file._id)}
                                            className="flex items-center justify-center space-x-2 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            <Download size={18} />
                                            <span className="text-sm font-medium">Download</span>
                                        </button>

                                        {!isSharedView ? (
                                            <button
                                                onClick={() => { onClose(); onShare(file); }}
                                                className="flex items-center justify-center space-x-2 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                            >
                                                <Share2 size={18} />
                                                <span className="text-sm font-medium">Share</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { onClose(); onRemove(file._id); }}
                                                className="flex items-center justify-center space-x-2 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <X size={18} />
                                                {/* Using X or UserMinus for Remove. UserMinus might be better contextually but X is fine for "Remove/Close" action or Trash. Let's use Trash or UserMinus to match card ? UserMinus is imported? No. */}
                                                <span className="text-sm font-medium">Remove</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Info List */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">File Details</h4>

                                        <div className="flex items-start space-x-3 text-sm">
                                            <Info size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Type</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{file.mimeType || 'Unknown'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 text-sm">
                                            <HardDrive size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Size</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 text-sm">
                                            <Calendar size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Modified</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(file.uploadDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PreviewModal;
