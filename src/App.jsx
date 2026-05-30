import { useMemo, useState } from 'react';
import AuthScreen from './components/AuthScreen';
import ShopScreen from './screens/ShopScreen';
import CartScreen from './screens/CartScreen';
import AdminScreen from './screens/AdminScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginQualityComparisonScreen from './screens/LoginQualityComparisonScreen';
import ProjectOneQrApp from './screens/ProjectOneQrApp';
import ProjectTwoSocialAdminApp from './screens/ProjectTwoSocialAdminApp';
import ProjectThreeRestaurantDashboard from './screens/ProjectThreeRestaurantDashboard';
import BuggyPostsLabScreen from './screens/BuggyPostsLabScreen';
import BrandLogo from './components/BrandLogo';
import { seedMovies } from './data/seedProducts';

const TRANSLATIONS = {
  en: {
    'app.qaProject': 'QA Training Project',
    'app.topRated': 'Top Rated',
    'app.inPlan': 'In Plan',
    'app.logout': 'Logout',
    'app.home': 'Home',
    'app.movies': 'Movies',
    'app.myPlan': 'My Plan',
    'app.history': 'History',
    'app.language': 'Language',
    'app.langEnglish': 'English',
    'app.langAlbanian': 'Albanian',
    'messages.movieAlreadySaved': 'Movie is already saved.',
    'messages.movieSavedToPlan': 'Movie saved to your watch plan.',
    'auth.emailRequired': 'Email is required.',
    'auth.emailInvalid': 'Email must include "@" and end with ".com".',
    'auth.passwordRequired': 'Password is required.',
    'auth.passwordMin': 'Password must be at least 6 characters.',
    'auth.passwordInvalid': 'Password must contain at least one letter and one number.',
    'auth.wrongCredentials': 'Wrong credentials. Try the demo account listed below.',
    'auth.visualDescription':
      'Professional training sandbox for UI testing, Playwright flows, and booking scenarios.',
    'auth.bulletMetadata': 'Realistic movie metadata',
    'auth.bulletModal': 'Modal interactions',
    'auth.bulletBooking': 'Booking controls + totals',
    'auth.signIn': 'Sign In',
    'auth.demoHint': 'Use your demo account to enter the portal.',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',
    'auth.demoCredentials': 'Demo credentials:',
    'shop.nowShowing': 'Now Showing',
    'shop.rating': 'Rating',
    'shop.browseMovies': 'Browse Movies',
    'shop.openPlan': 'Open Plan',
    'shop.tonightOverview': 'Tonight Overview',
    'shop.totalTitles': 'Total Titles',
    'shop.topRated': 'Top Rated',
    'shop.nextShowtime': 'Next Showtime',
    'shop.openSlide': 'Open',
    'shop.trendingNow': 'Trending Now',
    'shop.viewAll': 'View All',
    'shop.bestRatedPicks': 'Best Rated Picks',
    'shop.bookNow': 'Book Now',
    'cart.title': 'Movies',
    'cart.subtitle': 'Clean catalog experience with fast filters and clear movie cards.',
    'cart.search': 'Search',
    'cart.searchPlaceholder': 'Title, description, director...',
    'cart.genre': 'Genre',
    'cart.sort': 'Sort',
    'cart.topRating': 'Top Rating',
    'cart.lowestPrice': 'Lowest Price',
    'cart.shortestDuration': 'Shortest Duration',
    'cart.titleAZ': 'Title A-Z',
    'cart.minRating': 'Min rating',
    'cart.maxPrice': 'Max price',
    'cart.showing': 'Showing',
    'cart.from': 'from',
    'cart.totalTitles': 'total titles',
    'cart.savedInPlan': 'Saved In Plan',
    'cart.readyForBooking': 'ready for booking',
    'cart.quickPicks': 'Quick Picks',
    'cart.ratingWord': 'rating',
    'cart.savedAlready': 'Saved Already',
    'cart.saveMovie': 'Save Movie',
    'cart.director': 'Director',
    'cart.language': 'Language',
    'cart.ageRating': 'Age Rating',
    'cart.formats': 'Formats',
    'cart.basePrice': 'Base Price',
    'cart.communityRating': 'Community rating',
    'cart.saveToPlan': 'Save To Plan',
    'cart.close': 'Close',
    'cart.all': 'All',
    'admin.title': 'My Watch Plan',
    'admin.subtitle':
      'Finalize city, watch order, showtime, seat type, and ticket quantity per movie.',
    'admin.selectedMovies': 'Selected Movies',
    'admin.totalTickets': 'Total Tickets',
    'admin.estimatedTotal': 'Estimated Total',
    'admin.empty': 'No movies selected yet. Go to Movies screen and save one.',
    'admin.base': 'Base',
    'admin.lineTotal': 'Line Total',
    'admin.watchOrder': 'Watch Order',
    'admin.city': 'City',
    'admin.showtime': 'Showtime',
    'admin.seatType': 'Seat Type',
    'admin.tickets': 'Tickets (1-8)',
    'admin.finishOrder': 'Finish Order',
    'admin.orderCompleted': 'Order completed successfully.',
    'admin.confirmOrder': 'Confirm Order',
    'admin.cancelOrder': 'Cancel',
    'admin.removeMovie': 'Remove Movie',
    'admin.orderFirst': 'First',
    'admin.orderSecond': 'Second',
    'admin.orderThird': 'Third',
    'admin.seatStandard': 'Standard',
    'admin.seatVip': 'VIP',
    'history.title': 'Order History',
    'history.subtitle': 'Completed orders appear here. Latest completed order is shown first.',
    'history.empty': 'No completed orders yet. Finish an order from My Plan to see it here.',
    'history.orderedAt': 'Ordered at',
    'history.tickets': 'Tickets',
    'history.city': 'City',
    'history.showtime': 'Showtime',
    'history.seatType': 'Seat Type',
    'history.deleteOrder': 'Delete order',
    'history.deleteConfirmTitle': 'Delete order',
    'history.deleteConfirmText': 'Are you sure you want to remove this order from history?',
    'history.confirmDelete': 'Yes, delete',
    'history.cancelDelete': 'No',
  },
  sq: {
    'app.qaProject': 'Projekt i Trajnimit QA',
    'app.topRated': 'Më të Vlerësuar',
    'app.inPlan': 'Në Plan',
    'app.logout': 'Dil',
    'app.home': 'Ballina',
    'app.movies': 'Filmat',
    'app.myPlan': 'Plani Im',
    'app.history': 'Historiku',
    'app.language': 'Gjuha',
    'app.langEnglish': 'Anglisht',
    'app.langAlbanian': 'Shqip',
    'messages.movieAlreadySaved': 'Filmi është tashmë i ruajtur.',
    'messages.movieSavedToPlan': 'Filmi u ruajt në planin tënd.',
    'auth.emailRequired': 'Email është i detyrueshëm.',
    'auth.emailInvalid': 'Email-i duhet të përmbajë "@" dhe të përfundojë me ".com".',
    'auth.passwordRequired': 'Fjalëkalimi është i detyrueshëm.',
    'auth.passwordMin': 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.',
    'auth.passwordInvalid': 'Fjalëkalimi duhet të ketë së paku një shkronjë dhe një numër.',
    'auth.wrongCredentials': 'Kredenciale të pasakta. Provo llogarinë demo më poshtë.',
    'auth.visualDescription':
      'Ambient profesional për testim UI, rrjedha Playwright dhe skenarë rezervimi.',
    'auth.bulletMetadata': 'Metadata reale të filmave',
    'auth.bulletModal': 'Ndërveprime me modal',
    'auth.bulletBooking': 'Kontrolle rezervimi + total',
    'auth.signIn': 'Hyr',
    'auth.demoHint': 'Përdor llogarinë demo për të hyrë në portal.',
    'auth.email': 'Email',
    'auth.password': 'Fjalëkalimi',
    'auth.showPassword': 'Shfaq fjalëkalimin',
    'auth.hidePassword': 'Fsheh fjalëkalimin',
    'auth.demoCredentials': 'Kredencialet demo:',
    'shop.nowShowing': 'Në Program',
    'shop.rating': 'Vlerësim',
    'shop.browseMovies': 'Shfleto Filmat',
    'shop.openPlan': 'Hap Planin',
    'shop.tonightOverview': 'Përmbledhja e Sonte',
    'shop.totalTitles': 'Gjithsej Filma',
    'shop.topRated': 'Më të Vlerësuar',
    'shop.nextShowtime': 'Shfaqja e Radhës',
    'shop.openSlide': 'Hap',
    'shop.trendingNow': 'Në Trend',
    'shop.viewAll': 'Shiko Të Gjitha',
    'shop.bestRatedPicks': 'Zgjedhjet Më të Vlerësuara',
    'shop.bookNow': 'Rezervo Tani',
    'cart.title': 'Filmat',
    'cart.subtitle': 'Katalog i pastër me filtra të shpejtë dhe karta të qarta filmi.',
    'cart.search': 'Kërko',
    'cart.searchPlaceholder': 'Titull, përshkrim, regjisor...',
    'cart.genre': 'Zhanri',
    'cart.sort': 'Rendit',
    'cart.topRating': 'Vlerësimi më i lartë',
    'cart.lowestPrice': 'Çmimi më i ulët',
    'cart.shortestDuration': 'Kohëzgjatja më e shkurtër',
    'cart.titleAZ': 'Titulli A-Z',
    'cart.minRating': 'Vlerësimi minimal',
    'cart.maxPrice': 'Çmimi maksimal',
    'cart.showing': 'Duke shfaqur',
    'cart.from': 'nga',
    'cart.totalTitles': 'filma gjithsej',
    'cart.savedInPlan': 'Ruajtur në Plan',
    'cart.readyForBooking': 'gati për rezervim',
    'cart.quickPicks': 'Zgjedhje të Shpejta',
    'cart.ratingWord': 'vlerësim',
    'cart.savedAlready': 'Tashmë i Ruajtur',
    'cart.saveMovie': 'Ruaj Filmin',
    'cart.director': 'Regjisori',
    'cart.language': 'Gjuha',
    'cart.ageRating': 'Kufizim Moshe',
    'cart.formats': 'Formatet',
    'cart.basePrice': 'Çmimi Bazë',
    'cart.communityRating': 'Vlerësimi i komunitetit',
    'cart.saveToPlan': 'Ruaj në Plan',
    'cart.close': 'Mbyll',
    'cart.all': 'Të gjitha',
    'admin.title': 'Plani Im i Shikimit',
    'admin.subtitle':
      'Finalizo qytetin, rendin e shikimit, orarin, llojin e ulëses dhe numrin e biletave për çdo film.',
    'admin.selectedMovies': 'Filmat e Zgjedhur',
    'admin.totalTickets': 'Bileta Totale',
    'admin.estimatedTotal': 'Totali i Vlerësuar',
    'admin.empty': 'Nuk ka filma të zgjedhur ende. Shko te Filmat dhe ruaj një.',
    'admin.base': 'Bazë',
    'admin.lineTotal': 'Totali i Rreshtit',
    'admin.watchOrder': 'Rendi i Shikimit',
    'admin.city': 'Qyteti',
    'admin.showtime': 'Orari',
    'admin.seatType': 'Lloji i Ulëses',
    'admin.tickets': 'Biletat (1-8)',
    'admin.finishOrder': 'Përfundo Porosinë',
    'admin.orderCompleted': 'Porosia u krye me sukses.',
    'admin.confirmOrder': 'Konfirmo Porosinë',
    'admin.cancelOrder': 'Anulo',
    'admin.removeMovie': 'Hiqe Filmin',
    'admin.orderFirst': 'I pari',
    'admin.orderSecond': 'I dyti',
    'admin.orderThird': 'I treti',
    'admin.seatStandard': 'Standard',
    'admin.seatVip': 'VIP',
    'history.title': 'Historiku i Porosive',
    'history.subtitle': 'Porositë e kryera shfaqen këtu. Më e fundit shfaqet e para.',
    'history.empty': 'Nuk ka porosi të kryera ende. Përfundo një porosi te Plani Im që të shfaqet këtu.',
    'history.orderedAt': 'Porositur më',
    'history.tickets': 'Biletat',
    'history.city': 'Qyteti',
    'history.showtime': 'Orari',
    'history.seatType': 'Lloji i Ulëses',
    'history.deleteOrder': 'Fshi porosinë',
    'history.deleteConfirmTitle': 'Fshi porosinë',
    'history.deleteConfirmText': 'A je i sigurt që dëshiron ta heqësh këtë porosi nga historiku?',
    'history.confirmDelete': 'Po, fshije',
    'history.cancelDelete': 'Jo',
  },
};

