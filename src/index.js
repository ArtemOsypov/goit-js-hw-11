import { createGalleryMarkup } from './js/gallary-markup.js';
import ImagesApiLoad from './js/fetch-image.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  input: document.querySelector('#search-form'),
  btnSearch: document.querySelector('.button-search'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.input.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);
loadMoreBtnDisabled();

let lightbox = 0;
const imagesApiLoad = new ImagesApiLoad();

function onSearch(e) {
  e.preventDefault();
  imagesApiLoad.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApiLoad.resetPage();
  imagesApiLoad.resetLoadedHits();
  clearGelleryContainer();

  if (imagesApiLoad.query === '') {
    return Notiflix.Notify.failure('Введите поисковый запрос');
  }

  imagesApiLoad
    .fetchImages()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      imagesApiLoad.loadedHits = imagesApiLoad.per_page;
      refs.galleryContainer.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(hits)
      );
      loadMoreBtnactive();
      lightbox = new SimpleLightbox('.gallery  a', {
        captionDelay: 250,
        scrollZoom: false,
        captionsData: 'alt',
        captionPosition: 'bottom',
      });
    })
    .catch();
}

function onLoadMore() {
  imagesApiLoad.fetchImages().then(({ hits, totalHits }) => {
    if (Math.ceil(totalHits / imagesApiLoad.per_page) === imagesApiLoad.page) {
      loadMoreBtnDisabled();
      return Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    }
    imagesApiLoad.incrementLoadedHits(hits);

    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(hits)
    );
  });
}

function clearGelleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function loadMoreBtnDisabled() {
  refs.btnLoadMore.disabled = true;
  refs.btnLoadMore.classList.add('is-hidden');
}

function loadMoreBtnactive() {
  refs.btnLoadMore.disabled = false;
  refs.btnLoadMore.classList.remove('is-hidden');
}
