import React from "react";
import { Link } from "react-router-dom";

function Portfolio() {
  return (
    <section className="portfolio">
      <h4 className="portfolio__title">Портфолио</h4>
      <ul className="portfolio__container">
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/how-to-learn">Статичный сайт</Link></li>
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/russian-travel">Адаптивный сайт</Link></li>
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/react-mesto-api-full">Одностраничное приложение</Link></li>
      </ul>
    </section>
  );
}

export default Portfolio;
