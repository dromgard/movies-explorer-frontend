import React from "react";
import FilterCheckbox from "../FilterCheckbox/FilterCheckbox";
import searchButtonLine from "../../images/search-button-line.svg"
import searchButtonArrow from "../../images/search-button-arrow.svg"

function SearchForm() {
  return (
    <section className="search-form">
      <form className="search-form__form" name="search-form">
        <div className="search-form__container">
          <input
            className="search-form__input input"
            type="text"
            id="search-input"
            aria-label="Введите название фильма"
            placeholder="Фильм"
            name="search-input"
          />
          <button
            className="search-form__submit button"
            type="submit"
            aria-label="Найти фильм"
            title="Найти фильм"
          >
            <img src={searchButtonLine} alt="Поиск" />
            <img src={searchButtonArrow} alt="Поиск" />
          </button>
        </div>
        <FilterCheckbox />
      </form>
    </section>
  );
}

export default SearchForm;
