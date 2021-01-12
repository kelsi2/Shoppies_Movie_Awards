import {useEffect, useState} from 'react';
import Searchbar from './Searchbar';
import MovieList from './MovieList';
import Nominations from './Nominations';
import MaxNominations from './MaxNominations';

export default function Search() {
  // Set state of search field and search results
  const [term, setTerm] = useState('');
  const [movies, setMovies] = useState([]);
  // Loading state for search results, set to false until search is in progress
  const [loading, setLoading] = useState(false);
  const [nominated, setNominated] = useState([]);
  
  useEffect(() => {
    // Append search term "t=<movie title>" to API_URL to perform a search
    const API_URL = `http://www.omdbapi.com/?s=${term}&type=movie&apikey=eb5b6c31`;
    
    if (term === '') {
      setMovies([])
    }

    // Request movie data in json form and setResult state
    const getMovies = async() => {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      
      if (json.Search) {
        setMovies(json.Search);
        setLoading(false);
      }
    }
    
    getMovies(term);
  }, [term]);
  console.log(movies)
  console.log(nominated)
  
  const addNomination = (movie) => {
    // Copy new nomination to the array
    const nominationList = [...nominated, movie];
    if (nominated.length <= 5 && !nominated.includes(movie)) {
      setNominated(nominationList);
    }
  }

  const removeNomination = (movie) => {
    const newNominationList = nominated.filter((nomination) => 
      nomination.imdbID !== movie.imdbID
    );
    setNominated(newNominationList);
  }

  return (
    <>
      <main>
        <Searchbar term={term} loading={loading} onSearch={(term) => setTerm(term)} />
        <MaxNominations nominated={nominated} />
        <div className="search-results">
          <MovieList movies={movies} handleNominationClick={addNomination} nominated={nominated} />
        </div>
        <div className="nomination-results">
          <Nominations movies={nominated} handleRemoveClick={removeNomination} />
        </div>
      </main>
    </>
  );
}