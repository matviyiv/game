const TEAM_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function History({ history, players, onClear }) {
  if (!history || history.length === 0) return null;

  function getName(id) {
    return players.find((p) => p.id === id)?.name || id;
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="history-section">
      <div className="history-header">
        <h2 className="section-title">History</h2>
        <button className="btn-clear" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="history-list">
        {[...history].reverse().map((run, i) => (
          <div key={run.id} className="history-run" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="run-meta">
              <span className="run-num">Run #{history.length - i}</span>
              <span className="run-date">{formatDate(run.timestamp)}</span>
            </div>
            <div className="run-teams">
              {run.teams.map((team, ti) => (
                <div key={ti} className="run-team">
                  <span
                    className="run-team-dot"
                    style={{ background: TEAM_COLORS[ti % TEAM_COLORS.length] }}
                  />
                  {team.map((id) => getName(id)).join(' & ')}
                </div>
              ))}
            </div>
            {run.sitOut && run.sitOut.length > 0 && (
              <div className="run-sitout">
                Sat out: {run.sitOut.map((id) => getName(id)).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
