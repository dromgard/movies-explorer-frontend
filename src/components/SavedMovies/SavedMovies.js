import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import SearchForm from "../SearchForm/SearchForm";

function SavedMovies({
  needUpdate,
  isFiltering,
  loadSavedMoviesData,
  onSaveMovie,
  savedMovies,
  isSavedMoviesEmpty,
  isLoadingData,
  handleSearchSavedMovies,
  isFavouritesMoviesApiError,
  isNoSavedMoviesFound,
}) {

  const savedSearchName = localStorage.getItem("search-name-saved") || "";
  const savedSearchShorts = (localStorage.getItem("search-isShorts-saved") === "true") ? true : false;

  console.log("savedSearchName", savedSearchName)
  console.log("savedSearchShorts", savedSearchShorts)

  const handleSubmit = (request, filtercheckbox) => {
    handleSearchSavedMovies(request, filtercheckbox);
  }




  let location = useLocation();

  useEffect(() => {
    handleSearchSavedMovies(savedSearchName, savedSearchShorts);
  }, [])

  // const handleUpdateMovies = () => {
  //   if (!isFiltering && !needUpdate) {
  //     loadSavedMoviesData();
  //     return;
  //   }

  //   if (needUpdate) {
  //     loadSavedMoviesData();
  //     return;
  //   }
  // };

  // useEffect(() => {

  //   handleUpdateMovies();

  // }, [savedMovies])

  return (
    <>
      <SearchForm onSubmit={handleSubmit} savedSearchName={savedSearchName} savedSearchShorts={savedSearchShorts} />
      {!isLoadingData && isSavedMoviesEmpty && (
        <span className="section-text section-text_movies">В избранном пусто</span>
      )}
      {isLoadingData && (
        <Preloader />
      )}
      {!isLoadingData && isNoSavedMoviesFound && (
        <span className="section-text section-text_movies">Ничего не нашли.</span>
      )}
      {isFavouritesMoviesApiError && (
        <span className="section-text section-text_movies">Во время запроса произошла ошибка.
          Возможно, проблема с соединением или сервер недоступен.
          Подождите немного и попробуйте ещё раз.</span>
      )}
      <MoviesCardList
        data={savedMovies}
        locationPathname={location.pathname}
        onSaveMovie={onSaveMovie}
      />
    </>
  );
}

export default SavedMovies;
