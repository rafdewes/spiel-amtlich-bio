import fs from 'fs';
import path from 'path';

// Read all module files
const cardsJs = fs.readFileSync('js/data/cards.js', 'utf8')
  .replace(/export const /g, 'const ')
  .replace(/export /g, '');

const gameStateJs = fs.readFileSync('js/engine/gameState.js', 'utf8')
  .replace(/import .*/g, '')
  .replace(/export /g, '');

const aiJs = fs.readFileSync('js/engine/ai.js', 'utf8')
  .replace(/import .*/g, '')
  .replace(/export /g, '');

const audioJs = fs.readFileSync('js/ui/audio.js', 'utf8')
  .replace(/import .*/g, '')
  .replace(/export /g, '');

const rendererJs = fs.readFileSync('js/ui/renderer.js', 'utf8')
  .replace(/import .*/g, '')
  .replace(/export /g, '');

const appJs = fs.readFileSync('js/app.js', 'utf8')
  .replace(/import .*/g, '')
  .replace(/export /g, '');

const bundle = `/**
 * AMTLICH! Das biometrische Bürgeramt - Standalone Bundle
 * Läuft direkt im Browser (auch offline via file:// ohne lokalen Server)
 */
(function() {
  ${cardsJs}

  ${gameStateJs}

  ${aiJs}

  ${audioJs}

  ${rendererJs}

  ${appJs}
})();
`;

fs.writeFileSync('js/bundle.js', bundle);
console.log('js/bundle.js erfolgreich generiert!');
