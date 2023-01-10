import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import NavigationAuth from "../NavigationAuth/NavigationAuth";

function Header({ isMainPage, togglePopupMenu }) {
  return (
    <header className={`header ${isMainPage ? '' : 'header_light-theme'}`}>
      <Link className="button header__logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      {isMainPage ? <NavigationAuth /> : <Navigation />}
      <button
        className={`button ${isMainPage ? "header__burger-menu_invisible" : "header__burger-menu"}`}
        type="button"
        title="Открыть меню"
        aria-label="Открыть меню"
        onClick={togglePopupMenu}
      />
    </header>
  );
};

export default Header;
