import ImagesApiLoad from './js/fetch-image';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  input: document.querySelector('#search-form'),
  btnSearch: document.querySelector('.button-search'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.input.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);
const imagesApiLoad = new ImagesApiLoad();

function onSearch(e) {
  e.preventDefault();
  imagesApiLoad.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApiLoad.resetPage();
  imagesApiLoad.resetLoadedHits();
  clearGelleryContainer();
  console.log(e.currentTarget.elements.searchQuery.value.trim());
  console.log(imagesApiLoad.query);

  if (imagesApiLoad.query === '') {
    console.log('Введите поисковый запрос');
    return;
  }
  imagesApiLoad
    .fetchImages()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        console.log('Ничего не найдено, повторите запрос!');
        return;
      }
      console.log(`найдено ${totalHits} картинок`);
      console.log(hits);
      console.log(totalHits);
      console.log(hits.length);

      createGalleryMarkup(hits);

      //   return response.data;
    })
    .catch();
}

function onLoadMore() {
  imagesApiLoad.incrementLoadedHits();
  console.log(imagesApiLoad.incrementLoadedHits());
  imagesApiLoad
    .fetchImages()
    .then(({ hits, totalHits }) => {
      console.log(hits);

      createGalleryMarkup(hits);

      //   return response.data;
    })
    .catch();
}

// async function fetchImages(searchQuery) {
//   const searchParams = new URLSearchParams({
//     key: API_KEY,
//     q: searchQuery,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     page: 1,
//     per_page: 40,
//   });
//   const url = `${BASE_URL}?${searchParams}`;
//   const response = await axios.get(url);
//   //   this.incrementPage();

//   return response.data;
// }

function createGalleryMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
      <a href="${webformatURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearGelleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
