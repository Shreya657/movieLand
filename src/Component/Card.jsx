import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Card.css';


const Card = ({movies}) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/movie/${movies.imdbID}`);
  };
  return (
    <div className='movie-card'>
     <img  className='poster' src={movies.Poster!=='N/A'?movies.Poster:"https://via.placeholder.com/300x445?text=No+Image"} alt={movies.Title} />
     <div className="movie-info">
      <h3>{movies.Title}</h3>
      <p>{movies.Year}</p>
      <button onClick={handleDetailsClick}>Details</button>
    </div>
    </div>
  )
}

export default Card
