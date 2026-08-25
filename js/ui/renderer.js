/**
 * AMTLICH! Das biometrische Bürgeramt - UI Renderer
 * Rendert das Spielbrett, Karten, Schreibtische, Modale und Animationen
 */

export class UIRenderer {
  constructor(app) {
    this.app = app;
  }

  renderAll() {
    this.renderHeader();
    this.renderOpponents();
    this.renderActivePlayerBoard();
    this.renderMarket();
    this.renderHand();
    this.renderControls();
    this.renderLog();
    this.renderPendingDisruptionModal();
    this.renderGameOverModal();
  }

  renderHeader() {
    const gs = this.app.gameState;
    const activePlayer = gs.getCurrentPlayer();

    document.getElementById('header-round').textContent = `Runde ${gs.round} / ${gs.maxRounds}`;
    
    const startPlayer = gs.players[gs.startPlayerIndex];
    document.getElementById('header-startplayer').textContent = `Startspieler: ${startPlayer.name}`;

    const turnBadge = document.getElementById('header-active-turn');
    if (turnBadge) {
      turnBadge.innerHTML = `<span class="player-icon">${activePlayer.icon}</span> <strong>${activePlayer.name}</strong> ${activePlayer.isHuman ? '(Du)' : '(KI)'}`;
    }

    const phaseBadge = document.getElementById('header-phase-badge');
    if (phaseBadge) {
      let phaseText = 'Aktionsphase';
      if (gs.turnStep === 'ACCEPT_REQUESTS') phaseText = '1. Anträge annehmen';
      else if (gs.turnStep === 'ACTIONS_AND_UPGRADES') phaseText = '2. Aktionen & Modernisierung';
      else if (gs.turnStep === 'MARKET') phaseText = '3. Marktkarte wählen';
      else if (gs.phase === 'ROUND_END') phaseText = 'Gemeinsames Rundenende';
      else if (gs.phase === 'DISRUPTION_CHOICE') phaseText = 'Störfall-Übergabe';
      else if (gs.phase === 'GAME_OVER') phaseText = 'Schlusswertung';
      phaseBadge.textContent = phaseText;
    }
  }

