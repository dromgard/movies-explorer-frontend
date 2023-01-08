import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import NavigationAuth from "../NavigationAuth/NavigationAuth";

function Header({ isMainPage }) {
  return (
    <header className={`header ${isMainPage ? '' : 'header_light-theme'}`}>
      <Link className="button header__logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      {isMainPage ? <NavigationAuth /> : <Navigation />}
    </header>
  );
};

export default Header;
