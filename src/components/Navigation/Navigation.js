import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <Link className="link navigation__link" to="/movies" >Фильмы</Link>
        <Link className="link navigation__link navigation__link_favourites-movies" to="/saved-movies" >Сохранённые фильмы</Link>
        <Link className="button navigation__link navigation__link_account" to="/profile" >Аккаунт</Link>
      </ul>
    </nav>
  )
};

export default Navigation;
