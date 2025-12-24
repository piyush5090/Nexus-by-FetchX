import axios from "axios";

const UNSPLASH_KEYS = process.env.UNSPLASH_ACCESS_KEY
  ? process.env.UNSPLASH_ACCESS_KEY.split(",").map(k => k.trim()).filter(Boolean)
  : [];

if (UNSPLASH_KEYS.length === 0) {
  throw new Error("❌ UNSPLASH_ACCESS_KEY missing in .env");
}

const BASE_URL = "https://api.unsplash.com";
let currentKeyIndex = 0;

/* ---------- INTERNAL HELPER ---------- */
async function fetchWithRotation(url, params = {}) {
  let attempts = 0;

  while (attempts < UNSPLASH_KEYS.length) {
    const key = UNSPLASH_KEYS[currentKeyIndex];
    try {
      const res = await axios.get(url, {
        params,
        headers: {
          Authorization: `Client-ID ${key}`,
        },
      });
      return res;
    } catch (err) {
      const status = err.response?.status;

      // Rotate key on quota or auth failure
      if (status === 401 || status === 403 || status === 429) {
        console.warn(
          `⚠️ Unsplash key issue (status: ${status}, key index: ${currentKeyIndex}), rotating...`
        );
        currentKeyIndex = (currentKeyIndex + 1) % UNSPLASH_KEYS.length;
        attempts++;
        continue;
      }
      // For other errors, throw a more informative message
      throw new Error(`Unsplash API request failed with status ${status}: ${err.message}`);
    }
  }

  throw new Error("❌ All Unsplash API keys are exhausted or invalid.");
}

/* ---------- COUNTS ---------- */
export async function getUnsplashCount(query) {
  const res = await fetchWithRotation(
    `${BASE_URL}/search/photos`,
    {
      query,
      page: 1,
      per_page: 1,
    }
  );

  return {
    images: res.data.total || 0,
  };
}

/* ---------- IMAGES ---------- */
export async function getUnsplashImages(query, page = 1, perPage = 30) {
  const res = await fetchWithRotation(
    `${BASE_URL}/search/photos`,
    {
      query,
      page,
      per_page: perPage,
    }
  );

  return {
    page,
    perPage,
    total: res.data.total || 0,
    items: res.data.results || [],
  };
}
