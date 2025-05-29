import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTracks = async (userId) => {
  try {
    console.log(`Fetching tracks for user ${userId}...`);
    const response = await api.get(`/api/user/${userId}/tracks`);
    console.log('Tracks fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadTrack = async (formData) => {
  try {
    console.log('Uploading track with data:', {
      title: formData.get('title'),
      artist: formData.get('artist'),
      fileSize: formData.get('audio')?.size,
      fileName: formData.get('audio')?.name
    });

    // Content-Type will be set automatically for FormData
    const response = await api.post('/api/mint/track', formData);
    console.log('Track uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading track:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

export const getCertificate = async (trackId) => {
  try {
    console.log(`Fetching certificate for track ${trackId}...`);
    const response = await api.get(`/api/track/${trackId}/certificate`);
    console.log('Certificate fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};
