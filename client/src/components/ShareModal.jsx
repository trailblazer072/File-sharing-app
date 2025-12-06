import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Link as LinkIcon, Copy, Trash2, CheckCircle, Loader2, Globe } from 'lucide-react';
import shareService from '../services/shareService';

const ShareModal = ({ file, isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState({ sharedWith: [], links: [] });
    const [activeTab, setActiveTab] = useState('invite'); // 'invite' or 'manage'
    const [generatedLink, setGeneratedLink] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (isOpen && file) {
            fetchPermissions();
            setGeneratedLink(null);
            setEmail('');
        }
    }, [isOpen, file]);

    const fetchPermissions = async () => {
        try {
            const data = await shareService.getPermissions(file._id);
            setPermissions(data);
        } catch (err) {
            console.error("Failed to fetch permissions", err);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await shareService.shareFile(file._id, email);
            setEmail('');
            fetchPermissions(); // Refresh list
            alert("Invitation sent!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to share");
        } finally {
            setLoading(false);
        }
    };



    const handleRemoveUser = async (userId) => {
        if (!confirm("Remove access for this user?")) return;
        try {
            await shareService.removeUserAccess(file._id, userId);
            fetchPermissions();
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-[#2d2d2d] w-full max-w-lg rounded-2xl shadow-xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-xl font-semibold dark:text-white">Share "{file?.originalName || file?.filename}"</h3>
                                <button onClick={onClose}><X className="text-gray-400" /></button>
                            </div>

                            <div className="p-2 flex space-x-1 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#252525]">
                                <button
                                    onClick={() => setActiveTab('invite')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'invite' ? 'bg-white dark:bg-[#3d3d3d] shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Invite
                                </button>
                                <button
                                    onClick={() => setActiveTab('manage')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-white dark:bg-[#3d3d3d] shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Manage Access
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {activeTab === 'invite' ? (
                                    <>
                                        <div className="space-y-6">
                                            <form onSubmit={handleInvite} className="flex space-x-2">
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter email address"
                                                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-[#1e1e1e] dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark disabled:opacity-50"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" /> : 'Send'}
                                                </button>
                                            </form>
                                        </div>


                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                                <LinkIcon size={16} className="mr-2" /> Restricted Link
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate mr-2 select-all">
                                                    {`${window.location.origin}/file/${file._id}`}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/file/${file._id}`);
                                                        setCopySuccess(true);
                                                        setTimeout(() => setCopySuccess(false), 2000);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                                                    title="Copy Link"
                                                >
                                                    {copySuccess ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                Only users with access (Owner or Shared) can view this link.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">People</h4>
                                        {permissions.sharedWith.length === 0 && <p className="text-sm text-gray-500 italic">Shared with no one.</p>}
                                        {permissions.sharedWith.map(u => (
                                            <div key={u._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {u.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium dark:text-white">{u.name}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemoveUser(u._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}


                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
