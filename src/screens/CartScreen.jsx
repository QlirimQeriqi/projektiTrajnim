import { useMemo, useState } from 'react';

const ALL_GENRE = 'all';

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export default function CartScreen({ movies, savedMovieIds, onSaveMovie, t }) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(ALL_GENRE);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(12);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [toast, setToast] = useState('');

  const genres = useMemo(() => {
    const unique = new Set(movies.map((movie) => movie.genre));
    return [
      { value: ALL_GENRE, label: t('cart.all') },
      ...[...unique].map((entry) => ({ value: entry, label: entry })),
    ];
  }, [movies, t]);

  const filteredMovies = useMemo(() => {
    const lowered = query.toLowerCase().trim();

    const base = movies.filter((movie) => {
      const byGenre = genre === ALL_GENRE || movie.genre === genre;
      const byQuery =
        !lowered ||
        movie.title.toLowerCase().includes(lowered) ||
        movie.description.toLowerCase().includes(lowered) ||
        movie.director.toLowerCase().includes(lowered);
      const byRating = movie.rating >= minRating;
      const byPrice = movie.price <= maxPrice;

      return byGenre && byQuery && byRating && byPrice;
    });

    const sorted = [...base];

    if (sortBy === 'rating_desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration_asc') {
      sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'title_asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [movies, query, genre, minRating, maxPrice, sortBy]);

  const quickPicks = useMemo(() => {
    return [...filteredMovies].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [filteredMovies]);

  const handleSave = (movieId) => {
    const result = onSaveMovie(movieId);
    setToast(result.message);
    window.clearTimeout(window.__qaToastTimer);
    window.__qaToastTimer = window.setTimeout(() => setToast(''), 1500);
  };

  return (
    <section className="catalog-page">
      <header className="screen-header">
        <div>
          <h2>{t('cart.title')}</h2>
          <p>{t('cart.subtitle')}</p>
        </div>
      </header>

      <div className="panel catalog-toolbar">
        <div className="catalog-search catalog-search-right">
          <label htmlFor="search">{t('cart.search')}</label>
          <input
            id="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('cart.searchPlaceholder')}
          />
        </div>

        <div className="catalog-filter-grid">
          <div>
            <label htmlFor="genre">{t('cart.genre')}</label>
            <select id="genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
              {genres.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sortBy">{t('cart.sort')}</label>
            <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="rating_desc">{t('cart.topRating')}</option>
              <option value="price_asc">{t('cart.lowestPrice')}</option>
              <option value="duration_asc">{t('cart.shortestDuration')}</option>
              <option value="title_asc">{t('cart.titleAZ')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="minRating">
              {t('cart.minRating')}: {minRating.toFixed(1)}
            </label>
            <input
              id="minRating"
              type="range"
              min="0"
              max="9"
              step="0.1"
              value={minRating}
              onChange={(event) => setMinRating(Number(event.target.value))}
            />
          </div>

          <div>
            <label htmlFor="maxPrice">
              {t('cart.maxPrice')}: EUR {maxPrice.toFixed(2)}
            </label>
            <input
              id="maxPrice"
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="catalog-summary">
        <article className="panel catalog-summary-card">
          <small>{t('cart.showing')}</small>
          <strong>{filteredMovies.length}</strong>
          <p>
            {t('cart.from')} {movies.length} {t('cart.totalTitles')}
          </p>
        </article>
        <article className="panel catalog-summary-card">
          <small>{t('cart.savedInPlan')}</small>
          <strong>{savedMovieIds.size}</strong>
          <p>{t('cart.readyForBooking')}</p>
        </article>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="catalog-layout">
        <aside className="panel catalog-aside">
          <h3>{t('cart.quickPicks')}</h3>
          <div className="catalog-aside-list">
            {quickPicks.map((movie) => (
              <button key={movie.id} type="button" className="catalog-aside-item" onClick={() => setSelectedMovie(movie)}>
                <img src={movie.image} alt={movie.title} />
                <div>
                  <h4>{movie.title}</h4>
                  <p>{movie.genre}</p>
                  <strong>
                    {movie.rating.toFixed(1)} {t('cart.ratingWord')}
                  </strong>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="catalog-grid">
          {filteredMovies.map((movie) => (
            <article
              key={movie.id}
              className="catalog-card"
              onClick={() => setSelectedMovie(movie)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedMovie(movie);
                }
              }}
            >
              <div className="catalog-cover">
                <img src={movie.image} alt={movie.title} />
                <span className="rating-pill">{movie.rating.toFixed(1)}</span>
              </div>

              <div className="catalog-card-body">
                <div className="catalog-card-top">
                  <p className="chip">{movie.genre}</p>
                  <small>{movie.year}</small>
                </div>

                <h3>{movie.title}</h3>
                <p className="desc">{movie.description}</p>

                <div className="catalog-card-meta">
                  <span>{formatDuration(movie.durationMinutes)}</span>
                  <span>{movie.language}</span>
                  <strong>EUR {movie.price.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  className={`btn full ${savedMovieIds.has(movie.id) ? 'btn-success' : 'btn-primary'}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSave(movie.id);
                  }}
                >
                  {savedMovieIds.has(movie.id) ? t('cart.savedAlready') : t('cart.saveMovie')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <img src={selectedMovie.image} alt={selectedMovie.title} />
            <div>
              <h3>{selectedMovie.title}</h3>
              <p className="modal-meta">
                {selectedMovie.genre} · {selectedMovie.year} · {formatDuration(selectedMovie.durationMinutes)}
              </p>
              <p>{selectedMovie.description}</p>

              <div className="modal-list">
                <p>
                  <strong>{t('cart.director')}:</strong> {selectedMovie.director}
                </p>
                <p>
                  <strong>{t('cart.language')}:</strong> {selectedMovie.language}
                </p>
                <p>
                  <strong>{t('cart.ageRating')}:</strong> {selectedMovie.ageRating}
                </p>
                <p>
                  <strong>{t('cart.formats')}:</strong> {selectedMovie.formats.join(', ')}
                </p>
                <p>
                  <strong>{t('cart.basePrice')}:</strong> EUR {selectedMovie.price.toFixed(2)}
                </p>
              </div>

              <div className="modal-showtimes">
                {selectedMovie.showtimes.map((slot) => (
                  <span key={slot}>{slot}</span>
                ))}
              </div>

              <p className="modal-rating">
                {t('cart.communityRating')}: {selectedMovie.rating.toFixed(1)} / 10
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className={`btn ${savedMovieIds.has(selectedMovie.id) ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleSave(selectedMovie.id)}
                >
                  {t('cart.saveToPlan')}
                </button>
                <button type="button" className="btn" onClick={() => setSelectedMovie(null)}>
                  {t('cart.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
