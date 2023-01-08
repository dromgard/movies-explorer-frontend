import React from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";

function Movies() {
  return (
    <>
      <SearchForm />
      <MoviesCardList />
      <section className="more-movies">
        <button
          className="more-movies-button button"
          type="button"
          aria-label="Показать больше фильмов"
        >Ещё</button>
      </section>
    </>
  );
}

export default Movies;
