import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerms } from '../../features/media/mediaSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { query: currentQuery, mediaType: currentMediaType } = useSelector((state) => state.media);
  
  const [localQuery, setLocalQuery] = useState(currentQuery);
  const [localMediaType, setLocalMediaType] = useState(currentMediaType);

  useEffect(() => {
    setLocalQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    setLocalMediaType(currentMediaType);
  }, [currentMediaType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(setSearchTerms({ query: localQuery.trim(), mediaType: localMediaType }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 my-8">
      <select
        value={localMediaType}
        onChange={(e) => setLocalMediaType(e.target.value)}
        className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
      >
        <option value="images">Images</option>
        <option value="videos">Videos</option>
      </select>
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search for media..."
        className="p-2 rounded-md w-1/2 md:w-1/3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
      />
      <button
        type="submit"
        className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;