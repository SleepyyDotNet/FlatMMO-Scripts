// ==UserScript==
// @name            The Ultimate JavaScript Search Machine by SleepyyNet
// @name:en         The Ultimate JavaScript Search Machine by SleepyyNet
// @name:sv         Den ultimata JavaScript-Sökmaskinen av SleepyyNet
// @namespace       https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:en    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:sv    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @version         2.0
// @version:en      2.0
// @version:sv      2.0
// @description     A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:en  A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:sv  Ett kraftfullt metasök-verktyg som söker igenom alla stora arkiv för användarskript (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) samtidigt.
// @author          SleepyyNet
// @match           *://*/*
// @include         *
// @match           *:///*
// @match           *://*/*/*
// @match           https://*/
// @match           http://*/*
// @match           https://*.google.*/*
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @homepage        https://github.com/SleepyyDotNet/FlatMMO-Scripts
// @repository      https://github.com/SleepyyDotNet/FlatMMO-Scripts
// @downloadURL     https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet%20(v.2.0).js
// @updateURL       https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet%20(v.2.0).js
// @license         MIT
// ==/UserScript==

(function() {
    'use strict';

    // 1. Standardinställningar
    const defaultSettings = {
        position: 'top-left',
        lang: 'en', // Standard till Engelska/Svenska
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
    let settings = typeof GM_getValue!== 'undefined'? GM_getValue('tum_settings', defaultSettings) : defaultSettings;
    settings = Object.assign({}, defaultSettings, settings);
    settings.sources = Object.assign({}, defaultSettings.sources, settings.sources);
    if (!settings.lang) settings.lang = 'sv'; // Säkerhetsåtgärd vid uppdatering från äldre version

    // 2. Språk och översättningar
    const i18n = {
        'sv': {
            bubbleText: '🔍 UserScript',
            promptText: 'The Ultimate Search Machine by SleepyyNet\n\nVad för typ av userscript letar du efter?',
            settingsTitle: 'Inställningar',
            posLabel: 'Bubblans position',
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

    // Hjälpfunktion för att snabbt hämta text på rätt språk
    const t = (key) => i18n[settings.lang][key];

    // 3. Skapa den flytande bubblan
    const bubble = document.createElement('div');
    bubble.textContent = t('bubbleText');
    bubble.style.position = 'fixed';
    bubble.style.background = 'black';
    bubble.style.color = 'white';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '50px';
    bubble.style.cursor = 'pointer';
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
        switch(settings.position) {
            case 'top-left': bubble.style.top = '10px'; bubble.style.left = '10px'; break;
            case 'top-center': bubble.style.top = '10px'; bubble.style.left = '50%'; bubble.style.transform = 'translate(-50%, 0)'; break;
            case 'top-right': bubble.style.top = '10px'; bubble.style.right = '10px'; break;
            case 'bottom-left': bubble.style.bottom = '10px'; bubble.style.left = '10px'; break;
            case 'bottom-center': bubble.style.bottom = '10px'; bubble.style.left = '50%'; bubble.style.transform = 'translate(-50%, 0)'; break;
            case 'bottom-right': bubble.style.bottom = '10px'; bubble.style.right = '10px'; break;
        }
    }

    applyPosition();
    document.body.appendChild(bubble);

    // 4. Sökfunktionen
    function searchAllDatabases(e) {
        if(e) e.preventDefault();

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
                if (typeof GM_openInTab!== "undefined") {
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
                <option value="sv" ${settings.lang === 'sv'? 'selected' : ''}>Svenska</option>
                <option value="en" ${settings.lang === 'en'? 'selected' : ''}>English</option>
            </select>

            <h3 style="font-size: 15px; margin-bottom: 8px;">${t('posLabel')}</h3>
            <select id="tum-position" style="width: 100%; padding: 8px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="top-left" ${settings.position === 'top-left'? 'selected' : ''}>${t('posTL')}</option>
                <option value="top-center" ${settings.position === 'top-center'? 'selected' : ''}>${t('posTC')}</option>
                <option value="top-right" ${settings.position === 'top-right'? 'selected' : ''}>${t('posTR')}</option>
                <option value="bottom-left" ${settings.position === 'bottom-left'? 'selected' : ''}>${t('posBL')}</option>
                <option value="bottom-center" ${settings.position === 'bottom-center'? 'selected' : ''}>${t('posBC')}</option>
                <option value="bottom-right" ${settings.position === 'bottom-right'? 'selected' : ''}>${t('posBR')}</option>
            </select>

            <h3 style="font-size: 15px; margin-bottom: 8px;">${t('srcLabel')}</h3>
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom: 25px;">
                <label style="cursor:pointer;"><input type="checkbox" id="src-greasyfork" ${settings.sources.greasyfork? 'checked' : ''}> Greasy Fork</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-sleazyfork" ${settings.sources.sleazyfork? 'checked' : ''}> Sleazy Fork (18+)</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-openuserjs" ${settings.sources.openuserjs? 'checked' : ''}> OpenUserJS</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-userscriptzone" ${settings.sources.userscriptzone? 'checked' : ''}> Userscript.Zone</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-scriptcat" ${settings.sources.scriptcat? 'checked' : ''}> ScriptCat</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-github" ${settings.sources.github? 'checked' : ''}> GitHub (.user.js)</label>
                <label style="cursor:pointer;"><input type="checkbox" id="src-gist" ${settings.sources.gist? 'checked' : ''}> Gist (GitHub)</label>
            </div>

            <div style="display:flex; justify-content: space-between;">
                <button id="tum-close" style="padding: 8px 15px; cursor:pointer; border:1px solid #999; border-radius:5px; background:#ddd; font-weight:bold;">${t('btnCancel')}</button>
                <button id="tum-save" style="padding: 8px 15px; background:blue; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">${t('btnSave')}</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('tum-close').onclick = () => overlay.remove();
        document.getElementById('tum-save').onclick = () => {

            // Spara det nya språket och alla val
            settings.lang = document.getElementById('tum-lang').value;
            settings.position = document.getElementById('tum-position').value;
            settings.sources.greasyfork = document.getElementById('src-greasyfork').checked;
            settings.sources.sleazyfork = document.getElementById('src-sleazyfork').checked;
            settings.sources.openuserjs = document.getElementById('src-openuserjs').checked;
            settings.sources.userscriptzone = document.getElementById('src-userscriptzone').checked;
            settings.sources.scriptcat = document.getElementById('src-scriptcat').checked;
            settings.sources.github = document.getElementById('src-github').checked;
            settings.sources.gist = document.getElementById('src-gist').checked;

            if(typeof GM_setValue!== 'undefined') {
                GM_setValue('tum_settings', settings);
            }

            // Uppdatera bubblans position och text direkt utan att behöva ladda om sidan
            applyPosition();
            bubble.textContent = i18n[settings.lang];

            overlay.remove();
        };
    }

    // 6. Interaktioner & Hover-effekter
    bubble.addEventListener('click', searchAllDatabases);
    bubble.addEventListener('contextmenu', openSettings);

    bubble.addEventListener('mouseenter', () => {
        bubble.style.background = 'darkred';
        bubble.style.opacity = '1';
    });

    bubble.addEventListener('mouseleave', () => {
        bubble.style.background = 'red';
        bubble.style.opacity = '0.25';
    });

    // Registrera i skripthanterarens sub-meny
    if (typeof GM_registerMenuCommand!== "undefined") {
        GM_registerMenuCommand(t('menuSearch'), searchAllDatabases);
        GM_registerMenuCommand(t('menuSettings'), openSettings);
    }

})();
