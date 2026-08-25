"""
AMTLICH! Das biometrische Bürgeramt - HTML & PDF Print Sheets Generator
Erstellt druckfertige A4-Bögen mit gestrichelten Schnittlinien, Farbcodes und Tableaus
"""

import json

def generate_html():
    with open('print-to-play/cards_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    html = """<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>AMTLICH! Das biometrische Bürgeramt - Print-to-Play Druckbögen</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 8mm 10mm 8mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #e2e8f0;
      color: #0f172a;
      line-height: 1.3;
    }

    .no-print-bar {
      background: #1e3a8a;
      color: #ffffff;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }

    .no-print-bar button {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      font-weight: bold;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 8mm 8mm;
      margin: 15px auto;
      background: #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      page-break-after: always;
      position: relative;
    }

    .page-header {
      font-size: 11pt;
      font-weight: 700;
      color: #1e3a8a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 3mm;
      margin-bottom: 4mm;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .page-header span {
      font-size: 8pt;
      color: #64748b;
      font-weight: normal;
    }

    /* 3x3 Card Grid for Standard Card Sheet (63x88mm approx) */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 2.5mm;
      width: 100%;
      height: 260mm;
    }

    .pnp-card {
      border: 1.5px dashed #64748b;
      border-radius: 4mm;
      padding: 3.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      position: relative;
      overflow: hidden;
    }

    .card-type-hilfe { border-top: 5px solid #059669; }
    .card-type-organisation { border-top: 5px solid #2563eb; }
    .card-type-störfall { border-top: 5px solid #dc2626; }
    .card-type-reaktion { border-top: 5px solid #d97706; }
    .card-type-personal { border-top: 5px solid #4338ca; }
    .card-type-digitalisierung { border-top: 5px solid #0891b2; }
    .card-type-infrastruktur { border-top: 5px solid #475569; }
    .card-type-schulung { border-top: 5px solid #7c3aed; }
    .card-type-antrag { border-top: 5px solid #ea580c; }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5mm;
    }

    .card-type-tag {
      font-size: 6.5pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 1px 4px;
      border-radius: 3px;
      background: #f1f5f9;
      color: #334155;
    }

    .card-cost {
      font-size: 7.5pt;
      font-weight: 800;
      color: #1e3a8a;
      background: #e0e7ff;
      padding: 1px 5px;
      border-radius: 8px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 1.5mm;
      margin-bottom: 1.5mm;
    }

    .card-icon {
      font-size: 13pt;
      line-height: 1;
    }

    .card-name {
      font-size: 8pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.15;
    }

    .card-subtitle {
      font-size: 6.5pt;
      color: #64748b;
      margin-bottom: 1.5mm;
    }

    .card-tag-pill {
      font-size: 6pt;
      color: #2563eb;
      font-weight: 600;
      margin-bottom: 1mm;
    }

    .card-body {
      font-size: 6.8pt;
      color: #334155;
      line-height: 1.25;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .card-flavor {
      font-family: Georgia, serif;
      font-style: italic;
      color: #57534e;
      font-size: 6.5pt;
      margin-top: 1mm;
    }

    .card-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5mm;
      margin-top: 1.5mm;
      font-size: 6.5pt;
      display: flex;
      justify-content: space-between;
      color: #64748b;
    }

    /* Player Tableau Layout */
    .tableau-container {
      border: 2.5px solid #0f172a;
      border-radius: 5mm;
      padding: 5mm;
      height: 260mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #f8fafc;
    }

    .tableau-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 3mm;
    }

    .tableau-title-bar h2 {
      font-size: 16pt;
      color: #0f172a;
    }

    .time-track-box {
      display: flex;
      gap: 3mm;
      align-items: center;
    }

    .time-box-item {
      border: 2px solid #1e3a8a;
      background: #ffffff;
      padding: 2mm 5mm;
      border-radius: 4mm;
      font-weight: 800;
      font-size: 9pt;
      color: #1e3a8a;
    }

    .tableau-desks-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin: 3mm 0;
    }

    .tableau-desk {
      border: 2px solid #94a3b8;
      background: #ffffff;
      border-radius: 4mm;
      padding: 4mm;
      min-height: 85mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .tableau-desk h3 {
      font-size: 10.5pt;
      color: #1e3a8a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 1.5mm;
      margin-bottom: 2mm;
    }

    .desk-card-drop {
      border: 1.5px dashed #cbd5e1;
      border-radius: 3mm;
      height: 48mm;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #94a3b8;
      text-align: center;
      padding: 3mm;
      background: #f8fafc;
    }

    .desk-tokens-line {
      font-size: 8pt;
      font-weight: bold;
      color: #b91c1c;
      margin-top: 2mm;
    }

    .tableau-queue-row {
      border: 2px solid #f59e0b;
      border-radius: 4mm;
      background: #ffffff;
      padding: 3mm;
      margin: 2mm 0;
    }

    .queue-thresh-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2mm;
      margin-top: 2mm;
      font-size: 7.5pt;
    }

    .queue-thresh-item {
      padding: 2mm;
      border-radius: 2mm;
    }

    .q-normal { background: #d1fae5; color: #065f46; }
    .q-rush { background: #fef3c7; color: #92400e; }
    .q-overload { background: #fee2e2; color: #991b1b; }

    .tableau-mods-row {
      border: 2px solid #475569;
      border-radius: 4mm;
      background: #ffffff;
      padding: 3mm;
    }

    .mods-drop-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3mm;
      margin-top: 2mm;
    }

    .mod-drop-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 3mm;
      height: 32mm;
      padding: 2mm;
      font-size: 7.5pt;
      text-align: center;
      color: #64748b;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Tokens Sheet */
    .token-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(8, 1fr);
      gap: 3mm;
      height: 260mm;
    }

    .pnp-token {
      border: 1.5px dashed #475569;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2mm;
      font-size: 7pt;
      font-weight: bold;
    }

    .token-mark { background: #fee2e2; color: #991b1b; }
    .token-time { background: #dbeafe; color: #1e40af; }
    .token-round { background: #fef3c7; color: #92400e; border-radius: 4mm; }
    .token-start { background: #fde68a; color: #b45309; border-radius: 4mm; }

    @media print {
      body { background: #ffffff; }
      .no-print-bar { display: none; }
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div>
      <strong>🏛️ AMTLICH! – Print-to-Play Druckcenter</strong> (A4 Druckbögen & Tableaus)
    </div>
    <button onclick="window.print()">🖨️ Jetzt Drucken / Als PDF speichern (Strg + P)</button>
  </div>
"""

    # Helper function to generate cards in 9-per-page grid
    def add_card_pages(cards, page_title, default_type=""):
        nonlocal html
        chunks = [cards[i:i + 9] for i in range(0, len(cards), 9)]
        for chunk_idx, chunk in enumerate(chunks):
            html += f"""
  <div class="page">
    <div class="page-header">
      <div>{page_title} (Seite {chunk_idx + 1}/{len(chunks)})</div>
      <span>Entlang der gestrichelten Linien ausschneiden</span>
    </div>
    <div class="card-grid">
"""
            for card in chunk:
                name = card.get('name') or card.get('title')
                cost = card.get('cost')
                ctype = card.get('type') or default_type
                icon = card.get('icon', '📄')
                desc = card.get('description') or card.get('flavor') or ""
                tag = card.get('tag') or card.get('synergy') or ""
                subtitle = card.get('title') if card.get('name') else ""

                type_class = f"card-type-{ctype.lower()}"

                html += f"""
      <div class="pnp-card {type_class}">
        <div>
          <div class="card-top">
            <span class="card-type-tag">{ctype}</span>
            {f'<span class="card-cost">⏱️ {cost} Zeit</span>' if cost is not None else '<span class="card-cost">1 Pkt.</span>'}
          </div>
          <div class="card-title-row">
            <span class="card-icon">{icon}</span>
            <div class="card-name">{name}</div>
          </div>
          {f'<div class="card-subtitle">{subtitle}</div>' if subtitle and subtitle != name else ''}
          {f'<div class="card-tag-pill">🔖 {tag}</div>' if tag else ''}
        </div>
        <div class="card-body">
          {f'<div class="card-flavor">{desc}</div>' if card.get('flavor') else f'<div>{desc}</div>'}
        </div>
        <div class="card-footer">
          <span>AMTLICH! v0.2</span>
          <span>{('🔴 🔴 Startmarken' if 'flavor' in card else 'Biometrie-Edition')}</span>
        </div>
      </div>
"""
            # Fill empty slots if last page has < 9 cards
            for _ in range(9 - len(chunk)):
                html += '<div class="pnp-card" style="border: 1px dotted #e2e8f0;"></div>'

            html += """
    </div>
  </div>
"""

    # 1. 4x Player Boards
    for p_num in range(1, 5):
        html += f"""
  <div class="page">
    <div class="page-header">
      <div>🏛️ KOMMUNENTABLEAU: SPIELER {p_num}</div>
      <span>Vor den Spieler legen · 2 Personalplätze · 3 Modernisierungsplätze</span>
    </div>
    <div class="tableau-container">
      <div class="tableau-title-bar">
        <h2>🏛️ Bürgeramt Kommune {p_num}</h2>
        <div class="time-track-box">
          <span>Zeit-Vorrat:</span>
          <div class="time-box-item">⏱️ 1</div>
          <div class="time-box-item">⏱️ 2</div>
          <div class="time-box-item">⏱️ 3</div>
        </div>
      </div>

      <div class="tableau-desks-row">
        <div class="tableau-desk">
          <h3>🏢 SCHREIBTISCH 1 (Personalplatz 1)</h3>
          <div class="desk-card-drop">[ Personalkarte 1 hier anlegen ]</div>
          <div class="desk-card-drop" style="margin-top: 2mm;">[ Aktiver Antrag mit Bearbeitungsmarken ]</div>
          <div class="desk-tokens-line">Standard-Start: 🔴 🔴 (2 Marken) · Max. 2 Störfälle</div>
        </div>

        <div class="tableau-desk">
          <h3>🏢 SCHREIBTISCH 2 (Personalplatz 2)</h3>
          <div class="desk-card-drop">[ Personalkarte 2 hier anlegen ]</div>
          <div class="desk-card-drop" style="margin-top: 2mm;">[ Aktiver Antrag mit Bearbeitungsmarken ]</div>
          <div class="desk-tokens-line">Standard-Start: 🔴 🔴 (2 Marken) · Max. 2 Störfälle</div>
        </div>
      </div>

      <div class="tableau-queue-row">
        <strong>⏳ WARTESCHLANGE & WARTERAUM</strong> (Hier nicht zugewiesene Anträge in Reihe anlegen)
        <div class="queue-thresh-grid">
          <div class="queue-thresh-item q-normal"><strong>0–2: Normalbetrieb</strong><br/>Regulärer Dienstbetrieb.</div>
          <div class="queue-thresh-item q-rush"><strong>3–4: Andrang ⚠️</strong><br/>Gegner-Störfälle kosten +1 Zeit. Triage aktiv.</div>
          <div class="queue-thresh-item q-overload"><strong>5+: Überlastung 🚨</strong><br/>Erste eigene Hilfe-Aktion kostet -1 Zeit!</div>
        </div>
      </div>

      <div class="tableau-mods-row">
        <strong>⚙️ MODERNISIERUNGSPLÄTZE (Max. 3 Upgrades)</strong>
        <div class="mods-drop-grid">
          <div class="mod-drop-box"><strong>Platz 1</strong><br/>Digitalisierung / Infrastruktur / Schulung</div>
          <div class="mod-drop-box"><strong>Platz 2</strong><br/>Digitalisierung / Infrastruktur / Schulung</div>
          <div class="mod-drop-box"><strong>Platz 3</strong><br/>Digitalisierung / Infrastruktur / Schulung</div>
        </div>
      </div>
    </div>
  </div>
"""

    # 2. Staff Cards (12)
    add_card_pages(data['staff'], "👨‍💼 PERSONALKARTEN (12 Profile)", "Personal")

    # 3. Modernizations (36 = 4 sets of 9)
    all_mods = []
    for s in range(1, 5):
        for m in data['modernizations']:
            all_mods.append({ **m, 'tag': f'Set {s}' })
    add_card_pages(all_mods, "⚙️ MODERNISIERUNGSVORRAT (36 Karten / 4 Sets)", "Modernisierung")

    # 4. Start Decks (24 = 4 sets of 6)
    all_start = []
    for s in range(1, 5):
        for c in data['startDeck']:
            all_start.append({ **c, 'tag': f'Startdeck P{s}' })
    add_card_pages(all_start, "🎴 PERSÖNLICHE STARTDECKS (24 Karten / 4 Decks)", "Startkarte")

    # 5. Market Cards (48)
    all_market = []
    for c in data['marketCards']:
        copies = c.get('copies', 1)
        for i in range(copies):
            all_market.append(c)
    add_card_pages(all_market, "🛒 ZENTRALER AKTIONSMARKT (48 Karten)", "Markt")

    # 6. Request Cards (48)
    add_card_pages(data['requests'], "📄 ANTRAGSKARTEN (48 Bürger-Fälle)", "Antrag")

    # 7. Token Sheet
    html += """
  <div class="page">
    <div class="page-header">
      <div>🪙 TOKEN- & MARKIERUNGSBOGEN (Ausschneiden)</div>
      <span>Auf Karton kleben und ausschneiden</span>
    </div>
    <div class="token-grid">
"""
    # 24 Bearbeitungsmarken
    for _ in range(24):
        html += '<div class="pnp-token token-mark">🔴<br/>Marke</div>'
    # 12 Zeitmarker
    for p in range(1, 5):
        for t in range(1, 4):
            html += f'<div class="pnp-token token-time">⏱️ {t}<br/>K{p}</div>'
    # 8 Rundenzähler
    for r in range(1, 9):
        html += f'<div class="pnp-token token-round">Runde<br/><strong>{r}</strong></div>'
    # Startspieler & Spezial
    html += '<div class="pnp-token token-start">👑<br/>Start</div>'
    html += '<div class="pnp-token token-start">🛡️<br/>Schutz</div>'
    html += '<div class="pnp-token token-start">⚡<br/>Triage</div>'
    html += '<div class="pnp-token token-start">💼<br/>Koffer</div>'

    html += """
    </div>
  </div>
</body>
</html>
"""

    output_path = 'print-to-play/print_sheets.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"HTML Print Sheets erfolgreich erstellt: {output_path}")

if __name__ == '__main__':
    generate_html()
