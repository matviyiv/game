const KEYS = {
  PLAYERS: 'teamSelector_players',
  HISTORY: 'teamSelector_history',
  LAST_RUN: 'teamSelector_lastRun',
};

export function getPlayers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PLAYERS)) || [];
  } catch {
    return [];
  }
}

export function savePlayers(players) {
  localStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function getLastRun() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LAST_RUN)) || null;
  } catch {
    return null;
  }
}

export function saveLastRun(run) {
  localStorage.setItem(KEYS.LAST_RUN, JSON.stringify(run));
}

export function clearAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
