import React, { useEffect, useState } from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";
import Preloader from "../Preloader/Preloader";
import { useLocation } from "react-router-dom";

function Movies({
  isLoadingData,
  resStatus,
  moviesData,
  onSubmit,
  onSaveMovie,
  onDeleteSavedMovie,
  isNoMoviesFound,
}) {

  let location = useLocation();

  const [isMoviesApiError, setIsMoviesApiError] = useState(false);

  // Обработчик кнопки "Поиск".
  const handleSubmit = (request, filtercheckbox) => {
    onSubmit(request, filtercheckbox);
  }

  const handleErrors = () => {
    if (resStatus) {
      switch (resStatus) {
        case 200:
          setIsMoviesApiError(false);
          break;
        default:
          setIsMoviesApiError(true);
          break;
      };
    };
  };

  // Проверяем есть ли в массиве фильмы - если нет, грузим из локалки.
  const getPreviousSerachMovies = (moviesData) => {
    if (moviesData.length === 0) {
      return JSON.parse(localStorage.getItem('filtered-previously-movies'));
    }
    return moviesData;
  }

  useEffect(() => {
    handleErrors();
  }, [resStatus])

  return (
    <>
      <SearchForm onSubmit={handleSubmit} />
      {!isLoadingData && isNoMoviesFound && (
        <span className="profile-form__input-error">NO_MOVIES_FOUND</span>
      )}
      {isLoadingData && (
        <Preloader />
      )}
      {isMoviesApiError && (
        <span className="profile-form__input-error">MOVIES_ERRORS_TEXTS</span>
      )}
      <MoviesCardList
        // data={moviesData}
        data={getPreviousSerachMovies(moviesData)}
        locationPathname={location.pathname}
        onSaveMovie={onSaveMovie}
        onDeleteSavedMovie={onDeleteSavedMovie}
      />
    </>
  );
}

export default Movies;
