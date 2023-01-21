import React, { useState } from "react";
import FilterCheckbox from "../FilterCheckbox/FilterCheckbox";
import searchButtonLine from "../../images/search-button-line.svg"
import searchButtonArrow from "../../images/search-button-arrow.svg"
import { useLocation } from "react-router-dom";

function SearchForm({ onSubmit }) {
  // States.
  const lastSearch = localStorage.getItem("request");
  const lastFiltercheckbox = (localStorage.getItem("filtercheckbox") === "true") ? true : false;
  const lastFavouriteSearch = localStorage.getItem("fav-request");
  const lastFavouriteFiltercheckbox = (localStorage.getItem("fav-filtercheckbox") === "true") ? true : false;

  const { pathname } = useLocation();

  const [request, setRequest] = useState(pathname === "/movies" ? lastSearch || "" : lastFavouriteSearch || "");
  const [filtercheckbox, setFiltercheckbox] = useState(pathname === "/movies" ? lastFiltercheckbox : lastFavouriteFiltercheckbox);
  const [isRequestEmpty, setIsRequestEmpty] = useState(false);


  // Функции обработчики.
  const handleRequest = (e) => {
    setRequest(e.target.value)

    if (e.target.value) {
      setIsRequestEmpty(false)
    } else {
      setIsRequestEmpty(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем не пустой ли запрос.
    if (isRequestEmpty) {
      setIsRequestEmpty(true)
      console.log("Введите запрос");
      return;
    }

    onSubmit(request, filtercheckbox);
  }

  const handleCheckbox = (checkboxstatus) => {
    setFiltercheckbox(checkboxstatus);
    // Проверяем не пустой ли запрос.
    if (isRequestEmpty) {
      setIsRequestEmpty(true)
      console.log("Введите запрос");
      // return;
    }

    onSubmit(request, checkboxstatus);
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
        <span className="search-form__input-error">{isRequestEmpty && "Введите запрос"}</span>
        <FilterCheckbox filtercheckbox={filtercheckbox} handleCheckbox={handleCheckbox} />
      </form>
    </section>
  );
}

export default SearchForm;
