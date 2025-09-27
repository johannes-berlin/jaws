# JAWS - Webflow Integration

GSAP-Animationen und interaktive Effekte für Webflow-Projekte.

## Features

- 🎬 **Smooth Menu Animation** - Hamburger-Menü mit GSAP-Animationen
- 🎥 **Video Hover Effects** - Interaktive Video-Vorschauen mit Scramble-Text-Effekten
- 📜 **Scroll Animations** - Pin-Effekte und Mask-Animationen beim Scrollen
- 🎨 **Custom Easing** - Spezielle Easing-Funktionen für flüssige Übergänge
- 📱 **Responsive Design** - Optimiert für alle Bildschirmgrößen

## Technologien

- **JavaScript ES6+** - Moderne JavaScript-Features
- **GSAP 3.12.5** - Professionelle Animationen
  - ScrollTrigger Plugin
  - CustomEase Plugin
  - SplitText Plugin
- **Lenis** - Smooth Scrolling Library
- **Webflow** - Design und Hosting

## Installation

1. Repository klonen:
```bash
git clone https://github.com/johannes-berlin/jaws.git
cd jaws
```

2. `jaws-webflow.js` in dein Webflow-Projekt einbinden

## Webflow Integration

### 1. GSAP-Plugins einbinden

Füge diese Scripts in den `<head>` deines Webflow-Projekts ein:

```html
<!-- GSAP Core -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<!-- GSAP Plugins -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js"></script>
<!-- Lenis Smooth Scrolling -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.39/bundled/lenis.min.js"></script>
```

### 2. Haupt-Script einbinden

Füge `jaws-webflow.js` vor dem schließenden `</body>` Tag ein:

```html
<script src="jaws-webflow.js"></script>
```

### 3. Benötigte Webflow-Klassen

#### Hamburger-Menü
- `.menu-toggle` - Hamburger-Button
- `.menu_new` - Menü-Overlay
- `.menu_links_wrap` - Container für Menü-Links
- `.menu_link` - Einzelne Menü-Links
- `.page_main` - Haupt-Content-Container

#### Director Hover-Effekte
- `.director-item` - Container für jeden Director
- `.director-name h2` - Director-Name
- `.director-preview` - Video-Container
- `.director-preview video` - Video-Element

#### Scroll-Effekte
- `.mwg_effect037` - Haupt-Container
- `.pin-height` - Pin-Container
- `.container` - Sticky-Container
- `.hidden` - Versteckte Elemente
- `.media` - Medien-Container

#### Header-Animationen
- `.header h1` - Haupt-Titel
- `.video-wrapper` - Video-Container im Header
- `.menu_wrap` - Menü-Wrapper
- `.link` - Menü-Links
- `.socials p` - Social Media Links

### 4. CSS-Variablen

Füge diese CSS-Variablen zu deinem Webflow-Projekt hinzu:

```css
:root {
    --tone-500: #888; /* Farbe für Hover-Effekte */
}
```

## Projektstruktur

```
jaws/
├── jaws-webflow.js        # Haupt-JavaScript-Datei für Webflow
├── webflow-integration.html # Detaillierte Integrations-Anleitung
├── package.json           # NPM-Konfiguration
└── README.md             # Diese Datei
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

Du kannst die Animationen in der `jaws-webflow.js` Datei anpassen:
- Timing und Easing-Funktionen
- Stagger-Werte
- Animation-Dauern
- Scramble-Text-Einstellungen

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Kontakt

Bei Fragen oder Problemen erstelle ein Issue im Repository.
