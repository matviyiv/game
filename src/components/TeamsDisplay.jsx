const TEAM_NAMES = ['Team A', 'Team B', 'Team C', 'Team D'];
const TEAM_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function TeamsDisplay({ result, players, onSave, onReset, saved }) {
  if (!result) return null;

  function getName(id) {
    return players.find((p) => p.id === id)?.name || id;
  }

  return (
    <div className="teams-display">
      <h2 className="section-title result-title">Game Time! 🎮</h2>

      <div className="teams-grid">
        {result.teams.map((team, i) => (
          <div
            key={i}
            className="team-card"
            style={{
              borderColor: TEAM_COLORS[i % TEAM_COLORS.length],
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <div
              className="team-header"
              style={{ background: TEAM_COLORS[i % TEAM_COLORS.length] }}
            >
              {TEAM_NAMES[i] || `Team ${i + 1}`}
            </div>
            <div className="team-members">
              {team.map((id) => (
                <div key={id} className="team-member">
                  <span className="member-avatar">
                    {getName(id).charAt(0).toUpperCase()}
                  </span>
                  <span>{getName(id)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {result.sitOut.length > 0 && (
        <div className="sitout-section">
          <h3 className="sitout-title">Sitting Out Next Round</h3>
          <div className="sitout-list">
            {result.sitOut.map((id) => (
              <span key={id} className="sitout-badge">
                {getName(id)}
              </span>
            ))}
          </div>
          <p className="sitout-hint">
            They get priority next game!
          </p>
        </div>
      )}

      <div className="result-actions">
        {!saved ? (
          <button className="btn-save" onClick={onSave}>
            Save to History
          </button>
        ) : (
          <span className="saved-confirm">✓ Saved to history</span>
        )}
        <button className="btn-reset" onClick={onReset}>
          New Game
        </button>
      </div>
    </div>
  );
}
