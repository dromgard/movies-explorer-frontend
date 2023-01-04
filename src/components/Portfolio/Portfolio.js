import React from "react";
import { Link } from "react-router-dom";

function Portfolio() {
  return (
    <section className="portfolio">
      <h2 className="portfolio__title">Портфолио</h2>
      <ul className="portfolio__container">
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/how-to-learn" target="_blank">Статичный сайт</Link></li>
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/russian-travel" target="_blank">Адаптивный сайт</Link></li>
        <li className="portfolio__links"><Link className="portfolio__link link" to="https://github.com/dromgard/react-mesto-api-full" target="_blank">Одностраничное приложение</Link></li>
      </ul>
    </section>
  );
}

export default Portfolio;
