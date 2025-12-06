import api from './api';

const shareService = {
    // Share with user
    shareFile: async (fileId, email) => {
        const response = await api.post(`/files/${fileId}/share`, { email });
        return response.data;
    },

    // Create link
    createShareLink: async (fileId, expiresInHours = 24) => {
        const response = await api.post(`/files/${fileId}/link`, { expiresInHours });
        return response.data; // { status: 'success', data: { token, expiresAt } }
    },

    // Get permissions (active shares)
    getPermissions: async (fileId) => {
        const response = await api.get(`/files/${fileId}/permissions`);
        return response.data.data; // { sharedWith: [], links: [] }
    },

    // Remove user access
    removeUserAccess: async (fileId, userId) => {
        await api.delete(`/files/${fileId}/permissions/user/${userId}`);
    },

    // Remove link
    removeLink: async (linkId) => {
        await api.delete(`/permissions/link/${linkId}`);
    }
};

export default shareService;
