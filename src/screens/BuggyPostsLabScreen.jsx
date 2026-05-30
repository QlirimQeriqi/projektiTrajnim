import { useEffect, useMemo, useState } from 'react';
import { footballPlayersApi } from '../api/footballPlayersApi';

const TEAMS = ['Real Madrid', 'Barcelona', 'Chelsea', 'Kosova'];

function formatTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(value);
}

function getUpdatedAt(player) {
  return player.updatedAt ?? player.updateAt ?? Date.now();
}

export default function BuggyPostsLabScreen({ onExit }) {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [form, setForm] = useState({
    name: '',
    team: TEAMS[0],
    position: '',
    age: 22,
  });
  const [editingId, setEditingId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pushLog = (envelope) => {
    setLogs((prev) => [envelope, ...prev].slice(0, 20));
  };

  const loadPlayers = async (query = search, team = teamFilter) => {
    setLoading(true);
    setErrorMessage('');
    const response = await footballPlayersApi.getPlayers(query, team);
    pushLog(response);
    setLoading(false);

    if (response.status >= 400) {
      setErrorMessage('Failed loading players.');
      setPlayers([]);
      return;
    }

    setPlayers(Array.isArray(response.data?.players) ? response.data.players : []);
  };

  useEffect(() => {
    loadPlayers('', 'all');
  }, []);

  const selectedEditingPlayer = useMemo(
    () => players.find((item) => item.id === editingId) ?? null,
    [players, editingId],
  );

  const onCreate = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const response = await footballPlayersApi.createPlayer(form);
    pushLog(response);

    if (response.status >= 400) {
      setErrorMessage('Create failed.');
      return;
    }

    // intentional frontend bug for training: temp row not reconciled with backend id
    setPlayers((prev) => [
      {
        id: `temp-${Date.now()}`,
        name: form.name,
        team: form.team,
        position: form.position,
        age: Number(form.age),
        image:
          form.team === 'Real Madrid'
            ? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
            : form.team === 'Barcelona'
              ? 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80'
              : form.team === 'Chelsea'
                ? 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
        updatedAt: Date.now(),
      },
      ...prev,
    ]);

    setForm({
      name: '',
      team: TEAMS[0],
      position: '',
      age: 22,
    });
  };

  const onStartEdit = (player) => {
    setEditingId(player.id);

    // intentional frontend bug for training: position prefilled from name
    setForm({
      name: player.name ?? '',
      team: player.team ?? TEAMS[0],
      position: player.name ?? '',
      age: Number(player.age ?? 22),
    });
  };

  const onSaveEdit = async () => {
    if (!editingId) {
      return;
    }

    const response = await footballPlayersApi.updatePlayer(editingId, form);
    pushLog(response);

    if (response.status >= 400) {
      setErrorMessage(`Update failed with status ${response.status}.`);
      return;
    }

    setEditingId(null);
    setForm({
      name: '',
      team: TEAMS[0],
      position: '',
      age: 22,
    });
    loadPlayers(search, teamFilter);
  };

  const onDelete = async (id) => {
    const response = await footballPlayersApi.deletePlayer(id);
    pushLog(response);

    // intentional frontend bug for training: on error, list is not refreshed
    if (response.status >= 400) {
      setErrorMessage(`Delete returned status ${response.status}.`);
      return;
    }

    // intentional behavior for training:
    // if backend returns 200 but ok=false (Barcelona case), keep the player visible on UI.
    if (!response.data?.ok) {
      return;
    }

    setPlayers((prev) => prev.filter((item) => item.id !== id));
  };

  const onResetData = async () => {
    const response = await footballPlayersApi.reset();
    pushLog(response);
    loadPlayers('', 'all');
  };

  return (
    <div className="buglab-root">
      <button type="button" className="buglab-back" onClick={onExit}>
        Back To Login
      </button>

      <section className="buglab-card">
        <header className="buglab-head">
          <div>
            <span>Players Football</span>
            <h1>Players Football Platform</h1>
          </div>
          <button type="button" className="buglab-btn" onClick={onResetData}>
            Reset Data
          </button>
        </header>

        <nav className="buglab-team-nav" aria-label="Teams">
          <button
            type="button"
            className={teamFilter === 'all' ? 'active' : ''}
            onClick={() => {
              setTeamFilter('all');
              loadPlayers(search, 'all');
            }}
          >
            All Teams
          </button>
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              className={teamFilter === team ? 'active' : ''}
              onClick={() => {
                setTeamFilter(team);
                loadPlayers(search, team);
              }}
            >
              {team}
            </button>
          ))}
        </nav>

        <div className="buglab-layout">
          <aside className="buglab-side">
            <section className="buglab-panel">
              <form className="buglab-form" onSubmit={onCreate}>
                <h3>{editingId ? 'Edit Player' : 'Add Player'}</h3>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Player name"
                />
                <select
                  value={form.team}
                  onChange={(event) => setForm((prev) => ({ ...prev, team: event.target.value }))}
                >
                  {TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={form.position}
                  onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
                  placeholder="Position"
                />
                <input
                  type="number"
                  min="16"
                  max="45"
                  value={form.age}
                  onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                  placeholder="Age"
                />

                <div className="buglab-actions">
                  {editingId ? (
                    <>
                      <button type="button" className="buglab-btn buglab-btn-primary" onClick={onSaveEdit}>
                        Save Edit
                      </button>
                      <button type="button" className="buglab-btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="submit" className="buglab-btn buglab-btn-primary">
                      Add Player
                    </button>
                  )}
                </div>
              </form>
            </section>
          </aside>

          <section className="buglab-main-area">
            <div className="buglab-toolbar">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search players"
              />
              <button type="button" className="buglab-btn" onClick={() => loadPlayers(search, teamFilter)}>
                Search
              </button>
            </div>

            {errorMessage ? <p className="buglab-error">{errorMessage}</p> : null}
            {loading ? <p className="buglab-muted">Loading...</p> : null}

            <div className="buglab-cards-grid">
              {players.map((player) => (
                <article
                  key={player.id}
                  className={`buglab-post-card ${selectedEditingPlayer?.id === player.id ? 'active' : ''}`}
                >
                  <div className="buglab-player-image-wrap">
                    <img src={player.image} alt={player.name} className="buglab-player-image" />
                  </div>
                  <div className="buglab-post-top">
                    <span className="buglab-pill">{player.team}</span>
                    <span className="buglab-score">{player.age}</span>
                  </div>
                  <h4>{player.name}</h4>
                  <p>{player.position}</p>
                  <small>
                    #{player.id} • Updated {formatTime(getUpdatedAt(player))}
                  </small>

                  <div className="buglab-actions buglab-post-actions">
                    <button type="button" className="buglab-btn" onClick={() => onStartEdit(player)}>
                      Edit
                    </button>
                    <button type="button" className="buglab-btn buglab-btn-danger" onClick={() => onDelete(player.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <section className="buglab-panel buglab-log-panel">
              <h3>Request / Response</h3>
              <div className="buglab-log-list">
                {logs.length === 0 ? (
                  <div className="buglab-log">No requests yet.</div>
                ) : (
                  logs.map((entry) => (
                    <article key={entry.requestId} className="buglab-log">
                      <header>
                        <strong>
                          [{entry.status}] {entry.method} {entry.endpoint}
                        </strong>
                        <small>{formatTime(entry.at)}</small>
                      </header>
                      <pre>request: {JSON.stringify(entry.requestBody, null, 2)}</pre>
                      <pre>response: {JSON.stringify(entry.data, null, 2)}</pre>
                    </article>
                  ))
                )}
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}
