//const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'https://fetchx-backend.onrender.com';



const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from endpoint: ${endpoint}`, error);
    throw error;
  }
};

export const fetchPexels = (type, query, page) => {
  return fetchFromAPI(`metadata/pexels/${type}?query=${query}&page=${page}&perPage=15`);
};

export const fetchUnsplash = (query, page) => {
  return fetchFromAPI(`metadata/unsplash/images?query=${query}&page=${page}&perPage=15`);
};

export const fetchPixabay = (type, query, page) => {
  const pixabayType = type === 'images' ? 'photos' : type;
  return fetchFromAPI(`metadata/pixabay/${pixabayType}?query=${query}&page=${page}&perPage=15`);
};
