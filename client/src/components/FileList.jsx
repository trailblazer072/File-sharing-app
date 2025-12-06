import { motion, AnimatePresence } from 'framer-motion';
import FileCard from './FileCard';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

const FileList = ({ files, viewMode, onDownload, onDelete, onShare, onPreview, isSharedView }) => {
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="mb-4 bg-gray-100 dark:bg-[#1e1e1e] p-6 rounded-full">
                    <LayoutGrid size={48} className="opacity-50" />
                </div>
                <p className="text-lg">No files found</p>
                <p className="text-sm">Upload a file to get started</p>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1'
                }`}
        >
            <AnimatePresence>
                {files.map((file) => (
                    <FileCard
                        key={file._id}
                        file={file}
                        onDownload={onDownload}
                        onShare={onShare}
                        onDelete={onDelete}
                        onPreview={onPreview}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default FileList;
