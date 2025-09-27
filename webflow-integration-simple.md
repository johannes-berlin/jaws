# JAWS - Webflow Integration (Einfach)

## 🎯 Lösung: Externes JavaScript-Modul von Netlify

### Schritt 1: Netlify-Deployment

1. **Repository zu Netlify pushen:**
   - Gehe zu [netlify.com](https://netlify.com)
   - "New site from Git"
   - GitHub verbinden und `johannes-berlin/jaws` auswählen
   - Build-Einstellungen:
     - **Build Command**: `echo "No build needed"`
     - **Publish Directory**: `.` (root)
   - Deploy!

2. **Deine Netlify-URL wird sein:**
   ```
   https://jaws-xxxxx.netlify.app
   ```

### Schritt 2: Webflow-Integration

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
<!-- Dein JavaScript-Modul von Netlify -->
<script type="module" src="https://jaws-xxxxx.netlify.app/main.js"></script>
```

**WICHTIG:** Ersetze `jaws-xxxxx` mit deiner tatsächlichen Netlify-URL!

### Schritt 3: Testen

1. **Webflow-Vorschau:** Teste die Animationen in der Webflow-Vorschau
2. **Browser-Konsole:** Prüfe auf Fehler in der Browser-Konsole
3. **Responsive:** Teste auf verschiedenen Bildschirmgrößen

## 🔧 Troubleshooting

### Häufige Probleme:

1. **Animationen funktionieren nicht:**
   - Prüfe Browser-Konsole auf Fehler
   - Stelle sicher, dass die Netlify-URL korrekt ist
   - Überprüfe, ob alle Klassen korrekt benannt sind

2. **CORS-Fehler:**
   - Stelle sicher, dass deine Netlify-Site öffentlich zugänglich ist
   - Prüfe, ob die URL korrekt ist

3. **Module-Loading-Fehler:**
   - Stelle sicher, dass du `type="module"` verwendest
   - Prüfe, ob die URL erreichbar ist

## 🎯 Vorteile dieser Lösung:

- ✅ **Einfach:** Nur ein Script-Tag in Webflow
- ✅ **Modular:** Alle Animationen in einem Modul
- ✅ **Wartbar:** Updates über Netlify-Deployment
- ✅ **Performance:** CDN-optimiert
- ✅ **Skalierbar:** Funktioniert in mehreren Projekten

## 📱 Demo

Besuche die Demo-Seite: `https://jaws-xxxxx.netlify.app/demo.html`

## 🚀 Nächste Schritte:

1. Netlify-Site erstellen
2. Webflow-Klassen hinzufügen
3. Custom Code einfügen
4. Testen und optimieren

Das war's! 🎉
