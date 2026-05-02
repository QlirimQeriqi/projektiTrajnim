import { useEffect, useMemo, useState } from 'react';

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export default function ShopScreen({
  movies,
  selectedCount,
  onGoMovies,
  onGoPlan,
  onSaveMovie,
  savedMovieIds,
  t,
}) {
  const slides = useMemo(() => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6), [movies]);
  const [current, setCurrent] = useState(0);
  const [selectedBestMovie, setSelectedBestMovie] = useState(null);
  const [toast, setToast] = useState('');

  const trendingNow = useMemo(
    () => [...movies].sort((a, b) => b.year - a.year || b.rating - a.rating).slice(0, 10),
    [movies]
  );
  const bestRated = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10),
    [movies]
  );
  const tonightStart = useMemo(() => {
    if (movies.length === 0) {
      return '--:--';
    }

    const first = movies[0].showtimes?.[0];
    return first ?? '--:--';
  }, [movies]);
  const topRatedCount = useMemo(() => movies.filter((movie) => movie.rating >= 8).length, [movies]);

  useEffect(() => {
    if (slides.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const featured = slides[current] ?? movies[0];

  const handleSaveMovie = (movieId) => {
    const result = onSaveMovie(movieId);
    setToast(result.message);
    window.clearTimeout(window.__qaHomeSaveToastTimer);
    window.__qaHomeSaveToastTimer = window.setTimeout(() => setToast(''), 1500);
  };

  if (!featured) {
    return null;
  }

  return (
    <section className="clean-home">
      <article className="clean-hero panel" style={{ backgroundImage: `url(${featured.image})` }}>
        <div className="clean-hero-overlay" />
        <div className="clean-hero-main">
          <p className="eyebrow">{t('shop.nowShowing')}</p>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>

          <div className="clean-hero-tags">
            <span>{featured.genre}</span>
            <span>{featured.year}</span>
            <span>{formatDuration(featured.durationMinutes)}</span>
            <strong>
              {featured.rating.toFixed(1)} {t('shop.rating')}
            </strong>
          </div>

          <div className="clean-hero-actions">
            <button type="button" className="btn btn-primary" onClick={onGoMovies}>
              {t('shop.browseMovies')}
            </button>
            <button type="button" className="btn" onClick={onGoPlan}>
              {t('shop.openPlan')} ({selectedCount})
            </button>
          </div>
        </div>

        <aside className="clean-hero-aside">
          <h3>{t('shop.tonightOverview')}</h3>
          <div className="clean-metrics">
            <article>
              <small>{t('shop.totalTitles')}</small>
              <strong>{movies.length}</strong>
            </article>
            <article>
              <small>{t('shop.topRated')}</small>
              <strong>{topRatedCount}</strong>
            </article>
            <article>
              <small>{t('shop.nextShowtime')}</small>
              <strong>{tonightStart}</strong>
            </article>
          </div>
        </aside>

        <div className="clean-hero-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={index === current ? 'active' : ''}
              onClick={() => setCurrent(index)}
              aria-label={`${t('shop.openSlide')} ${slide.title}`}
            />
          ))}
        </div>
      </article>

      <section className="clean-row panel">
        <header className="clean-row-head">
          <h3>{t('shop.trendingNow')}</h3>
          <button type="button" className="btn" onClick={onGoMovies}>
            {t('shop.viewAll')}
          </button>
        </header>

        <div className="clean-scroll" role="list">
          {trendingNow.map((movie) => (
            <button key={movie.id} type="button" className="clean-poster" onClick={onGoMovies} role="listitem">
              <img src={movie.image} alt={movie.title} />
              <span>{movie.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="clean-row panel">
        <header className="clean-row-head">
          <h3>{t('shop.bestRatedPicks')}</h3>
          <button type="button" className="btn" onClick={onGoPlan}>
            {t('shop.bookNow')}
          </button>
        </header>

        <div className="clean-scroll clean-scroll-wide" role="list">
          {bestRated.map((movie) => (
            <article
              key={movie.id}
              className="clean-wide-card clean-wide-card-clickable"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedBestMovie(movie)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedBestMovie(movie);
                }
              }}
            >
              <img src={movie.image} alt={movie.title} />
              <div>
                <h4>{movie.title}</h4>
                <p>
                  {movie.genre} · {formatDuration(movie.durationMinutes)}
                </p>
                <strong>{movie.rating.toFixed(1)} / 10</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      {toast && <div className="toast toast-success">{toast}</div>}

      {selectedBestMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedBestMovie(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <img src={selectedBestMovie.image} alt={selectedBestMovie.title} />
            <div>
              <h3>{selectedBestMovie.title}</h3>
              <p className="modal-meta">
                {selectedBestMovie.genre} · {selectedBestMovie.year} ·{' '}
                {formatDuration(selectedBestMovie.durationMinutes)}
              </p>
              <p>{selectedBestMovie.description}</p>

              <div className="modal-list">
                <p>
                  <strong>{t('cart.director')}:</strong> {selectedBestMovie.director}
                </p>
                <p>
                  <strong>{t('cart.language')}:</strong> {selectedBestMovie.language}
                </p>
                <p>
                  <strong>{t('cart.formats')}:</strong> {selectedBestMovie.formats.join(', ')}
                </p>
                <p>
                  <strong>{t('cart.basePrice')}:</strong> EUR {selectedBestMovie.price.toFixed(2)}
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className={`btn full ${
                    savedMovieIds.has(selectedBestMovie.id) ? 'btn-success' : 'btn-primary'
                  }`}
                  onClick={() => handleSaveMovie(selectedBestMovie.id)}
                >
                  {savedMovieIds.has(selectedBestMovie.id) ? t('cart.savedAlready') : t('cart.saveMovie')}
                </button>
                <button type="button" className="btn" onClick={() => setSelectedBestMovie(null)}>
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
