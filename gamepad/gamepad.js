// ==UserScript==
// @name         FlatMMO+ Gamepad
// @namespace    com.dounford.flatmmo.gamepad
// @version      0.0.1
// @description  Adds Gamepad Support on FlatMMO
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';
    const buttonNames = {
        xbox: {
            a: "A",
            b: "B",
            x: "X",
            y: "Y",
            l1: "LB",
            l2: "LT",
            l3: "LS",
            r1: "RB",
            r2: "RT",
            r3: "RS",
            back: "BACK",
            start: "START",
            up: "↑ (UP)",
            down: "↓ (DOWN)",
            left: "← (LEFT)",
            right: "→ (RIGHT)",
        },
        playstation: {
            a: "✖",
            b: "⃝",
            x: "◻",
            y: "△",
            l1: "L1",
            l2: "L2",
            l3: "L3",
            r1: "R1",
            r2: "R2",
            r3: "R3",
            back: "SELECT",
            start: "START",
            up: "↑ (UP)",
            down: "↓ (DOWN)",
            left: "← (LEFT)",
            right: "→ (RIGHT)",
        }
    };
 
    class GamepadPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("gamepad", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "rumbleDamage",
                        label: "Rumble on Damage",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "gamepadRemap",
                        label: "Remap Gamepad",
                        type: "panel",
                        panel: "gamepadRemap"
                    }
                ]
            });
            this.gamepad;
            this.inventorySlotSelected = 0;
            this.mapObjectSelected = 0;
            this.paths = [];
            this.currentPath = 0;
            this.mappings = {
                a: 0,
                b: 1,
                x: 2,
                y: 3,
                l1: 4,
                l2: 6,
                l3: 10,
                r1: 5,
                r2: 7,
                r3: 11,
                back: 8,
                start: 9,
                up: 12,
                down: 13,
                left: 14,
                right: 15,
            };
            this.buttonActions = {
                0: null,
                1: null,
                2: null,
                3: () => this.clickPath(),
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null,
                10: null,
                11: null,
                12: null,
                13: null,
                14: () => this.currentPath = (this.currentPath - 1 + this.paths.length) % this.paths.length,
                15: () => this.currentPath = (this.currentPath + 1 + this.paths.length) % this.paths.length,
            }
            this.buttonCooldowns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.commandCooldown = 200;
        }
        
        onLogin() {
            FlatMMOPlus.addPanel("gamepadMappins","Gamepad","content");

            window.addEventListener("gamepadconnected", (e) => {
                this.gamepad = e.gamepad.index;
            })
        }

        //Called when the player changes map
        onMessageReceived(data) {
            if(data.startsWith("SET_TELEPORT_TILES")) {
                this.currentPath = 0;
                this.joinPaths();
            }
        }
        
        //Called everytime something changes in the inventory
        onInventoryChanged() {
            this.changeInventorySelected();
        }

        onDamageTaken() {
            if(!this.config.rumbleDamage) {
                return
            }
            gamepad.vibrationActuator.playEffect("trigger-rumble", {
                startDelay: 0,
                duration: 250,
                weakMagnitude: 0,
                strongMagnitude: 0.5,
            });
        }

        //Called every frame after every other paint
        onPaint() {
            if(this.paths.length !== 0) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#ff0';
                this.paths[this.currentPath].forEach(tile => {
                    ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
                })
                ctx.globalAlpha = 1;
            }
            if(this.gamepad !== undefined) {
                this.checkButtons();
            }
        }

        checkButtons() {
            const now = Date.now();
            const btns = navigator.getGamepads()[this.gamepad].buttons;

            btns.forEach((btn, index) => {
                if(btn.pressed && this.buttonActions[index] !== null && now - (this.buttonCooldowns[index] || 0) > this.commandCooldown) {
                    this.buttonActions[index]();
                    this.buttonCooldowns[index] = now;
                }
            })
        }


        joinPaths() {
            const tileSet = new Set(teleport_tiles.map(t => `${t.x},${t.y}`));
            const visited = new Set();
            this.paths = [];

            for (const tile of teleport_tiles) {
                const key = `${tile.x},${tile.y}`;
                if (!visited.has(key)) {
                    const group = [];
                    const queue = [tile];
                    visited.add(key);

                    while (queue.length > 0) {
                        const current = queue.shift();
                        const neighbors = [
                            { x: current.x + 1, y: current.y },
                            { x: current.x - 1, y: current.y },
                            { x: current.x, y: current.y + 1 },
                            { x: current.x, y: current.y - 1 }
                        ];

                        for (const n of neighbors) {
                            const nKey = `${n.x},${n.y}`;
                            if (tileSet.has(nKey) && !visited.has(nKey)) {
                                visited.add(nKey);
                                queue.push(n);
                            }
                        }
                        group.push({x:current.x * 64, y: current.y * 64});
                    }
                    this.paths.push(group);
                }
            }
        }

        clickPath() {
            if(this.currentPath.length === 0) {
                return;
            }
            const path = this.paths[this.currentPath][0];
            FlatMMOPlus.sendMessage(`CLICKED_TILE=${path.x / 64}~${path.y / 64}`);
        }

        changeInventorySelected() {
            document.getElementById("ui-panel-inventory-content").children[this.inventorySlotSelected].style.cssText = "border: 2px solid #ff0000 !important; background: darkgrey;"
        }
        
    }
    
    const plugin = new GamepadPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();