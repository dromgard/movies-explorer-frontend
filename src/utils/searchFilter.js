const searchFilter = (request = '', filtercheckbox = false, moviesData) => {

  // Фильтруем по тексту запроса.
  const filterRequest = (movie) => {
    return JSON.stringify(movie).toLocaleLowerCase().includes(request.toLowerCase())
  }

  // Фильтруем по короткометражкам.
  const filterShortfilm = (movie) => {
    return movie.duration <= 40;
  }

  if (filtercheckbox) {
    return moviesData.filter(filterShortfilm).filter(filterRequest);
  } else {
    return moviesData.filter(filterRequest);
  }
}

export default searchFilter;
