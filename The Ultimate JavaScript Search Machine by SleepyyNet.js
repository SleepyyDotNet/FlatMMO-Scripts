// ==UserScript==
// @name            The Ultimate JavaScript Search Machine by SleepyyNet
// @name:en         The Ultimate JavaScript Search Machine by SleepyyNet
// @name:sv         Den ultimata JavaScript-Sökmaskinen av SleepyyNet
// @namespace       https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:en    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:sv    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @version         1.5
// @version:en      1.5
// @version:sv      1.5
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
// @downloadURL     https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @updateURL       https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet.js
// @license         MIT
// ==/UserScript==

(function() {
    'use strict';

    // 1. Huvudfunktion för att samla in sökord och öppna flikar
    function searchAllDatabases() {
        let query = prompt("Search in The Ultimate JavaScript Search Machine:\nWhat type of script are you looking for?");
        
        if (!query) return;

        let encodedQuery = encodeURIComponent(query);

        // Lista med källor att söka igenom
        let searchUrls = [
            `https://greasyfork.org/sv/scripts?q=${encodedQuery}`,
            `https://sleazyfork.org/sv/scripts?q=${encodedQuery}`,
            `https://openuserjs.org/?q=${encodedQuery}`,
            `https://www.userscript.zone/search?q=${encodedQuery}`,
            `https://scriptcat.org/search?keyword=${encodedQuery}`,
            `https://github.com/search?q=${encodedQuery}+extension%3Auser.js&type=code`,
            `https://gist.github.com/search?q=${encodedQuery}`
        ];

        // Loopa igenom listan och öppna flikarna
        searchUrls.forEach(url => {
            if (typeof GM_openInTab!== "undefined") {
                GM_openInTab(url, { active: false, insert: true });
            } else {
                window.open(url, '_blank');
            }
        });
    }

    // 2. Skapa den flytande bubblan (UI)
    const bubble = document.createElement('div');
    bubble.textContent = '🔍 UserScript';
    bubble.style.position = 'fixed';
    bubble.style.top = '10px';
    bubble.style.left = '10px';
    bubble.style.background = 'black';
    bubble.style.color = 'white';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '50px';
    bubble.style.cursor = 'pointer';
    bubble.style.zIndex = '999999';
    bubble.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.3)';
    bubble.style.fontFamily = 'sans-serif';
    bubble.style.fontSize = '11px';
    bubble.style.fontWeight = 'bold';
    bubble.style.userSelect = 'none';
    
    // Nya rader för transparens och mjuk animation
    bubble.style.opacity = '0.25'; // Ca 75% transparent som standard
    bubble.style.transition = 'opacity 0.3s ease, background-color 0.3s ease'; 

    // Lägg till bubblan på webbsidan
    document.body.appendChild(bubble);

    // Koppla klick på bubblan till sökfunktionen
    bubble.addEventListener('click', searchAllDatabases);

    // Gör bubblan fullt synlig (100%) och lite mörkare blå när musen är över den
    bubble.addEventListener('mouseenter', () => {
        bubble.style.background = 'darkred';
        bubble.style.opacity = '1'; 
    });

    // Återgå till 75% transparens när musen lämnar
    bubble.addEventListener('mouseleave', () => {
        bubble.style.background = 'black';
        bubble.style.opacity = '0.25'; 
    });

    // 3. Registrera kommandot i skripthanterarens sub-meny
    if (typeof GM_registerMenuCommand!== "undefined") {
        GM_registerMenuCommand("🔍 Search with The Ultimate JavaScript Search Machine", searchAllDatabases);
    }

})();
