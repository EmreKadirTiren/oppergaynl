# oppergaynl

## Structuur
- `index.html`: alleen HTML markup
- `assets/styles.css`: alle styles
- `assets/main.js`: alle client-side JavaScript

## Last.fm configuratie
Deze site draait als statische HTML/CSS/JS (GitHub Pages), dus een `.env` bestand wordt niet automatisch ingeladen in de browser.

Gebruik `.env.example` als voorbeeld voor lokale configuratie en zet je waarden handmatig in `assets/main.js`:
- `LASTFM_USER`
- `LASTFM_KEY`

Plaats nooit echte secrets in publieke repositories.
