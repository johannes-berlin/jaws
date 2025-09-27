# Webflow + Netlify Integration Guide

## 🎯 Ziel
Webflow für Design + Netlify für GSAP-Animationen kombinieren

## 📋 Schritt-für-Schritt Anleitung

### 1. Webflow-Projekt vorbereiten

#### A) Klassen in Webflow hinzufügen
Stelle sicher, dass deine Webflow-Elemente diese Klassen haben:

**Navigation:**
- Hamburger-Button: `menu-toggle`
- Menü-Overlay: `menu_new`
- Menü-Links-Container: `menu_links_wrap`
- Einzelne Links: `menu_link`
- Haupt-Content: `page_main`

**Director-Sektion:**
- Director-Container: `director-item`
- Director-Name: `director-name h2`
- Video-Container: `director-preview`
- Video-Element: `director-preview video`

**Scroll-Effekte:**
- Haupt-Container: `mwg_effect037`
- Pin-Container: `pin-height`
- Sticky-Container: `container`
- Versteckte Elemente: `hidden`
- Medien-Container: `media`

**Header:**
- Haupt-Titel: `header h1`
- Video-Wrapper: `video-wrapper`

#### B) Custom Code in Webflow hinzufügen

**Head Code (Project Settings → Custom Code):**
```html
<!-- GSAP Core -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<!-- GSAP Plugins -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js"></script>
<!-- Lenis Smooth Scrolling -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.39/bundled/lenis.min.js"></script>

<!-- CSS für Animationen -->
<style>
:root {
    --tone-500: #888;
}

/* Menu Toggle Styles */
.menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: all 0.3s ease;
}

.hamburger-line {
    width: 25px;
    height: 2px;
    background: #fff;
    transition: all 0.3s ease;
}

.menu-toggle.is-open .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle.is-open .hamburger-line:nth-child(2) {
    opacity: 0;
}

.menu-toggle.is-open .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

/* Director Preview Styles */
.director-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
    pointer-events: none;
}

.director-preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.5);
}

/* Scroll Effect Styles */
.mwg_effect037 .hidden {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    mask-image: linear-gradient(transparent -25%, #000 0%, #000 100%);
    -webkit-mask-image: linear-gradient(transparent -25%, #000 0%, #000 100%);
}

.mwg_effect037 .media {
    width: 80%;
    height: 80%;
    overflow: hidden;
    border-radius: 10px;
}

.mwg_effect037 .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Header Animation Styles */
.header h1 span {
    display: inline-block;
    transform: translateY(500px) rotateY(90deg) scale(0.75);
}

.video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
}

.video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
```

**Footer Code (vor `</body>`):**
```html
<!-- Deine JavaScript-Dateien -->
<script src="js/menu.js"></script>
<script src="js/directors.js"></script>
<script src="js/scroll-effects.js"></script>
<script src="js/header-animation.js"></script>
```

### 2. Webflow-Code exportieren

1. **Project Settings** → **Export Code**
2. **Download ZIP** wählen
3. ZIP-Datei entpacken

### 3. JavaScript-Dateien hinzufügen

1. Erstelle einen `js/` Ordner im exportierten Code
2. Kopiere die JavaScript-Dateien aus diesem Repository:
   - `js/menu.js`
   - `js/directors.js`
   - `js/scroll-effects.js`
   - `js/header-animation.js`

### 4. Netlify-Deployment

#### Option A: GitHub-Integration
1. Exportierten Code zu GitHub pushen
2. Netlify mit GitHub verbinden
3. Build-Einstellungen:
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `.` (root)

#### Option B: Drag & Drop
1. Exportierten Code als ZIP packen
2. Auf Netlify hochladen (Drag & Drop)

### 5. Custom Domain (Optional)

1. In Netlify: **Domain Settings**
2. Custom Domain hinzufügen
3. DNS-Einstellungen in deinem Domain-Provider anpassen

## 🔧 Troubleshooting

### Häufige Probleme:

1. **Animationen funktionieren nicht:**
   - Prüfe Browser-Konsole auf Fehler
   - Stelle sicher, dass alle GSAP-Plugins geladen sind
   - Überprüfe, ob alle Klassen korrekt benannt sind

2. **Videos laden nicht:**
   - Prüfe Video-URLs
   - Stelle sicher, dass Videos öffentlich zugänglich sind

3. **Scroll-Effekte funktionieren nicht:**
   - Prüfe, ob ScrollTrigger korrekt geladen ist
   - Überprüfe die HTML-Struktur

## 📱 Testing

1. **Lokal testen:**
   ```bash
   npx serve .
   ```

2. **Netlify-Preview testen:**
   - Netlify erstellt automatisch Preview-URLs
   - Teste auf verschiedenen Geräten

## 🎯 Nächste Schritte

1. Webflow-Projekt mit den Klassen erstellen
2. Custom Code hinzufügen
3. Code exportieren
4. JavaScript-Dateien integrieren
5. Netlify-Deployment
6. Testen und optimieren

## 💡 Tipps

- Verwende Webflow für das Design und Layout
- Nutze Netlify für die GSAP-Animationen
- Teste regelmäßig in der Browser-Konsole
- Halte die JavaScript-Dateien modular
