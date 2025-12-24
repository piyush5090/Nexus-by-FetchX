import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPexels, fetchUnsplash, fetchPixabay, fetchProviderCounts } from '../../services/api';

// Normalization functions for each provider
const normalizePexels = (item, mediaType) => {
  let previewURL = mediaType === 'images' ? item.src.large : item.image;
  if (mediaType === 'videos') {
    const sdVideo = item.video_files?.find(f => f.quality === 'sd');
    previewURL = sdVideo?.link || item.video_files?.[0]?.link;
  }
  return {
    id: item.id,
    source: 'pexels',
    type: mediaType.slice(0, -1),
    url: mediaType === 'images' ? item.src.original : item.video_files[0].link,
    previewURL,
    tags: [], // Pexels API doesn't provide tags in the search results
    width: item.width,
    height: item.height,
    photographer: item.photographer,
    photographer_url: item.photographer_url,
  };
};

const normalizeUnsplash = (item) => ({
  id: item.id,
  source: 'unsplash',
  type: 'image',
  url: item.urls?.full,
  previewURL: item.urls?.regular,
  tags: item.tags?.map(tag => tag.title) || [],
  width: item.width,
  height: item.height,
  photographer: item.user?.name,
  photographer_url: item.user?.links?.html,
});

const normalizePixabay = (item, mediaType) => ({
  id: item.id,
  source: 'pixabay',
  type: mediaType.slice(0, -1),
  url: mediaType === 'images' ? item.largeImageURL : item.videos.large.url,
  previewURL: mediaType === 'images' ? item.webformatURL : item.videos.small.url,
  tags: item.tags.split(',').map(tag => tag.trim()),
  width: mediaType === 'images' ? item.imageWidth : item.videos.large.width,
  height: mediaType === 'images' ? item.imageHeight : item.videos.large.height,
  photographer: item.user,
  photographer_url: `https://pixabay.com/users/${item.user}-${item.user_id}`,
});

export const fetchSearchCounts = createAsyncThunk(
  'media/fetchSearchCounts',
  async (_, { getState }) => {
    const { query, mediaType } = getState().media;
    if (!query) return null;
    const response = await fetchProviderCounts(query, mediaType);
    return response.providers;
  }
);

export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (_, { getState }) => {
    const { query, mediaType, page } = getState().media;
    
    let promises = [];

    if (mediaType === 'images') {
      promises = [
        fetchPexels('images', query, page).then(data => data.items.map(item => normalizePexels(item, 'images'))),
        fetchUnsplash(query, page).then(data => data.items.map(normalizeUnsplash)),
        fetchPixabay('photos', query, page).then(data => data.items.map(item => normalizePixabay(item, 'images'))),
        fetchPixabay('illustrations', query, page).then(data => data.items.map(item => normalizePixabay(item, 'images'))),
        fetchPixabay('vectors', query, page).then(data => data.items.map(item => normalizePixabay(item, 'images'))),
      ];
    } else if (mediaType === 'videos') {
      promises = [
        fetchPexels('videos', query, page).then(data => data.items.map(item => normalizePexels(item, 'videos'))),
        fetchPixabay('videos', query, page).then(data => data.items.map(item => normalizePixabay(item, 'videos'))),
      ];
    }

    const results = await Promise.allSettled(promises);
    const combinedMedia = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // simple shuffle
    return combinedMedia.sort(() => Math.random() - 0.5);
  }
);

export const fetchRelatedMedia = createAsyncThunk(
  'media/fetchRelatedMedia',
  async (_, { getState }) => {
    const { query: originalQuery, mediaType, selectedItem, relatedItemsPage } = getState().media;

    // Use the first tag of the selected item, or fall back to the original query
    const relatedQuery = selectedItem.tags?.[0] || originalQuery;
    const page = relatedItemsPage;
    
    let promises = [];
    if (mediaType === 'images') {
      promises = [
        fetchPexels('images', relatedQuery, page).then(data => data.items.map(item => normalizePexels(item, 'images'))),
        fetchUnsplash(relatedQuery, page).then(data => data.items.map(normalizeUnsplash)),
        fetchPixabay('photos', relatedQuery, page).then(data => data.items.map(item => normalizePixabay(item, 'images'))),
      ];
    } else if (mediaType === 'videos') {
      promises = [
        fetchPexels('videos', relatedQuery, page).then(data => data.items.map(item => normalizePexels(item, 'videos'))),
        fetchPixabay('videos', relatedQuery, page).then(data => data.items.map(item => normalizePixabay(item, 'videos'))),
      ];
    }

    const results = await Promise.allSettled(promises);
    const combinedMedia = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value)
      // Filter out the item we're already viewing
      .filter(item => item.id !== selectedItem.id);

    return combinedMedia.sort(() => Math.random() - 0.5);
  }
);

const initialState = {
  items: [],
  query: '',
  mediaType: 'images',
  page: 1,
  status: 'idle',
  error: null,
  selectedItem: null,
  providerCounts: null,
  countsStatus: 'idle',
  // New state for related media
  relatedItems: [],
  relatedItemsPage: 1,
  relatedItemsStatus: 'idle',
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSearchTerms: (state, action) => {
      state.query = action.payload.query;
      state.mediaType = action.payload.mediaType;
      state.page = 1;
      state.items = [];
      state.providerCounts = null;
      state.countsStatus = 'idle';
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
      // Reset related items when a new item is selected
      state.relatedItems = [];
      state.relatedItemsPage = 1;
      state.relatedItemsStatus = 'idle';
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
      // Also clear related items when modal is closed
      state.relatedItems = [];
      state.relatedItemsPage = 1;
      state.relatedItemsStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers for fetchMedia
      .addCase(fetchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducers for fetchSearchCounts
      .addCase(fetchSearchCounts.pending, (state) => {
        state.countsStatus = 'loading';
      })
      .addCase(fetchSearchCounts.fulfilled, (state, action) => {
        state.countsStatus = 'succeeded';
        state.providerCounts = action.payload;
      })
      .addCase(fetchSearchCounts.rejected, (state) => {
        state.countsStatus = 'failed';
      })
      // Reducers for fetchRelatedMedia
      .addCase(fetchRelatedMedia.pending, (state) => {
        state.relatedItemsStatus = 'loading';
      })
      .addCase(fetchRelatedMedia.fulfilled, (state, action) => {
        state.relatedItems.push(...action.payload);
        state.relatedItemsPage += 1;
        state.relatedItemsStatus = 'succeeded';
      })
      .addCase(fetchRelatedMedia.rejected, (state) => {
        state.relatedItemsStatus = 'failed';
      });
  },
});

export const {
  setSearchTerms,
  setPage,
  setSelectedItem,
  clearSelectedItem,
} = mediaSlice.actions;

export default mediaSlice.reducer;
