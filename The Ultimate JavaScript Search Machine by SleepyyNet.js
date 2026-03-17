// ==UserScript==
// @name            The Ultimate JavaScript Search Machine by SleepyyNet
// @name:en         The Ultimate JavaScript Search Machine by SleepyyNet
// @name:se         Den ultimata JavaScript-sökmaskinen av SleepyyNet
// @namespace       http://tampermonkey.net/
// @namespace:en    http://tampermonkey.net/
// @namespace:se    http://tampermonkey.net/
// @version         1.1
// @version:en      1.1
// @version:sv      1.1
// @description     A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:en  A powerful metasearch tool that searches all major userscript repositories (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) simultaneously.
// @description:se  Ett kraftfullt metasök-verktyg som söker igenom alla stora arkiv för användarskript (Greasy Fork, Sleazy Fork, OpenUserJS, Userscript.Zone, GitHub & Gist) samtidigt.
// @author          SleepyyNet
// @match           *://*/*
// @include         *
// @match           *:///*
// @match           *://*/*/*
// @match           *://*/*/*
// @match           https://*/
// @match           http://*/*
// @match           https://*.google.*/*
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// ==/UserScript==
​
(function() {
    'use strict';
​
    // Huvudfunktion för att samla in sökord och öppna flika
    function searchAllDatabases() {
        // Fråga användaren efter sökord
        let query = prompt("Sök i The Ultimate Machine:\nVad för typ av script letar du efter?");
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
    GM_registerMenuCommand("🔍 Sök med The Ultimate Machine", searchAllDatabases);
})();
