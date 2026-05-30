import { useMemo, useState } from 'react';

const STORAGE_KEY = 'project2-news-posts';
const LOGIN_CREDENTIALS = {
  email: 'editor@newsdesk.com',
  password: 'News123',
};

const REPORT_REASONS = ['Misinformation', 'Sensitive Content', 'Copyright', 'Offensive Language', 'Other'];

const STORY_CATEGORIES = [
  {
    id: 'news',
    label: 'News',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'sport',
    label: 'Sport',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'politican',
    label: 'Politican',
    image: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'art',
    label: 'Art',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'music',
    label: 'Music',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80',
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function getStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function getCategoryById(categoryId) {
  return STORY_CATEGORIES.find((category) => category.id === categoryId) ?? STORY_CATEGORIES[0];
}

export default function ProjectTwoSocialAdminApp({ onExit }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState('desk');

  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSubmitError, setLoginSubmitError] = useState('');

  const [storyTitle, setStoryTitle] = useState('');
  const [storyText, setStoryText] = useState('');
  const [storyCategory, setStoryCategory] = useState(STORY_CATEGORIES[0].id);
  const [storyError, setStoryError] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [deskSearch, setDeskSearch] = useState('');
  const [draftReportReason, setDraftReportReason] = useState(REPORT_REASONS[0]);

  const [reportedSearch, setReportedSearch] = useState('');
  const [reportedReasonFilter, setReportedReasonFilter] = useState('all');
  const [toasts, setToasts] = useState([]);

  const [stories, setStories] = useState(() => getStoredValue(STORAGE_KEY, []));

  const saveStories = (next) => {
    setStories(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const pushToast = (message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const validateLogin = () => {
    const errors = {};

    if (!loginValues.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(loginValues.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }

    if (!loginValues.password.trim()) {
      errors.password = 'Password is required.';
    } else if (loginValues.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
  };

  const onLoginSubmit = (event) => {
    event.preventDefault();

    const errors = validateLogin();
    setLoginErrors(errors);
    setLoginSubmitError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    const isValid =
      loginValues.email.trim().toLowerCase() === LOGIN_CREDENTIALS.email &&
      loginValues.password === LOGIN_CREDENTIALS.password;

    if (!isValid) {
      setLoginSubmitError('Invalid credentials. Use the newsroom demo account below.');
      return;
    }

    setIsLoggedIn(true);
    setScreen('desk');
    pushToast('Welcome to Newsroom Admin.', 'success');
  };

  const onPublishStory = () => {
    if (!storyTitle.trim()) {
      setStoryError('Headline is required.');
      return;
    }

    if (!storyText.trim()) {
      setStoryError('Story content is required.');
      return;
    }

    const now = Date.now();

    const selectedCategory = getCategoryById(storyCategory);

    const nextStory = {
      id: `story-${now}`,
      title: storyTitle.trim(),
      text: storyText.trim(),
      category: selectedCategory.label,
      image: selectedCategory.image,
      createdAt: now,
      likes: Math.floor(Math.random() * 120),
      comments: Math.floor(Math.random() * 45),
      status: 'published',
      reportReason: '',
    };

    saveStories([nextStory, ...stories]);
    setStoryTitle('');
    setStoryText('');
    setStoryError('');
    pushToast('Story published successfully.', 'success');
  };

  const onReportStory = (storyId) => {
    const next = stories.map((story) =>
      story.id === storyId ? { ...story, status: 'reported', reportReason: draftReportReason } : story,
    );
    saveStories(next);
    pushToast('Story moved to reported queue for review.', 'warning');
  };

  const onApproveStory = (storyId) => {
    const next = stories.map((story) =>
      story.id === storyId ? { ...story, status: 'approved', reportReason: '' } : story,
    );
    saveStories(next);
    pushToast('Reported story approved.', 'success');
  };

  const onDeleteStory = (storyId) => {
    const next = stories.filter((story) => story.id !== storyId);
    saveStories(next);
    pushToast('Story deleted.', 'danger');
  };

  const onIncrementCounter = (storyId, key) => {
    const next = stories.map((story) =>
      story.id === storyId ? { ...story, [key]: story[key] + 1 } : story,
    );
    saveStories(next);
  };

  const filteredDeskStories = useMemo(() => {
    const query = deskSearch.trim().toLowerCase();

    return stories.filter((story) => {
      const statusMatch = statusFilter === 'all' || story.status === statusFilter;
      const searchMatch =
        !query ||
        story.title.toLowerCase().includes(query) ||
        story.text.toLowerCase().includes(query) ||
        (story.category ?? '').toLowerCase().includes(query) ||
        story.reportReason.toLowerCase().includes(query);
      return statusMatch && searchMatch;
    });
  }, [stories, deskSearch, statusFilter]);

  const reportedStories = useMemo(() => stories.filter((story) => story.status === 'reported'), [stories]);

  const filteredReportedStories = useMemo(() => {
    const query = reportedSearch.trim().toLowerCase();

    return reportedStories.filter((story) => {
      const reasonMatch = reportedReasonFilter === 'all' || story.reportReason === reportedReasonFilter;
      const searchMatch =
        !query ||
        story.title.toLowerCase().includes(query) ||
        story.text.toLowerCase().includes(query) ||
        story.reportReason.toLowerCase().includes(query);
      return reasonMatch && searchMatch;
    });
  }, [reportedStories, reportedSearch, reportedReasonFilter]);

  const publishedCount = stories.filter((story) => story.status === 'published').length;
  const reportedCount = reportedStories.length;
  const approvedCount = stories.filter((story) => story.status === 'approved').length;

  const getStatusClass = (status) => `news2-badge news2-badge-${status}`;

  if (!isLoggedIn) {
    return (
      <div className="news2-root news2-login-shell">
        <div className="news2-toast-stack" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <article key={toast.id} className={`news2-toast news2-toast-${toast.tone}`}>
              {toast.message}
            </article>
          ))}
        </div>

        <div className="news2-login-frame">
          <button type="button" className="news2-back" onClick={onExit}>
            Back To Main Login
          </button>

          <section className="news2-login-card">
            <p className="news2-kicker">Project 2</p>
            <h1>QA Admin desk</h1>
            <p className="news2-muted">Sign in to publish stories and moderate reported content.</p>

            <form onSubmit={onLoginSubmit} className="news2-form" noValidate>
              <label htmlFor="news2-email">Email</label>
              <input
                id="news2-email"
                name="email"
                type="email"
                value={loginValues.email}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setLoginValues((prev) => ({ ...prev, [name]: value }));
                  setLoginErrors((prev) => ({ ...prev, [name]: '' }));
                  setLoginSubmitError('');
                }}
                placeholder="editor@newsdesk.com"
              />
              {loginErrors.email ? <small className="news2-error">{loginErrors.email}</small> : null}

              <label htmlFor="news2-password">Password</label>
              <input
                id="news2-password"
                name="password"
                type="password"
                value={loginValues.password}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setLoginValues((prev) => ({ ...prev, [name]: value }));
                  setLoginErrors((prev) => ({ ...prev, [name]: '' }));
                  setLoginSubmitError('');
                }}
                placeholder="News123"
              />
              {loginErrors.password ? <small className="news2-error">{loginErrors.password}</small> : null}

              {loginSubmitError ? <p className="news2-alert">{loginSubmitError}</p> : null}

              <button type="submit" className="news2-btn news2-btn-primary news2-full">
                Login
              </button>
            </form>

            <div className="news2-credentials">
              <p>
                Demo: <strong>{LOGIN_CREDENTIALS.email}</strong>
              </p>
              <p>
                Password: <strong>{LOGIN_CREDENTIALS.password}</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="news2-root news2-app-shell">
      <div className="news2-toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <article key={toast.id} className={`news2-toast news2-toast-${toast.tone}`}>
            {toast.message}
          </article>
        ))}
      </div>

      <aside className="news2-sidebar">
        <div>
          <p className="news2-kicker">Project 2</p>
          <h2>Newsroom CMS</h2>
        </div>

        <nav>
          <button
            type="button"
            className={screen === 'desk' ? 'active' : ''}
            onClick={() => setScreen('desk')}
          >
            News Desk
          </button>
          <button
            type="button"
            className={screen === 'reported' ? 'active' : ''}
            onClick={() => setScreen('reported')}
          >
            Reported Stories
          </button>
        </nav>

        <section className="news2-sidebar-stats">
          <article>
            <small>Published</small>
            <strong>{publishedCount}</strong>
          </article>
          <article>
            <small>Reported</small>
            <strong>{reportedCount}</strong>
          </article>
          <article>
            <small>Approved</small>
            <strong>{approvedCount}</strong>
          </article>
        </section>

        <button
          type="button"
          className="news2-btn"
          onClick={() => {
            setIsLoggedIn(false);
            setScreen('desk');
          }}
        >
          Logout
        </button>
      </aside>

      <main className="news2-main">
        {screen === 'desk' ? (
          <div className="news2-screen">
            <section className="news2-panel news2-compose">
              <h3>Create News Story</h3>
              <p className="news2-muted">Add headline, content, choose category, then publish.</p>

              <label htmlFor="news2-title">Headline</label>
              <input
                id="news2-title"
                type="text"
                value={storyTitle}
                onChange={(event) => {
                  setStoryTitle(event.target.value);
                  setStoryError('');
                }}
                placeholder="City Council Approves New Transit Plan"
              />

              <label htmlFor="news2-text">Story Content</label>
              <textarea
                id="news2-text"
                rows="4"
                value={storyText}
                onChange={(event) => {
                  setStoryText(event.target.value);
                  setStoryError('');
                }}
                placeholder="Write the story details..."
              />

              <label htmlFor="news2-category">Category</label>
              <select
                id="news2-category"
                value={storyCategory}
                onChange={(event) => setStoryCategory(event.target.value)}
              >
                {STORY_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>

              <div className="news2-upload-row">
                <span className="news2-file-chip">Auto image from selected category</span>
              </div>

              <img
                src={getCategoryById(storyCategory).image}
                alt={`${getCategoryById(storyCategory).label} preview`}
                className="news2-preview-image"
              />
              {storyError ? <p className="news2-alert">{storyError}</p> : null}

              <button type="button" className="news2-btn news2-btn-primary" onClick={onPublishStory}>
                Publish Story
              </button>
            </section>

            <section className="news2-panel news2-list-panel">
              <div className="news2-list-head">
                <div>
                  <h3>Published Stories</h3>
                  <p className="news2-muted">Search, filter, and moderate stories.</p>
                </div>
                <div className="news2-filters">
                  <input
                    type="search"
                    placeholder="Search headline/content"
                    value={deskSearch}
                    onChange={(event) => setDeskSearch(event.target.value)}
                  />
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="all">All status</option>
                    <option value="published">Published</option>
                    <option value="reported">Reported</option>
                    <option value="approved">Approved</option>
                  </select>
                  <select
                    value={draftReportReason}
                    onChange={(event) => setDraftReportReason(event.target.value)}
                  >
                    {REPORT_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="news2-story-list">
                {filteredDeskStories.length === 0 ? (
                  <div className="news2-empty">No stories found for current filters.</div>
                ) : (
                  filteredDeskStories.map((story, index) => (
                    <article key={story.id} className="news2-story-card">
                      <img
                        src={story.image || FALLBACK_MEDIA[index % FALLBACK_MEDIA.length]}
                        alt="story"
                        className="news2-story-thumb"
                      />

                      <div className="news2-story-body">
                        <h4>{story.title}</h4>
                        <p>{story.text}</p>
                        <small>{formatDate(story.createdAt)}</small>
                        {story.category ? <small className="news2-reason">Category: {story.category}</small> : null}
                        {story.reportReason ? <small className="news2-reason">Reason: {story.reportReason}</small> : null}
                      </div>

                      <div className="news2-story-actions">
                        <span className={getStatusClass(story.status)}>{story.status}</span>
                        <div className="news2-counter-row">
                          <button type="button" className="news2-chip" onClick={() => onIncrementCounter(story.id, 'likes')}>
                            Likes {story.likes}
                          </button>
                          <button type="button" className="news2-chip" onClick={() => onIncrementCounter(story.id, 'comments')}>
                            Comments {story.comments}
                          </button>
                        </div>
                        <div className="news2-action-row">
                          <button type="button" className="news2-btn" onClick={() => onReportStory(story.id)}>
                            Report
                          </button>
                          <button type="button" className="news2-btn news2-btn-danger" onClick={() => onDeleteStory(story.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="news2-screen">
            <section className="news2-panel news2-list-panel">
              <div className="news2-list-head">
                <div>
                  <h3>Reported Stories</h3>
                  <p className="news2-muted">Review report reason, approve, or remove story.</p>
                </div>
                <div className="news2-filters news2-filters-reported">
                  <input
                    type="search"
                    placeholder="Search reported stories"
                    value={reportedSearch}
                    onChange={(event) => setReportedSearch(event.target.value)}
                  />
                  <select
                    value={reportedReasonFilter}
                    onChange={(event) => setReportedReasonFilter(event.target.value)}
                  >
                    <option value="all">All reasons</option>
                    {REPORT_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="news2-story-list">
                {filteredReportedStories.length === 0 ? (
                  <div className="news2-empty">No reported stories found.</div>
                ) : (
                  filteredReportedStories.map((story, index) => (
                    <article key={story.id} className="news2-story-card">
                      <img
                        src={story.image || FALLBACK_MEDIA[index % FALLBACK_MEDIA.length]}
                        alt="reported story"
                        className="news2-story-thumb"
                      />

                      <div className="news2-story-body">
                        <h4>{story.title}</h4>
                        <p>{story.text}</p>
                        <small>{formatDate(story.createdAt)}</small>
                        {story.category ? <small className="news2-reason">Category: {story.category}</small> : null}
                        <small className="news2-reason">Report reason: {story.reportReason}</small>
                      </div>

                      <div className="news2-story-actions">
                        <span className={getStatusClass(story.status)}>{story.status}</span>
                        <div className="news2-action-row">
                          <button type="button" className="news2-btn news2-btn-primary" onClick={() => onApproveStory(story.id)}>
                            Approve
                          </button>
                          <button type="button" className="news2-btn news2-btn-danger" onClick={() => onDeleteStory(story.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
