import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './MovieDetails.css';



function MovieDetails() {

  const YOUTUBE_API_KEY = process.env.REACT_APP_YT_API_KEY;
console.log(YOUTUBE_API_KEY )
const API_URL =process.env.REACT_APP_OMDB_API_KEY ;

  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actorImages, setActorImages] = useState({});
  const [videoId, setVideoId] = useState(null);

  // Fetch movie details from OMDB
  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`${API_URL}&i=${id}`);
      const data = await response.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [id]);

  // Fetch actor images from Wikipedia
  useEffect(() => {
    const fetchActorImages = async () => {
      if (!movie?.Actors) return;

      const names = movie.Actors.split(',').map(name => name.trim());
      const images = {};

      for (let name of names) {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
          );
          const data = await res.json();
          images[name] = data.thumbnail?.source || null;
        } catch (err) {
          console.error(`Failed to fetch image for ${name}`, err);
          images[name] = null;
        }
      }

      setActorImages(images);
    };

    fetchActorImages();
  }, [movie]);

  // Fetch YouTube trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie?.Title) return;

      const query = `${movie.Title} trailer`;
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
      );
      const data = await res.json();
      const firstVideo = data.items?.[0];

      if (firstVideo) {
        setVideoId(firstVideo.id.videoId);
      }
    };

    fetchTrailer();
  }, [movie]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      {movie.Response === "True" ? (
        <>
          <h2>{movie.Title}</h2>

          <div className="actors">
            <strong>Cast:</strong>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {movie.Actors.split(',').map((actor) => {
                const name = actor.trim();
                return (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <img
                      src={actorImages[name] || `https://ui-avatars.com/api/?name=${name}`}
                      alt={name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <p>{name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Released:</strong> {movie.Released}</p>

          {videoId && (
            <div style={{ marginTop: '20px' }}>
              <h3>Trailer:</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <img src={movie.Poster} alt={movie.Title} style={{ maxWidth: '300px', marginTop: '20px' }} />
        </>
      ) : (
        <p>Error: {movie.Error}</p>
      )}
    </div>
  );
}

export default MovieDetails;
