// ==UserScript==
// @name         FlatMMO+ SamplePlugin
// @namespace    com.dounford.flatmmo.sample
// @version      0.0.2
// @description  FlatMMO+ Template Script
// @author       Anwinity ported by Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';

    /**
     * Chat Object received onChat
     * @typedef {Object} ChatData
     * @property {string} username
     * @property {string} tag
     * @property {string} sigil
     * @property {string} color
     * @property {string} message
     * @property {boolean} yell
     */
 
    class SamplePlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("sample", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "record",
                        label: "Record the Game",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "chat",
                        label: "Capture chat",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "chat",
                        label: "Capture Other Players",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "chat",
                        label: "Capture Pets",
                        type: "boolean",
                        default: true
                    },
                ]
            });
            this.recording = false;
            this.lastNpcs = [];
            this.lastPlayers = {};

            this.events = [
                {
                    type: "",
                    timestamp: "",
                    data: {}
                }
            ]
        }

        
        
        onConfigsChanged() {
            console.log("SamplePlugin.onConfigsChanged");
        }
        
        //Run this function when the login is completed, if the plugin is loaded after login it will run as soon as possible
        onLogin() {
            console.log("SamplePlugin.onLogin");
        }
        
        /**
         * Receives all messages sent by the game server
         * @param {string} data 
         */
        onMessageReceived(data) {
            if(data.startsWith("NPCS=")) {
                const split = data.substring(5).split("~");

                if(this.lastNpcs.length === 0) {
                    this.lastNpcs = split;
                    return;
                }

                const changes = {};

                for (let i = 0; i < split.length; i++) {
                    const stat = split[i];

                    if(this.lastNpcs[i] !== stat)
                    
                }
            }
        }
        
        /**
         * This is called on pm, local and global chat messages
         * @param {ChatData} data 
         */
        onChat(data) {
            //This is how data is passed:
            const chatData = {
                username: "felipe",
                tag: "investor",
                sigil: "images/ui/gift_sigil.png",
                color: "white",
                message: "This is a message",
                yell: false
            }
            // Could spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onChat", data);
        }
        
        //Called on UI panel switches
        onPanelChanged(panelBefore, panelAfter) {
            console.log("SamplePlugin.onPanelChange", panelBefore, panelAfter);
        }
        
        //Called when the player changes map
        onMapChanged(mapBefore, mapAfter) {
            // console.log("SamplePlugin.onMapChange", mapBefore, mapAfter);
            this.lastNpcs = [];
            this.lastPlayers = {};
        }
        
        //Called everytime something changes in the inventory
        onInventoryChanged(inventoryBefore, inventoryAfter) {
            //It sends the full inventory even if you just got one item
            //It spams the console each time any modification happens
            // console.log("SamplePlugin.onInventoryChange", inventoryBefore, inventoryAfter);
        }

        //Called when the player engages in a fight
        onFightStarted() {

        }

        //Called when the player was fighting but starts doing other action, this can have a little delay
        onFightEnded() {

        }

        //Called when the player animation changes
        onActionChanged() {
            console.log(FlatMMOPlus.currentAction);
        }

        //Called every frame after every other paint
        onPaint() {

        }

        //Called every frame between paint_layer_1 and paint_map_objects_lower_shadows
        onPaintObjects() {

        }

        //Called every frame between paint_ground_items and paint_npcs
        onPaintNpcs() {

        }
        
        //These are used inside functions instead of being called directly by FMP
        additionalMethods() {
            //content can be html text or a function that returns html text
            FlatMMOPlus.addPanel("id","Title","content");

            //Sends messages to game server
            FlatMMOPlus.sendMessage("message");

            //You can have screen notifications
            //FlatMMOPlus.addNotification(notificationName, imageSrc, title, text, ticks, textColor);
            FlatMMOPlus.addNotification("test", "https://flatmmo.com/images/ui/hp_med.png", "TEST", "I'm a message", 18000, "blue");

            const sheet = new AnimationSheetPlus("name", 5, "", 50, ["url.png","url2.png", "..."])
        }
        
        
    }
    
    const plugin = new SamplePlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();