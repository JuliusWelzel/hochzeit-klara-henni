# Ticket zum Speichern – Design (kurz)

## Warum
Gäste sollen sich auf der Seite „anmelden“ und als **Andenken** ein Ticket bekommen.
Keine Einlasskontrolle. Testphase: Es wird nichts gespeichert.

## Ziele
- Formular: Name, Anzahl Personen, Essenswunsch.
- Danach ein Ticket im Stil der Seite (Fußball-Magazin → Stadionticket), das man als Bild speichern kann.
- Button „In den Kalender“ (.ics, 05.11.2027, Bauer Kammesheidt).
- Funktioniert auf iPhone und Android gleich.

## Nicht-Ziele
- Kein echtes Apple- oder Google-Wallet-Pass (kein Zertifikat, kein Server).
- Keine Speicherung der Angaben (kommt später, z. B. über den Homeserver).
- Keine Einlasskontrolle / kein QR-Check.

## Anti-Ziele
- Kein Token oder Geheimnis im Seitencode.
- Keine fremden Dienste, an die Gästedaten fließen.

## Ansätze
- **A. Ticket als Bild im Browser (gewählt):** kein Server, volle Gestaltung, alle Handys.
- B. Google Wallet: braucht Signier-Server und Google-Freischaltung, nur Android.
- C. Fremder Wallet-Dienst (Pass2U o. ä.): Daten beim Anbieter, eingeschränkte Gestaltung.

## Entscheidungen
- Neue Sektion **03 Tickets** unter „Hotels“, Nav-Link „Tickets“; Cover-Zeile „Tickets – Bald im Vorverkauf“ verlinkt dorthin.
- Formular (Claudes Vorschlag): Name (Pflicht), Anzahl Personen 1–6, Essen **pro Person** Fleisch / Vegetarisch / Vegan, optional Freitext für Allergien.
- Ticket als HTML/Canvas, Farben und Schriften der Seite (Anton, Oswald, Rot/Creme), Abriss-Kante, „Block / Reihe / Platz“-Spielerei, Barcode-Optik wie auf dem Cover.
- „Ticket speichern“ erzeugt ein PNG per `<canvas>` (kein externes Script); auf dem Handy über das Teilen-Menü in die Fotos.
- Alles in `index.html`, `style.css` und einer neuen `ticket.js`.

## Offen für die Umsetzung
- Genaue Ticket-Texte, Platzzuweisung (z. B. aus dem Namen abgeleitet), Feinlayout.
