// ==UserScript==
// @name         FlatMMO+ Pets
// @namespace    com.dounford.flatmmo.piggie
// @version      1.6.2
// @description  Adds custom Pets to the game
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Pets.user.js
// @updateURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Pets.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

 
    class pets extends FlatMMOPlusPlugin {
        constructor() {
            super("petsBuddy", {
                about: {
                    name: "FlatMMO+ Pets",
                    version: "1.6.2",
                    author: "Dounford",
                    description: "Adds custom Pets to the game"
                },
                config: [
                    {
                        id: "showPet",
						label: "Show Pet",
						type: "boolean",
						default: true
					},
                    {
                        id: "pet",
                        label: "Pet",
                        type: "select",
                        options: [
                            {
                                value: "ogPig",
                                label: "Original Pig"
                            },
                            {
                                value: "blackSlimeCat",
                                label: "Black Slime Cat"
                            },
                            {
                                value: "coolPizza",
                                label: "Cool Pizza"
                            },
                            {
                                value: "calicoSlimeCat",
                                label: "Calico Slime Cat"
                            },
                            {
                                value: "whiteSlimeCat",
                                label: "White Slime Cat"
                            },
                            {
                                value: "pumpkin",
                                label: "Pumpking"
                            },
                            {
                                value: "pizza",
                                label: "Pizza"
                            },
                            {
                                value: "capybara",
                                label: "Capybara"
                            },
                            {
                                value: "beer",
                                label: "Beer"
                            },
                            {
                                value: "gingerbreadMan",
                                label: "Gingerbread Man"
                            },
                            {
                                value: "pig",
                                label: "Pig"
                            },
                            {
                                value: "snowman",
                                label: "Snowman"
                            },
                            {
                                value: "reindeer",
                                label: "Reindeer"
                            },
                            {
                                value: "redPresent",
                                label: "Red Present"
                            },
                            {
                                value: "bluePresent",
                                label: "Blue Present"
                            },
                            {
                                value: "cupcake",
                                label: "Cupcake"
                            },
                            {
                                value: "ogCapybara",
                                label: "Original Capybara"
                            },
                            {
                                value: "ogBeer",
                                label: "Original Beer"
                            },
                            {
                                value: "wolf",
                                label: "Wolf"
                            },
                        ]
                    },
                    {
                        id: "randomize",
                        label: "Randomize Selected Pet",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "event",
                        label: "Event Skin",
                        type: "select",
                        options: [
                            {
                                value: "",
                                label: "None"
                            },
                            {
                                value: "halloween",
                                label: "Halloween"
                            },
                            {
                                value: "christmas",
                                label: "Christmas"
                            }
                        ]
                    }
                ]
            });

            this.currentPet = "ogPig";
            this.currentAction = "stand";
            this.pets = {};
            this.loaded = false;
        }

        onConfigsChanged() {
            this.changePet(this.config["pet"]);
        }
        
        onPaint() {
            if(this.config["showPet"] === false) return;
            if(this.loaded === false) return;
            if(!this.pets.hasOwnProperty(this.currentPet)) return;
            if(!this.pets[this.currentPet].hasOwnProperty(this.currentAction)) {
                this.currentAction = "stand";
            }
            //Draw pig
            const sheet = this.pets[this.currentPet][this.currentAction];
            const frame = sheet.get_frame();

            if (!frame || !frame.complete || frame.naturalWidth === 0) return;

            if (players[Globals.local_username].face_left) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(frame, -(players[Globals.local_username].client_x + 160), players[Globals.local_username].client_y - 25, sheet.width, sheet.height);
                ctx.restore();
            } else {
                ctx.drawImage(frame, players[Globals.local_username].client_x - 96, players[Globals.local_username].client_y - 25, sheet.width, sheet.height);
            }
            if(this.config.randomize && Math.random() < 0.0000046296296296296296) {
                this.randomizePet();
            }
        }
 
        
        onLogin() {
            this.addPets();
        }

        onActionChanged() {
            if(!this.pets.hasOwnProperty("pig")) {return};
            if(this.pets[this.currentPet].hasOwnProperty("stand_" + this.config.event)) {
                if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction + "_" + this.config.event)) {
                    this.currentAction = FlatMMOPlus.currentAction + "_" + this.config.event;
                } else {
                    this.currentAction = "stand_" + this.config.event;
                }
            } else if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }
        
        changePet(pet) {
            this.currentPet = pet;
            this.currentAction = "stand";
            this.onActionChanged();
        }

        randomizePet() {
            const petArray = Object.keys(this.pets);
            const newIndex = Math.floor(Math.random() * petArray.length);
            this.changePet(petArray[newIndex])
        }

        async addPet(pet) {
            if(!this.pets.hasOwnProperty(pet.name)) {
                this.pets[pet.name] = {};
            }
            for(let i = 0; i < pet.animations.length; i++) {
                const animation = pet.animations[i];
                if(Array.isArray(animation)) {
                    await this.registerAnimation(pet.name, animation[0], animation[2] || 2, animation[1]);
                } else {
                    await this.registerAnimation(pet.name, animation, 2, pet.speed);
                }
            }
        }
        
        async addSkin(pet, eventName) {
            if(!this.pets.hasOwnProperty(pet)) return;
            //Halloween only has stand animations
            if(eventName === "halloween") {
                await this.registerAnimation(pet,"stand_halloween", this.pets[pet].stand.FRAMES, this.pets[pet].stand.SPEED);
                return;
            }
            const animations = Object.entries(this.pets[pet]);
            for (let i = 0; i < animations.length; i++) {
                const animation = animations[i];
                await this.registerAnimation(pet, animation[0] + "_" + eventName, animation[1].FRAMES, animation[1].SPEED);
            }
        }
        
        async addPets() {
            const defaultPets = [
                {name: "beer", animations: [["stand", 25, 1]], speed: 25},
                {name: "blackSlimeCat", animations: ["stand", ["walk", 10], ["attack", 20]], speed: 50, christmas: true},
                {name: "bluePresent", animations: [["stand", 25, 1]], speed: 25},
                {name: "calicoSlimeCat", animations: ["stand", ["walk", 10], ["attack", 20]], speed: 50, christmas: true},
                {name: "capybara", animations: [["stand", 25, 1]], speed: 25},
                {name: "coolPizza", animations: [["stand", 25, 1]], speed: 25},
                {name: "cupcake", animations: [["stand", 25, 1]], speed: 25},
                {name: "gingerbreadMan", animations: ["stand"], speed: 25},
                {name: "ogBeer", animations: ["stand"], speed: 25, halloween: true, christmas: true},
                {name: "ogCapybara", animations: ["stand"], speed: 50, halloween: true, christmas: true},
                {name: "ogPig", animations: [["stand", 50], ["walk", 10, 4], ["attack", 20], "fishing_net", "fishing_rod", "harpoon", ["mine_rock", 15], ["chop_tree", 20]], speed: 25, halloween: true, christmas: true},
                {name: "pig", animations: [["stand", 25, 1]], speed: 25},
                {name: "pizza", animations: ["stand"], speed: 50, halloween: true, christmas: true},
                {name: "pumpkin", animations: ["stand"], speed: 50, christmas: true},
                {name: "redPresent", animations: [["stand", 25, 1]], speed: 25},
                {name: "reindeer", animations: ["stand"], speed: 50},
                {name: "snowman", animations: ["stand"], speed: 50},
                {name: "whiteSlimeCat", animations: ["stand", ["walk", 10], ["attack", 20]], speed: 50, christmas: true},
                {name: "wolf", animations: [["stand", 25, 1]], speed: 25},

            ]
            for(let i = 0; i < defaultPets.length; i++) {
                const pet = defaultPets[i];
                await this.addPet(pet);
                if(pet.christmas) await this.addSkin(pet.name, "christmas");
                if(pet.halloween) await this.addSkin(pet.name, "halloween");
            }
            this.loaded = true;
        }

        async registerAnimation(pet, animation, frames, speed) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/pets/images/${pet}/${animation}${i}.png?v=${this.opts.about.version}`);
            }
            const sheet = await new AnimationSheetPlus(pet + animation, frames, speed, animations, true);
            const firstImage = sheet.images[0]

            if (firstImage && firstImage.complete && firstImage.naturalWidth > 0 && firstImage.naturalHeight > 0) {
                if(firstImage.width > firstImage.height) {
                    const aspect = firstImage.width / firstImage.height;
                    sheet.width = 96;
                    sheet.height = 96 / aspect;
                } else {
                    const aspect = firstImage.height / firstImage.width;
                    sheet.height = 96;
                    sheet.width = 96 / aspect;
                }
            } else {
               sheet.width = 96;
                sheet.height = 96;
            }
            this.pets[pet][animation] = sheet;
        }
    }
 
    const plugin = new pets();
    FlatMMOPlus.registerPlugin(plugin);
 
})();