import api from './api';

const fileService = {
    // List files
    listFiles: async () => {
        const response = await api.get('/files');
        return response.data; // Assuming backend returns { status: 'success', data: { files: [] } } or just array? 
        // Backend controller: res.status(200).json({ status: 'success', results: files.length, data: { files } });
    },

    // List shared files
    listSharedFiles: async () => {
        const response = await api.get('/files/shared');
        return response.data;
    },

    leaveShare: async (fileId) => {
        const response = await api.delete(`/share/files/${fileId}/leave`);
        return response.data;
    },

    // Upload file(s)
    uploadFiles: async (formData, onProgress) => {
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    // Delete file
    deleteFile: async (id) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    },

    // Download file (Get presigned URL)
    downloadFile: async (id) => {
        const response = await api.get(`/files/${id}/download`);
        return response.data.data.downloadUrl;
    },

    // direct access support
    getFile: async (id) => {
        const response = await api.get(`/files/${id}/download`);
        return response.data.data;
    }
};

export default fileService;
