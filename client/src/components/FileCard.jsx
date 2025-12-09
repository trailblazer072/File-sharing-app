import { FileText, Image, Film, Music, MoreVertical, Download, Share2, Trash2, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';

const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="text-purple-500" size={40} />;
    if (mimeType?.startsWith('video/')) return <Film className="text-red-500" size={40} />;
    if (mimeType?.startsWith('audio/')) return <Music className="text-yellow-500" size={40} />;
    return <FileText className="text-blue-500" size={40} />;
};

const FileCard = ({ file, onDownload, onDelete, onShare, onPreview, isSharedView }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            onClick={() => onPreview && onPreview(file)}
            className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-4 pb-16 md:pb-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-all relative group cursor-pointer overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 dark:bg-[#1e1e1e] rounded-xl">
                    {getFileIcon(file.mimeType)}
                </div>
                {!isSharedView && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={file.originalName || file.filename}>
                    {file.originalName || file.filename}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                </p>
                {isSharedView && file.ownerId && (
                    <p className="text-xs text-blue-500 mt-1 truncate">
                        Shared by {file.ownerId.name || file.ownerId.email || 'Unknown'}
                    </p>
                )}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-[#2d2d2d]/95 backdrop-blur-sm p-3 rounded-b-2xl translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform flex justify-around border-t border-gray-100 dark:border-gray-700 shadow-lg z-10">
                <button onClick={(e) => { e.stopPropagation(); onDownload(file._id); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg" title="Download">
                    <Download size={18} />
                </button>

                {!isSharedView ? (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); onShare(file); }} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded-lg" title="Share">
                            <Share2 size={18} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(file._id); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg" title="Delete">
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); onDelete(file._id); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg" title="Remove from Shared">
                        <UserMinus size={18} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default FileCard;
