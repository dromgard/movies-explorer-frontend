import React from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";

function Movies({ handleGetMovies }) {
  return (
    <>
      <SearchForm handleGetMovies={handleGetMovies} />
      <MoviesCardList />
      <section className="more-movies">
        <button
          className="more-movies-button button"
          type="button"
          aria-label="Показать больше фильмов"
          title="Показать больше фильмов"
        >Ещё</button>
      </section>
    </>
  );
}

export default Movies;
