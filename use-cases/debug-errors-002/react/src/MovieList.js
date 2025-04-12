// MovieList.js
import React from 'react';
import './MovieList.css';

const Movie = ({ title, director, year }) => {
  return (
    <div className="movie-card">
      <h3>{title}</h3>
      <p>Directed by: {director}</p>
      <p>Released: {year}</p>
    </div>
  );
};

const MovieList = ({ movies }) => {
  return (
    <div className="movie-list">
      <h2>Featured Movies</h2>
      {movies.map((movie) => (
        <Movie
          title={movie.title}
          director={movie.director}
          year={movie.year}
        />
      ))}
    </div>
  );
};

export default MovieList;