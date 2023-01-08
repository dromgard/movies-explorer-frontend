import React from "react";

function MoviesCard({ image, title, duration, isFavourite }) {

  return (
    <article className="moviescard">
      <img
        src={image}
        alt={title}
        className="moviescard__image"
      />
      <div className="moviescard__container">
        <h2 className="moviescard__title">{title}</h2>
        <button
          className={`${isFavourite ? "moviescard__favourites-remove" : "moviescard__favourites-add"} button`}
          type="button"
          aria-label="Добавить в избранное"
        // onClick={}
        ></button>
      </div>
      <p className="moviescard__duration">{duration}</p>
    </article>
  );
}

export default MoviesCard;
