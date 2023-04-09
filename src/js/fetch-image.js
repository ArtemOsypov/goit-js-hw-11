import axios from 'axios';

const API_KEY = '35146846-5a99dc9bb4c755dbdfcd66a7d';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiLoad {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.loadedHits = 0;
    this.per_page = 40;
  }

  async fetchImages() {
    try {
      const searchParams = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      });
      const url = `${BASE_URL}?${searchParams}`;
      const response = await axios.get(url);
      this.incrementPage();

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementLoadedHits(hits) {
    this.loadedHits += hits.length;
  }

  resetLoadedHits() {
    this.loadedHits = 0;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