  renderOpponents() {
    const gs = this.app.gameState;
    const humanPlayer = gs.players.find(p => p.isHuman) || gs.players[0];
    const container = document.getElementById('opponents-container');
    if (!container) return;

    container.innerHTML = '';

    gs.players.forEach(player => {
      if (player.id === humanPlayer.id) return; // Only render opponents here

      const qStatus = gs.getQueueStatus(player);
      const isTurn = gs.currentTurnPlayerIndex === player.id;

      const card = document.createElement('div');
      card.className = `opponent-card ${isTurn ? 'opponent-active-turn' : ''}`;
      
      let desksHtml = '';
      player.desks.forEach((d, idx) => {
        const hasReq = !!d.activeRequest;
        const tokens = d.tokens;
        const disruptions = d.attachedDisruptions.length;

        desksHtml += `
          <div class="opp-desk-mini ${hasReq ? 'has-request' : 'empty-desk'}">
            <div class="opp-desk-title">${d.staff.avatar} T${idx + 1}: ${d.staff.name.split(',')[0]}</div>
            ${hasReq ? `
              <div class="opp-desk-req" title="${d.activeRequest.title}">
                „${d.activeRequest.title.length > 22 ? d.activeRequest.title.substr(0, 20) + '…' : d.activeRequest.title}“
              </div>
              <div class="opp-desk-marks">
                ${Array(tokens).fill('<span class="opp-token">●</span>').join('')}
                ${tokens === 0 ? '<span class="opp-ready">Fertig!</span>' : ''}
                ${disruptions > 0 ? `<span class="opp-disruption-badge" title="${disruptions} Störfall/Störfälle">⚠️ ${disruptions}</span>` : ''}
              </div>
            ` : `<div class="opp-desk-empty">Frei</div>`}
          </div>
        `;
      });

      const activeMods = player.modernizations.filter(m => m.active).length;

      card.innerHTML = `
        <div class="opp-header">
          <div class="opp-name"><span class="opp-icon">${player.icon}</span> <strong>${player.name}</strong></div>
          <div class="opp-score" title="Erledigte Anträge">🏆 ${player.scorePile.length} Pkt.</div>
        </div>
        <div class="opp-status-row">
          <span class="badge ${qStatus.class}" title="${qStatus.desc}">Warteschlange: ${player.queue.length} (${qStatus.status})</span>
          <span class="badge badge-mod" title="${activeMods} aktive Modernisierungen">⚙️ ${activeMods}/3</span>
        </div>
        <div class="opp-desks-grid">
          ${desksHtml}
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderActivePlayerBoard() {
    const gs = this.app.gameState;
    const player = gs.players.find(p => p.isHuman) || gs.getCurrentPlayer();
    const container = document.getElementById('my-office-board');
    if (!container) return;

    const qStatus = gs.getQueueStatus(player);
    const isCurrent = gs.currentTurnPlayerIndex === player.id;

    // Time Indicator
    const timeTokensHtml = Array(player.time).fill('<span class="time-token-icon" title="Verfügbare Zeit">⏱️</span>').join('');
    const emptyTimeTokensHtml = Array(Math.max(0, 3 - player.time)).fill('<span class="time-token-icon empty" title="Verbrauchte Zeit">⚪</span>').join('');

    // Render Desks
    let desksHtml = '';
    player.desks.forEach((desk, dIdx) => {
      const staff = desk.staff;
      const hasReq = !!desk.activeRequest;
      const disruptions = desk.attachedDisruptions;

      // Check for staff synergies/state
      let staffSynergyClass = '';
      if (staff.id === 'guel_kaya' && qStatus.level >= 1) staffSynergyClass = 'synergy-active';
      if (staff.id === 'frank_neumann' && qStatus.level >= 1) staffSynergyClass = 'synergy-active';
      if (staff.id === 'aylin_demir' && player.modernizations.some(m => m.active && m.card?.type === 'Digitalisierung')) staffSynergyClass = 'synergy-active';

      let tokensVisual = '';
      if (hasReq) {
        tokensVisual = Array(desk.tokens).fill('<span class="mark-token active" title="Bearbeitungsmarke">🔴</span>').join('');
        if (desk.tokens === 0) {
          tokensVisual = '<span class="mark-token-ready">✅ BEREIT ZUM ABSCHLUSS!</span>';
        }
      }

      desksHtml += `
        <div class="office-desk-card ${hasReq ? 'desk-occupied' : 'desk-free'} ${desk.blockedThisRound ? 'desk-blocked' : ''}">
          <div class="desk-header">
            <span class="desk-number">Schreibtisch ${dIdx + 1}</span>
            <span class="desk-staff-avatar">${staff.avatar}</span>
          </div>

          <div class="staff-info-box ${staffSynergyClass}">
            <div class="staff-name">${staff.name}</div>
            <div class="staff-title">${staff.title}</div>
            <div class="staff-ability" title="${staff.description}">
              <strong>Fähigkeit:</strong> ${staff.description}
            </div>
            <div class="staff-synergy-tag">⚡ ${staff.synergy}</div>
          </div>

          <div class="desk-active-area">
            ${hasReq ? `
              <div class="active-request-card">
                <div class="req-title">📄 ${desk.activeRequest.title}</div>
                <div class="req-flavor">${desk.activeRequest.flavor}</div>
                <div class="req-tokens-row">
                  <span class="req-tokens-label">Bearbeitungsdauer:</span>
                  <div class="req-tokens-display">${tokensVisual}</div>
                </div>
                ${disruptions.length > 0 ? `
                  <div class="desk-disruptions-box">
                    <span class="disruption-header">⚠️ Anliegende Störfälle (${disruptions.length}/2):</span>
                    ${disruptions.map(dis => `<div class="disruption-item" title="${dis.description}">• ${dis.name}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="desk-empty-placeholder">
                <div class="empty-icon">🪑</div>
                <div class="empty-text">Freier Schreibtisch</div>
                <div class="empty-hint">Wartet auf neue Anträge oder Nachrücker aus der Warteschlange</div>
              </div>
            `}
          </div>

          ${isCurrent && gs.turnStep === 'ACTIONS_AND_UPGRADES' && staff.id === 'eleni_papadakis' && !player.turnState.usedEleniThisRound ? `
            <button class="btn btn-xs btn-outline btn-eleni" onclick="window.app.triggerEleniSwap()">🔄 Eleni: Schreibtische tauschen</button>
          ` : ''}
        </div>
      `;
    });

    // Render Modernization Slots
    let modSlotsHtml = '';
    player.modernizations.forEach((slot, sIdx) => {
      if (slot.active) {
        modSlotsHtml += `
          <div class="mod-slot-card mod-slot-active">
            <div class="mod-slot-badge">AKTIV</div>
            <div class="mod-card-icon">${slot.card.icon}</div>
            <div class="mod-card-name">${slot.card.name}</div>
            <div class="mod-card-type">${slot.card.type}</div>
            <div class="mod-card-desc">${slot.card.description}</div>
          </div>
        `;
      } else if (slot.card) {
        const pct = Math.min(100, Math.round((slot.timeInvested / slot.card.cost) * 100));
        modSlotsHtml += `
          <div class="mod-slot-card mod-slot-building">
            <div class="mod-slot-badge building">IM BAU (${slot.timeInvested}/${slot.card.cost} ⏱️)</div>
            <div class="mod-card-icon">${slot.card.icon}</div>
            <div class="mod-card-name">${slot.card.name}</div>
            <div class="mod-card-type">${slot.card.type}</div>
            <div class="mod-progress-bar">
              <div class="mod-progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="mod-card-desc">${slot.card.description}</div>
            ${isCurrent && gs.turnStep === 'ACTIONS_AND_UPGRADES' && player.time > 0 ? `
              <div class="mod-slot-actions">
                <button class="btn btn-xs btn-primary" onclick="window.app.investInSlot(${sIdx}, 1)">+1 ⏱️ Investieren</button>
                ${player.time >= 2 && slot.card.cost - slot.timeInvested >= 2 ? `
                  <button class="btn btn-xs btn-primary" onclick="window.app.investInSlot(${sIdx}, 2)">+2 ⏱️ Investieren</button>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
      } else {
        modSlotsHtml += `
          <div class="mod-slot-card mod-slot-empty">
            <div class="mod-slot-badge empty">PLATZ ${sIdx + 1} FREI</div>
            <div class="mod-empty-icon">🏗️</div>
            <div class="mod-empty-text">Freier Ausbauplatz</div>
            ${isCurrent && gs.turnStep === 'ACTIONS_AND_UPGRADES' && player.time > 0 ? `
              <button class="btn btn-sm btn-outline" onclick="window.app.openModernizationPicker(${sIdx})">Modernisierung starten</button>
            ` : '<div class="empty-sub">Kostet Zeit zum Starten</div>'}
          </div>
        `;
      }
    });

    // Render Queue Items
    let queueItemsHtml = '';
    if (player.queue.length === 0) {
      queueItemsHtml = '<div class="queue-empty">Keine wartenden Bürger im Warteraum.</div>';
    } else {
      queueItemsHtml = player.queue.map((req, qIdx) => `
        <div class="queue-item" title="${req.flavor}">
          <span class="queue-num">#${qIdx + 1}</span>
          <span class="queue-title">${req.title}</span>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="office-header-bar">
        <div class="office-title-box">
          <span class="office-avatar">${player.icon}</span>
          <div>
            <div class="office-title">${player.name}</div>
            <div class="office-subtitle">Kommunales Bürgeramt & Biometrie-Zentrum</div>
          </div>
        </div>

        <div class="office-stats-row">
          <div class="stat-pill">
            <span class="stat-label">Zeit-Vorrat:</span>
            <div class="stat-time-tokens">${timeTokensHtml}${emptyTimeTokensHtml} (${player.time} Zeit)</div>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Warteschlange:</span>
            <span class="badge ${qStatus.class}">${player.queue.length} Fälle (${qStatus.status})</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Wertungsstapel:</span>
            <span class="badge badge-score">🏆 ${player.scorePile.length} Punkte</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Deck / Ablage:</span>
            <span class="badge badge-deck">🎴 ${player.deck.length} / 🗄️ ${player.discard.length}</span>
          </div>
        </div>
      </div>

      <div class="office-main-grid">
        <div class="office-desks-container">
          <div class="section-title">🏢 Personalplätze & Schreibtische (2 Plätze)</div>
          <div class="desks-flex">
            ${desksHtml}
          </div>
        </div>

        <div class="office-queue-container">
          <div class="section-title">⏳ Warteraum & Warteschlange (${player.queue.length})</div>
          <div class="queue-list-box">
            ${queueItemsHtml}
          </div>
        </div>
      </div>

      <div class="office-mods-section">
        <div class="section-title">⚙️ Modernisierungsplätze (3 Plätze für Digitalisierung, Infrastruktur & Schulung)</div>
        <div class="mods-grid">
          ${modSlotsHtml}
        </div>
      </div>
    `;
  }

  renderMarket() {
    const gs = this.app.gameState;
    const player = gs.getCurrentPlayer();
    const container = document.getElementById('market-cards-container');
    if (!container) return;

    container.innerHTML = '';

    const canBuy = (gs.turnStep === 'ACTIONS_AND_UPGRADES' || gs.turnStep === 'MARKET') && !player.turnState.marketPurchased && player.isHuman;

    gs.market.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = `action-card card-${card.type.toLowerCase()}`;

      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-type-badge type-${card.type.toLowerCase()}">${card.type}</span>
          <span class="card-cost-badge">⏱️ ${card.cost} Zeit</span>
        </div>
        <div class="card-body">
          <div class="card-icon">${card.icon}</div>
          <div class="card-name">${card.name}</div>
          ${card.tag ? `<div class="card-tag">🔖 ${card.tag}</div>` : ''}
          <div class="card-desc">${card.description}</div>
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-market" ${canBuy ? '' : 'disabled'} onclick="window.app.buyMarketCard(${idx})">
            Kostenlos erwerben
          </button>
        </div>
      `;

      container.appendChild(cardEl);
    });
  }

  renderHand() {
    const gs = this.app.gameState;
    const player = gs.players.find(p => p.isHuman) || gs.getCurrentPlayer();
    const container = document.getElementById('hand-cards-container');
    if (!container) return;

    container.innerHTML = '';

    const isCurrent = gs.currentTurnPlayerIndex === player.id;
    const isActionPhase = isCurrent && gs.turnStep === 'ACTIONS_AND_UPGRADES';

    if (player.hand.length === 0) {
      container.innerHTML = '<div class="hand-empty">Keine Handkarten vorhanden. Am Rundenende ziehst du 4 neue Karten.</div>';
      return;
    }

    player.hand.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = `action-card hand-card card-${card.type.toLowerCase()}`;

      // Check playable
      let isPlayable = false;
      let effectiveCost = card.cost;
      if (isActionPhase) {
        effectiveCost = gs.calculateCardCost(player, card, { targetDeskIndex: 0 });
        isPlayable = player.time >= effectiveCost;
      }

      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-type-badge type-${card.type.toLowerCase()}">${card.type}</span>
          <span class="card-cost-badge ${effectiveCost < card.cost ? 'cost-discounted' : ''}">⏱️ ${effectiveCost} Zeit</span>
        </div>
        <div class="card-body">
          <div class="card-icon">${card.icon}</div>
          <div class="card-name">${card.name}</div>
          ${card.tag ? `<div class="card-tag">🔖 ${card.tag}</div>` : ''}
          <div class="card-desc">${card.description}</div>
        </div>
        <div class="card-footer">
          ${isActionPhase ? `
            <button class="btn btn-sm btn-play" ${isPlayable ? '' : 'disabled'} onclick="window.app.initiatePlayCard('${card.uid}')">
              Ausspielen (${effectiveCost} ⏱️)
            </button>
          ` : `
            <span class="hand-inactive-hint">Nicht am Zug</span>
          `}
        </div>
      `;

      container.appendChild(cardEl);
    });
  }

  renderControls() {
    const gs = this.app.gameState;
    const player = gs.getCurrentPlayer();
    const container = document.getElementById('turn-controls-container');
    if (!container) return;

    if (!player.isHuman) {
      container.innerHTML = `
        <div class="bot-turn-indicator">
          <span class="spinner">⏳</span> <strong>${player.name} (KI)</strong> überlegt und führt den Zug aus…
        </div>
      `;
      return;
    }

    if (gs.turnStep === 'ACCEPT_REQUESTS') {
      container.innerHTML = `
        <div class="step-controls-box">
          <div class="step-prompt">
            <strong>Schritt 1: Anträge annehmen.</strong> Wie viele neue Bürger-Fälle möchtest du in dein Amt aufnehmen?
          </div>
          <div class="step-buttons-group">
            <button class="btn btn-primary" onclick="window.app.acceptRequests(1)">
              📄 1 Pflichtantrag annehmen (Sicherer Betrieb)
            </button>
            <button class="btn btn-secondary" onclick="window.app.acceptRequests(2)">
              📄📄 2 Anträge annehmen (Höherer Durchsatz)
            </button>
            <button class="btn btn-warning" onclick="window.app.acceptRequests(3)">
              📄📄📄 3 Anträge annehmen (Risiko: Warteschlange!)
            </button>
          </div>
        </div>
      `;
    } else if (gs.turnStep === 'ACTIONS_AND_UPGRADES' || gs.turnStep === 'MARKET') {
      container.innerHTML = `
        <div class="step-controls-box">
          <div class="step-prompt">
            <strong>Schritt 2 & 3: Aktionen spielen & Markt.</strong> Du hast <strong>${player.time} Zeit</strong> übrig.
            ${!player.turnState.marketPurchased ? 'Vergiss nicht, bis zu 1 Marktkarte kostenlos zu nehmen!' : 'Marktkarte für diesen Zug bereits genommen.'}
          </div>
          <div class="step-buttons-group">
            <button class="btn btn-outline" onclick="window.app.openModernizationPicker(0)">
              🏗️ Modernisierungs-Katalog öffnen
            </button>
            <button class="btn btn-success" onclick="window.app.endTurn()">
              ✅ Meinen Zug beenden
            </button>
          </div>
        </div>
      `;
    }
  }

  renderLog() {
    const gs = this.app.gameState;
    const container = document.getElementById('action-log-entries');
    if (!container) return;

    container.innerHTML = gs.logEntries.map(e => `
      <div class="log-entry log-${e.type}">
        <span class="log-time">[${e.time}]</span>
        <span class="log-text">${e.text}</span>
      </div>
    `).join('');
  }

  renderPendingDisruptionModal() {
    const gs = this.app.gameState;
    const modal = document.getElementById('disruption-choice-modal');
    if (!modal) return;

    if (gs.phase === 'DISRUPTION_CHOICE' && gs.pendingDisruptionDecisions.length > 0) {
      const decision = gs.pendingDisruptionDecisions[0];
      const card = decision.card;

      document.getElementById('disruption-card-name').textContent = card.name;
      document.getElementById('disruption-card-type').textContent = `${card.type} (Kosten: ${card.cost} Zeit)`;
      document.getElementById('disruption-card-desc').textContent = card.description;
      document.getElementById('disruption-req-title').textContent = `Erledigter Antrag: „${decision.requestTitle}“`;

      modal.classList.add('modal-visible');
    } else {
      modal.classList.remove('modal-visible');
    }
  }

  renderGameOverModal() {
    const gs = this.app.gameState;
    const modal = document.getElementById('game-over-modal');
    if (!modal) return;

    if (gs.phase === 'GAME_OVER' && gs.rankings) {
      const tableBody = document.getElementById('game-over-rankings-body');
      if (tableBody) {
        tableBody.innerHTML = gs.rankings.map((r, idx) => `
          <tr class="${idx === 0 ? 'rank-winner' : ''} ${r.isHuman ? 'rank-human' : ''}">
            <td class="rank-pos">${idx === 0 ? '🏆 1.' : `${idx + 1}.`}</td>
            <td class="rank-name"><span class="rank-icon">${r.icon}</span> <strong>${r.name}</strong></td>
            <td class="rank-completed">+${r.completedCount} Pkt.</td>
            <td class="rank-open">${r.openRequests} Fälle</td>
            <td class="rank-penalty">-${r.penalty} Pkt.</td>
            <td class="rank-final"><strong>${r.finalScore} Pkt.</strong></td>
          </tr>
        `).join('');
      }

      modal.classList.add('modal-visible');
    } else {
      modal.classList.remove('modal-visible');
    }
  }
}
