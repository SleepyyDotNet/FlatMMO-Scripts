// ==UserScript==
// @name         FlatMMO+ Map Updater
// @namespace    com.dounford.flatmmo.map
// @version      0.0.2
// @description  FlatMMO+ Interactive Map Updater
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class MapUpdaterPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("mapUpdater", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: []
            });
            this.loaded = false;
            this.maps = {};
            this.paths = [];
            this.objects = {};
            this.npcs = {};
            this.lastTile = null;
        }

        //Run this function when the login is completed, if the plugin is loaded after login it will run as soon as possible
        async onLogin() {
            // try {
            //     const response = await fetch("https://flatmmo.wiki/custom/proxyImages.php?url=https://flatmmo.wiki/index.php/MediaWiki:Maps.json?action=raw&ctype=text/javascript")
            //     this.maps = await response.json();
            //     console.log("Maps loaded")
            //     this.loaded = true;
            // } catch (error) {
            //     console.error(error.message);
            // }
        }
        
        onMessageSent(message) {
            if(message.startsWith("CLICKED_TILE")){
                [x, y] = message.slice(13).split("~");
                this.lastTile = {
                    x,
                    y
                }
            }
        }
        
        //Receives all messages sent by the game server
        onMessageReceived(data) {
            // Will spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onMessageReceived: ", data);
        }
        
        //Called when the player changes map
        onMapChanged(mapBefore, mapAfter) {
            this.createMap();
            const teleported = Object.entries(this.maps[mapBefore].paths).find(path => {
                return path[1].tiles.find(tile => {
                    return tile.x === this.lastTile.x && tile.y === this.lastTile.y
                })
            })
            if(teleported) {
                this.maps[mapBefore].paths[teleported[0]].destination = mapAfter;
            }

            
            
        }

        onMessageReceived(data) {
            this.createMap();
            if(data.startsWith("SET_TELEPORT_TILES")) {
                this.joinPaths();
                if(Object.keys(this.maps[current_map].paths).length !== this.paths.length) {
                    this.paths.forEach(path => {
                        const id = this.getId(path);
                        if(!this.maps[current_map].paths[id]) {
                            this.maps[current_map].paths[id] = {
                                tiles: path,
                                destination: ""
                            }
                        }
                    })
                }
            }
        }

        createMap() {
            if(typeof current_map !== "undefined" && !this.maps[current_map]) {
                this.maps[current_map] = {
                    ingameId: current_map,
                    displayName: "",
                    upperImg: maps[current_map]?.upper_image !== undefined,
                    height: 14,
                    width: 24,
                    paths: {},
                    structures: [],
                    objects: [],
                    npcs: []
                }
            }
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
                        group.push({x:current.x, y: current.y});
                    }
                    this.paths.push(group);
                }
            }
        }

        getId(path) {
            const ids = path.map(p => p.x + (p.y * 24)).sort((a, b) => a - b);
            return ids.join('-');
        };

        getObjects() {
            map_objects.forEach(object => {
                const name = obj.filename;
                name = name.replace("_opened", "");
                if(name.includes("dig_spot")) {
                    return;
                }
                let isTp = false;
                if(name.includes("boat") || name.includes("ship") || name.includes("entrance") || name.includes("ladder") || name.includes("door")) {
                    isTp = true;
                }
                if(!this.objects[name]) {
                    obj = {
                        label: this.toTitleCase(name),
                        description: "",
                        itemPage: this.toTitleCase(name),
                    }
                    if(object.contains_upper_layer_images) {
                        obj.upper = true;
                    }
                    if(object.contains_shadow_layer_images) {
                        obj.shadow = true;
                    }
                    if(object.contains_lower_layer_images === false) {
                        obj.noLower = true;
                    }
                    if(object.tile_width !== 1) {
                        obj.height = object.tile_width * 64
                    }
                    if(object.tile_height !== 1) {
                        obj.height = object.tile_height * 64
                    }
                    if(isTp) {
                        obj.noInspect = true;
                    }
                    this.objects[name] = obj;
                }
                this.maps[current_map].objects.push({
                    name,
                    x: objects.x,
                    y: objects.y
                })

                if(isTp) {
                    this.paths.push({
                        x1: object.x,
                        y1: object.y,
                        x2: object.x + object.tile_width - 1,
                        y2: object.y + object.tile_height - 1,
                        destination: ""
                    })
                }
            });
        }
        
        toTitleCase(text) {
            text.split("_").map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(" ");
        }
    }
    
    const plugin = new MapUpdaterPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();