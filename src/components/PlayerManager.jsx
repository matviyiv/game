import { useState } from 'react';

export default function PlayerManager({ players, onPlayersChange }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function addPlayer(e) {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Player already exists!');
      return;
    }
    setError('');
    const newPlayer = {
      id: Date.now().toString(),
      name,
      active: true,
    };
    onPlayersChange([...players, newPlayer]);
    setInput('');
  }

  function toggleActive(id) {
    onPlayersChange(
      players.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }

  function removePlayer(id) {
    onPlayersChange(players.filter((p) => p.id !== id));
  }

  const activePlayers = players.filter((p) => p.active);

  return (
    <div className="player-manager">
      <h2 className="section-title">Players</h2>

      <form onSubmit={addPlayer} className="add-player-form">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder="Enter player name..."
          className="name-input"
          maxLength={24}
        />
        <button type="submit" className="btn-add" disabled={!input.trim()}>
          Add
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {players.length === 0 && (
        <p className="hint">Add players to get started!</p>
      )}

      <div className="player-list">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`player-card ${p.active ? 'active' : 'inactive'}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <button
              className="toggle-btn"
              onClick={() => toggleActive(p.id)}
              title={p.active ? 'Click to mark as away' : 'Click to mark as available'}
            >
              <span className="avatar" style={{ background: getColor(i) }}>
                {p.name.charAt(0).toUpperCase()}
              </span>
            </button>
            <span className="player-name">{p.name}</span>
            {!p.active && <span className="away-badge">Away</span>}
            <button
              className="remove-btn"
              onClick={() => removePlayer(p.id)}
              title="Remove player"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {players.length > 0 && (
        <p className="active-count">
          {activePlayers.length} / {players.length} players available
        </p>
      )}
    </div>
  );
}

const PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

function getColor(i) {
  return PALETTE[i % PALETTE.length];
}
