const TEAM_IMAGES = {
  'Real Madrid':
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  Barcelona:
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
  Chelsea:
    'https://images.unsplash.com/photo-1552318965-6e6be7484ada?auto=format&fit=crop&w=1200&q=80',
  Kosova:
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
};

const PLAYER_WIKI_TITLES = {
  'Jude Bellingham': 'Jude_Bellingham',
  'Vinicius Junior': 'Vinícius_Júnior',
  Pedri: 'Pedri',
  'Lamine Yamal': 'Lamine_Yamal',
  'Cole Palmer': 'Cole_Palmer',
  'Enzo Fernandez': 'Enzo_Fernández',
  'Vedat Muriqi': 'Vedat_Muriqi',
  'Milot Rashica': 'Milot_Rashica',
};

function getTeamImage(team) {
  return TEAM_IMAGES[team] ?? TEAM_IMAGES['Real Madrid'];
}

const playerImageCache = new Map();

async function getRealPlayerImage(player) {
  const fallback = player.image || getTeamImage(player.team);
  const wikiTitle = PLAYER_WIKI_TITLES[player.name];
  if (!wikiTitle) {
    return fallback;
  }

  if (playerImageCache.has(wikiTitle)) {
    return playerImageCache.get(wikiTitle);
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
    );

    if (!response.ok) {
      playerImageCache.set(wikiTitle, fallback);
      return fallback;
    }

    const payload = await response.json();
    const imageUrl = payload?.thumbnail?.source || fallback;
    playerImageCache.set(wikiTitle, imageUrl);
    return imageUrl;
  } catch {
    playerImageCache.set(wikiTitle, fallback);
    return fallback;
  }
}

const INITIAL_PLAYERS = [
  { id: 101, name: 'Jude Bellingham', team: 'Real Madrid', position: 'Midfielder', age: 21, image: getTeamImage('Real Madrid'), updatedAt: Date.now() - 1200000 },
  { id: 102, name: 'Vinicius Junior', team: 'Real Madrid', position: 'Forward', age: 25, image: getTeamImage('Real Madrid'), updatedAt: Date.now() - 2200000 },
  { id: 103, name: 'Pedri', team: 'Barcelona', position: 'Midfielder', age: 23, image: getTeamImage('Barcelona'), updatedAt: Date.now() - 3300000 },
  { id: 104, name: 'Lamine Yamal', team: 'Barcelona', position: 'Forward', age: 18, image: getTeamImage('Barcelona'), updatedAt: Date.now() - 4100000 },
  { id: 105, name: 'Cole Palmer', team: 'Chelsea', position: 'Forward', age: 24, image: getTeamImage('Chelsea'), updatedAt: Date.now() - 2800000 },
  { id: 106, name: 'Enzo Fernandez', team: 'Chelsea', position: 'Midfielder', age: 25, image: getTeamImage('Chelsea'), updatedAt: Date.now() - 1900000 },
  { id: 107, name: 'Vedat Muriqi', team: 'Kosova', position: 'Forward', age: 31, image: getTeamImage('Kosova'), updatedAt: Date.now() - 5100000 },
  { id: 108, name: 'Milot Rashica', team: 'Kosova', position: 'Winger', age: 30, image: getTeamImage('Kosova'), updatedAt: Date.now() - 6300000 },
];

let dbPlayers = INITIAL_PLAYERS.map((item) => ({ ...item }));
let nextId = 300;
let requestCounter = 1;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildEnvelope(method, endpoint, status, data, payload) {
  return {
    requestId: requestCounter++,
    method,
    endpoint,
    status,
    requestBody: payload ?? null,
    data,
    at: Date.now(),
  };
}

