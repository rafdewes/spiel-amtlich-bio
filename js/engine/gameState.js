/**
 * AMTLICH! Das biometrische Bürgeramt - Game Engine & State Management
 * Vollständige Logik für Runden, Züge, Schreibtische, Warteschlange, Modernisierungen & Wertung
 */

import { STAFF_PROFILES, MODERNIZATIONS, START_DECK, MARKET_CARDS, REQUEST_CARDS } from '../data/cards.js';

export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class GameState {
  constructor(config = {}) {
    this.maxRounds = 8;
    this.round = 1;
    this.startPlayerIndex = 0;
    this.currentTurnPlayerIndex = 0;
    this.turnStep = 'ACCEPT_REQUESTS'; // 'ACCEPT_REQUESTS', 'ACTIONS_AND_UPGRADES', 'MARKET', 'TURN_DONE'
    this.phase = 'TURN_PHASE'; // 'SETUP', 'TURN_PHASE', 'ROUND_END', 'DISRUPTION_CHOICE', 'GAME_OVER'
    
    this.players = [];
    this.market = [];
    this.actionDeck = [];
    this.requestDeck = [];
    this.disposedCards = [];
    this.logEntries = [];
    this.pendingDisruptionDecisions = []; // [{ playerId, deskIndex, card, requestTitle }]
    
    this.initGame(config);
  }

  log(message, type = 'info') {
    const entry = {
      round: this.round,
      player: this.getCurrentPlayer()?.name || 'System',
      text: message,
      type: type,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.logEntries.unshift(entry);
    if (this.logEntries.length > 200) this.logEntries.pop();
  }

  initGame(config = {}) {
    const playerCount = config.playerCount || 2;
    const playerConfigs = config.players || [
      { name: 'Bad Formular (Du)', isHuman: true },
      { name: 'Bezirksamt Groß-Metropole', isHuman: false, personality: 'balanced', icon: '🏙️' },
      { name: 'Kommune Bad Bürokratie', isHuman: false, personality: 'aggressive', icon: '🏰' },
      { name: 'Bürgerbüro Digitalien', isHuman: false, personality: 'modernizer', icon: '🚀' }
    ].slice(0, playerCount);

    // Prepare Request Deck
    this.requestDeck = shuffleArray(REQUEST_CARDS.map((r, i) => ({
      ...r,
      uid: `req_${i}_${Date.now()}`,
      baseTokens: 2
    })));

    // Prepare Action Deck for Market
    const allMarketCards = [];
    MARKET_CARDS.forEach(cardDef => {
      for (let c = 0; c < (cardDef.copies || 1); c++) {
        allMarketCards.push({
          ...cardDef,
          uid: `${cardDef.id}_${c}_${Math.random().toString(36).substr(2, 5)}`
        });
      }
    });
    this.actionDeck = shuffleArray(allMarketCards);

    // Draw initial Market (3 cards)
    this.market = [];
    for (let i = 0; i < 3; i++) {
      if (this.actionDeck.length > 0) {
        this.market.push(this.actionDeck.pop());
      }
    }

    // Prepare Staff pool
    const staffPool = shuffleArray([...STAFF_PROFILES]);

    // Setup Players
    this.players = playerConfigs.map((cfg, pIdx) => {
      // 2 random staff members
      const staff1 = staffPool.pop();
      const staff2 = staffPool.pop();

      // Start Deck (6 cards)
      const startDeck = shuffleArray(START_DECK.map((c, i) => ({
        ...c,
        uid: `p${pIdx}_${c.id}_${i}_${Math.random().toString(36).substr(2, 4)}`
      })));

      // Draw initial hand of 4
      const hand = startDeck.splice(0, 4);
      const deck = startDeck;

      return {
        id: pIdx,
        name: cfg.name,
        isHuman: cfg.isHuman ?? true,
        personality: cfg.personality || 'balanced',
        icon: cfg.icon || (cfg.isHuman ? '🏛️' : '🤖'),
        time: 3,
        handPenaltyNextRound: 0,
        
        // 2 Desks
        desks: [
          {
            index: 0,
            staff: { ...staff1 },
            activeRequest: null,
            tokens: 0,
            attachedDisruptions: [],
            blockedThisRound: false,
            staffAbilityDisabled: false,
            assignedThisTurn: false
          },
          {
            index: 1,
            staff: { ...staff2 },
            activeRequest: null,
            tokens: 0,
            attachedDisruptions: [],
            blockedThisRound: false,
            staffAbilityDisabled: false,
            assignedThisTurn: false
          }
        ],

        // 3 Modernization Slots
        modernizations: [
          { slot: 0, card: null, timeInvested: 0, active: false, assignedDeskIndex: null },
          { slot: 1, card: null, timeInvested: 0, active: false, assignedDeskIndex: null },
          { slot: 2, card: null, timeInvested: 0, active: false, assignedDeskIndex: null }
        ],
        availableModernizations: MODERNIZATIONS.map(m => ({ ...m })),

        // Queues & Decks
        queue: [],
        deck: deck,
        hand: hand,
        discard: [],
        scorePile: [],

        // Per-turn / Per-round trackers
        turnState: {
          acceptedCount: 0,
          marketPurchased: false,
          positiveActionsCount: 0,
          usedEleniThisRound: false,
          usedIsabelThisRound: false,
          usedKarlaThisRound: false,
          usedJonasThisRound: false,
          usedRegisterschnittstelleThisRound: false,
          usedSchulungFachverfahrenThisRound: false,
          usedAylinThisRound: false,
          usedGuelThisRound: false,
          shieldActive: false, // Plausibilitätsprüfung vorab
          thirdDeskActiveThisRound: false,
          thirdDeskUsedInGame: false,
          thirdDesk: null // temporary 3rd active desk if Ausweicharbeitsplatz is used
        },

        stats: {
          totalAccepted: 0,
          totalCompleted: 0,
          disruptionsSent: 0,
          disruptionsReceived: 0,
          modernizationsFinished: 0
        }
      };
    });

    this.round = 1;
    this.startPlayerIndex = 0;
    this.currentTurnPlayerIndex = 0;
    this.phase = 'TURN_PHASE';
    this.turnStep = 'ACCEPT_REQUESTS';

    this.startPlayerTurn();
    this.log(`Partie gestartet! Runde 1 von 8 beginnt.`, 'announcement');
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnPlayerIndex];
  }

  getQueueStatus(player) {
    let effectiveQueueLength = player.queue.length;
    // Check if Online-Terminmanagement upgrade is active (treats queue as -1 for status)
    const hasTerminMgmt = player.modernizations.some(m => m.active && m.card?.id === 'infra_terminmanagement');
    if (hasTerminMgmt && effectiveQueueLength > 0) {
      effectiveQueueLength = Math.max(0, effectiveQueueLength - 1);
    }

    if (effectiveQueueLength >= 5) {
      return { status: 'Überlastung', level: 2, class: 'status-overload', desc: 'Fremde Störfälle kosten +1 Zeit. Erste eigene positive Aktion kostet -1 Zeit.' };
    } else if (effectiveQueueLength >= 3) {
      return { status: 'Andrang', level: 1, class: 'status-rush', desc: 'Fremde Störfälle kosten +1 Zeit. Aktiviert Andrang-Effekte.' };
    } else {
      return { status: 'Normalbetrieb', level: 0, class: 'status-normal', desc: 'Regulärer Dienstbetrieb im Bürgeramt.' };
    }
  }

  startPlayerTurn() {
    const player = this.getCurrentPlayer();
    player.time = 3;
    player.turnState.acceptedCount = 0;
    player.turnState.marketPurchased = false;
    player.turnState.positiveActionsCount = 0;
    player.turnState.shieldActive = false;
    this.turnStep = 'ACCEPT_REQUESTS';

    // Desks reset assigned flag
    player.desks.forEach(d => {
      d.assignedThisTurn = false;
    });

    this.log(`${player.name} ist am Zug und erhält 3 Zeit.`, 'turn');
  }

  /**
   * Phase A.2: Anträge annehmen (1, 2 oder 3)
   */
  acceptRequests(count) {
    const player = this.getCurrentPlayer();
    if (this.turnStep !== 'ACCEPT_REQUESTS') {
      throw new Error('Anträge können nur zu Beginn des Zuges angenommen werden.');
    }
    if (count < 1 || count > 3) {
      throw new Error('Es müssen zwischen 1 und 3 Anträge angenommen werden.');
    }

    player.turnState.acceptedCount = count;
    player.stats.totalAccepted += count;

    // Check Modernization: Automatisierte ICAO-Prüfung (digi_terminpruefung)
    const hasTerminPruefung = player.modernizations.some(m => m.active && m.card?.id === 'digi_terminpruefung');
    if (hasTerminPruefung && count === 1) {
      this.drawCardsForPlayer(player, 1);
      // Auto-discard if hand > 0 (for AI) or prompt
      this.log(`${player.name} nutzt „Automatisierte ICAO-Prüfung“ (nur 1 Pflichtantrag angenommen) -> zieht 1 Karte.`, 'bonus');
    }

    // Draw `count` request cards
    const newRequests = [];
    for (let i = 0; i < count; i++) {
      if (this.requestDeck.length === 0) {
        // Reshuffle all completed requests from game if request deck ever runs out
        this.requestDeck = shuffleArray(REQUEST_CARDS.map((r, idx) => ({
          ...r,
          uid: `req_re_${idx}_${Date.now()}`,
          baseTokens: 2
        })));
      }
      newRequests.push(this.requestDeck.pop());
    }

    this.log(`${player.name} nimmt ${count} neue(n) Antrag/Anträge an: ${newRequests.map(r => `„${r.title}“`).join(', ')}`, 'action');

    // Assign to free desks:
    // Rule: "Sind schon Anträge in der Warteschlange, werden freie Plätze zuerst mit den ältesten wartenden Fällen besetzt. Neu angenommene Fälle dürfen nicht vordrängeln."
    for (let deskIndex = 0; deskIndex < player.desks.length; deskIndex++) {
      const desk = player.desks[deskIndex];
      if (!desk.activeRequest) {
        let requestToAssign = null;
        if (player.queue.length > 0) {
          requestToAssign = player.queue.shift();
          // The new request goes to queue
          if (newRequests.length > 0) {
            player.queue.push(newRequests.shift());
          }
        } else if (newRequests.length > 0) {
          requestToAssign = newRequests.shift();
        }

        if (requestToAssign) {
          this.assignRequestToDesk(player, desk, requestToAssign);
        }
      }
    }

    // Any remaining new requests go to the end of the queue
    while (newRequests.length > 0) {
      const req = newRequests.shift();
      player.queue.push(req);
      this.log(`„${req.title}“ kommt in die Warteschlange von ${player.name}.`, 'info');
    }

    this.turnStep = 'ACTIONS_AND_UPGRADES';
  }

  assignRequestToDesk(player, desk, request) {
    let tokens = 2; // Standard start marks

    // Check Staff Abilities:
    // 1. Aylin Demir: Sobald eine Digitalisierung aktiv ist, startet der erste ihr pro Runde zugewiesene Antrag mit 1 Marke weniger.
    const hasDigitalisierung = player.modernizations.some(m => m.active && m.card?.type === 'Digitalisierung');
    if (desk.staff.id === 'aylin_demir' && hasDigitalisierung && !player.turnState.usedAylinThisRound) {
      tokens = Math.max(1, tokens - 1);
      player.turnState.usedAylinThisRound = true;
      this.log(`Fähigkeit von ${desk.staff.name} ausgelöst: Antrag startet mit nur ${tokens} Bearbeitungsmarke!`, 'bonus');
    }

    // 2. Gül Kaya: Bei Andrang (queue >= 3) startet der nächste ihr zugewiesene Antrag mit 1 Marke weniger.
    const queueStatus = this.getQueueStatus(player);
    if (desk.staff.id === 'guel_kaya' && queueStatus.level >= 1 && !player.turnState.usedGuelThisRound) {
      tokens = Math.max(1, tokens - 1);
      player.turnState.usedGuelThisRound = true;
      this.log(`Fähigkeit von ${desk.staff.name} (Andrang) ausgelöst: Antrag startet mit nur ${tokens} Marke!`, 'bonus');
    }

    // 3. Modernization: Digitale Antragsvorbereitung (digi_vorbereitung): Der erste pro Runde zugewiesene Antrag startet mit 1 Marke weniger.
    const hasVorbereitung = player.modernizations.some(m => m.active && m.card?.id === 'digi_vorbereitung');
    if (hasVorbereitung && !player.turnState.usedDigiVorbereitungThisRound) {
      tokens = Math.max(1, tokens - 1);
      player.turnState.usedDigiVorbereitungThisRound = true;
      this.log(`Modernisierung „Biometrische Voraberfassung“ aktiv: Neuer Fall startet mit ${tokens} Marke!`, 'bonus');
    }

    desk.activeRequest = request;
    desk.tokens = tokens;
    desk.attachedDisruptions = [];
    desk.blockedThisRound = false;
    desk.staffAbilityDisabled = false;
    desk.assignedThisTurn = true;

    this.log(`Schreibtisch ${desk.index + 1} (${desk.staff.name}) übernimmt „${request.title}“ (${tokens} Marken).`, 'info');
  }

  /**
   * Play an action card from hand
   */
  canPlayCard(player, cardUid, targetParams = {}) {
    if (this.turnStep !== 'ACTIONS_AND_UPGRADES') return { canPlay: false, reason: 'Nicht in der Aktionsphase.' };
    const card = player.hand.find(c => c.uid === cardUid);
    if (!card) return { canPlay: false, reason: 'Karte nicht auf der Hand.' };

    const effectiveCost = this.calculateCardCost(player, card, targetParams);
    if (player.time < effectiveCost) {
      return { canPlay: false, reason: `Nicht genug Zeit (${player.time} vorhanden, ${effectiveCost} benötigt).` };
    }

    // Card-specific prerequisites
    if (card.type === 'Hilfe') {
      if (card.id === 'm_amtshilfe') {
        const hasBoth = player.desks[0].activeRequest && player.desks[1].activeRequest;
        if (!hasBoth) return { canPlay: false, reason: 'Amtshilfe erfordert 2 aktive Schreibtische mit Anträgen.' };
      } else if (card.id.startsWith('start_routine') || card.id === 'm_icao_norm' || card.id === 'm_fingerabdruck_politur' || card.id === 'm_bundesdruckerei_express') {
        const hasAnyActive = player.desks.some(d => d.activeRequest && d.tokens > 0);
        if (!hasAnyActive) return { canPlay: false, reason: 'Kein eigener aktiver Antrag mit Bearbeitungsmarken vorhanden.' };
      } else if (card.id === 'm_iris_express') {
        const validDesk = player.desks.some(d => d.activeRequest && d.tokens > 0 && d.attachedDisruptions.length === 0);
        if (!validDesk) return { canPlay: false, reason: 'Erfordert einen aktiven Schreibtisch ohne anliegenden Störfall.' };
      } else if (card.id === 'm_medienbruch') {
        const hasAnyActive = player.desks.some(d => d.activeRequest);
        if (!hasAnyActive) return { canPlay: false, reason: 'Kein eigener aktiver Schreibtisch vorhanden.' };
      }
    } else if (card.type === 'Störfall') {
      // Must have a valid foreign target
      const opponent = this.players[targetParams.targetPlayerId];
      if (!opponent || opponent.id === player.id) {
        return { canPlay: false, reason: 'Ungültiges gegnerisches Ziel.' };
      }
      const targetDesk = opponent.desks[targetParams.targetDeskIndex];
      if (!targetDesk || !targetDesk.activeRequest) {
        return { canPlay: false, reason: 'Ziel-Schreibtisch hat keinen aktiven Antrag.' };
      }
      if (targetDesk.attachedDisruptions.length >= 2) {
        return { canPlay: false, reason: 'Maximal 2 fremde Störfälle pro Schreibtisch erlaubt.' };
      }
      if (targetDesk.attachedDisruptions.some(d => d.id === card.id)) {
        return { canPlay: false, reason: 'Derselbe Störfall liegt bereits an diesem Schreibtisch an.' };
      }
      if (card.id === 'm_bundesdruckerei_offline' && targetDesk.tokens <= 1) {
        return { canPlay: false, reason: 'Darf nicht auf Fälle mit nur 1 verbleibenden Marke gespielt werden.' };
      }
    } else if (card.type === 'Organisation') {
      if (card.id === 'm_projektgruppe') {
        const hasPendingMod = player.modernizations.some(m => m.card && !m.active);
        if (!hasPendingMod) return { canPlay: false, reason: 'Keine begonnene Modernisierung zum Beschleunigen vorhanden.' };
      } else if (card.id === 'start_priorisieren') {
        const hasActive = player.desks.some(d => d.activeRequest);
        const hasQueue = player.queue.length > 0;
        if (!hasActive || !hasQueue) return { canPlay: false, reason: 'Erfordert mindestens 1 aktiven Antrag und 1 Antrag in der Warteschlange.' };
      } else if (card.id === 'm_aktenbereinigung') {
        if (player.hand.length < 2 && player.discard.length === 0) {
          return { canPlay: false, reason: 'Keine weitere Karte zum Entsorgen vorhanden.' };
        }
      }
    }

    return { canPlay: true, cost: effectiveCost };
  }

  calculateCardCost(player, card, targetParams = {}) {
    let cost = card.cost;

    // Help card modifiers
    if (card.type === 'Hilfe') {
      // 1. ICAO-Norm (m_icao_norm): Normalbetrieb costs 0
      if (card.id === 'm_icao_norm') {
        const qStatus = this.getQueueStatus(player);
        if (qStatus.level === 0) cost = 0;
      }

      // 2. Infrastruktur: Modernes 4-Finger-Flachbettscanner-Terminal (infra_lichtbildterminal)
      const hasScannerTerminal = player.modernizations.some(m => m.active && m.card?.id === 'infra_lichtbildterminal');
      if (hasScannerTerminal && player.turnState.positiveActionsCount === 0) {
        cost = Math.max(0, cost - 1);
      }

      // 3. Überlastung: Erste positive Aktion kostet 1 Zeit weniger
      const qStatus = this.getQueueStatus(player);
      if (qStatus.level === 2 && player.turnState.positiveActionsCount === 0) {
        cost = Math.max(0, cost - 1);
      }

      // 4. Personal: Frank Neumann (frank_neumann): Bei Andrang sind eigene positive Aktionen auf seinen Schreibtisch 1 Zeit günstiger
      if (targetParams.targetDeskIndex !== undefined) {
        const desk = player.desks[targetParams.targetDeskIndex];
        if (desk && desk.staff.id === 'frank_neumann' && qStatus.level >= 1) {
          cost = Math.max(0, cost - 1);
        }

        // 5. Schulung: Fachverfahren Pass 4.0 kompakt (schulung_fachverfahren)
        const hasSchulungFach = player.modernizations.some(m => m.active && m.card?.id === 'schulung_fachverfahren' && m.assignedDeskIndex === targetParams.targetDeskIndex);
        if (hasSchulungFach && !player.turnState.usedSchulungFachverfahrenThisRound) {
          cost = Math.max(0, cost - 1);
        }
      }
    }

    // Störfall card modifiers
    if (card.type === 'Störfall' && targetParams.targetPlayerId !== undefined) {
      const targetPlayer = this.players[targetParams.targetPlayerId];
      if (targetPlayer) {
        const targetQStatus = this.getQueueStatus(targetPlayer);
        // Andrang / Überlastung makes attacks against target cost +1 Zeit
        if (targetQStatus.level >= 1) {
          cost += 1;
        }

        // Target Personal: Bernd Peters (bernd_peters) -> Foreign disruptions against his desk cost +1 Zeit
        if (targetParams.targetDeskIndex !== undefined) {
          const targetDesk = targetPlayer.desks[targetParams.targetDeskIndex];
          if (targetDesk && targetDesk.staff.id === 'bernd_peters') {
            cost += 1;
          }
        }
      }
    }

    return Math.max(0, cost);
  }

  playCard(player, cardUid, targetParams = {}) {
    const check = this.canPlayCard(player, cardUid, targetParams);
    if (!check.canPlay) {
      throw new Error(check.reason);
    }

    const cardIndex = player.hand.findIndex(c => c.uid === cardUid);
    const card = player.hand[cardIndex];
    const cost = check.cost;

    player.time -= cost;
    player.hand.splice(cardIndex, 1);

    this.log(`${player.name} spielt „${card.name}“ für ${cost} Zeit.`, 'card-play');

    if (card.type === 'Hilfe') {
      player.turnState.positiveActionsCount++;
      this.executeHelpCard(player, card, targetParams);
      player.discard.push(card);
    } else if (card.type === 'Organisation') {
      this.executeOrganisationCard(player, card, targetParams);
      if (card.id !== 'm_aktenbereinigung') {
        player.discard.push(card);
      }
    } else if (card.type === 'Störfall') {
      this.executeDisruptionCard(player, card, targetParams);
      player.stats.disruptionsSent++;
    } else if (card.type === 'Reaktion') {
      // Direct reaction play
      player.discard.push(card);
    }

    return true;
  }

  executeHelpCard(player, card, targetParams) {
    const deskIdx = targetParams.targetDeskIndex ?? 0;
    const desk = player.desks[deskIdx];

    if (card.id.startsWith('start_routine') || card.id === 'm_icao_norm' || card.id === 'm_fingerabdruck_politur' || card.id === 'm_bundesdruckerei_express') {
      if (desk && desk.activeRequest) {
        desk.tokens = Math.max(0, desk.tokens - 1);
        this.log(`1 Bearbeitungsmarke von Schreibtisch ${deskIdx + 1} (${desk.activeRequest.title}) entfernt. (Verbleibend: ${desk.tokens})`, 'action');

        if (card.id === 'm_fingerabdruck_politur') {
          const qStatus = this.getQueueStatus(player);
          if (qStatus.level >= 1) {
            this.drawCardsForPlayer(player, 1);
            this.log(`Handcreme & Andrang-Bonus: 1 zusätzliche Karte gezogen!`, 'bonus');
          }
        } else if (card.id === 'm_bundesdruckerei_express') {
          if (desk.tokens === 0) {
            player.time = Math.min(6, player.time + 1);
            this.log(`Express-Freigabe erfolgreich! 1 Zeit zurückerstattet (${player.time} Zeit).`, 'bonus');
          }
        }
      }
    } else if (card.id === 'm_amtshilfe') {
      player.desks.forEach((d, idx) => {
        if (d.activeRequest) {
          d.tokens = Math.max(0, d.tokens - 1);
          this.log(`Amtshilfe: 1 Marke von Schreibtisch ${idx + 1} entfernt (noch ${d.tokens}).`, 'action');
        }
      });
      player.handPenaltyNextRound = (player.handPenaltyNextRound || 0) + 1;
      this.log(`${player.name} zieht nächste Runde wegen Amtshilfe 1 Karte weniger.`, 'warning');
    } else if (card.id === 'm_medienbruch') {
      if (desk && desk.activeRequest) {
        desk.tokens = Math.max(0, desk.tokens - 1);
        let removedDisruption = null;
        if (desk.attachedDisruptions.length > 0) {
          removedDisruption = desk.attachedDisruptions.pop();
          this.disposedCards.push(removedDisruption);
          this.log(`Medienbruch überbrückt: Störfall „${removedDisruption.name}“ dauerhaft entsorgt!`, 'bonus');
        }
      }
    } else if (card.id === 'm_iris_express') {
      if (desk && desk.activeRequest && desk.attachedDisruptions.length === 0) {
        desk.tokens = Math.max(0, desk.tokens - 2);
        this.log(`Express-Iris-Abgleich: 2 Marken von Schreibtisch ${deskIdx + 1} entfernt! (Verbleibend: ${desk.tokens})`, 'bonus');
      }
    } else if (card.id === 'start_rueckruf') {
      player.turnState.shieldActive = true;
      this.log(`Plausibilitätsprüfung vorab aktiviert: Schreibtische gegen Markenaddition geschützt!`, 'bonus');
    }
  }

  executeOrganisationCard(player, card, targetParams) {
    if (card.id === 'start_rueckfrage' || card.id === 'm_schulungsoffensive') {
      const drawCount = card.id === 'm_schulungsoffensive' ? 2 : 1;
      this.drawCardsForPlayer(player, drawCount);
      this.log(`${player.name} zieht ${drawCount} Karte(n) durch ${card.name}.`, 'action');
      
      // Auto discard oldest card if player is bot, or handle in UI
      if (!player.isHuman && player.hand.length > 0) {
        const discarded = player.hand.pop();
        player.discard.push(discarded);
        this.log(`${player.name} legt „${discarded.name}“ auf den Ablagestapel ab.`, 'info');
      }
    } else if (card.id === 'start_priorisieren') {
      const deskIdx = targetParams.targetDeskIndex ?? 0;
      const desk = player.desks[deskIdx];
      if (desk.activeRequest && player.queue.length > 0) {
        const oldActive = desk.activeRequest;
        const newActive = player.queue.shift();
        desk.activeRequest = newActive;
        player.queue.unshift(oldActive);
        this.log(`Priorisiert: „${newActive.title}“ ist jetzt an Schreibtisch ${deskIdx + 1}, „${oldActive.title}“ wartet in der Schlange.`, 'action');
      }
    } else if (card.id === 'm_tagesplan') {
      if (targetParams.mode === 'swap_active') {
        const tempReq = player.desks[0].activeRequest;
        const tempTokens = player.desks[0].tokens;
        const tempDisruptions = player.desks[0].attachedDisruptions;

        player.desks[0].activeRequest = player.desks[1].activeRequest;
        player.desks[0].tokens = player.desks[1].tokens;
        player.desks[0].attachedDisruptions = player.desks[1].attachedDisruptions;

        player.desks[1].activeRequest = tempReq;
        player.desks[1].tokens = tempTokens;
        player.desks[1].attachedDisruptions = tempDisruptions;
        this.log(`Tagesplan: Aktive Anträge beider Schreibtische getauscht!`, 'action');
      } else {
        const deskIdx = targetParams.targetDeskIndex ?? 0;
        const desk = player.desks[deskIdx];
        if (desk.activeRequest && player.queue.length > 0) {
          const oldReq = desk.activeRequest;
          desk.activeRequest = player.queue.shift();
          player.queue.unshift(oldReq);
          this.log(`Tagesplan: Schreibtisch ${deskIdx + 1} mit erstem Warteschlangenfall getauscht!`, 'action');
        }
      }
    } else if (card.id === 'm_projektgruppe') {
      const slotIdx = targetParams.modernizationSlotIndex ?? player.modernizations.findIndex(m => m.card && !m.active);
      if (slotIdx >= 0 && player.modernizations[slotIdx]?.card && !player.modernizations[slotIdx].active) {
        const mod = player.modernizations[slotIdx];
        mod.timeInvested += 2;
        this.log(`Projektgruppe Biometrie-Upgrade: +2 Fortschritt auf „${mod.card.name}“ (${mod.timeInvested}/${mod.card.cost}).`, 'bonus');
        if (mod.timeInvested >= mod.card.cost) {
          mod.active = true;
          player.stats.modernizationsFinished++;
          this.log(`🎉 Modernisierung „${mod.card.name}“ ist nun dauerhaft AKTIV!`, 'announcement');
        }
      }
    } else if (card.id === 'm_aktenbereinigung') {
      this.disposedCards.push(card);
      let purgedCardName = 'Keine';
      if (targetParams.purgeCardUid) {
        const handIdx = player.hand.findIndex(c => c.uid === targetParams.purgeCardUid);
        if (handIdx >= 0) {
          const purged = player.hand.splice(handIdx, 1)[0];
          this.disposedCards.push(purged);
          purgedCardName = purged.name;
        } else {
          const discardIdx = player.discard.findIndex(c => c.uid === targetParams.purgeCardUid);
          if (discardIdx >= 0) {
            const purged = player.discard.splice(discardIdx, 1)[0];
            this.disposedCards.push(purged);
            purgedCardName = purged.name;
          }
        }
      } else if (!player.isHuman && player.hand.length > 0) {
        const purged = player.hand.pop();
        this.disposedCards.push(purged);
        purgedCardName = purged.name;
      }
      this.log(`DS-GVO-Aktenbereinigung: „${card.name}“ und „${purgedCardName}“ dauerhaft entsorgt.`, 'action');
    } else if (card.id === 'm_dienstanweisung') {
      player.time += 1;
      player.handPenaltyNextRound = (player.handPenaltyNextRound || 0) + 1;
      this.log(`Dienstanweisung: +1 Zeit erhalten (${player.time} Zeit). Nächste Runde -1 Handkarte.`, 'bonus');
    }
  }

  executeDisruptionCard(player, card, targetParams) {
    const targetPlayer = this.players[targetParams.targetPlayerId];
    const targetDesk = targetPlayer.desks[targetParams.targetDeskIndex];

    targetPlayer.stats.disruptionsReceived++;

    // Check target shield or defensive reactions
    // 1. Plausibilitätsprüfung vorab
    if (targetPlayer.turnState.shieldActive) {
      this.log(`🛡️ ${targetPlayer.name} hat Plausibilitätsprüfung aktiv! Der Störfall verpufft wirkungslos.`, 'warning');
      player.discard.push(card);
      return;
    }

    // 2. Modernization: NOBID- & Registerschnittstelle (digi_registerschnittstelle)
    const hasRegisterschnittstelle = targetPlayer.modernizations.some(m => m.active && m.card?.id === 'digi_registerschnittstelle');
    if (hasRegisterschnittstelle && !targetPlayer.turnState.usedRegisterschnittstelleThisRound && (card.id.includes('foto') || card.id.includes('fingerkuppen') || card.id.includes('zustaendigkeit'))) {
      targetPlayer.turnState.usedRegisterschnittstelleThisRound = true;
      this.log(`🛡️ NOBID-Schnittstelle von ${targetPlayer.name} wehrt das Hinzufügen der Bearbeitungsmarke ab!`, 'bonus');
      targetDesk.attachedDisruptions.push(card);
      return;
    }

    // 3. Personal: Hannes Vogt (hannes_vogt) -> Negative Aktionen können keine bereits entfernte Marke zurücklegen
    if (targetDesk.staff.id === 'hannes_vogt' && (card.id.includes('foto') || card.id.includes('fingerkuppen') || card.id.includes('zustaendigkeit'))) {
      if (targetDesk.tokens < 2) {
        this.log(`🛡️ Hannes Vogt (DPI-Fetischist) verhindert, dass eine entfernte Marke zurückgelegt wird!`, 'bonus');
        targetDesk.attachedDisruptions.push(card);
        return;
      }
    }

    // Apply Disruption effect
    if (card.id.includes('foto') || card.id.includes('fingerkuppen') || card.id.includes('zustaendigkeit') || card.id === 'start_unklare_zustaendigkeit') {
      // Claudia Reuter: Erster Störfall max +1 Marke
      targetDesk.tokens = Math.min(4, targetDesk.tokens + 1);
      this.log(`⚠️ Störfall auf ${targetPlayer.name} (Schreibtisch ${targetDesk.index + 1}): +1 Bearbeitungsmarke (jetzt ${targetDesk.tokens} Marken).`, 'attack');
    } else if (card.id === 'm_iris_verweigert') {
      // Claudia Reuter check
      if (targetDesk.staff.id === 'claudia_reuter') {
        this.log(`🛡️ Claudia Reuter (Dienst nach ICAO) verhindert das Überspringen der Bearbeitung! Stattdessen +1 Marke.`, 'bonus');
        targetDesk.tokens = Math.min(4, targetDesk.tokens + 1);
      } else {
        targetDesk.blockedThisRound = true;
        this.log(`⚠️ Bürger verweigert Iris-Scan: Schreibtisch ${targetDesk.index + 1} von ${targetPlayer.name} wird am Rundenende blockiert!`, 'attack');
      }
    } else if (card.id === 'm_rueckfrage_zertifikat') {
      targetDesk.tokens = Math.min(4, targetDesk.tokens + 1);
      targetDesk.staffAbilityDisabled = true;
      this.log(`⚠️ Zertifikats-Rückfrage: +1 Marke & Personal-Fähigkeit an Schreibtisch ${targetDesk.index + 1} von ${targetPlayer.name} deaktiviert!`, 'attack');
    } else if (card.id === 'm_bundesdruckerei_offline') {
      if (targetDesk.staff.id === 'claudia_reuter') {
        targetDesk.tokens = Math.min(4, targetDesk.tokens + 1);
        this.log(`🛡️ Claudia Reuter verhindert Komplettausfall! Stattdessen +1 Marke.`, 'bonus');
      } else {
        targetDesk.blockedThisRound = true;
        this.log(`💥 Bundesdruckerei offline: Schreibtisch ${targetDesk.index + 1} von ${targetPlayer.name} komplett blockiert!`, 'attack');
      }
    }

    // Attach card to opponent's desk
    targetDesk.attachedDisruptions.push(card);
  }

  /**
   * Invest Time into Modernization
   */
  canInvestModernization(player, slotIndex, modernizationId, timeAmount = 1) {
    if (this.turnStep !== 'ACTIONS_AND_UPGRADES') return { canInvest: false, reason: 'Nicht in der Ausbauphase.' };
    if (slotIndex < 0 || slotIndex >= 3) return { canInvest: false, reason: 'Ungültiger Modernisierungsplatz (0-2).' };
    if (player.time < timeAmount) return { canInvest: false, reason: `Nicht genug Zeit (${player.time} vorhanden, ${timeAmount} benötigt).` };

    const slot = player.modernizations[slotIndex];
    if (slot.active) return { canInvest: false, reason: 'Dieser Modernisierungsplatz ist bereits fertig ausgebaut.' };

    if (!slot.card) {
      // Starting a new modernization in this slot
      const modDef = player.availableModernizations.find(m => m.id === modernizationId);
      if (!modDef) return { canInvest: false, reason: 'Modernisierungskarte nicht im persönlichen Vorrat gefunden.' };
      
      // Check if already in another slot
      const alreadyBuilt = player.modernizations.some(m => m.card?.id === modernizationId);
      if (alreadyBuilt) return { canInvest: false, reason: 'Diese Modernisierung wurde bereits begonnen oder gebaut.' };
    }

    return { canInvest: true };
  }

  investModernization(player, slotIndex, modernizationId, timeAmount = 1, assignedDeskIndex = 0) {
    const check = this.canInvestModernization(player, slotIndex, modernizationId, timeAmount);
    if (!check.canInvest) {
      throw new Error(check.reason);
    }

    const slot = player.modernizations[slotIndex];
    if (!slot.card) {
      const modDef = player.availableModernizations.find(m => m.id === modernizationId);
      let cost = modDef.cost;

      // Personal: Darius Wolf (darius_wolf): Erste Schulung an seinem Platz kostet 2 Zeit weniger
      if (modDef.type === 'Schulung') {
        const desk = player.desks[assignedDeskIndex];
        if (desk && desk.staff.id === 'darius_wolf' && !player.turnState.usedDariusDiscount) {
          cost = Math.max(1, cost - 2);
          player.turnState.usedDariusDiscount = true;
          this.log(`Darius Wolf Fortbildungs-Rabatt: Modernisierung kostet 2 Zeit weniger (${cost} Zeit)!`, 'bonus');
        }
      }

      slot.card = { ...modDef, cost: cost };
      slot.timeInvested = 0;
      slot.active = false;
      slot.assignedDeskIndex = assignedDeskIndex;
      this.log(`${player.name} beginnt Modernisierung „${modDef.name}“ auf Platz ${slotIndex + 1} (Kosten: ${cost} Zeit).`, 'action');
    }

    player.time -= timeAmount;
    slot.timeInvested += timeAmount;
    this.log(`${player.name} investiert ${timeAmount} Zeit in „${slot.card.name}“ (${slot.timeInvested}/${slot.card.cost}).`, 'action');

    if (slot.timeInvested >= slot.card.cost) {
      slot.active = true;
      player.stats.modernizationsFinished++;
      this.log(`🎉 Modernisierung „${slot.card.name}“ ist nun dauerhaft AKTIV!`, 'announcement');
    }
  }

  /**
   * Discard an unfinished modernization to free the slot
   */
  clearModernizationSlot(player, slotIndex) {
    const slot = player.modernizations[slotIndex];
    if (!slot.card || slot.active) return;
    this.log(`${player.name} bricht Modernisierung „${slot.card.name}“ ab und räumt Platz ${slotIndex + 1}.`, 'warning');
    slot.card = null;
    slot.timeInvested = 0;
    slot.active = false;
    slot.assignedDeskIndex = null;
  }

  /**
   * Phase A.4: Marktkarte erwerben (0-1 Karte kostenlos)
   */
  buyMarketCard(player, marketIndex) {
    if (this.turnStep !== 'ACTIONS_AND_UPGRADES' && this.turnStep !== 'MARKET') {
      throw new Error('Marktkarten können nur in der Erwerbsphase genommen werden.');
    }
    if (player.turnState.marketPurchased) {
      throw new Error('In diesem Zug wurde bereits eine Marktkarte erworben (max. 1 pro Zug).');
    }
    if (marketIndex < 0 || marketIndex >= this.market.length) {
      throw new Error('Ungültiger Markt-Index.');
    }

    const card = this.market.splice(marketIndex, 1)[0];
    player.discard.push(card);
    player.turnState.marketPurchased = true;

    this.log(`${player.name} nimmt kostenlos „${card.name}“ (${card.type}) aus dem Markt in die eigene Ablage.`, 'action');

    // Refill Market
    if (this.actionDeck.length > 0) {
      this.market.push(this.actionDeck.pop());
    } else if (this.disposedCards.length > 0) {
      // In rare case of empty market deck
      this.log('Marktdeck ist leer. Keine weiteren Karten verfügbar.', 'info');
    }

    return true;
  }

  /**
   * End Player Turn
   */
  endPlayerTurn() {
    const player = this.getCurrentPlayer();
    this.log(`${player.name} beendet den Zug.`, 'info');

    // Advance to next player
    this.currentTurnPlayerIndex = (this.currentTurnPlayerIndex + 1) % this.players.length;

    // Check if all players finished their turn in this round
    if (this.currentTurnPlayerIndex === this.startPlayerIndex) {
      this.executeRoundEnd();
    } else {
      this.startPlayerTurn();
    }
  }

  /**
   * Phase B: Gemeinsames Rundenende (nachdem alle Kommunen am Zug waren)
   */
  executeRoundEnd() {
    this.phase = 'ROUND_END';
    this.log(`=== Gemeinsames Rundenende (Runde ${this.round} von 8) ===`, 'announcement');

    this.pendingDisruptionDecisions = [];

    // 1. Process active desks for all players
    this.players.forEach(player => {
      player.desks.forEach((desk, deskIdx) => {
        if (!desk.activeRequest) return;

        if (desk.blockedThisRound) {
          this.log(`🚫 Schreibtisch ${deskIdx + 1} von ${player.name} war blockiert und verliert diese Runde keine Marke.`, 'warning');
          desk.blockedThisRound = false;
        } else {
          // Standard: remove 1 token
          let tokensToRemove = 1;

          // Personal: Mehmet Yilmaz (mehmet_yilmaz) -> If no disruption attached, remove +1 token at even round ends
          if (desk.staff.id === 'mehmet_yilmaz' && desk.attachedDisruptions.length === 0 && this.round % 2 === 0) {
            tokensToRemove += 1;
            this.log(`👴 Mehmet Yilmaz (Routinier) entfernt am geraden Rundenende 1 zusätzliche Marke!`, 'bonus');
          }

          desk.tokens = Math.max(0, desk.tokens - tokensToRemove);
          this.log(`Schreibtisch ${deskIdx + 1} (${player.name}) bearbeitet „${desk.activeRequest.title}“ (-${tokensToRemove} Marke, verbleibend: ${desk.tokens}).`, 'info');
        }

        // Check completion (0 tokens)
        if (desk.tokens === 0) {
          const completedReq = desk.activeRequest;
          player.scorePile.push(completedReq);
          player.stats.totalCompleted++;
          this.log(`✅ „${completedReq.title}“ bei ${player.name} erfolgreich abgeschlossen! (+1 Punkt)`, 'bonus');

          // Check attached disruptions for handover decisions
          if (desk.attachedDisruptions.length > 0) {
            desk.attachedDisruptions.forEach(disruptionCard => {
              this.pendingDisruptionDecisions.push({
                playerId: player.id,
                deskIndex: deskIdx,
                card: disruptionCard,
                requestTitle: completedReq.title
              });
            });
            desk.attachedDisruptions = [];
          }

          // Check Schulung: Biometrie-Triage & Arbeitsorganisation (schulung_triage)
          const hasSchulungTriage = player.modernizations.some(m => m.active && m.card?.id === 'schulung_triage' && m.assignedDeskIndex === deskIdx);
          const qStatus = this.getQueueStatus(player);
          if (hasSchulungTriage && qStatus.level >= 1 && player.queue.length > 0) {
            const nextReq = player.queue.shift();
            desk.activeRequest = nextReq;
            desk.tokens = 1; // 2 minus 1 from triage
            this.log(`⚡ Biometrie-Triage aktiv: „${nextReq.title}“ rückt sofort nach und startet mit nur 1 Marke!`, 'bonus');
          } else {
            desk.activeRequest = null;
          }
        }
      });
    });

    // 2. Handle Pending Disruption Decisions
    if (this.pendingDisruptionDecisions.length > 0) {
      this.phase = 'DISRUPTION_CHOICE';
      this.resolveDisruptionsStep();
    } else {
      this.finishRoundEnd();
    }
  }

  resolveDisruptionsStep() {
    // Process bot decisions automatically, keep human decisions pending
    const remainingDecisions = [];
    for (const decision of this.pendingDisruptionDecisions) {
      const player = this.players[decision.playerId];
      if (!player.isHuman) {
        // Bot heuristic: keep high-value disruptions (cost <= 2), discard others
        if (decision.card.cost <= 2) {
          player.discard.push(decision.card);
          this.log(`🎓 ${player.name} entscheidet: LERNEFFEKT! Nimmt „${decision.card.name}“ ins eigene Deck auf.`, 'action');
        } else {
          this.disposedCards.push(decision.card);
          this.log(`🗄️ ${player.name} entscheidet: Fall abgeschlossen. „${decision.card.name}“ dauerhaft entsorgt.`, 'info');
        }
      } else {
        remainingDecisions.push(decision);
      }
    }
    this.pendingDisruptionDecisions = remainingDecisions;

    if (this.pendingDisruptionDecisions.length === 0) {
      this.finishRoundEnd();
    }
  }

  handleDisruptionChoice(decisionIndex, choice) {
    if (decisionIndex < 0 || decisionIndex >= this.pendingDisruptionDecisions.length) return;
    const decision = this.pendingDisruptionDecisions.splice(decisionIndex, 1)[0];
    const player = this.players[decision.playerId];

    if (choice === 'learn') {
      player.discard.push(decision.card);
      this.log(`🎓 ${player.name} wählt LERNEFFEKT: „${decision.card.name}“ wandert in den persönlichen Ablagestapel!`, 'action');
    } else {
      this.disposedCards.push(decision.card);
      this.log(`🗄️ ${player.name} schließt Fall ab: „${decision.card.name}“ wird dauerhaft aus dem Spiel entsorgt.`, 'info');
    }

    if (this.pendingDisruptionDecisions.length === 0) {
      this.finishRoundEnd();
    }
  }

  finishRoundEnd() {
    // 3. Refill free desks from queue for all players
    this.players.forEach(player => {
      player.desks.forEach(desk => {
        if (!desk.activeRequest && player.queue.length > 0) {
          const waitingReq = player.queue.shift();
          this.assignRequestToDesk(player, desk, waitingReq);
        }
        desk.staffAbilityDisabled = false;
        desk.blockedThisRound = false;
      });

      // Reset round trackers
      player.turnState.usedEleniThisRound = false;
      player.turnState.usedIsabelThisRound = false;
      player.turnState.usedKarlaThisRound = false;
      player.turnState.usedJonasThisRound = false;
      player.turnState.usedRegisterschnittstelleThisRound = false;
      player.turnState.usedSchulungFachverfahrenThisRound = false;
      player.turnState.usedAylinThisRound = false;
      player.turnState.usedGuelThisRound = false;
      player.turnState.usedDigiVorbereitungThisRound = false;

      // 4. Hand card reset: discard remaining hand, draw 4 cards
      while (player.hand.length > 0) {
        player.discard.push(player.hand.pop());
      }
      let cardsToDraw = 4 - (player.handPenaltyNextRound || 0);
      player.handPenaltyNextRound = 0;
      cardsToDraw = Math.max(1, cardsToDraw);

      this.drawCardsForPlayer(player, cardsToDraw);
    });

    // 5. Rotate Start Player clockwise
    this.startPlayerIndex = (this.startPlayerIndex + 1) % this.players.length;
    this.currentTurnPlayerIndex = this.startPlayerIndex;

    // 6. Check Game End
    if (this.round >= this.maxRounds) {
      this.endGame();
    } else {
      this.round++;
      this.phase = 'TURN_PHASE';
      this.log(`=== Start von Runde ${this.round} von 8 === (Startspieler: ${this.players[this.startPlayerIndex].name})`, 'announcement');
      this.startPlayerTurn();
    }
  }

  drawCardsForPlayer(player, count) {
    for (let i = 0; i < count; i++) {
      if (player.deck.length === 0) {
        if (player.discard.length === 0) break;
        player.deck = shuffleArray(player.discard);
        player.discard = [];
        this.log(`${player.name} mischt den persönlichen Ablagestapel zum neuen Nachziehdeck.`, 'info');
      }
      if (player.deck.length > 0) {
        player.hand.push(player.deck.pop());
      }
    }
  }

  /**
   * Final Scoring & Audit Report
   */
  calculateScores() {
    return this.players.map(player => {
      const completedCount = player.scorePile.length;
      
      // Count open requests: active desks + queue
      let activeDeskCount = 0;
      player.desks.forEach(d => {
        if (d.activeRequest) activeDeskCount++;
      });
      const queueCount = player.queue.length;
      const totalOpenRequests = activeDeskCount + queueCount;

      // Rule: "−1 Punkt je zwei nicht erledigte Anträge, aufgerundet."
      const penalty = Math.ceil(totalOpenRequests / 2);
      const finalScore = completedCount - penalty;

      const totalDeckSize = player.deck.length + player.hand.length + player.discard.length;

      return {
        playerId: player.id,
        name: player.name,
        isHuman: player.isHuman,
        icon: player.icon,
        completedCount,
        openRequests: totalOpenRequests,
        penalty,
        finalScore,
        totalDeckSize,
        modernizationsCount: player.modernizations.filter(m => m.active).length,
        stats: player.stats
      };
    }).sort((a, b) => {
      // 1. Highest score
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      // 2. Tiebreaker: Fewest open requests
      if (a.openRequests !== b.openRequests) return a.openRequests - b.openRequests;
      // 3. Tiebreaker: Smallest total deck
      return a.totalDeckSize - b.totalDeckSize;
    });
  }

  endGame() {
    this.phase = 'GAME_OVER';
    const rankings = this.calculateScores();
    this.rankings = rankings;
    this.log(`🏆 DAS SPIEL IST BEENDET! Sieger-Kommune: ${rankings[0].name} mit ${rankings[0].finalScore} Punkten!`, 'announcement');
  }
}
