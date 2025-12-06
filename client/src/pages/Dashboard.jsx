import { useState, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom'; // Import context hook
import fileService from '../services/fileService';
import FileList from '../components/FileList';
import ShareModal from '../components/ShareModal';
import PreviewModal from '../components/PreviewModal';
import { Loader2, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ filter = 'my-files' }) => {
    const { refreshTrigger } = useOutletContext() || {};
    const { fileId } = useParams(); // Get fileId from URL if present
    const navigate = useNavigate();

    useEffect(() => {
        const title = filter === 'shared' ? 'Shared Files' : 'My Drive';
        document.title = `${title} - FileVault`;
    }, [filter]);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // Sharing State
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [fileToShare, setFileToShare] = useState(null);

    // Preview State
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [fileToPreview, setFileToPreview] = useState(null);

    // check if we have a fileId in url, if so try to preview it immediately
    useEffect(() => {
        if (fileId) {
            const loadFile = async () => {
                try {
                    const data = await fileService.getFile(fileId);
                    // merge details for the preview modal
                    const fileObj = { ...data.file, downloadUrl: data.downloadUrl };
                    setFileToPreview(fileObj);
                    setPreviewModalOpen(true);
                } catch (err) {
                    console.error("Failed to load file", err);
                    alert("File not found or access denied.");
                    navigate('/dashboard');
                }
            };
            loadFile();
        }
    }, [fileId, navigate]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            let response;
            if (filter === 'shared') {
                response = await fileService.listSharedFiles();
            } else {
                response = await fileService.listFiles();
            }
            setFiles(response.data.files || []);
        } catch (err) {
            console.error("Failed to fetch files", err);
            setError("Could not load your files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [refreshTrigger, filter]);

    const handlePreviewClose = () => {
        setPreviewModalOpen(false);
        setFileToPreview(null);
        if (fileId) {
            navigate('/dashboard'); // Clear URL when closing preview
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const url = await fileService.downloadFile(fileId);
            window.open(url, '_blank');
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to get download link");
        }
    };

    const handleDelete = async (fileId) => {
        const isShared = filter === 'shared';
        const message = isShared
            ? "Are you sure you want to remove this file from your shared list?"
            : "Are you sure you want to delete this file?";

        if (!window.confirm(message)) return;

        try {
            if (isShared) {
                await fileService.leaveShare(fileId);
            } else {
                await fileService.deleteFile(fileId);
            }
            setFiles(prev => prev.filter(f => f._id !== fileId));
        } catch (err) {
            console.error("Action failed", err);
            alert("Failed to perform action");
        }
    };

    const handleShare = (file) => {
        setFileToShare(file);
        setShareModalOpen(true);
    };

    const handlePreview = (file) => {
        setFileToPreview(file);
        setPreviewModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header / Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {filter === 'shared' ? 'Shared with me' : 'My Drive'}
                </h1>

                <div className="flex bg-white dark:bg-[#2d2d2d] rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#3d3d3d] text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#3d3d3d] text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <FileList
                files={files}
                viewMode={viewMode}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onShare={handleShare}
                onPreview={handlePreview}
                isSharedView={filter === 'shared'}
            />

            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                file={fileToShare}
            />

            <PreviewModal
                isOpen={previewModalOpen}
                onClose={handlePreviewClose}
                file={fileToPreview}
                onDownload={handleDownload}
                onShare={handleShare}
                isSharedView={filter === 'shared'}
                onRemove={handleDelete}
            />
        </div>
    );
};

export default Dashboard;
