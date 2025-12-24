import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPexels, fetchUnsplash, fetchPixabay } from '../../services/api';

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

const initialState = {
  items: [],
  query: 'cartoons',
  mediaType: 'images',
  page: 1,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedItem: null,
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
    },
    setQuery: (state, action) => {
      state.query = action.payload;
      state.page = 1;
      state.items = [];
    },
    setMediaType: (state, action) => {
      state.mediaType = action.payload;
      state.page = 1;
      state.items = [];
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const {
  setSearchTerms,
  setQuery,
  setMediaType,
  setPage,
  setSelectedItem,
  clearSelectedItem,
} = mediaSlice.actions;

export default mediaSlice.reducer;
