import React, { useEffect, useState } from "react";

function MoviesCard({
  data,
  locationPathname,
  onSaveMovie,
  onDeleteSavedMovie,
}) {

  // Получаем постер фильма.
  const getImage = (path) => {
    if (locationPathname === '/saved-movies') {
      return data.image;
    } else if (locationPathname === '/movies') {
      return `https://api.nomoreparties.co/${path}`;
    }
  }

  // Получаем красивую продолжительность фильма.
  const getDuration = (mins) => {
    let hours = Math.trunc(mins / 60);
    let minutes = mins % 60;
    let renderHours = hours === 0 ? '' : `${hours}ч`;
    let renderminutes = minutes === 0 ? '' : `${minutes}м`;
    return `${renderHours} ${renderminutes}`;
  }

  const [movieData, setMovieData] = useState({
    country: data.country || 'Нет данных',
    director: data.director || 'Нет данных',
    duration: data.duration || 0,
    year: data.year || 'Нет данных',
    description: data.description || 'Нет данных',
    image: getImage(data.image.url),
    trailerLink: data.trailerLink,
    nameRU: data.nameRU || 'Нет данных',
    nameEN: data.nameEN || 'Нет данных',
    movieId: data.id,
    thumbnail: getImage(data.image.url),
  })

  const [isFavourite, setisFavourite] = useState(data.saved);

  useEffect(() => {
    if (locationPathname === '/saved-movies') {
      setisFavourite(false);
    } else if (locationPathname === '/movies') {
      setisFavourite(data.saved ? false : true)
    }
  }, [data.saved, locationPathname])

  // Обработчик сохранения и удаления фильмов из избранного.
  const handleClickFavoriteButton = () => {
    // Если мы на странице "Фильмы"...
    if (locationPathname === '/movies') {
      // и фильм не в избранном, то сохраняем в избранное.
      if (!data.saved) {
        // console.log("Сохранили в избранное карточка", data.saved);
        onSaveMovie(movieData);
      } else {
        // А если в избранном, то удаляем.

        onDeleteSavedMovie(data.id);
        // console.log("Удалили из избранного карточка", data.saved);
      }
      // Со страницы "Сохраненные фильмы" только удаляем из избранного.
    } else if (locationPathname === '/saved-movies') {
      onDeleteSavedMovie(data._id, data.movieId);
    }
  };

  // console.log(data.nameRU, data.saved)

  return (
    <article className="moviescard">
      <img
        src={movieData.image}
        alt={movieData.nameRU || movieData.nameEN}
        className="moviescard__image"
      />
      <div className="moviescard__container">
        <h2 className="moviescard__title">{movieData.nameRU || movieData.nameEN}</h2>
        <button
          className={`${isFavourite ? "moviescard__favourites-add" : "moviescard__favourites-remove"} button`}
          type="button"
          aria-label="Добавить в избранное"
          title="Добавить в избранное"
          onClick={handleClickFavoriteButton}
        ></button>
      </div>
      <p className="moviescard__duration">{getDuration(data.duration)}</p>
    </article>
  );
}

export default MoviesCard;
