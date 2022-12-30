import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import NavigationAuth from "../NavigationAuth/NavigationAuth";

function Header() {
  return (
    <header className="header">
      <Link className="header__logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      <NavigationAuth />
    </header>
  );
};

export default Header;