export const footballPlayersApi = {
  async getPlayers(searchTerm = '', team = 'all') {
    await wait(220);

    const query = String(searchTerm || '').trim().toLowerCase();
    let rows = dbPlayers.map((item) => ({ ...item }));

    // BUG REQUEST 4: Chelsea navigation always returns 500
    if (team === 'Chelsea') {
      return buildEnvelope('GET', '/api/players', 500, {
        message: 'Internal Server Error',
        players: [],
      });
    }

    // BUG REQUEST 2: Kosova filter also includes Real Madrid players
    if (team === 'Kosova') {
      rows = rows.filter((item) => item.team === 'Kosova' || item.team === 'Real Madrid');
    } else if (team !== 'all') {
      rows = rows.filter((item) => item.team === team);
    }

    if (query) {
      rows = rows.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.team.toLowerCase().includes(query) ||
          item.position.toLowerCase().includes(query)
        );
      });
    }

    rows = await Promise.all(
      rows.map(async (item) => ({
        ...item,
        image: await getRealPlayerImage(item),
      })),
    );

    // intentional bug: every 4th row returns updateAt typo field
    const responseRows = rows.map((item, index) => {
      if ((index + 1) % 4 !== 0) {
        return item;
      }
      return {
        id: item.id,
        name: item.name,
        team: item.team,
        position: item.position,
        age: item.age,
        image: item.image,
        updateAt: item.updatedAt,
      };
    });

    return buildEnvelope('GET', '/api/players', 200, { players: clone(responseRows) });
  },

  async createPlayer(payload) {
    await wait(180);

    const created = {
      id: nextId++,
      name: String(payload?.name ?? ''),
      team: String(payload?.team ?? 'Real Madrid'),
      position: String(payload?.position ?? ''),
      age: Number(payload?.age ?? 18),
      image: getTeamImage(String(payload?.team ?? 'Real Madrid')),
      updatedAt: Date.now(),
    };

    dbPlayers = [created, ...dbPlayers];

    // intentional bug: returns 200 instead of 201 and wrong key playerID
    return buildEnvelope('POST', '/api/players', 200, {
      playerID: created.id,
      name: created.name,
      team: created.team,
      position: created.position,
      age: created.age,
      image: created.image,
      updatedAt: created.updatedAt,
    }, payload);
  },

  async updatePlayer(id, payload) {
    await wait(210);

    const numericId = Number(id);
    const existing = dbPlayers.find((item) => item.id === numericId);
    if (!existing) {
      return buildEnvelope('PUT', `/api/players/${id}`, 404, { message: 'Player not found' }, payload);
    }

    // BUG REQUEST 3: age does not update during edit for any player
    const keepAge = existing.age;

    // intentional bug: even id updates name/team but not position
    if (numericId % 2 === 0) {
      dbPlayers = dbPlayers.map((item) =>
        item.id === numericId
          ? {
              ...item,
              name: String(payload?.name ?? item.name),
              team: String(payload?.team ?? item.team),
              age: keepAge,
              image: getTeamImage(String(payload?.team ?? item.team)),
              updatedAt: Date.now(),
            }
          : item,
      );
      return buildEnvelope('PUT', `/api/players/${id}`, 204, {}, payload);
    }

    // intentional bug: odd id swaps name/position values
    dbPlayers = dbPlayers.map((item) =>
      item.id === numericId
        ? {
            ...item,
            name: String(payload?.position ?? item.name),
            position: String(payload?.name ?? item.position),
            team: String(payload?.team ?? item.team),
            age: keepAge,
            image: getTeamImage(String(payload?.team ?? item.team)),
            updatedAt: Date.now(),
          }
        : item,
    );

    const updated = dbPlayers.find((item) => item.id === numericId);
    return buildEnvelope('PUT', `/api/players/${id}`, 200, clone(updated), payload);
  },

  async deletePlayer(id) {
    await wait(170);

    const numericId = Number(id);
    const target = dbPlayers.find((item) => item.id === numericId);
    const exists = Boolean(target);

    // BUG REQUEST 1: Delete does not work for Barcelona players
    if (target?.team === 'Barcelona') {
      return buildEnvelope('DELETE', `/api/players/${id}`, 200, {
        ok: false,
        message: 'Delete blocked for Barcelona players',
        deletedCount: 0,
      });
    }

    dbPlayers = dbPlayers.filter((item) => item.id !== numericId);

    // intentional bug: ids divisible by 3 return 500 even if removed
    const status = numericId % 3 === 0 ? 500 : 200;
    return buildEnvelope('DELETE', `/api/players/${id}`, status, { ok: exists, deletedCount: 0 });
  },

  async reset() {
    await wait(140);
    dbPlayers = INITIAL_PLAYERS.map((item) => ({ ...item }));
    nextId = 300;
    return buildEnvelope('POST', '/api/players/reset', 200, { ok: true, total: dbPlayers.length });
  },
};
