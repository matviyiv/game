/**
 * Weighted random shuffle.
 * Players who sat out recently get a higher weight (more likely to be picked first).
 * Weight formula: base 1 + 2 per consecutive sit-out run.
 */
export function buildWeightedPool(activePlayers, history) {
  // Count how many consecutive recent runs each player sat out
  const sitOutCounts = {};
  activePlayers.forEach((p) => (sitOutCounts[p.id] = 0));

  // Walk history from most recent backwards
  for (let i = history.length - 1; i >= 0; i--) {
    const run = history[i];
    if (!run.sitOut) break;
    run.sitOut.forEach((id) => {
      if (id in sitOutCounts) sitOutCounts[id]++;
    });
    // Only count streaks (stop counting once someone played)
    activePlayers.forEach((p) => {
      const playedThisRun =
        run.teams &&
        run.teams.some((t) => t.includes(p.id));
      if (playedThisRun) sitOutCounts[p.id] = 0; // reset if they played
    });
  }

  return activePlayers.map((p) => ({
    ...p,
    weight: 1 + sitOutCounts[p.id] * 2,
  }));
}

function weightedShuffle(pool) {
  const result = [];
  let remaining = [...pool];

  while (remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, p) => sum + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let idx = 0;
    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].weight;
      if (rand <= 0) {
        idx = i;
        break;
      }
    }
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

/**
 * Given a list of active players and history, build teams.
 * For n players, we form as many full 2-person teams as possible,
 * leftover sit out.
 *
 * Returns { teams: [[id,id], [id,id], ...], sitOut: [id, ...] }
 */
export function assignTeams(activePlayers, history, teamSize = 2) {
  const weighted = buildWeightedPool(activePlayers, history);
  const shuffled = weightedShuffle(weighted);

  const numTeams = Math.floor(shuffled.length / teamSize);
  const sitOutCount = shuffled.length % teamSize;

  // Sit-out players are drawn from the END of the weighted shuffle
  // (least-weighted = already played recently = more likely at end after inversion)
  // Actually since we want those who HAVEN'T played to be picked FIRST (play),
  // sit-out should be the ones at the end (lowest priority).
  const sitOut = shuffled.slice(numTeams * teamSize).map((p) => p.id);
  const playing = shuffled.slice(0, numTeams * teamSize);

  const teams = [];
  for (let i = 0; i < numTeams; i++) {
    teams.push(playing.slice(i * teamSize, (i + 1) * teamSize).map((p) => p.id));
  }

  return { teams, sitOut };
}
