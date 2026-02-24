import { useState, useEffect } from 'react';
import PlayerManager from './components/PlayerManager';
import SpinWheel from './components/SpinWheel';
import TeamsDisplay from './components/TeamsDisplay';
import History from './components/History';
import { getPlayers, savePlayers, getHistory, saveHistory } from './utils/storage';
import { assignTeams } from './utils/teamBuilder';
import './App.css';

const TABS = ['Players', 'Spin', 'History'];

export default function App() {
  const [tab, setTab] = useState(0);
  const [players, setPlayers] = useState(() => getPlayers());
  const [history, setHistory] = useState(() => getHistory());
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const activePlayers = players.filter((p) => p.active);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  function handleSpinComplete() {
    const res = assignTeams(activePlayers, history);
    setResult(res);
    setSaved(false);
  }

  function handleSave() {
    const run = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      teams: result.teams,
      sitOut: result.sitOut,
    };
    const updated = [...history, run];
    setHistory(updated);
    saveHistory(updated);
    setSaved(true);
  }

  function handleReset() {
    setResult(null);
    setSaved(false);
    setSpinKey((k) => k + 1);
  }

  function handleClearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  function handlePlayersChange(newPlayers) {
    setPlayers(newPlayers);
    setResult(null);
    setSaved(false);
  }

  const canSpin = activePlayers.length >= 4;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-glow" />
        <h1 className="app-title">
          <span className="title-icon">⚽</span>
          Team Selector
        </h1>
        <p className="app-subtitle">Fair teams, every time</p>
      </header>

      <nav className="tab-nav">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >
            {i === 2 && history.length > 0 && (
              <span className="badge">{history.length}</span>
            )}
            {t}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === 0 && (
          <PlayerManager
            players={players}
            onPlayersChange={handlePlayersChange}
          />
        )}

        {tab === 1 && (
          <div className="spin-tab">
            {!canSpin ? (
              <div className="not-enough">
                <div className="not-enough-icon">👥</div>
                <p>Need at least <strong>4 active players</strong> to form teams.</p>
                <button className="btn-goto" onClick={() => setTab(0)}>
                  Add Players
                </button>
              </div>
            ) : (
              <>
                <p className="spin-hint">
                  {activePlayers.length} players ready &bull;{' '}
                  {Math.floor(activePlayers.length / 2)} teams of 2
                  {activePlayers.length % 2 !== 0 && ' \u2022 1 sits out'}
                </p>
                <SpinWheel
                  key={spinKey}
                  players={activePlayers}
                  onSpinComplete={handleSpinComplete}
                />
                <TeamsDisplay
                  result={result}
                  players={players}
                  onSave={handleSave}
                  onReset={handleReset}
                  saved={saved}
                />
              </>
            )}
          </div>
        )}

        {tab === 2 && (
          <History
            history={history}
            players={players}
            onClear={handleClearHistory}
          />
        )}
      </main>
    </div>
  );
}
