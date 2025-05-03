import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import MovieDetails from './Component/MovieDetails';
import Card from './Component/Card'
const API_URL="http://www.omdbapi.com/?&apikey=69f646ff";

function App() {
  const[movie,setMovie]=useState([]);
  const[query,setQuery]=useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const searchMovies=async(title)=>{
    const response= await fetch(`${API_URL}&s=${title}`);
    const data=await response.json();
    setMovie(data.Search || []);
  }


 
 
  useEffect(()=>{
    searchMovies("avengers");
  },[])
  useEffect(() => {
    console.log("Selected movie updated:", selectedMovie);
  }, [selectedMovie]);


  return (
    <div>
    <div className="App">
    <h1 className="animated-title">
  {"MovieLand...".split("").map((char, index) => (
    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
      {char}
    </span>
  ))}
</h1>

      <Routes>
        <Route 
          path="/" 
          element={
            <div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder='Search your movie' 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && searchMovies(query)} 
                />
                <img className='search'
                  src="https://img.icons8.com/ios-filled/50/000000/search--v1.png" 
                  alt="search" 
                  onClick={() => searchMovies(query)} 
                  style={{ cursor: "pointer", width: "24px" }}
                />
              </div>

              {
                movie?.length > 0 ? (
                  <div className="card-container">
                    {
                      movie.map((movie1) => (
                        <Card key={movie1.imdbID} movies={movie1} />
                      ))
                    }
                  </div>
                ) : (
                  <div><h2>No Movies Found</h2></div>
                )
              }
            </div>
          } 
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  
  </div>  
  )}


export default App
