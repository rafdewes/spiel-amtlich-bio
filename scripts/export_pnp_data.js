/**
 * AMTLICH! Das biometrische Bürgeramt - PnP Card Data Exporter (JSON)
 * Exportiert alle Kartendaten als sauberes JSON für Python-DOCX & HTML-Druckbögen
 */

import fs from 'fs';
import { STAFF_PROFILES, MODERNIZATIONS, START_DECK, MARKET_CARDS, REQUEST_CARDS } from '../js/data/cards.js';

const pnpData = {
  staff: STAFF_PROFILES,
  modernizations: MODERNIZATIONS,
  startDeck: START_DECK,
  marketCards: MARKET_CARDS,
  requests: REQUEST_CARDS
};

fs.mkdirSync('print-to-play', { recursive: true });
fs.writeFileSync('print-to-play/cards_data.json', JSON.stringify(pnpData, null, 2), 'utf8');
console.log('print-to-play/cards_data.json erfolgreich erstellt.');
