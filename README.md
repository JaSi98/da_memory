# Memory

Ein Memory-Kartenspiel fuer den Browser, entstanden als Projekt der Developer Akademie.
Es ist komplett in TypeScript und SCSS geschrieben (Vite als Build-Tool, keine Frameworks) und setzt das Figma-Design mit vier Themes um.

Repository: https://github.com/JaSi98/da_memory

## Inhalt

- [Funktionen](#funktionen)
- [Extras](#extras)
- [Spielablauf](#spielablauf)
- [Installation und Start](#installation-und-start)
- [Projektstruktur](#projektstruktur)
- [Technische Umsetzung](#technische-umsetzung)
- [Ein neues Theme hinzufuegen](#ein-neues-theme-hinzufuegen)
- [Coding-Konventionen](#coding-konventionen)
- [Hinweise und Einschraenkungen](#hinweise-und-einschraenkungen)

## Funktionen

Die Umsetzung folgt den User Stories der Checkliste.

**Startseite**
- Startseite nach Figma-Vorgabe mit dem Play-Button, der zu den Settings fuehrt.
- Der Controller im Button waechst beim Hover und dreht sich, der Pfeil wird dicker.
- Grosser Controller als dezente Dekoration im Hintergrund.

**Settings**
- Auswahl von Spielthema, Spieleranzahl (1 bis 4) und Spielfeldgroesse (16, 24 oder 36 Karten, also 4x4, 4x6 und 6x6).
- Pro Gruppe ist genau eine Option waehlbar. Der gelbe Marker wird beim Hover und bei der Auswahl eingeblendet.
- Live-Vorschau mit Game Bar und zwei Beispielkarten, die sich mit dem gewaehlten Theme aendert.
- Der Breadcrumb zeigt die getroffene Auswahl. Der Start-Button ist erst aktiv, wenn alle drei Einstellungen gewaehlt sind.

**Themes**
- Vier Themes: Code vibes, Gaming, DA Projects und Foods.
- Jedes Theme hat 18 eigene Motive, ein eigenes Kartenrueckseiten-Design, eine eigene Schrift und eine eigene Game Bar.
- Das Theme veraendert Farbschema und Motive des gesamten Spiels, auch den End-Screen.

**Spielfeld**
- Das Spielfeld entspricht der gewaehlten Groesse.
- Ueber dem Spielfeld stehen die Punktestaende, der aktuelle Spieler und der Button "Exit game" mit Sicherheitsabfrage.
- Karten drehen sich per 3D-Animation um.
- Gefundene Paare werden in der Farbe des Spielers markiert, der sie gefunden hat.

**Ende der Runde**
- Ein "Game over"-Bild mit hochzaehlendem Endstand, danach das Ergebnis mit Gewinner oder Unentschieden.
- Bei einem Sieg gibt es Konfetti-Kanonen, Konfettiregen und Feuerwerk passend zum Theme.
- Ueber "Back to start" bzw. "Home" geht es zurueck zur Startseite und eine neue Runde kann beginnen.

## Extras

- **Bis zu vier Spieler.** Bei einem Spieler spielt man gegen den Computer.
- **Computer-Gegner mit Gedaechtnis.** Er merkt sich jede aufgedeckte Karte, spielt bekannte Paare direkt und deckt sonst bevorzugt unbekannte Karten auf.
- **Soundeffekte** fuer Aufdecken, Treffer, Fehlversuch, Sieg, Unentschieden und Feuerwerk. Sie werden mit der Web Audio API erzeugt, es werden keine Audio-Dateien geladen.
- **Themenbasierte End-Screens** mit eigenen Animationen. Beim Unentschieden pendelt eine Waage, es gibt bewusst kein Feuerwerk.
- **Skalierung nach dem Figma-Frame (1440 x 1024).** Alle Groessen werden relativ zu diesem Frame berechnet. Dadurch passen auch 36 Karten ohne Scrollbalken auf den Bildschirm. Ab 1440 Pixel Breite bleibt der Inhalt zentriert und der Hintergrund fuellt die ganze Breite.
- **Reduzierte Bewegung.** Bei aktivierter Systemeinstellung "prefers-reduced-motion" laufen die Animationen des End-Screens nur minimal und das Feuerwerk entfaellt.

## Spielablauf

1. Auf der Startseite "Play" klicken.
2. In den Settings Thema, Spieleranzahl und Spielfeldgroesse waehlen und "Start" klicken.
3. Der erste Spieler ist immer Blau. Ein Klick deckt eine Karte auf, ein zweiter Klick die zweite Karte.
4. Passen beide Karten zusammen, bekommt der Spieler einen Punkt und darf noch einmal. Passen sie nicht zusammen, werden sie wieder umgedreht und der naechste Spieler ist dran.
5. Sind alle Paare gefunden, endet die Runde. Wer die meisten Punkte hat, gewinnt. Bei Gleichstand gibt es ein Unentschieden.

Mit einem Spieler ist Orange der Computer. Er zieht automatisch, sobald er an der Reihe ist.

## Installation und Start

Voraussetzung ist eine aktuelle Node.js-Version (LTS) mit npm.

```bash
# Abhaengigkeiten installieren
npm install

# Entwicklungsserver starten (Standard: http://localhost:5173)
npm run dev

# Typpruefung und Produktions-Build nach dist/
npm run build

# Gebauten Stand lokal ansehen
npm run preview
```

Der Build verwendet `--base=./`. Die App laesst sich dadurch auch in einem Unterordner hosten, zum Beispiel auf GitHub Pages.

## Projektstruktur

```
index.html                  Einstiegsseite (Container #content, Schriften, Favicon)
public/
  favicon.svg
  images/
    code-vibes/ gaming/     Pro Theme: cover.svg und 18 Motive (SVG)
    da-projects/ foods/
    icons/                  UI-Icons (Controller, Pawn, Label, Exit, ...)
    end/                    Grafiken der End-Screens (Titel, Pokal, Waage, Konfetti)
src/
  main.ts                   Einstieg und Ablauf der Screens
  models/                   Datentypen (Card, Theme, Einstellungen)
  config/                   Themes, Spielerfarben, Bildpfade
  services/                 Kartenmischen, Sound, Konfetti und Feuerwerk
  game/                     Spiellogik, Punktestand, Templates fuer Board und Game Bar
  screens/                  Home, Settings, Exit-Popup und End-Screen
  styles/                   SCSS im 7-1-Muster
    abstracts/              Variablen und Hilfsfunktion u()
    base/                   Reset und Grundstile
    components/             Buttons, Karten, Board, Game Bar, Popup
    pages/                  Home, Settings, Spiel, End-Screen
```

## Technische Umsetzung

**Single Page App ohne Framework.** `main.ts` steuert den Ablauf Home, Settings, Spiel und End-Screen. Jeder Screen rendert per Template-Funktion in den Container `#content`. Der Wechsel geschieht ueber Callbacks, die Seite wird nie neu geladen.

**Trennung von Logik und Darstellung.**
- `game.ts` enthaelt Zustand und Regeln (Aufdecken, Paarpruefung, Zugwechsel, Computer-Zug).
- `score.ts` verwaltet Punkte und den aktiven Spieler.
- Die HTML-Templates liegen in eigenen Funktionen und Dateien, die Optik steckt komplett in SCSS.

**Theme-System.** Das aktive Theme steht als Attribut `data-theme` am Root-Element eines Screens. SCSS-Maps pro Theme werden per `@each` in CSS-Variablen ausgegeben (Farben, Schriften, Kartenmasse, Game-Bar-Aussehen). So gibt es pro Screen nur ein Markup, das Aussehen entscheidet das Theme.

**Skalierung.** Jeder Screen setzt `--s` als Verhaeltnis von Fenster zu Figma-Frame. Die SCSS-Funktion `u(24)` rechnet Figma-Pixel in `calc(24 * var(--s))` um. Alle Masse aus dem Design koennen dadurch unveraendert uebernommen werden.

**Computer-Gegner.** Alle aufgedeckten Karten landen in einer Merkliste. Zu Beginn eines Zuges sucht der Computer darin ein vollstaendig bekanntes Paar. Gibt es keines, deckt er eine Karte auf und nimmt fuer die zweite Karte den bekannten Partner, falls vorhanden.

**Effekte.** Das Feuerwerk und die Konfetti-Kanonen sind ein Partikelsystem auf einem Canvas (`effects.service.ts`). Jedes Theme bringt eigene Farben und Formen mit, zum Beispiel Code-Symbole bei Code vibes oder Essens-Sticker bei Foods.

**Schriften** werden von Google Fonts geladen: Red Rose, Orbitron, Figtree, Klee One, Delius Unicase, Almarai und Poppins.

## Ein neues Theme hinzufuegen

1. Ordner `public/images/<theme-id>/` anlegen mit `cover.svg` und den Motiven als SVG-Dateien.
2. In `src/models/theme.model.ts` die neue Id zum Typ `ThemeId` hinzufuegen.
3. In `src/config/theme.config.ts` das Theme mit Label, Vorschau-Motiv und den Dateinamen der Motive eintragen. Fuer die groesste Spielfeldgroesse werden 18 Motive gebraucht.
4. In den SCSS-Maps eine Zeile fuer das Theme ergaenzen: `$bar-themes` (Game Bar), `$game-themes` (Karten und Seitenfarbe), `$stage-themes` (Settings-Vorschau) und `$end-themes` (End-Screen).
5. Optional in `effects.service.ts` Farben und Formen fuer das Feuerwerk eintragen.

## Coding-Konventionen

Der Code folgt den Guidelines der Developer Akademie (Ordner `Guidelines`):

- Dateinamen in kebab-case, Funktionen und Variablen in camelCase, Klassen und Typen in PascalCase, Konstanten in UPPER_CASE.
- Maximal 14 Zeilen pro Funktion, eine Aufgabe pro Funktion.
- Typen und Rueckgabewerte werden explizit angegeben, kein `any`.
- HTML steht in Template-Funktionen und nicht verstreut im Code, es werden semantische Tags verwendet (`main`, `header`, `section`, `form`, `fieldset`, `button`).
- Bilder haben sinnvolle `alt`-Texte, dekorative Elemente sind mit `aria-hidden` markiert.
- SCSS im 7-1-Muster mit Partials, `@use`, Nesting, BEM-Namen sowie Maps und `@each` fuer Themes.

## Hinweise und Einschraenkungen

- Fuer die Schriften wird eine Internetverbindung gebraucht. Ohne Verbindung greifen die Ersatzschriften.
- Browser starten Audio erst nach einer Benutzeraktion. Die Sounds setzen daher mit dem ersten Klick ein.
- Das Layout ist fuer Desktop-Bildschirme ausgelegt. Auf sehr kleinen Bildschirmen wird alles proportional verkleinert.
- Alle Motive, Cover und Icons stammen aus dem Figma-Design des Projekts und wurden von dort als SVG exportiert.
