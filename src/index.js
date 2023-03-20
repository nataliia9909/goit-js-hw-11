import './sass/index.scss';

import NewsApiService from './api-service';
import { lightbox } from './simlelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');   

let isShown = 0;
const newsApiService = new NewsApiService();   
  
searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3
};
const intersectionObserver = new IntersectionObserver(onLoadMoreBtn, options);

   function onSearchForm(e) {
     e.preventDefault(); 

     galleryContainer.innerHTML = '';       
     newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
     newsApiService.resetPage();   
          
     if (newsApiService.query === '') {
         Notify.warning('Please, fill the main field');  
      return;
     }       
    
     isShown = 0;
    fetchGallery();  
    createGallery(hits);
    
   }
   
   function onLoadMoreBtn() {      
    newsApiService.incrementPage();
    fetchGallery();
  }   

  async function fetchGallery() {
    loadMoreBtn.classList.add('is-hidden');
    
    const { hits, total } = await newsApiService.fetchGallery();
    isShown += hits.length;

    if (!hits.length) {
      Notify.warning(
        `Sorry, there are no images matching your search query. Please try again.`,
      );
      loadMoreBtn.classList.add('is-hidden');
      return;
    };  

   createGallery(hits);
    isShown += hits.length;

    if (isShown < total) {
        Notify.success(`Hooray! We found ${total} images !!!`);       ;
        loadMoreBtn.classList.remove('is-hidden');
    }
    if (isShown >= total) {
        Notify.info(
            'We re sorry, but you have reached the end of search results.'
        );
    }
  }


 function  createGallery(elements) {
  const markup = elements.map(({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
  }) => {
    return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
  }).join('');
       galleryContainer.insertAdjacentHTML('beforeend', markup);
       lightbox.refresh();      
}   

