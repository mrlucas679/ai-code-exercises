import { render, screen } from '@testing-library/react';
import App from './App';
import MovieList from './MovieList';

test('renders the movie database title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Movie Database/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders a list of movies', () => {
  render(<App />);
  const movieElements = screen.getAllByText(/Directed by:/i);
  expect(movieElements.length).toBeGreaterThan(0);
});

test('MovieList renders the correct number of movies', () => {
  const testMovies = [
    { id: 1, title: "Test Movie 1", director: "Director 1", year: 2021 },
    { id: 2, title: "Test Movie 2", director: "Director 2", year: 2022 },
    { id: 3, title: "Test Movie 3", director: "Director 3", year: 2023 },
  ];
  
  render(<MovieList movies={testMovies} />);
  const movieTitles = screen.getAllByRole('heading', { level: 3 });
  expect(movieTitles).toHaveLength(3);
});

// This test will pass even with the key warning issue
test('MovieList renders movie details correctly', () => {
  const testMovie = { id: 1, title: "Test Movie", director: "Test Director", year: 2020 };
  
  render(<MovieList movies={[testMovie]} />);
  expect(screen.getByText("Test Movie")).toBeInTheDocument();
  expect(screen.getByText(/Directed by: Test Director/i)).toBeInTheDocument();
  expect(screen.getByText(/Released: 2020/i)).toBeInTheDocument();
});