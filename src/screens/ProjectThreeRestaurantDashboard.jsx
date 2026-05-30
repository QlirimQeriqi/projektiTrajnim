import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'project3-menu-items';
const LOGIN_CREDENTIALS = {
  email: 'manager@restaurantmenu.com',
  password: 'Menu123',
};

const CATEGORIES = [
  'Mëngjes',
  'Sallata',
  'Sandviç',
  'Hamburger',
  'Skarë',
  'Samun',
  'Pizza',
  'Rizoto',
  'Pasta',
  'Menze',
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

function formatPrice(value) {
  return `${Number(value).toFixed(2)} €`;
}

export default function ProjectThreeRestaurantDashboard({ onExit }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState('create');

  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSubmitError, setLoginSubmitError] = useState('');

  const [menuItems, setMenuItems] = useState(() => getStoredValue(STORAGE_KEY, []));
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [formValues, setFormValues] = useState({
    category: CATEGORIES[0],
    name: '',
    description: '',
    price: '',
  });
  const [formError, setFormError] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    category: CATEGORIES[0],
    name: '',
    description: '',
    price: '',
  });
  const [editError, setEditError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  const saveItems = (nextItems) => {
    setMenuItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
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
      setLoginSubmitError('Invalid email or password.');
      return;
    }

    setIsLoggedIn(true);
    setScreen('create');
  };

  const resetForm = () => {
    setFormValues({
      category: CATEGORIES[0],
      name: '',
      description: '',
      price: '',
    });
    setFormError('');
  };

  const onSaveItem = (event) => {
    event.preventDefault();

    if (!formValues.name.trim()) {
      setFormError('Item name is required.');
      return;
    }

    if (!formValues.description.trim()) {
      setFormError('Description is required.');
      return;
    }

    const numericPrice = Number(formValues.price);
    if (!formValues.price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('Price must be a positive number.');
      return;
    }

    const now = Date.now();

    const newItem = {
      id: `menu-${now}`,
      category: formValues.category,
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      price: Number(numericPrice.toFixed(2)),
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    const next = [newItem, ...menuItems];
    saveItems(next);
    setSelectedItemId(newItem.id);
    resetForm();
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setEditValues({
      category: item.category,
      name: item.name,
      description: item.description,
      price: String(item.price),
    });
    setEditError('');
    setIsEditOpen(true);
  };

  const onSaveEdit = () => {
    if (!editValues.name.trim()) {
      setEditError('Item name is required.');
      return;
    }

    if (!editValues.description.trim()) {
      setEditError('Description is required.');
      return;
    }

    const numericPrice = Number(editValues.price);
    if (!editValues.price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setEditError('Price must be a positive number.');
      return;
    }

    const now = Date.now();
    const next = menuItems.map((item) =>
      item.id === editingId
        ? {
            ...item,
            category: editValues.category,
            name: editValues.name.trim(),
            description: editValues.description.trim(),
            price: Number(numericPrice.toFixed(2)),
            updatedAt: now,
          }
        : item,
    );
    saveItems(next);
    setIsEditOpen(false);
    setEditingId(null);
    setEditError('');
  };

  const onRemove = (id) => {
    const next = menuItems.filter((item) => item.id !== id);
    saveItems(next);
    if (selectedItemId === id) {
      setSelectedItemId(next[0]?.id ?? null);
    }
  };

  const onDuplicate = (item) => {
    const now = Date.now();
    const copy = {
      ...item,
      id: `menu-${now}`,
      name: `${item.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    const next = [copy, ...menuItems];
    saveItems(next);
    setSelectedItemId(copy.id);
  };

  const onToggleArchive = (id) => {
    const next = menuItems.map((item) =>
      item.id === id
        ? {
            ...item,
            archived: !item.archived,
            updatedAt: Date.now(),
          }
        : item,
    );
    saveItems(next);
  };

  const statusFilteredItems = useMemo(() => {
    if (statusFilter === 'all') {
      return menuItems;
    }

    if (statusFilter === 'archived') {
      return menuItems.filter((item) => item.archived);
    }

    return menuItems.filter((item) => !item.archived);
  }, [menuItems, statusFilter]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return statusFilteredItems.filter((item) => {
      const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });
  }, [statusFilteredItems, search, categoryFilter]);

  const availableCategories = useMemo(
    () => CATEGORIES.filter((category) => statusFilteredItems.some((item) => item.category === category)),
    [statusFilteredItems],
  );

  useEffect(() => {
    if (categoryFilter !== 'all' && !availableCategories.includes(categoryFilter)) {
      setCategoryFilter('all');
    }
  }, [availableCategories, categoryFilter]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ?? filteredItems[0] ?? null;

  const groupedFilteredItems = useMemo(() => {
    const categoriesToRender = categoryFilter === 'all' ? availableCategories : [categoryFilter];

    return categoriesToRender
      .map((category) => ({
        category,
        items: filteredItems.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [availableCategories, categoryFilter, filteredItems]);

  if (!isLoggedIn) {
    return (
      <div className="p3-root p3-login-screen">
        <div className="p3-login-frame">
          <button type="button" className="p3-back" onClick={onExit}>
            Back To Main Login
          </button>

          <section className="p3-login-card">
            <span className="p3-kicker">Project 3</span>
            <h1>QA Restaurant Menu</h1>
            <p>Manage categories, menu items, and pricing in one fast workflow.</p>

            <form onSubmit={onLoginSubmit} className="p3-form" noValidate>
              <label htmlFor="p3-email">Email</label>
              <input
                id="p3-email"
                name="email"
                type="email"
                value={loginValues.email}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setLoginValues((prev) => ({ ...prev, [name]: value }));
                  setLoginErrors((prev) => ({ ...prev, [name]: '' }));
                  setLoginSubmitError('');
                }}
                placeholder="your-email@example.com"
              />
              {loginErrors.email ? <small className="p3-error">{loginErrors.email}</small> : null}

              <label htmlFor="p3-password">Password</label>
              <input
                id="p3-password"
                name="password"
                type="password"
                value={loginValues.password}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setLoginValues((prev) => ({ ...prev, [name]: value }));
                  setLoginErrors((prev) => ({ ...prev, [name]: '' }));
                  setLoginSubmitError('');
                }}
                placeholder="Menu123"
              />
              {loginErrors.password ? <small className="p3-error">{loginErrors.password}</small> : null}

              {loginSubmitError ? <p className="p3-alert">{loginSubmitError}</p> : null}

              <button type="submit" className="p3-btn p3-btn-primary p3-full">
                Login
              </button>
            </form>

            <div className="p3-credentials">
              <p>
                Email: <strong>{LOGIN_CREDENTIALS.email}</strong>
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
    <div className="p3-root p3-app-shell">
      <header className="p3-topbar">
        <h1>QA Restaurant Menu</h1>
      </header>

      <aside className="p3-sidebar">
        <div>
          <span className="p3-kicker">Project 3</span>
          <h2>QA Restaurant Menu</h2>
        </div>

        <nav>
          <button type="button" className={screen === 'create' ? 'active' : ''} onClick={() => setScreen('create')}>
            Create Menu Item
          </button>
          <button type="button" className={screen === 'list' ? 'active' : ''} onClick={() => setScreen('list')}>
            QA Restaurant Menu List
          </button>
        </nav>

        <button
          type="button"
          className="p3-btn"
          onClick={() => {
            setIsLoggedIn(false);
            setScreen('create');
          }}
        >
          Logout
        </button>
      </aside>

      <main className="p3-main">
        {screen === 'create' ? (
          <section className="p3-panel">
            <h3>Create Menu Item</h3>
            <p className="p3-muted">Set category, item details, and price.</p>

            <form onSubmit={onSaveItem} className="p3-form" noValidate>
              <label htmlFor="p3-category">Category</label>
              <select
                id="p3-category"
                value={formValues.category}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="p3-item-name">Item Name</label>
              <input
                id="p3-item-name"
                type="text"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="Double Smash Burger"
              />

              <label htmlFor="p3-item-description">Description</label>
              <textarea
                id="p3-item-description"
                rows="4"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Grilled beef, cheddar, pickles, signature sauce"
              />

              <label htmlFor="p3-item-price">Price</label>
              <input
                id="p3-item-price"
                type="number"
                min="0"
                step="0.01"
                value={formValues.price}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                placeholder="7.90"
              />

              {formError ? <p className="p3-alert">{formError}</p> : null}

              <div className="p3-actions">
                <button type="submit" className="p3-btn p3-btn-primary">
                  Save Item
                </button>
                <button type="button" className="p3-btn" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="p3-panel p3-list-layout">
            <div className="p3-list-head">
              <div>
                <h3>QA Restaurant Menu List</h3>
                <p className="p3-muted">Filter, search, edit, and remove menu items.</p>
              </div>
              <div className="p3-filters">
                <input
                  type="search"
                  placeholder="Search item or description"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="all">All categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="active">Active only</option>
                  <option value="archived">Archived only</option>
                  <option value="all">All status</option>
                </select>
              </div>
            </div>

            <div className="p3-list-grid">
              <div className="p3-list-table-wrap">
                <div className="p3-category-row">
                  <button
                    type="button"
                    className={categoryFilter === 'all' ? 'active' : ''}
                    onClick={() => setCategoryFilter('all')}
                  >
                    Të Gjitha
                  </button>
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={categoryFilter === category ? 'active' : ''}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {filteredItems.length === 0 ? (
                  <div className="p3-empty">No menu items found.</div>
                ) : (
                  <div className="p3-category-sections">
                    {groupedFilteredItems.map((group) => (
                      <section key={group.category} className="p3-category-box">
                        <header>
                          <h4>{group.category}</h4>
                          <span>{group.items.length} items</span>
                        </header>
                        <div className="p3-category-items">
                          {group.items.map((item) => (
                            <article
                              key={item.id}
                              className={`p3-category-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                              onClick={() => setSelectedItemId(item.id)}
                            >
                              <div className="p3-category-item-main">
                                <h5>{item.name}</h5>
                                <p>{item.description}</p>
                              </div>
                              <div className="p3-category-item-side">
                                <strong>{formatPrice(item.price)}</strong>
                                <div className="p3-row-actions">
                                  <button type="button" className="p3-btn" onClick={() => onDuplicate(item)}>
                                    Duplicate
                                  </button>
                                  <button type="button" className="p3-btn" onClick={() => onEdit(item)}>
                                    Edit
                                  </button>
                                  <button type="button" className="p3-btn p3-btn-muted" onClick={() => onToggleArchive(item.id)}>
                                    {item.archived ? 'Restore' : 'Archive'}
                                  </button>
                                  <button type="button" className="p3-btn p3-btn-danger" onClick={() => onRemove(item.id)}>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="p3-detail-card p3-detail-row">
              <h4>Item Details</h4>
              {selectedItem ? (
                <>
                  <p className="p3-chip">{selectedItem.category}</p>
                  <p className="p3-chip p3-chip-status">{selectedItem.archived ? 'Archived' : 'Active'}</p>
                  <h5>{selectedItem.name}</h5>
                  <p>{selectedItem.description}</p>
                  <strong>{formatPrice(selectedItem.price)}</strong>
                  <small>Updated: {formatDate(selectedItem.updatedAt)}</small>
                </>
              ) : (
                <div className="p3-empty">Select an item to view details.</div>
              )}
            </aside>
          </section>
        )}
      </main>

      {isEditOpen ? (
        <div className="p3-modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="p3-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Edit Menu Item</h3>
            <p className="p3-muted">Update item details and save changes.</p>

            <label htmlFor="p3-edit-category">Category</label>
            <select
              id="p3-edit-category"
              value={editValues.category}
              onChange={(event) =>
                setEditValues((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label htmlFor="p3-edit-name">Item Name</label>
            <input
              id="p3-edit-name"
              type="text"
              value={editValues.name}
              onChange={(event) =>
                setEditValues((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />

            <label htmlFor="p3-edit-description">Description</label>
            <textarea
              id="p3-edit-description"
              rows="3"
              value={editValues.description}
              onChange={(event) =>
                setEditValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />

            <label htmlFor="p3-edit-price">Price</label>
            <input
              id="p3-edit-price"
              type="number"
              min="0"
              step="0.01"
              value={editValues.price}
              onChange={(event) =>
                setEditValues((prev) => ({
                  ...prev,
                  price: event.target.value,
                }))
              }
            />

            {editError ? <p className="p3-alert">{editError}</p> : null}

            <div className="p3-actions">
              <button type="button" className="p3-btn p3-btn-primary" onClick={onSaveEdit}>
                Save Changes
              </button>
              <button type="button" className="p3-btn" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
