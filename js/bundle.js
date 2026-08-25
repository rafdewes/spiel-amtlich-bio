/**
 * AMTLICH! Das biometrische Bürgeramt - Standalone Bundle
 * Läuft direkt im Browser (auch offline via file:// ohne lokalen Server)
 */
(function() {
  /**
 * AMTLICH! Das biometrische Bürgeramt - Kartendaten & Definitionen
 * Alle Karten, Profile, Modernisierungen und Anträge
 */

const STAFF_PROFILES = [
  {
    id: 'aylin_demir',
    name: 'Aylin Demir',
    title: 'Biometrie-Lotsin & FIDO2-Spezialistin',
    avatar: '👩‍💼',
    synergy: 'Digitalisierung · Schnelle Zuweisung',
    description: 'Sobald eine Digitalisierung aktiv ist, startet der erste ihr pro Runde zugewiesene Antrag mit 1 Bearbeitungsmarke weniger (1 statt 2).'
  },
  {
    id: 'bernd_peters',
    name: 'Bernd Peters',
    title: 'Publikumsliebling & Scanner-Flüsterer',
    avatar: '👨‍💼',
    synergy: 'Störfall-Schutz · Deeskalation',
    description: 'Ein fremder Störfall gegen seinen Schreibtisch kostet die ausspielende Kommune 1 zusätzliche Zeit.'
  },
  {
    id: 'claudia_reuter',
    name: 'Claudia Reuter',
    title: 'Dienst nach ICAO-Norm',
    avatar: '👩‍⚖️',
    synergy: 'Schadensbegrenzung · Vorschrift',
    description: 'Der erste Störfall an ihrem Schreibtisch darf höchstens 1 zusätzliche Marke verursachen und keine Bearbeitungsphase überspringen lassen.'
  },
  {
    id: 'darius_wolf',
    name: 'Darius Wolf',
    title: 'Fortbildungsfan & Zertifikats-Sammler',
    avatar: '👨‍🎓',
    synergy: 'Schulungen · Effizienz',
    description: 'Die erste Schulung an seinem Personalplatz kostet insgesamt 2 Zeit weniger.'
  },
  {
    id: 'eleni_papadakis',
    name: 'Eleni Papadakis',
    title: 'Improvisationstalent & Sensor-Putzmeisterin',
    avatar: '👩‍🔧',
    synergy: 'Flexibilität · Platzwechsel',
    description: 'Einmal pro Runde darfst du die aktiven Anträge deiner beiden Schreibtische kostenlos tauschen.'
  },
  {
    id: 'frank_neumann',
    name: 'Frank Neumann',
    title: 'Ruhepol & Warteschlangen-Bändiger',
    avatar: '🧔',
    synergy: 'Andrang · Kostenreduktion',
    description: 'Bei 3 oder mehr wartenden Anträgen (Andrang) sind eigene positive Aktionen auf seinen Schreibtisch 1 Zeit günstiger (mindestens 0 Zeit).'
  },
  {
    id: 'guel_kaya',
    name: 'Gül Kaya',
    title: 'Triage-Profi & Schnell-Erfasserin',
    avatar: '👩‍⚕️',
    synergy: 'Andrang · Schneller Durchsatz',
    description: 'Bei 3 oder mehr wartenden Anträgen (Andrang) startet der nächste ihr zugewiesene Antrag mit 1 Marke weniger.'
  },
  {
    id: 'hannes_vogt',
    name: 'Hannes Vogt',
    title: 'Gründlicher Prüfer & DPI-Fetischist',
    avatar: '👨‍🔬',
    synergy: 'Markenschutz · Exaktheit',
    description: 'Negative Aktionen können keine bereits entfernte Marke auf seinen Antrag zurücklegen (dürfen die Bearbeitung aber blockieren).'
  },
  {
    id: 'isabel_koenig',
    name: 'Isabel König',
    title: 'Springerin & Mobile-Station-Expertin',
    avatar: '👩‍💻',
    synergy: 'Dynamik · Ausweichplatz',
    description: 'Einmal pro Runde darf ein aktiver Antrag auf einen gerade frei gewordenen Personalplatz verschoben werden.'
  },
  {
    id: 'jonas_weber',
    name: 'Jonas Weber',
    title: 'Prozessdenker & Registervernetzer',
    avatar: '👨‍💻',
    synergy: 'Infrastruktur · Doppelwirkung',
    description: 'Die erste Infrastruktur, die seinen Schreibtisch betrifft, darf einmal pro Runde ein zweites Mal auslösen.'
  },
  {
    id: 'karla_nguyen',
    name: 'Karla Nguyen',
    title: 'Teamcoach & Fehlercode-Dolmetscherin',
    avatar: '👩‍🏫',
    synergy: 'Teamplay · Hilfsübertragung',
    description: 'Einmal pro Runde darf eine positive Aktion statt auf ihren Schreibtisch auf den Antrag des anderen Schreibtischs wirken.'
  },
  {
    id: 'mehmet_yilmaz',
    name: 'Mehmet Yilmaz',
    title: 'Routinier & Fingerabdruck-Veteran',
    avatar: '👴',
    synergy: 'Störungsfreiheit · Doppelabzug',
    description: 'Hat sein Antrag keinen angelegten Störfall, wird an jedem geraden Rundenende (Runde 2, 4, 6, 8) 1 zusätzliche Marke entfernt.'
  }
];

const MODERNIZATIONS = [
  // Digitalisierung
  {
    id: 'digi_vorbereitung',
    name: 'Biometrische Voraberfassung (Self-Service-Terminal)',
    type: 'Digitalisierung',
    cost: 5,
    icon: '🖥️',
    description: 'Der erste pro Runde zugewiesene Antrag startet mit 1 Marke weniger (1 statt 2).'
  },
  {
    id: 'digi_registerschnittstelle',
    name: 'NOBID- & Bundesdruckerei-Live-Schnittstelle',
    type: 'Digitalisierung',
    cost: 4,
    icon: '🌐',
    description: 'Einmal pro Runde darfst du das Hinzufügen einer Bearbeitungsmarke durch einen fremden Störfall verhindern.'
  },
  {
    id: 'digi_terminpruefung',
    name: 'Automatisierte ICAO-Konformitätsprüfung',
    type: 'Digitalisierung',
    cost: 3,
    icon: '🤖',
    description: 'Wenn du in deinem Zug nur den Pflichtantrag (1 Fall) annimmst, ziehe danach 1 Aktionskarte und lege 1 Handkarte ab.'
  },

  // Infrastruktur
  {
    id: 'infra_lichtbildterminal',
    name: 'Modernes 4-Finger-Flachbettscanner-Terminal',
    type: 'Infrastruktur',
    cost: 4,
    icon: '🖐️',
    description: 'Die erste positive Aktion auf einen aktiven Antrag kostet pro Runde 1 Zeit weniger (mindestens 0 Zeit).'
  },
  {
    id: 'infra_ausweicharbeitsplatz',
    name: 'Mobiler Biometrie-Koffer (Ausweichplatz)',
    type: 'Infrastruktur',
    cost: 5,
    icon: '💼',
    description: 'Einmal pro Partie: Ein 3. Antrag darf für eine Runde als aktiv bearbeitet werden (zieht am Rundenende -1 Marke ab).'
  },
  {
    id: 'infra_terminmanagement',
    name: 'Smartes eID-Terminmanagement mit Push-Aufruf',
    type: 'Infrastruktur',
    cost: 3,
    icon: '📱',
    description: 'Für die Zustände Andrang und Überlastung zählt deine Warteschlange, als hätte sie 1 Antrag weniger. (Schlussmalus unverändert).'
  },

  // Schulung (wird einem Schreibtisch 1 oder 2 zugeordnet)
  {
    id: 'schulung_fachverfahren',
    name: 'Fachverfahren „Pass/Ausweis 4.0“ kompakt',
    type: 'Schulung',
    cost: 3,
    icon: '📚',
    requiresDesk: true,
    description: 'Einmal pro Runde: Zahle 1 Zeit weniger für eine positive Aktion auf den zugeordneten Schreibtisch.'
  },
  {
    id: 'schulung_sonderfaelle',
    name: 'Umgang mit Sensor-Artefakten & Sonderfällen',
    type: 'Schulung',
    cost: 4,
    icon: '🔍',
    requiresDesk: true,
    description: 'Der erste Störfall pro Runde auf den zugeordneten Schreibtisch verliert seinen Nebeneffekt (reine Markenänderungen bleiben).'
  },
  {
    id: 'schulung_triage',
    name: 'Biometrie-Triage & Arbeitsorganisation',
    type: 'Schulung',
    cost: 4,
    icon: '⚡',
    requiresDesk: true,
    description: 'Bei Andrang (Warteschlange ≥ 3): Nach Abschluss eines Antrags darf sofort der nächste Fall nachrücken und verliert sofort 1 Marke.'
  }
];

const START_DECK = [
  {
    id: 'start_routine_1',
    name: 'Routinegriff (Druckluft & Scanner)',
    type: 'Hilfe',
    cost: 1,
    icon: '✨',
    description: 'Entferne 1 Bearbeitungsmarke von einem eigenen aktiven Antrag.'
  },
  {
    id: 'start_routine_2',
    name: 'Routinegriff (Druckluft & Scanner)',
    type: 'Hilfe',
    cost: 1,
    icon: '✨',
    description: 'Entferne 1 Bearbeitungsmarke von einem eigenen aktiven Antrag.'
  },
  {
    id: 'start_rueckfrage',
    name: 'Kollegiale Rückfrage am Kaffeeautomaten',
    type: 'Organisation',
    cost: 0,
    icon: '☕',
    description: 'Ziehe 1 Karte vom Deck, lege danach 1 Handkarte auf deine Ablage.'
  },
  {
    id: 'start_priorisieren',
    name: 'Priorisieren im Warteraum',
    type: 'Organisation',
    cost: 1,
    icon: '📋',
    description: 'Tausche einen deiner aktiven Anträge mit dem ersten Antrag deiner Warteschlange.'
  },
  {
    id: 'start_rueckruf',
    name: 'Plausibilitätsprüfung vorab',
    type: 'Hilfe',
    cost: 1,
    icon: '🛡️',
    description: 'Schutzschild: Verhindere, dass in diesem Zug eine Bearbeitungsmarke auf einen eigenen Schreibtisch gelegt wird.'
  },
  {
    id: 'start_unklare_zustaendigkeit',
    name: 'Unklare Passregister-Zuständigkeit',
    type: 'Störfall',
    cost: 2,
    icon: '⚠️',
    description: 'Störfall: Lege 1 Bearbeitungsmarke auf einen fremden aktiven Antrag. (Wird bei Abschluss übergeben).'
  }
];

const MARKET_CARDS = [
  // Hilfe
  {
    id: 'm_icao_norm',
    name: 'ICAO-Norm perfekt getroffen',
    type: 'Hilfe',
    cost: 1,
    copies: 4,
    icon: '📐',
    tag: 'Normalbetrieb-Bonus',
    description: 'Entferne 1 Bearbeitungsmarke von einem aktiven Antrag. Bei Normalbetrieb (Warteschlange ≤ 2) kostet diese Karte 0 Zeit.'
  },
  {
    id: 'm_medienbruch',
    name: 'Sensor gereinigt & Medienbruch behoben',
    type: 'Hilfe',
    cost: 2,
    copies: 3,
    icon: '🧽',
    tag: 'Störfall-Beseitigung',
    description: 'Entferne 1 Marke von einem eigenen Antrag und entsorge anschließend sofort einen fremden Störfall an diesem Antrag.'
  },
  {
    id: 'm_amtshilfe',
    name: 'Amtshilfe an der Scan-Station',
    type: 'Hilfe',
    cost: 1,
    copies: 3,
    icon: '🤝',
    tag: 'Doppelschlag',
    description: 'Entferne je 1 Bearbeitungsmarke von beiden eigenen aktiven Schreibtischen. Du ziehst nächste Runde 1 Karte weniger.'
  },
  {
    id: 'm_fingerabdruck_politur',
    name: 'Handcreme-Ausgabe & Sensor-Politur',
    type: 'Hilfe',
    cost: 1,
    copies: 3,
    icon: '🧴',
    tag: 'Andrang-Synergie',
    description: 'Entferne 1 Marke von einem aktiven Fall. Falls du im Zustand Andrang (≥3) bist, ziehe zusätzlich 1 Karte.'
  },
  {
    id: 'm_iris_express',
    name: 'Express-Iris-Abgleich',
    type: 'Hilfe',
    cost: 2,
    copies: 3,
    icon: '👁️',
    tag: 'Turbo-Abschluss',
    description: 'Entferne 2 Marken von einem eigenen Antrag, sofern an diesem Schreibtisch kein Störfall anliegt.'
  },
  {
    id: 'm_bundesdruckerei_express',
    name: 'Express-Freigabe Bundesdruckerei',
    type: 'Hilfe',
    cost: 1,
    copies: 3,
    icon: '🚀',
    tag: 'Rückvergütung',
    description: 'Entferne 1 Marke von einem aktiven Antrag. Falls der Fall dadurch 0 Marken hat, erhalte sofort 1 Zeit zurück.'
  },

  // Organisation
  {
    id: 'm_tagesplan',
    name: 'Tagesplan & Wartenummern neu sortiert',
    type: 'Organisation',
    cost: 0,
    copies: 4,
    icon: '🔄',
    tag: 'Agil',
    description: 'Tausche die beiden aktiven Anträge untereinander ODER tausche einen aktiven mit dem 1. wartenden Antrag.'
  },
  {
    id: 'm_projektgruppe',
    name: 'Projektgruppe Biometrie-Upgrade',
    type: 'Organisation',
    cost: 2,
    copies: 4,
    icon: '🏗️',
    tag: 'Modernisierungs-Turbo',
    description: 'Lege sofort 2 Zeit-Fortschritt auf eine deiner begonnenen Modernisierungen.'
  },
  {
    id: 'm_aktenbereinigung',
    name: 'DS-GVO-Löschroutine & Aktenbereinigung',
    type: 'Organisation',
    cost: 2,
    copies: 3,
    icon: '🗑️',
    tag: 'Deck-Optimierung',
    description: 'Entsorge diese Karte und eine weitere Karte aus deiner Hand oder deinem Ablagestapel dauerhaft aus dem Spiel.'
  },
  {
    id: 'm_schulungsoffensive',
    name: 'Spontaner Biometrie-Workshop',
    type: 'Organisation',
    cost: 1,
    copies: 3,
    icon: '🎓',
    tag: 'Kartenvorteil',
    description: 'Ziehe sofort 2 Aktionskarten von deinem Deck. Lege danach 1 Handkarte auf deinen Ablagestapel.'
  },
  {
    id: 'm_dienstanweisung',
    name: 'Dienstanweisung zur Beschleunigung',
    type: 'Organisation',
    cost: 0,
    copies: 3,
    icon: '📜',
    tag: 'Überstunden',
    description: 'Erhalte sofort 1 zusätzliche Zeit in diesem Zug. In der nächsten Runde ziehst du dafür 1 Karte weniger.'
  },

  // Störfall
  {
    id: 'm_passfoto_schattenwurf',
    name: 'Passfoto abgelehnt: Schattenwurf!',
    type: 'Störfall',
    cost: 2,
    copies: 4,
    icon: '📸',
    tag: 'Störfall · Übergabe',
    description: 'Störfall: Lege 1 Bearbeitungsmarke auf einen fremden aktiven Schreibtisch. (Max. 4 Marken pro Fall).'
  },
  {
    id: 'm_fingerkuppen_abrieb',
    name: 'Sensorfehler: Fingerkuppen abgenutzt',
    type: 'Störfall',
    cost: 2,
    copies: 4,
    icon: '🖐️',
    tag: 'Störfall · Übergabe',
    description: 'Störfall: Lege 1 Bearbeitungsmarke auf einen fremden aktiven Schreibtisch. Der Betroffene muss nachjustieren.'
  },
  {
    id: 'm_iris_verweigert',
    name: 'Bürger verweigert Iris-Scan',
    type: 'Störfall',
    cost: 1,
    copies: 3,
    icon: '🛑',
    tag: 'Störfall · Blockade',
    description: 'Störfall: Der betroffene fremde Antrag verliert am nächsten Rundenende keine Bearbeitungsmarke.'
  },
  {
    id: 'm_rueckfrage_zertifikat',
    name: 'Rückfrage der Pass-Zertifizierungsstelle',
    type: 'Störfall',
    cost: 2,
    copies: 3,
    icon: '🔒',
    tag: 'Störfall · Stummschaltung',
    description: 'Störfall: Lege 1 Marke auf den fremden Antrag. Die dauerhafte Personalfähigkeit dieses Schreibtischs ist bis Rundenende inaktiv.'
  },
  {
    id: 'm_bundesdruckerei_offline',
    name: 'Live-Sync zur Bundesdruckerei fehlgeschlagen',
    type: 'Störfall',
    cost: 3,
    copies: 3,
    icon: '💥',
    tag: 'Störfall · Totalblockade',
    description: 'Störfall: Der betroffene Fall wird am Rundenende nicht bearbeitet. (Darf nicht auf Fälle mit nur 1 Marke gespielt werden).'
  },

  // Reaktion
  {
    id: 'm_doch_zustaendig',
    name: 'Doch zuständig (Gültiges Ersatzdokument)',
    type: 'Reaktion',
    cost: 1,
    copies: 3,
    icon: '🛡️',
    tag: 'Reaktion · Neutralisieren',
    description: 'Reaktion: Neutralisiere einen gerade gespielten fremden Störfall. Die Störfallkarte geht auf die Ablage des Angreifers.'
  },
  {
    id: 'm_pragmatisch',
    name: 'Pragmatische Zwischenlösung (Manuelle Freigabe)',
    type: 'Reaktion',
    cost: 1,
    copies: 3,
    icon: '⚡',
    tag: 'Reaktion · Schadensbegrenzung',
    description: 'Reaktion: Ein fremder Effekt, der die Bearbeitung am Rundenende verhindert, legt stattdessen genau 1 Marke auf den Fall.'
  }
];

const REQUEST_CARDS = [
  {
    title: 'Express-Reisepass mit 3D-Gesichtsscan',
    flavor: '„Abflug morgen früh um 6 Uhr. Die biometrische Passkontrolle in Singapur verzeiht keine Fehler.“'
  },
  {
    title: 'Fingerabdruck-Nacherfassung für ePerso',
    flavor: '„Nach 20 Jahren Gartenarbeit erkennt der optische Sensor die Papillarlinien nur noch als abstrakte Kunst.“'
  },
  {
    title: 'Passbild-Korrektur: Lächelverbot missachtet',
    flavor: '„Die Mundwinkel waren 1,2 Millimeter zu hoch für den unerbittlichen ICAO-Konformitäts-Algorithmus.“'
  },
  {
    title: 'Neugeborenen-Erstregistrierung & Iris-Abgleich',
    flavor: '„Das Baby blinzelte genau in der Millisekunde des Infrarot-Blitzes. Versuch Nummer 8.“'
  },
  {
    title: 'Verlustanzeige mit eID-Sperrung',
    flavor: '„Portemonnaie auf dem Bürgerfest verloren – sicherheitshalber auch alle FIDO2-Zertifikate widerrufen.“'
  },
  {
    title: 'Biometrischer Grenzgänger-Pass (EasyPASS)',
    flavor: '„Täglich über die Grenze pendeln, aber das Lesegerät verlangt jedes Mal eine manuelle Neukalibrierung.“'
  },
  {
    title: 'Führerschein-Umtausch mit digitalem Lichtbildabgleich',
    flavor: '„Das Foto auf dem grauen Lappen stammt aus 1982 – die KI vermutet einen Zeitreise-Betrug.“'
  },
  {
    title: 'Wohnsitzanmeldung mit digitalem Meldeschein',
    flavor: '„Der QR-Code auf der Wohnungsgeberbestätigung ist mit Kaffee bekleckert und nicht mehr lesbar.“'
  },
  {
    title: 'Kinderreisepass-Aktualisierung (Wachstumsschub)',
    flavor: '„In zwei Monaten 8 cm gewachsen – das Gesichtserkennungssystem schlägt Alarm wegen Gestaltwechsel.“'
  },
  {
    title: 'Notfall-Reisedokument an der Flughafengrenze',
    flavor: '„Zwei Daumenabdrücke und ein flehentlicher Blick genügen, wenn der Bundesdruckerei-Server mitspielt.“'
  },
  {
    title: 'PIN-Rücksetzbrief für Online-Ausweisfunktion',
    flavor: '„Der Briefumschlag mit dem Freischaltcode liegt garantiert im allergeheimsten Ordner der Wohnung.“'
  },
  {
    title: 'Vor-Ort-Fotoautomat: Brillen-Reflexion',
    flavor: '„Der Automat fordert zum fünften Mal: \'Bitte Brille abnehmen, Scheitel korrigieren und neutral schauen!\'“'
  },
  {
    title: 'Namensänderung nach Eheschließung mit Zertifikats-Update',
    flavor: '„Alle Nachweise liegen lückenlos vor – nur die Software streikt beim Doppelnamen mit Umlauten.“'
  },
  {
    title: 'Visum-Verlängerung mit 10-Finger-Scan',
    flavor: '„Der rechte Ringfinger hat Pflaster. Jetzt muss eine amtliche Ausnahmegenehmigung her.“'
  },
  {
    title: 'Diplomatenpass-Erneuerung (Sonderprotokoll)',
    flavor: '„Erhöhte Verschlüsselungsstufe, aber die Schnittstelle im Bürgeramt läuft noch über Kupferkabel.“'
  },
  {
    title: 'Zweitwohnsitz-Steuererklärung & eID-Abgleich',
    flavor: '„Die Steuerberechnung klappt sofort, aber das Register verlangt ein zweites biometrisches Passbild.“'
  },
  {
    title: 'Vorläufiger Personalausweis vor Kreuzfahrt',
    flavor: '„Gültigkeit: 3 Monate. Gedruckt auf speziellem Sicherheitspapier mit echtem Stempelfett.“'
  },
  {
    title: 'Gewerbeummeldung mit Authentifizierungs-Token',
    flavor: '„Der USB-Stick mit dem Behörden-Zertifikat wurde versehentlich als Werbegeschenk formatiert.“'
  },
  {
    title: 'Identitätsfeststellung nach verpasstem Venenscan',
    flavor: '„Der Bürger beteuert, noch dieselbe Person wie vor 5 Jahren zu sein. Das System verlangt Zeugen.“'
  },
  {
    title: 'Ausstellung eines Dienstausweises mit RFID-Chip',
    flavor: '„Öffnet alle Türen im Rathaus – außer der Kantine, weil der Speiseplan-Server offline ist.“'
  },
  {
    title: 'Biometrischer Seefahrtsausweis',
    flavor: '„Hautkontakt mit Salzwasser führt zu erhöhter Fehlerrate am kapazitiven Fingersensor.“'
  },
  {
    title: 'Echtheitsprüfung ausländischer Geburtsurkunden',
    flavor: '„Beglaubigte Übersetzung mit Apostille, aber die Tinte glänzt nicht im korrekten UV-Spektrum.“'
  },
  {
    title: 'Korrektur der Meldeanschrift im Chip-Speicher',
    flavor: '„Der Aufkleber für die Rückseite klebt schief, aber die internen Bits stimmen millimetergenau.“'
  },
  {
    title: 'Sonderausweis für Berufsfeuerwehr & Katastrophenschutz',
    flavor: '„Rußpartikel an den Fingerkuppen verlangen eine manuelle Freigabe durch den Sachgebietsleiter.“'
  },
  {
    title: 'Erstbeantragung Personalausweis mit 16 Jahren',
    flavor: '„Der erste eigene Ausweis. Die Unterschrift auf dem Signaturpad wurde dreimal wiederholt.“'
  },
  {
    title: 'Registerabgleich nach Doppelstaatsbürgerschafts-Reform',
    flavor: '„Zwei Pässe, zwei Schreibweisen des Nachnamens, ein ratloses NOBID-Verfahren.“'
  },
  {
    title: 'Express-Abholung am automatischen 24/7-Ausgabeterminal',
    flavor: '„Das Terminal verlangt SMS-Code, PIN und Fingerabdruck, spuckt aber zuerst eine Quittung aus.“'
  },
  {
    title: 'Verlängerung Jagdschein mit Zuverlässigkeitsprüfung',
    flavor: '„Automatische Abfrage im Nationalen Waffenregister – Ladebalken steht bei 99 %.“'
  },
  {
    title: 'Parkausweis für Schwerbehinderte mit QR-Verifikation',
    flavor: '„Das Dokument ist laminiert, der QR-Code spiegelt in der Windschutzscheibe.“'
  },
  {
    title: 'Beglaubigung von Zeugniskopien mit Siegel-Scan',
    flavor: '„Prägestempel muss im 45-Grad-Winkel unter die Dokumentenkamera gehalten werden.“'
  },
  {
    title: 'Führungszeugnis für Ehrenamtliche im Sportverein',
    flavor: '„Befreiung von den Gebühren nachgewiesen, aber der Vereinssiegel-Stempel war zu schwach.“'
  },
  {
    title: 'Nachträgliche Aktivierung der eID-Funktion',
    flavor: '„Vor 8 Jahren deaktiviert, jetzt soll die Steuererklärung plötzlich volldigital laufen.“'
  },
  {
    title: 'Meldebescheinigung für Bankkredit',
    flavor: '„Der Banker will ein Original mit Nassunterschrift, der Bürger hat nur das PDF auf dem Smartphone.“'
  },
  {
    title: 'Eintragung eines Ordens- oder Künstlernamens',
    flavor: '„\'DJ Amtsschimmel\' soll in das Passregister eingetragen werden. Drei Fachaufsichten beraten.“'
  },
  {
    title: 'Erfassung biometrischer Daten für Mobilitätskarte',
    flavor: '„Senioren-Monatskarte mit Fotoabgleich am Bus-Entwerter. Die Schlange wird länger.“'
  },
  {
    title: 'Rückgabe ungültiger Dokumente zur Vernichtung',
    flavor: '„Mit der amtlichen Lochzange die Chip-Antenne durchtrennen – der befriedigendste Moment des Tages.“'
  },
  {
    title: 'Korrektur des Geburtsorts (Gemeindereform 1974)',
    flavor: '„Das Dorf gehört seit 50 Jahren zur Nachbarstadt, im Taufregister steht aber der alte Name.“'
  },
  {
    title: 'Ausstellung eines Reiseausweises für Staatenlose',
    flavor: '„Hochkomplexes Genehmigungsverfahren mit ministerieller Sonderfreigabe.“'
  },
  {
    title: 'Vollmachts-Hinterlegung für Vorsorge und Betreuung',
    flavor: '„Elektronisches Notarregister antwortet innerhalb von 0,4 Sekunden – alle Beschäftigten staunen.“'
  },
  {
    title: 'Wahlbenachrichtigung verloren: Wahlschein-Antrag',
    flavor: '„Sonntag ist Bundestagswahl. Identitätsprüfung via Fingerkuppenabgleich am Schalter.“'
  },
  {
    title: 'Zertifikatswechsel am mobilen Koffer-Arbeitsplatz',
    flavor: '„Hausbesuch im Seniorenheim mit dem 14-Kilo-Hightech-Koffer. Die Batterie zeigt 12 %.“'
  },
  {
    title: 'Erfassung der Pupillendistanz für Dienstbrille',
    flavor: '„Die Bildschirmarbeitsplatzverordnung verlangt höchste optische Präzision.“'
  },
  {
    title: 'Ausweisprüfung für Eheschließung im Standesamt',
    flavor: '„Biometrischer Check im Nachbarzimmer, damit die Trauung pünktlich beginnen kann.“'
  },
  {
    title: 'Abgleich nach Namens-Kombination im Melderegister',
    flavor: '„Dreifach-Vorname ohne Bindestrich – die Datenbank sortiert den Mittelnamen als Spitznamen ein.“'
  },
  {
    title: 'Grenzübertrittsausweis für Binnenschiffer',
    flavor: '„Wasserfeste Dokumentenkarte mit gehärtetem Kryptochip.“'
  },
  {
    title: 'Identitätsüberprüfung nach Phishing-Verdacht',
    flavor: '„Gefälschte Behörden-SMS erhalten – der Bürger möchte seinen Chip persönlich desinfizieren lassen.“'
  },
  {
    title: 'Status-Abfrage: Passlieferung aus Berlin',
    flavor: '„Der Kurier der Bundesdruckerei steht angeblich im Stau auf der A7.“'
  },
  {
    title: 'Sonderprüfung: Zwillingsverwechslung im Passregister',
    flavor: '„Eineiige Zwillinge mit identischem Geburtsdatum bringen das biometrische Matching an seine Grenzen.“'
  }
];

const BOT_NAMES = [
  { name: 'Bezirksamt Groß-Metropole', personality: 'balanced', icon: '🏙️' },
  { name: 'Kommune Bad Bürokratie', personality: 'aggressive', icon: '🏰' },
  { name: 'Bürgerbüro Digitalien', personality: 'modernizer', icon: '🚀' },
  { name: 'Gemeinde Hintertupfingen', personality: 'rusher', icon: '🌲' }
];


  /**
 * AMTLICH! Das biometrische Bürgeramt - Game Engine & State Management
 * Vollständige Logik für Runden, Züge, Schreibtische, Warteschlange, Modernisierungen & Wertung
 */



function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class GameState {
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


  /**
 * AMTLICH! Das biometrische Bürgeramt - KI-Entscheidungsengine
 * Strategische Bot-Steuerung mit Heuristiken für Anträge, Modernisierungen, Handkarten und Störfälle
 */

class BotAI {
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


  /**
 * AMTLICH! Das biometrische Bürgeramt - Web Audio Synthesizer
 * Generiert prozedurale Soundeffekte direkt im Browser ohne externe Sounddateien
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.25;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playStamp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);

    gain.gain.setValueAtTime(this.volume * 1.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playScan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.linearRampToValueAtTime(1760, t + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playCard() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.05); // E6

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  playGong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, t); // E4
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.8);

    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const t = this.ctx.currentTime + (i * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  playWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.15);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }
}


  /**
 * AMTLICH! Das biometrische Bürgeramt - UI Renderer
 * Rendert das Spielbrett, Karten, Schreibtische, Modale und Animationen
 */

class UIRenderer {
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


  /**
 * AMTLICH! Das biometrische Bürgeramt - Main Application Controller
 * Verbindet GameState, Renderer, Audio und Bot-Steuerung
 */






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

})();
