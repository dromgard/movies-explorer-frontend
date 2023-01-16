import React, { useState } from "react";
import FilterCheckbox from "../FilterCheckbox/FilterCheckbox";
import searchButtonLine from "../../images/search-button-line.svg"
import searchButtonArrow from "../../images/search-button-arrow.svg"

function SearchForm({ handleGetMovies }) {
  // States.
  const lastSearch = localStorage.getItem("request");
  const lastFiltercheckbox = (localStorage.getItem("filtercheckbox") === "true") ? true : false;

  const [request, setRequest] = useState(lastSearch || "");
  const [filtercheckbox, setFiltercheckbox] = useState(lastFiltercheckbox);

  // Функции обработчики.
  const handleRequest = (e) => {
    setRequest(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем не пустой ли запрос.
    if (request === "") {
      console.log("Введите запрос");
      return;
    }

    handleGetMovies(request, filtercheckbox);
  }

  return (
    <section className="search-form">
      <form className="search-form__form" name="search-form" onSubmit={handleSubmit}>
        <div className="search-form__container">
          <input
            className="search-form__input input"
            type="text"
            id="search-input"
            aria-label="Введите название фильма"
            placeholder="Фильм"
            name="search-input"
            value={request}
            onChange={handleRequest}
            required
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
        <FilterCheckbox filtercheckbox={filtercheckbox} handleCheckbox={setFiltercheckbox} />
      </form>
    </section>
  );
}

export default SearchForm;
