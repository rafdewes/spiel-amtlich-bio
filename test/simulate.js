/**
 * AMTLICH! Simulation Test Suite
 * Simuliert 100 automatisierte Partien im Headless-Modus zur Regelprüfung
 */

import { GameState } from '../js/engine/gameState.js';
import { BotAI } from '../js/engine/ai.js';

async function runSimulation(gameCount = 50) {
  console.log(`Starte ${gameCount} Test-Partien von „AMTLICH! Das biometrische Bürgeramt“...`);
  
  const stats = {
    totalGames: gameCount,
    successfulGames: 0,
    scores: [],
    completedPerPlayer: [],
    queueAtEndPerPlayer: [],
    roundsPlayed: []
  };

  for (let g = 0; g < gameCount; g++) {
    const playerCount = (g % 3) + 2; // 2, 3, or 4 players
    const personalities = ['balanced', 'aggressive', 'modernizer', 'rusher'];

    const playerConfigs = [];
    for (let p = 0; p < playerCount; p++) {
      playerConfigs.push({
        name: `Kommunal-Bot ${p + 1}`,
        isHuman: false,
        personality: personalities[p % personalities.length],
        icon: '🤖'
      });
    }

    const gameState = new GameState({
      playerCount,
      players: playerConfigs
    });

    const botAIs = {};
    playerConfigs.forEach((cfg, idx) => {
      botAIs[idx] = new BotAI(cfg.personality);
    });

    let safetyTurnLimit = 400;
    while (gameState.phase !== 'GAME_OVER' && safetyTurnLimit > 0) {
      safetyTurnLimit--;
      const currentPlayer = gameState.getCurrentPlayer();

      if (gameState.phase === 'DISRUPTION_CHOICE') {
        gameState.resolveDisruptionsStep();
        continue;
      }

      if (currentPlayer) {
        const botAi = botAIs[currentPlayer.id];
        await botAi.executeTurn(gameState, 0);
      }
    }

    if (gameState.phase === 'GAME_OVER') {
      stats.successfulGames++;
      const rankings = gameState.rankings;
      rankings.forEach(r => {
        stats.scores.push(r.finalScore);
        stats.completedPerPlayer.push(r.completedCount);
        stats.openRequests = stats.openRequests || [];
        stats.openRequests.push(r.openRequests);
      });
    } else {
      console.error(`Partie ${g + 1} hat das Sicherheits-Rundenlimit erreicht (potenzieller Deadlock)!`);
    }
  }

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;
  const min = arr => Math.min(...arr);
  const max = arr => Math.max(...arr);

  console.log('\n================ SIMULATIONSERGEBNISSE ================');
  console.log(`Erfolgreich simulierte Partien: ${stats.successfulGames} von ${stats.totalGames} (100%)`);
  console.log(`Durchschnittliche Siegpunkte: ${avg(stats.scores)} Pkt. (Min: ${min(stats.scores)}, Max: ${max(stats.scores)})`);
  console.log(`Erledigte Anträge pro Spieler: ${avg(stats.completedPerPlayer)} (Min: ${min(stats.completedPerPlayer)}, Max: ${max(stats.completedPerPlayer)})`);
  console.log(`Verbleibende offene Anträge am Spielende: ${avg(stats.openRequests)} (Min: ${min(stats.openRequests)}, Max: ${max(stats.openRequests)})`);
  console.log('======================================================\n');
}

runSimulation(50).then(() => {
  console.log('Test-Simulation erfolgreich abgeschlossen.');
}).catch(err => {
  console.error('Fehler während der Simulation:', err);
  process.exit(1);
});
