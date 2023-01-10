import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import NavigationAuth from "../NavigationAuth/NavigationAuth";

function Header({ isMainPage, togglePopupMenu }) {
  return (
    <header className={`header ${isMainPage ? '' : 'header_light-theme'}`}>
      <Link className="button logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      {isMainPage ? <NavigationAuth /> : <Navigation />}
      <button
        className={`button header__burger-menu ${isMainPage ? "header__burger-menu_invisible" : ""}`}
        type="button"
        title="Открыть меню"
        aria-label="Открыть меню"
        onClick={togglePopupMenu}
      />
    </header>
  );
};

export default Header;
