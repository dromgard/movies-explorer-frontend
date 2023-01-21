import React, { useState } from "react";
import FilterCheckbox from "../FilterCheckbox/FilterCheckbox";
import searchButtonLine from "../../images/search-button-line.svg"
import searchButtonArrow from "../../images/search-button-arrow.svg"
import { useLocation } from "react-router-dom";

function SearchForm({ onSubmit, savedSearchName, savedSearchShorts }) {
  // States.
  const lastSearch = localStorage.getItem("request");
  const lastFiltercheckbox = (localStorage.getItem("filtercheckbox") === "true") ? true : false;
  const lastFavouriteSearch = localStorage.getItem("fav-request");
  const lastFavouriteFiltercheckbox = (localStorage.getItem("fav-filtercheckbox") === "true") ? true : false;

  const { pathname } = useLocation();

  const [searchName, setSearchName] = useState(savedSearchName);
  const [searchShorts, setSearchShorts] = useState(savedSearchShorts);
  const [isRequestEmpty, setIsRequestEmpty] = useState(false);


  // Функции обработчики.
  const handleRequest = (e) => {
    setSearchName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(searchName, searchShorts);
  }

  const handleCheckbox = (checkboxstatus) => {
    console.log("попали в чекбокс", checkboxstatus);
    onSubmit(searchName, checkboxstatus);
    setSearchShorts(checkboxstatus);
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
            value={searchName}
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
        {/* <label className="filtercheckbox">
          <input
            type="checkbox"
            className="filtercheckbox__input checkbox"
            name="checkbox"
            id="checkbox"
            aria-label="Показать короткометражки"
            checked={filtercheckbox}
            onChange={() => handleCheckbox(!filtercheckbox)}
          />
          <span className="filtercheckbox__text">Короткометражки</span>
        </label> */}
        <FilterCheckbox filtercheckbox={searchShorts} handleCheckbox={handleCheckbox} />
      </form>
    </section>
  );
}

export default SearchForm;
