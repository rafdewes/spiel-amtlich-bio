/**
 * AMTLICH! Das biometrische Bürgeramt - Main Application Controller
 * Verbindet GameState, Renderer, Audio und Bot-Steuerung
 */

import { GameState } from './engine/gameState.js';
import { BotAI } from './engine/ai.js';
import { AudioManager } from './ui/audio.js';
import { UIRenderer } from './ui/renderer.js';

class App {
  constructor() {
    this.audio = new AudioManager();
    this.gameState = null;
    this.renderer = new UIRenderer(this);
    this.botAIs = {};
    this.isProcessingBot = false;
    this.pendingCardPlay = null;
    this.selectedModSlot = 0;
  }

  init() {
    this.initNewGame({ playerCount: 3 });
    this.bindEvents();
    this.update();
  }

  initNewGame(config = {}) {
    this.gameState = new GameState(config);
    
    // Setup Bot AIs
    this.botAIs = {};
    this.gameState.players.forEach(p => {
      if (!p.isHuman) {
        this.botAIs[p.id] = new BotAI(p.personality);
      }
    });

    this.audio.playGong();
    this.update();
    this.checkBotTurn();
  }

  update() {
    this.renderer.renderAll();
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem('AMTLICH_GAME_STATE', JSON.stringify({
        round: this.gameState.round,
        players: this.gameState.players.map(p => ({ name: p.name, isHuman: p.isHuman, score: p.scorePile.length }))
      }));
    } catch (e) {
      // Storage unavailable
    }
  }

  bindEvents() {
    // Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = this.audio.toggleSound();
        soundBtn.textContent = enabled ? '🔊 Ton: An' : '🔇 Ton: Aus';
      });
    }

    // Rules Modal
    const rulesBtn = document.getElementById('btn-open-rules');
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesBtn = document.getElementById('btn-close-rules');
    if (rulesBtn && rulesModal) {
      rulesBtn.addEventListener('click', () => rulesModal.classList.add('modal-visible'));
    }
    if (closeRulesBtn && rulesModal) {
      closeRulesBtn.addEventListener('click', () => rulesModal.classList.remove('modal-visible'));
    }

    // New Game Modal
    const newGameBtn = document.getElementById('btn-new-game');
    const newGameModal = document.getElementById('new-game-modal');
    const cancelNewGameBtn = document.getElementById('btn-cancel-new-game');
    const confirmNewGameBtn = document.getElementById('btn-confirm-new-game');

    if (newGameBtn && newGameModal) {
      newGameBtn.addEventListener('click', () => newGameModal.classList.add('modal-visible'));
    }
    if (cancelNewGameBtn && newGameModal) {
      cancelNewGameBtn.addEventListener('click', () => newGameModal.classList.remove('modal-visible'));
    }
    if (confirmNewGameBtn && newGameModal) {
      confirmNewGameBtn.addEventListener('click', () => {
        const playerCount = parseInt(document.getElementById('select-player-count').value, 10) || 2;
        const mode = document.getElementById('select-game-mode').value;
        
        let playerConfigs = [];
        if (mode === 'solo') {
          playerConfigs = [
            { name: 'Bad Formular (Du)', isHuman: true },
            { name: 'Bezirksamt Groß-Metropole', isHuman: false, personality: 'balanced', icon: '🏙️' },
            { name: 'Kommune Bad Bürokratie', isHuman: false, personality: 'aggressive', icon: '🏰' },
            { name: 'Bürgerbüro Digitalien', isHuman: false, personality: 'modernizer', icon: '🚀' }
          ].slice(0, playerCount);
        } else {
          // Pass & Play
          for (let i = 1; i <= playerCount; i++) {
            playerConfigs.push({ name: `Kommune Spieler ${i}`, isHuman: true, icon: `🏛️` });
          }
        }

        newGameModal.classList.remove('modal-visible');
        this.initNewGame({ playerCount, players: playerConfigs });
      });
    }
  }

  async checkBotTurn() {
    if (this.isProcessingBot) return;
    const current = this.gameState.getCurrentPlayer();
    if (!current || current.isHuman || this.gameState.phase === 'GAME_OVER') return;

    this.isProcessingBot = true;
    this.update();

    const botAi = this.botAIs[current.id] || new BotAI();
    await botAi.executeTurn(this.gameState, 650);

    this.isProcessingBot = false;
    this.audio.playStamp();
    this.update();

    // Check if next is also a bot
    setTimeout(() => {
      this.checkBotTurn();
    }, 200);
  }

  acceptRequests(count) {
    const player = this.gameState.getCurrentPlayer();
    if (!player.isHuman) return;

    try {
      this.gameState.acceptRequests(count);
      this.audio.playStamp();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  buyMarketCard(idx) {
    const player = this.gameState.getCurrentPlayer();
    if (!player.isHuman) return;

    try {
      this.gameState.buyMarketCard(player, idx);
      this.audio.playCard();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  initiatePlayCard(cardUid) {
    const player = this.gameState.getCurrentPlayer();
    if (!player.isHuman) return;

    const card = player.hand.find(c => c.uid === cardUid);
    if (!card) return;

    this.pendingCardPlay = card;

    if (card.type === 'Störfall') {
      this.openTargetSelectionModal(card);
    } else if (card.type === 'Hilfe' && (card.id.startsWith('start_routine') || card.id === 'm_icao_norm' || card.id === 'm_fingerabdruck_politur' || card.id === 'm_iris_express' || card.id === 'm_medienbruch' || card.id === 'm_bundesdruckerei_express')) {
      // If player has 2 active desks, let them choose desk
      const occupiedDesks = player.desks.filter(d => d.activeRequest);
      if (occupiedDesks.length > 1) {
        this.openDeskSelectionModal(card);
      } else {
        const deskIdx = player.desks.findIndex(d => d.activeRequest);
        this.executePlayCard(card.uid, { targetDeskIndex: deskIdx >= 0 ? deskIdx : 0 });
      }
    } else if (card.id === 'start_priorisieren') {
      this.openDeskSelectionModal(card);
    } else if (card.id === 'm_tagesplan') {
      this.openTagesplanModal(card);
    } else if (card.id === 'm_projektgruppe') {
      const slotIdx = player.modernizations.findIndex(m => m.card && !m.active);
      this.executePlayCard(card.uid, { modernizationSlotIndex: slotIdx >= 0 ? slotIdx : 0 });
    } else if (card.id === 'm_aktenbereinigung') {
      this.openPurgeCardModal(card);
    } else {
      this.executePlayCard(card.uid, {});
    }
  }

  executePlayCard(cardUid, targetParams = {}) {
    const player = this.gameState.getCurrentPlayer();
    try {
      this.gameState.playCard(player, cardUid, targetParams);
      this.audio.playScan();
      this.closeAllActionModals();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  openTargetSelectionModal(card) {
    const modal = document.getElementById('target-selection-modal');
    const container = document.getElementById('target-selection-container');
    if (!modal || !container) return;

    container.innerHTML = '';
    const opponents = this.gameState.players.filter(p => p.id !== this.gameState.getCurrentPlayer().id);

    opponents.forEach(opp => {
      const qStatus = this.gameState.getQueueStatus(opp);
      const section = document.createElement('div');
      section.className = 'target-opponent-section';

      let desksHtml = '';
      opp.desks.forEach((d, idx) => {
        if (!d.activeRequest) {
          desksHtml += `<div class="target-desk-btn disabled">Schreibtisch ${idx + 1}: Leer</div>`;
        } else {
          const check = this.gameState.canPlayCard(this.gameState.getCurrentPlayer(), card.uid, {
            targetPlayerId: opp.id,
            targetDeskIndex: idx
          });

          const cost = check.cost ?? card.cost;
          desksHtml += `
            <button class="target-desk-btn ${check.canPlay ? '' : 'disabled'}" ${check.canPlay ? '' : 'disabled'}
              onclick="window.app.executePlayCard('${card.uid}', { targetPlayerId: ${opp.id}, targetDeskIndex: ${idx} })">
              <strong>Schreibtisch ${idx + 1} (${d.staff.name.split(',')[0]}):</strong><br/>
              „${d.activeRequest.title}“ (${d.tokens} Marken, ${d.attachedDisruptions.length}/2 Störfälle)<br/>
              <span class="cost-badge">⏱️ Kosten: ${cost} Zeit</span>
              ${!check.canPlay ? `<div class="disabled-reason">${check.reason}</div>` : ''}
            </button>
          `;
        }
      });

      section.innerHTML = `
        <div class="target-opp-title">${opp.icon} <strong>${opp.name}</strong> <span class="badge ${qStatus.class}">Warteschlange: ${opp.queue.length} (${qStatus.status})</span></div>
        <div class="target-desks-grid">${desksHtml}</div>
      `;

      container.appendChild(section);
    });

    modal.classList.add('modal-visible');
  }

  openDeskSelectionModal(card) {
    const modal = document.getElementById('desk-selection-modal');
    const container = document.getElementById('desk-selection-container');
    if (!modal || !container) return;

    container.innerHTML = '';
    const player = this.gameState.getCurrentPlayer();

    player.desks.forEach((desk, idx) => {
      if (!desk.activeRequest) return;
      const btn = document.createElement('button');
      btn.className = 'target-desk-btn';
      btn.innerHTML = `
        <strong>Schreibtisch ${idx + 1} (${desk.staff.name}):</strong><br/>
        „${desk.activeRequest.title}“ (${desk.tokens} Marken verbleibend)
      `;
      btn.onclick = () => {
        this.executePlayCard(card.uid, { targetDeskIndex: idx });
      };
      container.appendChild(btn);
    });

    modal.classList.add('modal-visible');
  }

  openTagesplanModal(card) {
    const modal = document.getElementById('desk-selection-modal');
    const container = document.getElementById('desk-selection-container');
    if (!modal || !container) return;

    container.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: bold;">Wähle die gewünschte Sortierung:</div>
      <button class="target-desk-btn" onclick="window.app.executePlayCard('${card.uid}', { mode: 'swap_active' })">
        🔄 Aktive Anträge beider Schreibtische untereinander tauschen
      </button>
      <button class="target-desk-btn" onclick="window.app.executePlayCard('${card.uid}', { mode: 'swap_queue', targetDeskIndex: 0 })">
        📋 Schreibtisch 1 mit erstem Fall der Warteschlange tauschen
      </button>
      <button class="target-desk-btn" onclick="window.app.executePlayCard('${card.uid}', { mode: 'swap_queue', targetDeskIndex: 1 })">
        📋 Schreibtisch 2 mit erstem Fall der Warteschlange tauschen
      </button>
    `;
    modal.classList.add('modal-visible');
  }

  openPurgeCardModal(card) {
    const modal = document.getElementById('desk-selection-modal');
    const container = document.getElementById('desk-selection-container');
    if (!modal || !container) return;

    const player = this.gameState.getCurrentPlayer();
    container.innerHTML = `<div style="margin-bottom: 12px; font-weight: bold;">Wähle eine Karte zum dauerhaften Entsorgen:</div>`;

    player.hand.forEach(c => {
      if (c.uid === card.uid) return;
      const btn = document.createElement('button');
      btn.className = 'target-desk-btn';
      btn.innerHTML = `<strong>Hand: ${c.name}</strong> (${c.type}, ⏱️ ${c.cost})`;
      btn.onclick = () => {
        this.executePlayCard(card.uid, { purgeCardUid: c.uid });
      };
      container.appendChild(btn);
    });

    player.discard.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'target-desk-btn';
      btn.innerHTML = `<strong>Ablagestapel: ${c.name}</strong> (${c.type}, ⏱️ ${c.cost})`;
      btn.onclick = () => {
        this.executePlayCard(card.uid, { purgeCardUid: c.uid });
      };
      container.appendChild(btn);
    });

    modal.classList.add('modal-visible');
  }

  openModernizationPicker(slotIndex) {
    this.selectedModSlot = slotIndex;
    const modal = document.getElementById('mod-picker-modal');
    const container = document.getElementById('mod-picker-container');
    if (!modal || !container) return;

    container.innerHTML = '';
    const player = this.gameState.getCurrentPlayer();

    player.availableModernizations.forEach(mod => {
      const alreadyBuilt = player.modernizations.some(m => m.card?.id === mod.id);
      const isAffordable = player.time >= 1;

      const card = document.createElement('div');
      card.className = `mod-picker-item ${alreadyBuilt ? 'already-built' : ''}`;

      card.innerHTML = `
        <div class="mod-picker-icon">${mod.icon}</div>
        <div class="mod-picker-info">
          <div class="mod-picker-name">${mod.name}</div>
          <div class="mod-picker-meta">${mod.type} · Gesamtbaukosten: ${mod.cost} ⏱️ Zeit</div>
          <div class="mod-picker-desc">${mod.description}</div>
        </div>
        <div class="mod-picker-action">
          ${alreadyBuilt ? '<span class="badge badge-score">Bereits gebaut/im Bau</span>' : `
            <button class="btn btn-sm btn-primary" ${isAffordable ? '' : 'disabled'}
              onclick="window.app.startModernizationInSlot('${mod.id}', ${mod.requiresDesk ? 0 : 0})">
              Starten (1 ⏱️ anzahlen)
            </button>
            ${player.time >= 2 ? `
              <button class="btn btn-sm btn-outline"
                onclick="window.app.startModernizationInSlot('${mod.id}', ${mod.requiresDesk ? 0 : 0}, 2)">
                Starten (2 ⏱️)
              </button>
            ` : ''}
          `}
        </div>
      `;

      container.appendChild(card);
    });

    modal.classList.add('modal-visible');
  }

  startModernizationInSlot(modId, assignedDesk = 0, timeAmount = 1) {
    const player = this.gameState.getCurrentPlayer();
    try {
      this.gameState.investModernization(player, this.selectedModSlot, modId, timeAmount, assignedDesk);
      this.audio.playCoin();
      this.closeAllActionModals();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  investInSlot(slotIndex, timeAmount = 1) {
    const player = this.gameState.getCurrentPlayer();
    try {
      const slot = player.modernizations[slotIndex];
      this.gameState.investModernization(player, slotIndex, slot.card.id, timeAmount, slot.assignedDeskIndex || 0);
      this.audio.playCoin();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  triggerEleniSwap() {
    const player = this.gameState.getCurrentPlayer();
    if (player.turnState.usedEleniThisRound) return;

    const tempReq = player.desks[0].activeRequest;
    const tempTokens = player.desks[0].tokens;
    const tempDisruptions = player.desks[0].attachedDisruptions;

    player.desks[0].activeRequest = player.desks[1].activeRequest;
    player.desks[0].tokens = player.desks[1].tokens;
    player.desks[0].attachedDisruptions = player.desks[1].attachedDisruptions;

    player.desks[1].activeRequest = tempReq;
    player.desks[1].tokens = tempTokens;
    player.desks[1].attachedDisruptions = tempDisruptions;

    player.turnState.usedEleniThisRound = true;
    this.gameState.log(`🔄 Eleni Papadakis: Schreibtisch-Anträge erfolgreich getauscht!`, 'action');
    this.audio.playCard();
    this.update();
  }

  handleDisruptionDecision(choice) {
    this.gameState.handleDisruptionChoice(0, choice);
    this.audio.playCard();
    this.update();
  }

  endTurn() {
    const player = this.gameState.getCurrentPlayer();
    if (!player.isHuman) return;

    this.gameState.endPlayerTurn();
    this.audio.playStamp();
    this.update();

    setTimeout(() => {
      this.checkBotTurn();
    }, 400);
  }

  closeAllActionModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      if (m.id !== 'game-over-modal' && m.id !== 'disruption-choice-modal') {
        m.classList.remove('modal-visible');
      }
    });
  }
}

// Global App instance for inline event bindings
window.app = new App();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
