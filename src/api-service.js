import axios from 'axios';

export default class NewsApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;  
      this.PER_PAGE = 40;  
      
    }
    async fetchGallery() {
      const axiosOptions = {
        method: 'get',
        url: 'https://pixabay.com/api/',
        params: {
          key: '34557822-7f1cb8b4f49893e5debfda339',
          q: `${this.searchQuery}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: `${this.page}`,
          per_page: `${this.PER_PAGE}`,     
      }
    };
    try {
      const response = await axios(axiosOptions);

      const data = response.data;
      // console.log(data)
      this.incrementPage();
      return data;
    } catch (error) {
      console.error(error);
    }
  }   
  
    incrementPage() {
      this.page += 1;
    }
  
    resetPage() {
      this.page = 1;
    }

    resetEndOfHits() {
      this.endOfHits = false;
    }  
    
  
    get query() {
      return this.searchQuery;
    }
  
    set query(newQuery) {
      this.searchQuery = newQuery;
    } 
  }
