import React from "react";
import { Link } from "react-router-dom";

function PopupMenu({ isOpen, togglePopupMenu }) {
  return (
    <div className={`popup-menu ${isOpen ? "popup-menu_opened" : ""}`}>
      <div className="popup-menu__container">
        <button
          className="button popup-menu__close"
          type="button"
          aria-label="Закрыть меню"
          onClick={togglePopupMenu}
        ></button>
        <nav className="popup-menu__navigation">
          <ul className="popup-menu__list">
            <Link className="link popup-menu__link" to="/" onClick={togglePopupMenu} >Главная</Link>
            <Link className="link popup-menu__link" to="/movies" onClick={togglePopupMenu} >Фильмы</Link>
            <Link className="link popup-menu__link navigation__link_favourites-movies" to="/saved-movies" onClick={togglePopupMenu} >Сохранённые фильмы</Link>
          </ul>
          <Link className="link popup-menu__link popup-menu__link_account" to="/profile" onClick={togglePopupMenu} >Аккаунт</Link>
        </nav>


      </div>
    </div>
  );
}

export default PopupMenu;
