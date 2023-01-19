import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";

function SavedMovies({
  loadSavedMoviesData,
  onDeleteSavedMovie,
  savedMovies,
  isSavedMoviesEmpty,
  isLoadingData,
  handleSearchSavedMoviesData,
  getSavedMoviesResStatus,
  isNoSavedMoviesFound,
}) {

  const [isMoviesApiError, setIsMoviesApiError] = useState(false);

  const handleSubmit = (request, filtercheckbox) => {
    handleSearchSavedMoviesData(request, filtercheckbox);
  }

  let location = useLocation();

  const handleErrors = () => {
    if (getSavedMoviesResStatus) {
      switch (getSavedMoviesResStatus) {
        case 200:
          setIsMoviesApiError(false);
          break;
        default:
          setIsMoviesApiError(true);
          break;
      };
    };
  };

  useEffect(() => {
    handleErrors();
  }, [getSavedMoviesResStatus])

  useEffect(() => {
    loadSavedMoviesData();
  }, [])

  useEffect(() => {
    loadSavedMoviesData();
  }, [savedMovies])

  return (
    <>
      <SearchForm onSubmit={handleSubmit} />
      {!isLoadingData && isSavedMoviesEmpty && (
        <span className="profile-form__input-error">В избранном ничего нет</span>
      )}
      {!isLoadingData && isNoSavedMoviesFound && (
        <span className="profile-form__input-error">Ничего не найдено</span>
      )}
      {isMoviesApiError && (
        <span className="profile-form__input-error">Во время запроса произошла ошибка.
          Возможно, проблема с соединением или сервер недоступен.
          Подождите немного и попробуйте ещё раз</span>
      )}
      <MoviesCardList
        data={savedMovies}
        locationPathname={location.pathname}
        onDeleteSavedMovie={onDeleteSavedMovie}
      />
    </>
  );
}

export default SavedMovies;
