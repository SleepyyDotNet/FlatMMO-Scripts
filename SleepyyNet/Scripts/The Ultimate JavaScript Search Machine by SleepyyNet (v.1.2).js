// ==UserScript==
// @name            The Ultimate JavaScript Search Machine by SleepyyNet
// @name:en         The Ultimate JavaScript Search Machine by SleepyyNet
// @name:sv         Den ultimata JavaScript-Sökmaskinen av SleepyyNet
// @namespace       https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:en    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @namespace:sv    https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/The Ultimate JavaScript Search Machine by SleepyyNet.js
// @version         1.2
// @version:en      1.2
// @version:sv      1.2
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
// @downloadURL     https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet%20(v.1.1).js
// @updateURL       https://raw.githubusercontent.com/SleepyyDotNet/FlatMMO-Scripts/refs/heads/greasyfork/SleepyyNet/Scripts/The%20Ultimate%20JavaScript%20Search%20Machine%20by%20SleepyyNet%20(v.1.1).js
// @license         MIT
// ==/UserScript==
​
(function() {
    'use strict';
​
    // Huvudfunktion för att samla in sökord och öppna flika
    function searchAllDatabases() {
        // Fråga användaren efter sökord
        let query = prompt("Search in The Ultimate JavaScript Search Machine:\nWhat type of script are you looking for?");
​
        // Avbryt om användaren klickar på 'Avbryt' eller lämnar tomt
        if (!query) return;
​
        // URL-koda söksträngen så att den fungerar i webbläsarens adressfält
        let encodedQuery = encodeURIComponent(query);
​
        // Definiera alla källor som ska sökas igenom
        //let searchUrls =;
        let searchUrls = [
            `https://greasyfork.org/en/scripts?q=${encodedQuery}`,
            `https://sleazyfork.org/en/scripts?q=${encodedQuery}`,
            `https://openuserjs.org/?q=${encodedQuery}`,
            `https://www.userscript.zone/search?q=${encodedQuery}`,
            `https://github.com/search?q=${encodedQuery}+language%3AJavaScript&type=repositories`,
            `https://gist.github.com/search?q=${encodedQuery}`
        ];
​
​
        // Loopa igenom listan och öppna varje sökning i en ny flik
        searchUrls.forEach(url => {
            // GM_openInTab tillåter oss att öppna flikar i bakgrunden utan att webbläsaren blockerar dem som popups
            GM_openInTab(url, { active: false, insert: true });
        });
    }
​
    // Registrera kommandot i tilläggets meny
    GM_registerMenuCommand("🔍 Search with The Ultimate JavaScript Search Machine", searchAllDatabases);
})();
