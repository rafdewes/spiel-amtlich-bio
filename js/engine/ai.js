/**
 * AMTLICH! Das biometrische Bürgeramt - KI-Entscheidungsengine
 * Strategische Bot-Steuerung mit Heuristiken für Anträge, Modernisierungen, Handkarten und Störfälle
 */

export class BotAI {
  constructor(personality = 'balanced') {
    this.personality = personality; // 'balanced', 'aggressive', 'modernizer', 'rusher'
  }

  /**
   * Führt einen kompletten KI-Zug Schritt für Schritt aus
   */
  async executeTurn(gameState, delayMs = 600) {
    const bot = gameState.getCurrentPlayer();
    if (bot.isHuman) return;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Schritt 1: Anträge annehmen
    if (gameState.turnStep === 'ACCEPT_REQUESTS') {
      const count = this.decideRequestCount(bot, gameState);
      await sleep(delayMs);
      gameState.acceptRequests(count);
    }

    // Schritt 2: Aktionen & Modernisierungen
    if (gameState.turnStep === 'ACTIONS_AND_UPGRADES') {
      let madeProgress = true;
      let iterations = 0;

      while (madeProgress && iterations < 8 && bot.time > 0) {
        madeProgress = false;
        iterations++;

        // A: Hilfekarten auf eigene Schreibtische
        const helpMove = this.findBestHelpMove(bot, gameState);
        if (helpMove) {
          await sleep(delayMs);
          try {
            gameState.playCard(bot, helpMove.cardUid, helpMove.params);
            madeProgress = true;
            continue;
          } catch (e) {
            // ignore and try other moves
          }
        }

        // B: Organisationskarten
        const orgMove = this.findBestOrgMove(bot, gameState);
        if (orgMove) {
          await sleep(delayMs);
          try {
            gameState.playCard(bot, orgMove.cardUid, orgMove.params);
            madeProgress = true;
            continue;
          } catch (e) {
            // ignore
          }
        }

        // C: Störfallkarten gegen Gegner
        const attackMove = this.findBestAttackMove(bot, gameState);
        if (attackMove) {
          await sleep(delayMs);
          try {
            gameState.playCard(bot, attackMove.cardUid, attackMove.params);
            madeProgress = true;
            continue;
          } catch (e) {
            // ignore
          }
        }

        // D: Zeit in Modernisierung investieren
        if (bot.time >= 1 && (this.personality === 'modernizer' || bot.time >= 2 || gameState.round <= 5)) {
          const modMove = this.findBestModernizationMove(bot, gameState);
          if (modMove) {
            await sleep(delayMs);
            try {
              gameState.investModernization(bot, modMove.slotIndex, modMove.modId, modMove.timeToInvest, modMove.deskIndex);
              madeProgress = true;
              continue;
            } catch (e) {
              // ignore
            }
          }
        }
      }

      // Schritt 3: Marktkarte nehmen (falls noch nicht genommen)
      if (!bot.turnState.marketPurchased && gameState.market.length > 0) {
        const marketIdx = this.pickBestMarketCardIndex(bot, gameState);
        if (marketIdx >= 0) {
          await sleep(delayMs);
          try {
            gameState.buyMarketCard(bot, marketIdx);
          } catch (e) {
            // ignore
          }
        }
      }

      // Schritt 4: Zug beenden
      await sleep(delayMs);
      gameState.endPlayerTurn();
    }
  }

  decideRequestCount(bot, gameState) {
    const queueLen = bot.queue.length;
    const round = gameState.round;
    const freeDesks = bot.desks.filter(d => !d.activeRequest).length;

    // Gegen Ende des Spiels (Runde 7-8) vorsichtiger sein wegen Malus
    if (round >= 7) {
      if (queueLen >= 2) return 1;
      if (freeDesks >= 1) return 2;
      return 1;
    }

    if (this.personality === 'rusher') {
      if (queueLen < 4) return 3;
      return 2;
    }

    if (this.personality === 'modernizer') {
      if (freeDesks > 0 && queueLen === 0) return 2;
      return 1;
    }

    if (this.personality === 'aggressive') {
      if (queueLen <= 2) return 2;
      return 1;
    }

    // Balanced
    if (freeDesks === 2 && queueLen === 0) return 2;
    if (queueLen >= 4) return 1;
    if (queueLen <= 1) return 2;
    return 1;
  }

  findBestHelpMove(bot, gameState) {
    for (const card of bot.hand) {
      if (card.type !== 'Hilfe') continue;

      if (card.id.startsWith('start_routine') || card.id === 'm_icao_norm' || card.id === 'm_fingerabdruck_politur' || card.id === 'm_bundesdruckerei_express') {
        // Find desk with highest tokens (or tokens == 1 to finish it)
        for (let dIdx = 0; dIdx < bot.desks.length; dIdx++) {
          const desk = bot.desks[dIdx];
          if (desk.activeRequest && desk.tokens > 0) {
            const check = gameState.canPlayCard(bot, card.uid, { targetDeskIndex: dIdx });
            if (check.canPlay) {
              return { cardUid: card.uid, params: { targetDeskIndex: dIdx } };
            }
          }
        }
      } else if (card.id === 'm_iris_express') {
        for (let dIdx = 0; dIdx < bot.desks.length; dIdx++) {
          const desk = bot.desks[dIdx];
          if (desk.activeRequest && desk.tokens > 0 && desk.attachedDisruptions.length === 0) {
            const check = gameState.canPlayCard(bot, card.uid, { targetDeskIndex: dIdx });
            if (check.canPlay) {
              return { cardUid: card.uid, params: { targetDeskIndex: dIdx } };
            }
          }
        }
      } else if (card.id === 'm_amtshilfe') {
        const check = gameState.canPlayCard(bot, card.uid, {});
        if (check.canPlay) {
          return { cardUid: card.uid, params: {} };
        }
      } else if (card.id === 'm_medienbruch') {
        const deskWithDisruption = bot.desks.findIndex(d => d.activeRequest && d.attachedDisruptions.length > 0);
        const dIdx = deskWithDisruption >= 0 ? deskWithDisruption : 0;
        const check = gameState.canPlayCard(bot, card.uid, { targetDeskIndex: dIdx });
        if (check.canPlay) {
          return { cardUid: card.uid, params: { targetDeskIndex: dIdx } };
        }
      } else if (card.id === 'start_rueckruf') {
        const check = gameState.canPlayCard(bot, card.uid, {});
        if (check.canPlay && !bot.turnState.shieldActive) {
          return { cardUid: card.uid, params: {} };
        }
      }
    }
    return null;
  }

