// App.js
import React from 'react';
import MovieList from './MovieList';

function App() {
  const movieData = [
    { id: 1, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994 },
    { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972 },
    { id: 3, title: "The Dark Knight", director: "Christopher Nolan", year: 2008 },
    { id: 1, title: "Pulp Fiction", director: "Quentin Tarantino", year: 1994 }
  ];

  return (
    <div className="app">
      <h1>Movie Database</h1>
      <MovieList movies={movieData} />
    </div>
  );
}

export default App;