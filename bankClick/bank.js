// ==UserScript==
// @name         FlatMMO+ Bank Click
// @namespace    com.dounford.flatmmo.bankclick
// @version      1.0.2
// @description  Adds configurable withdraw amount of items on click
// @author       Liam
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==

(function() {
    'use strict';
 
    class BankClickPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("bankClick", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "shift",
                        label: "Shift",
                        type: "integer",
                        default: 1
                    },
                    {
                        id: "ctrl",
                        label: "Control",
                        type: "integer",
                        default: 10
                    },
                    {
                        id: "alt",
                        label: "Alt",
                        type: "integer",
                        default: 25
                    },
                    {
                        id: "meta",
                        label: "Meta/Windows Key",
                        type: "integer",
                        default: 50
                    },
                ]
            });
        }
        StorageClick(e) {
            const itemEl = e.target.closest("[data-bank-item-name]");
            if(!itemEl) return;
            const amount = e.ctrlKey ? this.config.ctrl :
                e.shiftKey ? this.config.shift :
                e.altKey ? this.config.alt :
                e.metaKey ? this.config.meta : 0;
            const current_amount = itemEl.getAttribute("data-bank-item-amount");
            const item = itemEl.getAttribute("data-bank-item-name");

            if(current_amount == 0) {
                open_confirmation_modal("Placeholder", "images/items/" + item + ".png", "Remove " + item.split("_").join(" ") + " placeholder?<br /><br /><hint>Note that right clicking a placeholder will remove it automaticaly.</hint>", "Yes", "No", "BANK_REMOVE_PLACEHOLDER=" + item);
            } else if(amount > 0) {
                FlatMMOPlus.sendMessage(`WITHDRAW_FROM_BANK=${item}~${amount}`);
            } else if(withdraw_as_notes) {
                open_input_integer_dialogue(item, "Enter Amount", "images/items/" + item + ".png", current_amount, "WITHDRAW_FROM_BANK_NOTES");
            } else {
                open_input_integer_dialogue(item, "Enter Amount", "images/items/" + item + ".png", current_amount, "WITHDRAW_FROM_BANK");
            }
        }

        StorageContext(e) {
            const itemEl = e.target.closest("[data-bank-item-name]");
            if(!itemEl) return;
            e.preventDefault();
            const item = itemEl.getAttribute("data-bank-item-name");
            FlatMMOPlus.sendMessage('RIGHT_CLICKED_WITHDRAW_BANK=' + item);
        }
        
        onLogin() {
            const storage = document.getElementById("storage-item");
            storage.addEventListener("click", (e) => this.StorageClick(e));
            storage.addEventListener("contextmenu", (e) => this.StorageContext(e));


            refresh_bank = function() {
                let storage = document.getElementById("storage");
                let catergories = storage.querySelectorAll('[data-bank-category]');
                for(let i = 0; i < catergories.length; i++) {
                    catergories[i].innerHTML = "";
                }
                let filter_by_tab_category = false;
                if(selected_bank_tab != 1) {
                    filter_by_tab_category = true;
                }
                let last_category = null;
                for(let i = 0; i < bank_items.length; i++) {
                    let obj = bank_items[i];
                    let item = obj.name;
                    let amount = obj.value;
                    let category = obj.category;
                    
                    // different category
                    if(filter_by_tab_category) {
                        if(category != selected_bank_tab) {
                            continue;
                        }
                    }
                    
                    let content = document.getElementById("storage-item")

                    if(!filter_by_tab_category && last_category !== null && category != last_category) {
                        content.append(document.createElement('hr'));
                    }
                    last_category = category;

                    let div = document.createElement('div');
                    if(amount == 0) {
                        div.style.opacity = 0.2;
                    }
                    div.setAttribute('data-bank-item-name', item);
                    div.setAttribute('data-bank-item-amount', amount);
                    div.style.backgroundColor = "#e1e1e1";
                    div.classList.add('tooltip')
                    div.classList.add('item')
                    div.setAttribute('draggable', 'true');
                    div.addEventListener('dragstart', function(event) {
                        event.dataTransfer.setData('text/plain', item);
                    });

                    //img
                    let img = document.createElement('img');
                    img.src = 'images/items/' + item + '.png';
                    img.classList.add('hover')
                    img.setAttribute('draggable', 'false');

                    //amount
                    let span = document.createElement('span');
                    span.classList.add('item-amount')
                    span.innerHTML = display_amount_abbreviaton(amount);
                    div.append(span);
                    div.append(img);

                    let tooltip_content =  document.createElement('span');
                    tooltip_content.classList.add('tooltiptext')
                    let tooltip_postfix = "";
                    if(amount > 1) {
                        tooltip_postfix = " <span class='color-yellow'>(" + format_number(amount) + ")</span>";
                    }
                    tooltip_content.innerHTML = item.split("_").join(" ").toUpperCase() + tooltip_postfix;
                    div.append(tooltip_content);
                    content.append(div);
                }
            };
        }
    }
    
    const plugin = new BankClickPlugin();
    FlatMMOPlus.registerPlugin(plugin);
})();