function getSavedState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getSavedSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep in-memory session.
  }
}

function clearSession(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore storage clear failures.
  }
}

function clampTickets(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(8, parsed));
}

function hydrateMovies(storedMovies) {
  if (!Array.isArray(storedMovies) || storedMovies.length === 0) {
    return seedMovies;
  }

  const fallbackById = new Map(seedMovies.map((movie) => [movie.id, movie]));

  return storedMovies.map((movie) => {
    const fallback = fallbackById.get(movie.id) ?? {};
    const mergedShowtimes =
      Array.isArray(movie.showtimes) && movie.showtimes.length > 0
        ? movie.showtimes
        : fallback.showtimes ?? ['18:30'];

    return {
      ...fallback,
      ...movie,
      showtimes: mergedShowtimes,
      formats:
        Array.isArray(movie.formats) && movie.formats.length > 0
          ? movie.formats
          : fallback.formats ?? ['2D'],
    };
  });
}

export default function App() {
  const SESSION_STORAGE_KEY = 'cineplex-session';
  const [language, setLanguage] = useState(() => getSavedState('cineplex-language', 'en'));
  const [session, setSession] = useState(() => getSavedSession(SESSION_STORAGE_KEY));
  const [showLoginQualityComparison, setShowLoginQualityComparison] = useState(false);
  const [showProjectOne, setShowProjectOne] = useState(false);
  const [showProjectTwo, setShowProjectTwo] = useState(false);
  const [showProjectThree, setShowProjectThree] = useState(false);
  const [showBugLab, setShowBugLab] = useState(false);
  const [screen, setScreen] = useState('home');
  const [movies] = useState(() => hydrateMovies(getSavedState('cineplex-movies', seedMovies)));
  const [historyOrders, setHistoryOrders] = useState(() => getSavedState('cineplex-history', []));
  const [selections, setSelections] = useState(() => {
    const stored = getSavedState('cineplex-selections', []);
    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.map((item) => ({
      movieId: item.movieId,
      watchOrder: item.watchOrder || 'First',
      city: item.city || 'Prizren',
      showtime: item.showtime || '18:30',
      seatType: item.seatType || 'Standard',
      tickets: clampTickets(item.tickets),
    }));
  });

  const persist = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const t = (key) => TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;

  const setLanguagePreference = (nextLanguage) => {
    setLanguage(nextLanguage);
    persist('cineplex-language', nextLanguage);
  };

  const login = (email) => {
    const nextSession = { email, loginAt: Date.now() };
    setSession(nextSession);
    saveSession(SESSION_STORAGE_KEY, nextSession);
  };

  const logout = () => {
    setSession(null);
    clearSession(SESSION_STORAGE_KEY);
  };

  const saveMovie = (movieId) => {
    const existing = selections.find((item) => item.movieId === movieId);
    if (existing) {
      return { ok: false, message: t('messages.movieAlreadySaved') };
    }

    const selectedMovie = movies.find((movie) => movie.id === movieId);

    const nextSelections = [
      {
        movieId,
        watchOrder: 'First',
        city: 'Prizren',
        showtime: selectedMovie?.showtimes?.[0] ?? '18:30',
        seatType: 'Standard',
        tickets: 1,
      },
      ...selections,
    ];

    setSelections(nextSelections);
    persist('cineplex-selections', nextSelections);
    return { ok: true, message: t('messages.movieSavedToPlan') };
  };

  const updateSelection = (movieId, field, value) => {
    const nextSelections = selections.map((item) => {
      if (item.movieId !== movieId) {
        return item;
      }

      if (field === 'tickets') {
        return { ...item, tickets: clampTickets(value) };
      }

      return { ...item, [field]: value };
    });

    setSelections(nextSelections);
    persist('cineplex-selections', nextSelections);
  };

  const removeSelection = (movieId) => {
    const nextSelections = selections.filter((item) => item.movieId !== movieId);
    setSelections(nextSelections);
    persist('cineplex-selections', nextSelections);
  };

  const finishOrder = (selectedItem) => {
    const nextSelections = selections.filter((item) => item.movieId !== selectedItem.movie.id);
    setSelections(nextSelections);
    persist('cineplex-selections', nextSelections);

    const nextHistoryOrders = [
      {
        id: `${selectedItem.movie.id}-${Date.now()}`,
        orderedAt: Date.now(),
        movie: selectedItem.movie,
        tickets: selectedItem.tickets,
        city: selectedItem.city,
        showtime: selectedItem.showtime,
        seatType: selectedItem.seatType,
        watchOrder: selectedItem.watchOrder,
      },
      ...historyOrders,
    ];
    setHistoryOrders(nextHistoryOrders);
    persist('cineplex-history', nextHistoryOrders);
  };

  const deleteHistoryOrder = (orderId) => {
    const nextHistoryOrders = historyOrders.filter((order) => order.id !== orderId);
    setHistoryOrders(nextHistoryOrders);
    persist('cineplex-history', nextHistoryOrders);
  };

  const selectedMovies = useMemo(() => {
    return selections
      .map((item) => {
        const movie = movies.find((entry) => entry.id === item.movieId);

        if (!movie) {
          return null;
        }

        const safeShowtime = movie.showtimes.includes(item.showtime)
          ? item.showtime
          : movie.showtimes[0] ?? '18:30';

        return {
          ...item,
          showtime: safeShowtime,
          movie,
        };
      })
      .filter(Boolean);
  }, [selections, movies]);

  const savedMovieIds = useMemo(() => new Set(selections.map((item) => item.movieId)), [selections]);

  const featuredCount = useMemo(() => movies.filter((movie) => movie.rating >= 8).length, [movies]);

  if (!session) {
    if (showBugLab) {
      return <BuggyPostsLabScreen onExit={() => setShowBugLab(false)} />;
    }

    if (showProjectThree) {
      return <ProjectThreeRestaurantDashboard onExit={() => setShowProjectThree(false)} />;
    }

    if (showProjectTwo) {
      return <ProjectTwoSocialAdminApp onExit={() => setShowProjectTwo(false)} />;
    }

    if (showProjectOne) {
      return <ProjectOneQrApp onExit={() => setShowProjectOne(false)} />;
    }

    if (showLoginQualityComparison) {
      return <LoginQualityComparisonScreen onBack={() => setShowLoginQualityComparison(false)} />;
    }

    return (
      <AuthScreen
        onSuccess={login}
        language={language}
        onLanguageChange={setLanguagePreference}
        t={t}
        onOpenLoginQualityComparison={() => setShowLoginQualityComparison(true)}
        onOpenProjectOne={() => setShowProjectOne(true)}
        onOpenProjectTwo={() => setShowProjectTwo(true)}
        onOpenProjectThree={() => setShowProjectThree(true)}
        onOpenBugLab={() => setShowBugLab(true)}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <BrandLogo
          eyebrow={t('app.qaProject')}
          title="Cineplex Stream"
          headingTag="h1"
          compact={true}
        />

        <div className="topbar-actions">
          <span className="top-stat">
            {featuredCount} {t('app.topRated')}
          </span>
          <span className="top-stat">
            {selectedMovies.length} {t('app.inPlan')}
          </span>
          <div className="lang-switch" role="group" aria-label={t('app.language')}>
            <button
              type="button"
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguagePreference('en')}
              aria-label={t('app.langEnglish')}
            >
              EN
            </button>
            <button
              type="button"
              className={language === 'sq' ? 'active' : ''}
              onClick={() => setLanguagePreference('sq')}
              aria-label={t('app.langAlbanian')}
            >
              AL
            </button>
          </div>
          <span className="user-chip">{session.email}</span>
          <button type="button" className="btn" onClick={logout}>
            {t('app.logout')}
          </button>
        </div>
      </header>

      <nav className="main-nav" aria-label="Main">
        <button
          type="button"
          className={screen === 'home' ? 'active' : ''}
          onClick={() => setScreen('home')}
        >
          {t('app.home')}
        </button>
        <button
          type="button"
          className={screen === 'movies' ? 'active' : ''}
          onClick={() => setScreen('movies')}
        >
          {t('app.movies')}
        </button>
        <button
          type="button"
          className={screen === 'plan' ? 'active' : ''}
          onClick={() => setScreen('plan')}
        >
          {t('app.myPlan')}
        </button>
        <button
          type="button"
          className={screen === 'history' ? 'active' : ''}
          onClick={() => setScreen('history')}
        >
          {t('app.history')}
        </button>
      </nav>

      <main>
        {screen === 'home' && (
          <ShopScreen
            movies={movies}
            selectedCount={selectedMovies.length}
            onGoMovies={() => setScreen('movies')}
            onGoPlan={() => setScreen('plan')}
            onSaveMovie={saveMovie}
            savedMovieIds={savedMovieIds}
            t={t}
          />
        )}
        {screen === 'movies' && (
          <CartScreen movies={movies} savedMovieIds={savedMovieIds} onSaveMovie={saveMovie} t={t} />
        )}
        {screen === 'plan' && (
          <AdminScreen
            selectedMovies={selectedMovies}
            onUpdateSelection={updateSelection}
            onRemoveSelection={removeSelection}
            onFinishOrder={finishOrder}
            t={t}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen historyOrders={historyOrders} onDeleteOrder={deleteHistoryOrder} t={t} />
        )}
      </main>
    </div>
  );
}
