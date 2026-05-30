import { useMemo, useState } from 'react';

const QRS_KEY = 'project1-qr-codes';
const PROJECT_ONE_CREDENTIALS = {
  email: 'student@projekti1.com',
  password: 'Projekti123',
};
const CATEGORY_OPTIONS = ['Marketing', 'Events', 'Support', 'Product', 'Internal'];
const HERO_LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1800&q=80';
const HERO_CREATE_IMAGE =
  'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=1600&q=80';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function getStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function buildQrPreview(content, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function categoryKey(category) {
  return `p1-cat-${category.toLowerCase()}`;
}

export default function ProjectOneQrApp({ onExit }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('create');
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSubmitError, setLoginSubmitError] = useState('');

  const [qrTitle, setQrTitle] = useState('');
  const [qrContent, setQrContent] = useState('');
  const [qrCategory, setQrCategory] = useState(CATEGORY_OPTIONS[0]);
  const [qrError, setQrError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState('');
  const [savedSearch, setSavedSearch] = useState('');
  const [savedCategoryFilter, setSavedCategoryFilter] = useState('All');
  const [qrCodes, setQrCodes] = useState(() => getStoredValue(QRS_KEY, []));
  const [selectedSavedId, setSelectedSavedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);

  const saveCodes = (nextCodes) => {
    setQrCodes(nextCodes);
    localStorage.setItem(QRS_KEY, JSON.stringify(nextCodes));
  };

  const validateLogin = () => {
    const nextErrors = {};

    if (!loginValues.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(loginValues.email.trim())) {
      nextErrors.email = 'Please enter a valid email.';
    }

    if (!loginValues.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (loginValues.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    return nextErrors;
  };

  const onLoginSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateLogin();
    setLoginErrors(nextErrors);
    setLoginSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const isValidUser =
      loginValues.email.trim().toLowerCase() === PROJECT_ONE_CREDENTIALS.email &&
      loginValues.password === PROJECT_ONE_CREDENTIALS.password;

    if (!isValidUser) {
      setLoginSubmitError('Invalid credentials. Use the demo account shown below.');
      return;
    }

    setIsLoggedIn(true);
    setActiveScreen('create');
  };

  const onLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    setLoginSubmitError('');
  };

  const clearForm = () => {
    setQrTitle('');
    setQrContent('');
    setQrCategory(CATEGORY_OPTIONS[0]);
    setEditingId(null);
    setQrError('');
  };

  const onSaveQr = (event) => {
    event.preventDefault();

    if (!qrTitle.trim()) {
      setQrError('QR title is required.');
      return;
    }

    if (!qrContent.trim()) {
      setQrError('URL/content is required.');
      return;
    }

    const now = Date.now();

    if (editingId) {
      const nextCodes = qrCodes.map((code) =>
        code.id === editingId
          ? {
              ...code,
              title: qrTitle.trim(),
              content: qrContent.trim(),
              category: qrCategory,
              updatedAt: now,
            }
          : code,
      );

      saveCodes(nextCodes);
      clearForm();
      return;
    }

    const newCode = {
      id: `qr-${now}`,
      title: qrTitle.trim(),
      content: qrContent.trim(),
      category: qrCategory,
      createdAt: now,
      updatedAt: now,
      saved: true,
    };

    saveCodes([newCode, ...qrCodes]);
    setSelectedSavedId(newCode.id);
    setNewlyCreatedId(newCode.id);
    window.setTimeout(() => {
      setNewlyCreatedId((current) => (current === newCode.id ? null : current));
    }, 850);
    clearForm();
  };

  const onEditQr = (code) => {
    setEditingId(code.id);
    setQrTitle(code.title);
    setQrContent(code.content);
    setQrCategory(code.category);
    setQrError('');
  };

  const onDeleteQr = (id) => {
    if (deletingId) {
      return;
    }

    setDeletingId(id);
    window.setTimeout(() => {
      const nextCodes = qrCodes.filter((code) => code.id !== id);
      saveCodes(nextCodes);

      if (selectedSavedId === id) {
        setSelectedSavedId(nextCodes.find((code) => code.saved)?.id ?? null);
      }

      setDeletingId(null);
    }, 220);
  };

  const onToggleSaved = (id) => {
    const nextCodes = qrCodes.map((code) =>
      code.id === id ? { ...code, saved: !code.saved, updatedAt: Date.now() } : code,
    );
    saveCodes(nextCodes);
  };

  const onRemoveFromSaved = (id) => {
    const nextCodes = qrCodes.map((code) =>
      code.id === id ? { ...code, saved: false, updatedAt: Date.now() } : code,
    );
    saveCodes(nextCodes);

    if (selectedSavedId === id) {
      setSelectedSavedId(nextCodes.find((code) => code.saved && code.id !== id)?.id ?? null);
    }
  };

  const filteredCodes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return qrCodes;
    }

    return qrCodes.filter((code) => {
      return (
        code.title.toLowerCase().includes(query) ||
        code.content.toLowerCase().includes(query) ||
        code.category.toLowerCase().includes(query)
      );
    });
  }, [qrCodes, search]);

  const savedCodes = useMemo(() => qrCodes.filter((code) => code.saved), [qrCodes]);

  const filteredSavedCodes = useMemo(() => {
    const query = savedSearch.trim().toLowerCase();

    return savedCodes.filter((code) => {
      const categoryMatch = savedCategoryFilter === 'All' || code.category === savedCategoryFilter;
      const textMatch =
        !query ||
        code.title.toLowerCase().includes(query) ||
        code.content.toLowerCase().includes(query) ||
        code.category.toLowerCase().includes(query);

      return categoryMatch && textMatch;
    });
  }, [savedCodes, savedSearch, savedCategoryFilter]);

  const selectedSavedCode =
    filteredSavedCodes.find((code) => code.id === selectedSavedId) ?? filteredSavedCodes[0] ?? null;

  const totalSaved = savedCodes.length;
  const totalUnsaved = qrCodes.length - totalSaved;

  if (!isLoggedIn) {
    return (
      <div className="p1-root p1-login-screen">
        <button type="button" className="p1-back" onClick={onExit}>
          Back To Main Login
        </button>

        <div className="p1-login-grid">
          <section className="p1-login-visual" style={{ backgroundImage: `url(${HERO_LOGIN_IMAGE})` }}>
            <div className="p1-login-overlay" />
            <div className="p1-login-visual-content">
              <span className="p1-kicker">Project 1</span>
              <h1>QA QR Studio</h1>
              <p>
                A standalone QR web app built for automation training. Test validations, CRUD, filters,
                and preview rendering across clean states.
              </p>
              <div className="p1-pill-row">
                <span>Validation</span>
                <span>Create/Edit/Delete</span>
                <span>Search + Filter</span>
                <span>Preview States</span>
              </div>
              <div className="p1-matrix-note">QR matrix engine ready</div>
            </div>
          </section>

          <section className="p1-card p1-login-card">
            <h2>Sign In To Project 1</h2>
            <p className="p1-muted">Use the fixed credentials for test scenarios.</p>

            <form onSubmit={onLoginSubmit} className="p1-form" noValidate>
              <label htmlFor="project1-email">Email</label>
              <input
                id="project1-email"
                name="email"
                type="email"
                value={loginValues.email}
                onChange={onLoginInputChange}
                placeholder="student@projekti1.com"
              />
              {loginErrors.email ? <small className="p1-error">{loginErrors.email}</small> : null}

              <label htmlFor="project1-password">Password</label>
              <input
                id="project1-password"
                name="password"
                type="password"
                value={loginValues.password}
                onChange={onLoginInputChange}
                placeholder="Projekti123"
              />
              {loginErrors.password ? <small className="p1-error">{loginErrors.password}</small> : null}
              {loginSubmitError ? <p className="p1-alert">{loginSubmitError}</p> : null}

              <button type="submit" className="p1-btn p1-btn-primary p1-full">
                Login
              </button>
            </form>

            <div className="p1-credentials">
              <p>
                Demo login: <strong>{PROJECT_ONE_CREDENTIALS.email}</strong>
              </p>
              <p>
                Password: <strong>{PROJECT_ONE_CREDENTIALS.password}</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="p1-root p1-app-screen">
      <header className="p1-topbar">
        <div>
          <span className="p1-kicker">Project 1</span>
          <h1>QA QR Studio</h1>
        </div>

        <div className="p1-top-actions">
          <button
            type="button"
            className={`p1-tab ${activeScreen === 'create' ? 'active' : ''}`}
            onClick={() => setActiveScreen('create')}
          >
            Create QR Code
          </button>
          <button
            type="button"
            className={`p1-tab ${activeScreen === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveScreen('saved')}
          >
            Saved QR Codes
          </button>
          <button
            type="button"
            className="p1-btn"
            onClick={() => {
              setIsLoggedIn(false);
              setActiveScreen('create');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {activeScreen === 'create' ? (
        <div className="p1-create-screen p1-screen-swap" key="create-screen">
          <section className="p1-card p1-create-hero">
            <div className="p1-create-copy">
              <span className="p1-kicker">QR Builder</span>
              <h2>Design and manage scannable QR codes in one flow</h2>
              <p>
                Step 1: fill the form. Step 2: verify preview. Step 3: manage records in the table.
                The page is intentionally structured for beginner readability and automated assertions.
              </p>
              <div className="p1-stats">
                <article>
                  <strong>{qrCodes.length}</strong>
                  <span>Total QR</span>
                </article>
                <article>
                  <strong>{totalSaved}</strong>
                  <span>Saved</span>
                </article>
                <article>
                  <strong>{totalUnsaved}</strong>
                  <span>Unsaved</span>
                </article>
              </div>
              <div className="p1-mode-chips">
                <span>Dynamic URL</span>
                <span>Static Text</span>
                <span>Wi-Fi</span>
              </div>
            </div>
            <div className="p1-create-image-wrap">
              <img src={HERO_CREATE_IMAGE} alt="Phone scanning a QR code" />
            </div>
          </section>

          <div className="p1-create-grid">
            <section className="p1-card p1-form-card">
              <h3>{editingId ? 'Edit QR Code' : 'Create QR Code'}</h3>
              <p className="p1-muted">Step 1: Enter data and save.</p>

              <div className="p1-tip">
                <span>Tip</span>
                <p>Use short titles and unique categories to simplify test selectors.</p>
              </div>

              <form onSubmit={onSaveQr} className="p1-form" noValidate>
                <label htmlFor="qr-title">QR Title</label>
                <input
                  id="qr-title"
                  type="text"
                  value={qrTitle}
                  onChange={(event) => {
                    setQrTitle(event.target.value);
                    setQrError('');
                  }}
                  placeholder="Summer Campaign Landing"
                />

                <label htmlFor="qr-content">URL / Content</label>
                <textarea
                  id="qr-content"
                  rows="3"
                  value={qrContent}
                  onChange={(event) => {
                    setQrContent(event.target.value);
                    setQrError('');
                  }}
                  placeholder="https://example.com/promo"
                />

                <label htmlFor="qr-category">Category</label>
                <select
                  id="qr-category"
                  value={qrCategory}
                  onChange={(event) => setQrCategory(event.target.value)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {qrError ? <p className="p1-alert">{qrError}</p> : null}

                <div className="p1-form-actions">
                  <button type="submit" className="p1-btn p1-btn-primary">
                    {editingId ? 'Save Changes' : 'Create / Save'}
                  </button>
                  {editingId ? (
                    <button type="button" className="p1-btn" onClick={clearForm}>
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="p1-card p1-preview-card">
              <h3>Live Preview</h3>
              <p className="p1-muted">Step 2: verify your QR output.</p>

              {qrContent.trim() ? (
                <div className="p1-scan-frame" key={qrContent}>
                  <img
                    className="p1-main-preview"
                    src={buildQrPreview(qrContent.trim(), 210)}
                    alt="QR preview"
                  />
                </div>
              ) : (
                <div className="p1-empty">Type URL/content to generate preview.</div>
              )}

              <div className="p1-mini-previews">
                <article>
                  <div className="p1-mini-frame">
                    <img src={buildQrPreview('https://example.com/offer', 100)} alt="sample url qr" />
                  </div>
                  <span>URL</span>
                </article>
                <article>
                  <div className="p1-mini-frame">
                    <img
                      src={buildQrPreview('WIFI:T:WPA;S:QA-LAB;P:Password123;;', 100)}
                      alt="sample wifi qr"
                    />
                  </div>
                  <span>Wi-Fi</span>
                </article>
              </div>
            </section>
          </div>

          <section className="p1-card p1-table-card">
            <div className="p1-table-head">
              <div>
                <h3>QR List Table</h3>
                <p className="p1-muted">Step 3: search, edit, delete, and save/unsave entries.</p>
              </div>
              <input
                type="search"
                placeholder="Search title, content, category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="p1-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCodes.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="p1-empty">No QR codes found.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredCodes.map((code) => (
                      <tr
                        key={code.id}
                        className={`${newlyCreatedId === code.id ? 'p1-row-new' : ''} ${
                          deletingId === code.id ? 'p1-row-deleting' : ''
                        }`}
                      >
                        <td>
                          <strong>{code.title}</strong>
                          <p>{code.content}</p>
                        </td>
                        <td>
                          <span className={`p1-cat ${categoryKey(code.category)}`}>{code.category}</span>
                        </td>
                        <td>{formatDateTime(code.updatedAt)}</td>
                        <td>
                          <div className="p1-row-actions">
                            <button type="button" className="p1-btn" onClick={() => onEditQr(code)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="p1-btn p1-btn-danger"
                              onClick={() => onDeleteQr(code.id)}
                              disabled={Boolean(deletingId)}
                            >
                              Delete
                            </button>
                            <button type="button" className="p1-btn" onClick={() => onToggleSaved(code.id)}>
                              {code.saved ? 'Unsave' : 'Save'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="p1-saved-screen p1-screen-swap" key="saved-screen">
          <section className="p1-card p1-saved-list">
            <h3>Saved QR Codes</h3>
            <div className="p1-saved-filters">
              <input
                type="search"
                placeholder="Search saved QR codes"
                value={savedSearch}
                onChange={(event) => setSavedSearch(event.target.value)}
              />
              <select
                value={savedCategoryFilter}
                onChange={(event) => setSavedCategoryFilter(event.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="p1-saved-scroll">
              {filteredSavedCodes.length === 0 ? (
                <div className="p1-empty">No saved QR codes match this filter.</div>
              ) : (
                filteredSavedCodes.map((code) => (
                  <article
                    key={code.id}
                    className={`p1-saved-item ${selectedSavedCode?.id === code.id ? 'active' : ''} ${
                      newlyCreatedId === code.id ? 'p1-row-new' : ''
                    } ${deletingId === code.id ? 'p1-row-deleting' : ''}`}
                    onClick={() => setSelectedSavedId(code.id)}
                  >
                    <div>
                      <h4>{code.title}</h4>
                      <span className={`p1-cat ${categoryKey(code.category)}`}>{code.category}</span>
                    </div>
                    <button
                      type="button"
                      className="p1-btn p1-btn-danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveFromSaved(code.id);
                      }}
                      disabled={Boolean(deletingId)}
                    >
                      Remove
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="p1-card p1-details-card">
            <h3>QR Preview & Details</h3>
            {selectedSavedCode ? (
              <>
                <div className="p1-scan-frame p1-scan-frame-large">
                  <img
                    className="p1-detail-preview"
                    src={buildQrPreview(selectedSavedCode.content, 250)}
                    alt={`${selectedSavedCode.title} qr`}
                  />
                </div>
                <dl>
                  <div>
                    <dt>Title</dt>
                    <dd>{selectedSavedCode.title}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{selectedSavedCode.category}</dd>
                  </div>
                  <div>
                    <dt>Content</dt>
                    <dd>{selectedSavedCode.content}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{formatDateTime(selectedSavedCode.updatedAt)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <div className="p1-empty">Select a saved QR code to see details.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
