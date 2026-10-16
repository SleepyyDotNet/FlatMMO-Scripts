// ==UserScript==
// @name         The Ultimate JavaScript Search Machine by SleepyyNet
// @name:en      The Ultimate JavaScript Search Machine by SleepyyNet
// @name:sv      Den ultimata JavaScript-Sökmaskinen av SleepyyNet
// @namespace    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @namespace:en https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @namespace:sv https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @version      2.13
// @version:en   2.13
// @version:sv   2.13
// @description  A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:en A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:sv Ett kraftfullt metasök-verktyg som söker igenom alla stora arkiv för användarskript (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) samtidigt.
// @note         v2.13: Added "Draggable" as an option in the settings menu, allowing users to toggle between fixed corners or a freely draggable bubble.
// @note         v2.12: Fixed/Removed issues with one of the "@match" lines in the code.
// @note         v2.11: Added "@note's" in the code with all the update changes made to it.
// @note         v2.1: Added missing "@grant's" in the userscript that is necessary.
// @note         v2.0: Major update with a lot of more customization for the UserScript. You can now enter a new Settings menu for the userscript by eather right-clicking the floating bubble or clicking the Setting button that are also avaliable for example in Violentmonkey/Tempermonkey sub-menu. Added Translations between English or Swedish. Added Customization for the Floating Bubble (to be able to change were the floating bubble should appear). Added so you can choose with websites the userscript should search on. Also made some small issues to the code that i noticed when testing the userscript before i releases it to the public.
// @note         v1.5: Added a floating button that you can now use to search for UserScripts. (25% transparent when not hovering over with the mouse pointer). Some small adjustments in the code for all the different functions to work properly.
// @note         v1.2: Fixed an error in the Metadata section of the code. Made the menu text translated over to English Language as default.
// @note         v1.1: Small changes to the code.
// @note         v1.0: Initial release of the userscript.
// @author       SleepyyNet
// @match        *://*/*
// @include      *
// @match        *://*/*/*
// @match        https://*/
// @match        http://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepage     https://github.com/SleepyyDotNet/FlatMMO-Scripts
// @repository   https://github.com/SleepyyDotNet/FlatMMO-Scripts
// @downloadURL  https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @updateURL    https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 1. Standardinställningar
    const defaultSettings = {
        position: 'draggable', // Standard är nu dragbar
        posX: '10px',
        posY: '10px',
        lang: 'en', // Standard till Engelska
        sources: {
            greasyfork: true,
            sleazyfork: true,
            openuserjs: true,
            userscriptzone: true,
            scriptcat: true,
            github: true,
            gist: true
        }
    };

    // Hämta sparade inställningar eller använd standard
    let settings = typeof GM_getValue !== 'undefined' ? GM_getValue('tum_settings', defaultSettings) : defaultSettings;
    settings = Object.assign({}, defaultSettings, settings);
    settings.sources = Object.assign({}, defaultSettings.sources, settings.sources);
    if (!settings.lang) settings.lang = 'sv'; 

    // 2. Språk och översättningar
    const i18n = {
        'sv': {
            bubbleText: '🔍 UserScript',
            promptText: 'The Ultimate Search Machine by SleepyyNet\n\nVad för typ av userscript letar du efter?',
            settingsTitle: 'Inställningar',
            posLabel: 'Bubblans position',
            posDraggable: 'Fritt dragbar',
            posTL: 'Uppe till vänster',
            posTC: 'Uppe i mitten',
            posTR: 'Uppe till höger',
            posBL: 'Nere till vänster',
            posBC: 'Nere i mitten',
            posBR: 'Nere till höger',
            srcLabel: 'Sökkällor',
            langLabel: 'Språk / Language',
            btnCancel: 'Avbryt',
            btnSave: 'Spara',
            menuSearch: '🔍 Sök med The Ultimate Search Machine',
            menuSettings: '⚙️ Inställningar för The Ultimate Search Machine'
        },
        'en': {
            bubbleText: '🔍 UserScript',
            promptText: 'The Ultimate Search Machine by SleepyyNet\n\nWhat kind of userscript are you looking for?',
            settingsTitle: 'Settings',
            posLabel: 'Bubble Position',
            posDraggable: 'Free Draggable',
            posTL: 'Top - Left',
            posTC: 'Top - Center',
            posTR: 'Top - Right',
            posBL: 'Bottom - Left',
            posBC: 'Bottom - Center',
            posBR: 'Bottom - Right',
            srcLabel: 'Search Sources',
            langLabel: 'Språk / Language',
            btnCancel: 'Cancel',
            btnSave: 'Save',
            menuSearch: '🔍 Search with The Ultimate Search Machine',
            menuSettings: '⚙️ Settings for The Ultimate Search Machine'
        }
    };

    const t = (key) => i18n[settings.lang][key];

    // 3. Skapa den flytande bubblan
    const bubble = document.createElement('div');
    bubble.textContent = t('bubbleText');
    bubble.style.position = 'fixed';
    bubble.style.background = 'red';
    bubble.style.color = 'white';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '50px';
    bubble.style.zIndex = '999999';
    bubble.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.3)';
    bubble.style.fontFamily = 'sans-serif';
    bubble.style.fontSize = '10px';
    bubble.style.fontWeight = 'bold';
    bubble.style.userSelect = 'none';
    bubble.style.opacity = '0.25'; 
    bubble.style.transition = 'opacity 0.3s ease, background-color 0.3s ease'; 

    function applyPosition() {
        bubble.style.top = ''; bubble.style.bottom = ''; bubble.style.left = ''; bubble.style.right = ''; bubble.style.transform = '';
        
        if (settings.position === 'draggable') {
            bubble.style.top = settings.posX || '10px';
            bubble.style.left = settings.posY || '10px';
            bubble.style.cursor = 'move';
        } else {
            bubble.style.cursor = 'pointer';
            switch(settings.position) {
                case 'top-left': bubble.style.top = '10px'; bubble.style.left = '10px'; break;
                case 'top-center': bubble.style.top = '10px'; bubble.style.left = '50%'; bubble.style.transform = 'translate(-50%, 0)'; break;
                case 'top-right': bubble.style.top = '10px'; bubble.style.right = '10px'; break;
                case 'bottom-left': bubble.style.bottom = '10px'; bubble.style.left = '10px'; break;
                case 'bottom-center': bubble.style.bottom = '10px'; bubble.style.left = '50%'; bubble.style.transform = 'translate(-50%, 0)'; break;
                case 'bottom-right': bubble.style.bottom = '10px'; bubble.style.right = '10px'; break;
            }
        }
    }
    
    applyPosition();
    document.body.appendChild(bubble);

    // --- Drag-logik ---
    let isDragging = false;
    let hasMoved = false; 
    let startX, startY;
    let initialX, initialY;

    bubble.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || settings.position !== 'draggable') return;
        isDragging = true;
        hasMoved = false;
        
        startX = e.clientX;
        startY = e.clientY;
        const rect = bubble.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        bubble.style.opacity = '1';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Kräver mer än 5 pixlars rörelse för att räknas som "drag", annars är det ett klick
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            hasMoved = true;
        }

        let newX = initialX + dx;
        let newY = initialY + dy;

        const maxX = window.innerWidth - bubble.offsetWidth;
        const maxY = window.innerHeight - bubble.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        bubble.style.left = `${newX}px`;
        bubble.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        bubble.style.opacity = '0.25';

        if (hasMoved) {
            settings.posX = bubble.style.top;
            settings.posY = bubble.style.left;
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('tum_settings', settings);
            }
        }
    });

    // 4. Sökfunktionen
    function searchAllDatabases(e) {
        if(e) e.preventDefault();
        
        // Avbryt om användaren precis dragit bubblan
        if(hasMoved && settings.position === 'draggable') return; 

        let query = prompt(t('promptText'));
        if (!query) return;

        let encodedQuery = encodeURIComponent(query);
        let allUrls = {
            greasyfork: `https://greasyfork.org/sv/scripts?q=${encodedQuery}`,
            sleazyfork: `https://sleazyfork.org/sv/scripts?q=${encodedQuery}`,
            openuserjs: `https://openuserjs.org/?q=${encodedQuery}`,
            userscriptzone: `https://www.userscript.zone/search?q=${encodedQuery}`,
            scriptcat: `https://scriptcat.org/search?keyword=${encodedQuery}`,
            github: `https://github.com/search?q=${encodedQuery}+extension%3Auser.js&type=code`,
            gist: `https://gist.github.com/search?q=${encodedQuery}`
        };

        for (let key in allUrls) {
            if (settings.sources[key]) {
                if (typeof GM_openInTab !== "undefined") {
                    GM_openInTab(allUrls[key], { active: false, insert: true });
                } else {
                    window.open(allUrls[key], '_blank');
                }
            }
        }
    }

    // 5. Inställningsmeny (GUI)
    function openSettings(e) {
        if(e) e.preventDefault(); 
        if(document.getElementById('tum-settings-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tum-settings-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
        overlay.style.zIndex = '9999999';
        overlay.style.display = 'flex'; overlay.style.justifyContent = 'center'; overlay.style.alignItems = 'center';

        const modal = document.createElement('div');
        modal.style.background = '#f9f9f9';
        modal.style.padding = '20px 30px';
        modal.style.borderRadius = '12px';
        modal.style.color = '#333';
        modal.style.fontFamily = 'sans-serif';
        modal.style.minWidth = '320px';
        modal.style.boxShadow = '0px 10px 25px rgba(0,0,0,0.5)';

        modal.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">${t('settingsTitle')}</h2>

            <h3 style="font-size: 15px; margin-bottom: 8px;">${t('langLabel')}</h3>
            <select id="tum-lang" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="sv" ${settings.lang === 'sv' ? 'selected' : ''}>Svenska</option>
                <option value="en" ${settings.lang === 'en' ? 'selected' : ''}>English</option>
            </select>

            <h3 style="font-size: 15px; margin-bottom: 8px;">${t('posLabel')}</h3>
            <select id="tum-position" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="draggable" ${settings.position === 'draggable' ? 'selected' : ''}>${t('posDraggable')}</option>
                <option value="top-left" ${settings.position === 'top-left' ? 'selected' : ''}>${t('posTL')}</option>
                <option value="top-center" ${settings.position === 'top-center' ? 'selected' : ''}>${t('posTC')}</option>
                <option value="top-right" ${settings.position === 'top-right' ? 'selected' : ''}>${t('posTR')}</option>
                <option value="bottom-left" ${settings.position === 'bottom-left' ? 'selected' : ''}>${t('posBL')}</option>
                <option value="bottom-center" ${settings.position === 'bottom-center' ? 'selected' : ''}>${t('posBC')}</option>
                <option value="bottom-right" ${settings.position === 'bottom-right' ? 'selected' : ''}>${t('posBR')}</option>
            </select>

            <h3 style="font-size: 15px; margin-bottom: 8px;">${t('srcLabel')}</h3>
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom: 25px;">
                <label style="cursor:pointer;"><input type="checkbox" id="src-greasyfork" ${settings.sources.greasyfork ? 'checked' : ''}> Greasy Fork</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-sleazyfork" ${settings.sources.sleazyfork ? 'checked' : ''}> Sleazy Fork (18+)</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-openuserjs" ${settings.sources.openuserjs ? 'checked' : ''}> OpenUserJS</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-userscriptzone" ${settings.sources.userscriptzone ? 'checked' : ''}> Userscript.Zone</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-scriptcat" ${settings.sources.scriptcat ? 'checked' : ''}> ScriptCat</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-github" ${settings.sources.github ? 'checked' : ''}> GitHub (.user.js)</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-gist" ${settings.sources.gist ? 'checked' : ''}> Gist (GitHub)</label>
            </div>

            <div style="display:flex; justify-content: space-between;">
                <button id="tum-close" style="padding: 8px 15px; cursor:pointer; border:1px solid #999; border-radius:5px; background:#ddd; font-weight:bold;">${t('btnCancel')}</button>
                <button id="tum-save" style="padding: 8px 15px; background:darkred; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">${t('btnSave')}</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('tum-close').onclick = () => overlay.remove();
        document.getElementById('tum-save').onclick = () => {
            
            settings.lang = document.getElementById('tum-lang').value;
            settings.position = document.getElementById('tum-position').value;
            settings.sources.greasyfork = document.getElementById('src-greasyfork').checked;
            settings.sources.sleazyfork = document.getElementById('src-sleazyfork').checked;
            settings.sources.openuserjs = document.getElementById('src-openuserjs').checked;
            settings.sources.userscriptzone = document.getElementById('src-userscriptzone').checked;
            settings.sources.scriptcat = document.getElementById('src-scriptcat').checked;
            settings.sources.github = document.getElementById('src-github').checked;
            settings.sources.gist = document.getElementById('src-gist').checked;

            if(typeof GM_setValue !== 'undefined') {
                GM_setValue('tum_settings', settings);
            }

            applyPosition();
            bubble.textContent = t('bubbleText');
            
            overlay.remove();
        };
    }

    // 6. Interaktioner & Hover-effekter
    bubble.addEventListener('click', searchAllDatabases);
    bubble.addEventListener('contextmenu', openSettings);

    bubble.addEventListener('mouseenter', () => {
        bubble.style.background = 'darkred';
        if (!isDragging) bubble.style.opacity = '1'; 
    });

    bubble.addEventListener('mouseleave', () => {
        bubble.style.background = 'red';
        if (!isDragging) bubble.style.opacity = '0.25'; 
    });

    // Registrera i skripthanterarens sub-meny
    if (typeof GM_registerMenuCommand !== "undefined") {
        GM_registerMenuCommand(t('menuSearch'), searchAllDatabases);
        GM_registerMenuCommand(t('menuSettings'), openSettings);
    }

})();
