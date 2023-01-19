import React, { useEffect, useState } from "react";
import MoviesCard from "../MoviesCard/MoviesCard";
import useCurrentSize from "../../utils/useCurrentSize";

function MoviesCardList({
  locationPathname,
  data,
  onSaveMovie,
  onDeleteSavedMovie,
}) {

  const size = useCurrentSize();

  // Данные для перерендера массива фильмов в зависимости от ширины экрана.
  const resizeConstants = {
    xl: {
      width: 1280,
      moviesToRender: 16,
      moviesToAdd: 4,
    },
    large: {
      width: 1024,
      moviesToRender: 12,
      moviesToAdd: 3,
    },
    medium: {
      width: 990,
      moviesToRender: 8,
      moviesToAdd: 2,
    },
    small: {
      width: 768,
      moviesToRender: 5,
      moviesToAdd: 1,
    }
  }

  // States
  const [randerChanged, setRanderChanged] = useState(false);
  const [moviesToRender, setMoviesToRender] = useState([]);
  const [isShowButtonActive, setIsShowButtonActive] = useState(false);
  const [numberMoviesToRender, setNumberMoviesToRender] = useState(0);
  const [numberMoviesToAdd, setNumberMoviesToAdd] = useState(0);

  // Устанавливаем количесвто фильмом для загрузки и для добавления в зависимости от ширины окна.
  const countNumberMoviesToRender = () => {
    if (size.width >= resizeConstants.xl.width) {
      setNumberMoviesToRender(resizeConstants.xl.moviesToRender);
      setNumberMoviesToAdd(resizeConstants.xl.moviesToAdd);
    } else if (size.width < resizeConstants.xl.width && size.width >= resizeConstants.large.width) {
      setNumberMoviesToRender(resizeConstants.large.moviesToRender);
      setNumberMoviesToAdd(resizeConstants.large.moviesToAdd);
    } else if (size.width < resizeConstants.medium.width && size.width >= resizeConstants.small.width) {
      setNumberMoviesToRender(resizeConstants.medium.moviesToRender);
      setNumberMoviesToAdd(resizeConstants.medium.moviesToAdd);
    } else if (size.width < resizeConstants.small.width) {
      setNumberMoviesToRender(resizeConstants.small.moviesToRender);
      setNumberMoviesToAdd(resizeConstants.small.moviesToAdd);
    };
  };

  // По кнопке "Ещё" добавляем к длине массива фильмов новые элементы для рендера.
  const handleShowMoreMoviesButtonClick = () => {
    setRanderChanged(!randerChanged);
    if (data) {
      setMoviesToRender(data.slice(0, moviesToRender.length + numberMoviesToAdd));
      if (moviesToRender.length >= data.length - numberMoviesToAdd) {
        setIsShowButtonActive(false);
      }
    }

  }

  // Перерисовываем страницу после изменения ширины окна.
  useEffect(() => {
    countNumberMoviesToRender();
  }, [size.width])

  // Перерисовываем страницу после изменения массива или изменения количества фильмов для рендера.
  useEffect(() => {
    if (data) {
      setMoviesToRender(data.slice(0, numberMoviesToRender));
      if (data.length <= numberMoviesToRender) {
        setIsShowButtonActive(false);
      } else {
        setIsShowButtonActive(true);
      };
    }
  }, [data, numberMoviesToRender])

  // Генерируем разметку массива фильмов.
  const moviesCardsMarkup = moviesToRender.map((item) => (
    <MoviesCard
      key={item.id || item._id}
      data={item}
      locationPathname={locationPathname}
      onSaveMovie={onSaveMovie}
      onDeleteSavedMovie={onDeleteSavedMovie}
    />
  ))

  return (
    <>
      <section className="moviescardlist">
        {moviesCardsMarkup}
      </section>

      {isShowButtonActive ? (
        <section className="more-movies">
          <button
            className="more-movies-button button"
            type="button"
            aria-label="Показать больше фильмов"
            title="Показать больше фильмов"
            onClick={handleShowMoreMoviesButtonClick}
          >Ещё</button>
        </section>
      ) : null}

    </>
  );
}

export default MoviesCardList;
