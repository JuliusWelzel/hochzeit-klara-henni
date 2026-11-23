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

## Eigene Domain (später)
Alle Pfade auf der Seite sind relativ, die Seite funktioniert also unter `github.io` und unter einer eigenen Domain ohne Änderungen.

1. Bei GitHub: **Settings → Pages → Custom domain** die Domain eintragen (z. B. `www.klara-und-henni.de`) und speichern. GitHub legt dabei eine Datei `CNAME` im Repository an. Danach lokal `git pull` ausführen.
2. Beim Domain-Anbieter (DNS-Einstellungen):
   - für `www.…`: einen **CNAME**-Eintrag `www` → `<DEIN-NAME>.github.io`
   - für die Domain ohne `www`: **A**-Einträge auf `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Wenn die Domain erreichbar ist (kann bis zu 24 h dauern): in den Pages-Einstellungen **Enforce HTTPS** anhaken.

## Später: Anmeldung (RSVP)
GitHub Pages kann nur statische Dateien ausliefern. Für die Anmeldung (Personenzahl, Essenswünsche wie vegan/vegetarisch) braucht es einen Formular-Dienst, z. B. Formspree, Google Forms (eingebettet) oder ein Google Sheet über Apps Script. Der Platzhalter dafür ist der Abschnitt `#kader` in `index.html`.
