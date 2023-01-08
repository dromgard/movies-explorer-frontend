import React from "react";
import MoviesCard from "../MoviesCard/MoviesCard";
import moviePic1 from "../../images/movie-pic-1.png";
import moviePic2 from "../../images/movie-pic-2.png";
import moviePic3 from "../../images/movie-pic-3.png";
import moviePic4 from "../../images/movie-pic-4.png";

function MoviesCardList() {

  // Временная БД с фильмами, на следующем этапе удалить.
  const moviesTemp = [
    {
      id: 1,
      image: moviePic1,
      title: "31 слово о дизайне",
      duration: "1ч41м",
      isFavourite: true,
    },
    {
      id: 2,
      image: moviePic2,
      title: "32 слова о дизайне",
      duration: "1ч42м",
      isFavourite: false,
    },
    {
      id: 3,
      image: moviePic3,
      title: "33 слова о дизайне",
      duration: "1ч43м",
      isFavourite: true,
    },
    {
      id: 4,
      image: moviePic4,
      title: "34 слова о дизайне",
      duration: "1ч44м",
      isFavourite: false,
    },
    {
      id: 5,
      image: moviePic1,
      title: "31 слово о дизайне",
      duration: "1ч41м",
      isFavourite: true,
    },
    {
      id: 6,
      image: moviePic2,
      title: "32 слова о дизайне",
      duration: "1ч42м",
      isFavourite: false,
    },
    {
      id: 7,
      image: moviePic3,
      title: "33 слова о дизайне",
      duration: "1ч43м",
      isFavourite: true,
    },
    {
      id: 8,
      image: moviePic4,
      title: "34 слова о дизайне",
      duration: "1ч44м",
      isFavourite: false,
    },
  ];

  const movies = moviesTemp.map((card) => (
    <MoviesCard
      key={card.id}
      image={card.image}
      title={card.title}
      duration={card.duration}
      isFavourite={card.isFavourite}
    />
  ));

  return (
    <section className="moviescardlist">
      {movies}
    </section>
  );
}

export default MoviesCardList;
