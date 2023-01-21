const searchFilter = (name = '', isShorts = false, movies) => {

  return movies.filter((movie) => {
    const isValidName = movie.nameRU.toLowerCase().includes(name.toLowerCase());
    const isMovieShort = isShorts ? movie.duration <= 40 : true;
    // console.log('isMovieShort', isMovieShort)
    // console.log('movie.duration', movie.duration)



    return isValidName && isMovieShort;
  })
}

export default searchFilter;
