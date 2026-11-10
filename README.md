# Klara & Henni – Hochzeitswebsite

Statische Seite im Look eines Fußballmagazin-Covers. Anpfiff am **05.11.2027, 16:00 Uhr** bei Bauer Kammesheidt, Essen.

## Dateien
- `index.html` – Inhalt (Cover, Spielort, Unterkünfte, Kader/Anmeldung)
- `style.css` – Gestaltung
- `script.js` – Countdown
- `img/ringe.jpg` – Titelfoto

## Auf GitHub Pages veröffentlichen
1. Auf github.com ein neues Repository anlegen (z. B. `hochzeit`).
2. Im Ordner hier:
   ```bash
   git remote add origin https://github.com/<DEIN-NAME>/hochzeit.git
   git push -u origin main
   ```
3. Auf GitHub: **Settings → Pages → Branch: `main` / `(root)` → Save**.
4. Nach ca. 1 Minute ist die Seite unter `https://<DEIN-NAME>.github.io/hochzeit/` erreichbar.

## Später: Anmeldung (RSVP)
GitHub Pages kann nur statische Dateien ausliefern. Für die Anmeldung (Personenzahl, Essenswünsche wie vegan/vegetarisch) braucht es einen Formular-Dienst, z. B. Formspree, Google Forms (eingebettet) oder ein Google Sheet über Apps Script. Der Platzhalter dafür ist der Abschnitt `#kader` in `index.html`.
