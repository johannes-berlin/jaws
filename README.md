# JAWS - Interactive Experience

Eine interaktive Website mit GSAP-Animationen und modernen Scroll-Effekten, optimiert für Netlify-Deployment.

## Features

- 🎬 **Smooth Menu Animation** - Hamburger-Menü mit GSAP-Animationen
- 🎥 **Video Hover Effects** - Interaktive Video-Vorschauen mit Scramble-Text-Effekten
- 📜 **Scroll Animations** - Pin-Effekte und Mask-Animationen beim Scrollen
- 🎨 **Custom Easing** - Spezielle Easing-Funktionen für flüssige Übergänge
- 📱 **Responsive Design** - Optimiert für alle Bildschirmgrößen

## Technologien

- **HTML5** - Semantische Struktur
- **CSS3** - Moderne Styles mit CSS Grid und Flexbox
- **JavaScript ES6+** - Moderne JavaScript-Features
- **GSAP 3.12.5** - Professionelle Animationen
  - ScrollTrigger Plugin
  - CustomEase Plugin
  - SplitText Plugin
  - TextPlugin
- **Lenis** - Smooth Scrolling Library

## Installation

1. Repository klonen:
```bash
git clone https://github.com/johannes-berlin/jaws.git
cd jaws
```

2. Dependencies installieren (optional):
```bash
npm install
```

3. Lokalen Server starten:
```bash
npm run dev
# oder
npx serve .
```

## Netlify Deployment

### Automatisches Deployment

1. Repository zu GitHub pushen
2. Netlify mit GitHub verbinden
3. Build-Einstellungen:
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `.` (root)
4. Deploy!

### Manuelles Deployment

1. Alle Dateien in einen Ordner packen
2. Auf Netlify hochladen (Drag & Drop)
3. Domain konfigurieren

## Projektstruktur

```
jaws/
├── index.html              # Haupt-HTML-Datei
├── styles.css              # Alle CSS-Styles
├── js/                     # JavaScript-Module
│   ├── menu.js            # Menü-Animationen
│   ├── directors.js       # Video-Hover-Effekte
│   ├── scroll-effects.js  # Scroll-Animationen
│   └── header-animation.js # Header-Animationen
├── package.json           # NPM-Konfiguration
└── README.md             # Diese Datei
```

## Lokale Entwicklung

```bash
# Server starten
npm run dev

# Oder mit serve
npx serve . -l 3000
```

## Browser-Unterstützung

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Lazy Loading für Videos
- Intersection Observer für optimierte Performance
- Will-change CSS-Eigenschaften für GPU-Beschleunigung
- Optimierte GSAP-Animationen

## Anpassungen

Du kannst die Animationen in den jeweiligen JavaScript-Dateien anpassen:
- `js/menu.js` - Menü-Animationen
- `js/directors.js` - Video-Hover-Effekte
- `js/scroll-effects.js` - Scroll-Animationen
- `js/header-animation.js` - Header-Animationen

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Kontakt

Bei Fragen oder Problemen erstelle ein Issue im Repository.