  findBestOrgMove(bot, gameState) {
    for (const card of bot.hand) {
      if (card.type !== 'Organisation') continue;

      if (card.id === 'start_rueckfrage' || card.id === 'm_schulungsoffensive' || card.id === 'm_dienstanweisung') {
        const check = gameState.canPlayCard(bot, card.uid, {});
        if (check.canPlay) {
          return { cardUid: card.uid, params: {} };
        }
      } else if (card.id === 'm_projektgruppe') {
        const modSlot = bot.modernizations.findIndex(m => m.card && !m.active);
        if (modSlot >= 0) {
          const check = gameState.canPlayCard(bot, card.uid, { modernizationSlotIndex: modSlot });
          if (check.canPlay) {
            return { cardUid: card.uid, params: { modernizationSlotIndex: modSlot } };
          }
        }
      } else if (card.id === 'start_priorisieren') {
        if (bot.queue.length > 0 && bot.desks.some(d => d.activeRequest)) {
          const check = gameState.canPlayCard(bot, card.uid, { targetDeskIndex: 0 });
          if (check.canPlay) {
            return { cardUid: card.uid, params: { targetDeskIndex: 0 } };
          }
        }
      }
    }
    return null;
  }

  findBestAttackMove(bot, gameState) {
    for (const card of bot.hand) {
      if (card.type !== 'Störfall') continue;

      // Find best opponent target
      // Target player with most points or shortest queue
      const opponents = gameState.players.filter(p => p.id !== bot.id);
      for (const opp of opponents) {
        for (let dIdx = 0; dIdx < opp.desks.length; dIdx++) {
          const desk = opp.desks[dIdx];
          if (desk.activeRequest && desk.attachedDisruptions.length < 2) {
            const check = gameState.canPlayCard(bot, card.uid, {
              targetPlayerId: opp.id,
              targetDeskIndex: dIdx
            });
            if (check.canPlay) {
              return {
                cardUid: card.uid,
                params: {
                  targetPlayerId: opp.id,
                  targetDeskIndex: dIdx
                }
              };
            }
          }
        }
      }
    }
    return null;
  }

  findBestModernizationMove(bot, gameState) {
    if (bot.time <= 0) return null;

    // 1. Look for existing unfinished modernization in slots
    for (let slotIdx = 0; slotIdx < bot.modernizations.length; slotIdx++) {
      const slot = bot.modernizations[slotIdx];
      if (slot.card && !slot.active) {
        const timeToInvest = Math.min(bot.time, slot.card.cost - slot.timeInvested);
        const check = gameState.canInvestModernization(bot, slotIdx, slot.card.id, timeToInvest);
        if (check.canInvest) {
          return { slotIndex: slotIdx, modId: slot.card.id, timeToInvest, deskIndex: slot.assignedDeskIndex || 0 };
        }
      }
    }

    // 2. Look for empty slot to start high-priority modernization
    const emptySlotIdx = bot.modernizations.findIndex(m => !m.card);
    if (emptySlotIdx >= 0) {
      // Pick best unbuilt modernization
      const priorityOrder = [
        'digi_vorbereitung',
        'infra_lichtbildterminal',
        'digi_registerschnittstelle',
        'schulung_fachverfahren',
        'digi_terminpruefung',
        'schulung_triage',
        'infra_terminmanagement',
        'schulung_sonderfaelle',
        'infra_ausweicharbeitsplatz'
      ];

      for (const modId of priorityOrder) {
        const alreadyStarted = bot.modernizations.some(m => m.card?.id === modId);
        if (!alreadyStarted) {
          const timeToInvest = Math.min(bot.time, 2);
          const check = gameState.canInvestModernization(bot, emptySlotIdx, modId, timeToInvest);
          if (check.canInvest) {
            return { slotIndex: emptySlotIdx, modId: modId, timeToInvest, deskIndex: 0 };
          }
        }
      }
    }

    return null;
  }

  pickBestMarketCardIndex(bot, gameState) {
    if (gameState.market.length === 0) return -1;

    // Evaluate cards by type and synergy
    let bestIdx = 0;
    let highestScore = -100;

    gameState.market.forEach((card, idx) => {
      let score = 5;
      if (card.type === 'Hilfe') score += 10;
      if (card.type === 'Störfall') score += (this.personality === 'aggressive' ? 12 : 7);
      if (card.type === 'Organisation') score += 6;
      if (card.id === 'm_icao_norm') score += 5;
      if (card.id === 'm_iris_express') score += 8;
      if (card.id === 'm_projektgruppe' && bot.modernizations.some(m => m.card && !m.active)) score += 10;

      if (score > highestScore) {
        highestScore = score;
        bestIdx = idx;
      }
    });

    return bestIdx;
  }
}
