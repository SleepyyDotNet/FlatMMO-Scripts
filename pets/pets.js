// ==UserScript==
// @name         FlatMMO+ Pets
// @namespace    com.dounford.flatmmo.piggie
// @version      2.0
// @description  Adds custom Pets to the game
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';

 
    class pets extends FlatMMOPlusPlugin {
        constructor() {
            super("petsBuddy", {
                about: {
                    name: "FlatMMO+ Pets",
                    version: "2.0",
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
                        onChange: () => FlatMMOPlus.plugins.petsBuddy.updateSkins(),
                        options: []
                    },
                    {
                        id: "skin",
                        label: "Skin",
                        type: "select",
                        options: []
                    },
                    {
                        id: "randomize",
                        label: "Randomize Selected Pet",
                        type: "boolean",
                        default: false
                    },
                ]
            });

            this.currentPet = 1;
            this.currentSkin = 0,
            this.currentAction = "stand";
            this.pets = {}
            this.uploadIframe = null;
            
        }

        onConfigsChanged() {
            //Just to make sure that pet will be changed first
            Array.from(this.changedConfigs).sort().forEach(config => {
                switch(config) {
                    case "pet":
                        this.changePet(this.config.pet);
                        break;
                    case "skin":
                        this.changeSkin(this.config.skin)
                        break;
                }
            })
        }
        
        onPaint() {
            if(this.config.showPet === false) {return};
            if(FlatMMOPlus.loggedIn === false) {return};
            
            //This should not happen, but just in case the current action is not available
            if(!this.pets[this.currentPet].skins[this.currentSkin].animations.hasOwnProperty(this.currentAction)) {
                this.currentAction = "stand";
            }

            if (players[Globals.local_username].face_left) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.pets[this.currentPet].skins[this.currentSkin].animations[this.currentAction].get_frame(), -(players[Globals.local_username].client_x + 160), players[Globals.local_username].client_y - 25, 96, 96);
                ctx.restore();
            } else {
                ctx.drawImage(this.pets[this.currentPet].skins[this.currentSkin].animations[this.currentAction].get_frame(), players[Globals.local_username].client_x - 96, players[Globals.local_username].client_y - 25, 96, 96);
            }
            // 1 / 3600 / 60 | 1 in 1 hour with 60 fps
            if(this.config.randomize && Math.random() < 0.000004629) {
                this.randomizePet();
            }
        }
  
        onLogin() {
            this.addDefaultPets();
            this.loadDownloadedPets();
        }

        onActionChanged() {
            if(!this.pets.hasOwnProperty(1)) {return};
            if(this.pets[this.currentPet].skins[this.currentSkin].animations.hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }

        onCustomReceived(sender, script, command, payload) {
            if(sender === "dounbot" && command === "secretToken") {
                this.uploadIframe.postMessage({ type: 'secretToken', username: Globals.local_username, token: payload }, 'http://127.0.0.1:5500');
            }
        }

        addUI() {
            FlatMMOPlus.addPanel("petShop", "Pet Shop", `

            `, true);
            FlatMMOPlus.addPanel("petShopUpload", "Upload Pet", `
                <button onclick="FlatMMOPlus.plugins.petsBuddy.toggleIframe()">Toggle Pet Uploader (expensive)</button>
            `, false);
            document.getElementById("ui-panel-petShopUpload-content").style = "display: flex;flex-direction: column;"
        }

        toggleIframe(id) {
            if(this.uploadIframe) {
                this.uploadIframe.remove();
                this.uploadIframe = null;
            } else {
                const panel = document.getElementById("settings-modal-petShopUpload-panel");
                this.uploadIframe = document.createElement("iframe");
                this.uploadIframe.style = "border: none;flex-grow: 1;";
                let url = "http://127.0.0.1:5500/test.html";
                url = id ? `${url}?=petId=${id}` : url;
                this.uploadIframe.src = url;
                panel.append(this.uploadIframe);
                this.uploadIframe.onload = () => {
                    this.sendCustom("dounbot", "hash")
                }
            }
        }
        
        changePet(id) {
            this.currentPet = id;
            this.currentSkin = 0;
            this.currentAction = "stand";
            this.onActionChanged();
        }

        changeSkin(id) {
            if(this.pets[this.currentPet].skins.hasOwnProperty(id)) {
                this.currentSkin = 0;
                return;
            }
            this.currentSkin = id;
            this.currentAction = "stand";
            this.onActionChanged();
        }

        randomizePet() {
            const petArray = Object.keys(this.pets);
            const newIndex = Math.floor(Math.random() * petArray.length);
            const skinArray = Object.keys(this.pets[petArray[newIndex]].skins);
            const newSkinIndex = Math.floor(Math.random() * skinArray.length);
            this.changePet(petArray[newIndex]);
            this.changeSkin(skinArray[newSkinIndex]);
        }

        async downloadPet(id) {
            let response;
            try {
                response = await fetch("http://localhost:7830/pets/" + id);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const petObj = await response.json();
                petObj.animations = JSON.parse(petObj.animations);
    
                if(petObj.type === 1 && !this.pets.hasOwnProperty(petObj.requiredPet)) {
                    await this.downloadPet(petObj.requiredPet);
                }
    
                if(petObj.type === 0) {
                    this.addPet(petObj);
                } else {
                    this.addSkin(petObj);
                }
    
                let pets = [];
                if(localStorage.getItem("pets-downloadedPets")) {
                    pets = JSON.parse(localStorage.getItem("pets-downloadedPets"));
                }
                pets.push(petObj);
                localStorage.setItem("pets-downloadedPets", JSON.stringify(pets));
            } catch (err) {
                if(response.status === 404) {
                    //TBD show error
                    return;
                }
            }
        }

        loadDownloadedPets() {
            if(localStorage.getItem("pets-downloadedPets")) {
				const pets = JSON.parse(localStorage.getItem("pets-downloadedPets"));
                pets.forEach(pet => {
                    if(pet.type === 0) {
                        this.addPet(pet);
                    } else {
                        this.addSkin(pet);
                    }
                })
			}
        }

        removePet(id) {
            if(this.currentPet === id) {
                this.changePet(1);
            }
            delete this.pets[id];
            this.opts.config[1].options = this.opts.config[1].options.filter(p => p.value !== id);
            FlatMMOPlus.refreshPanel("plugins");
        }

        updateSkins() {
            const pet = document.getElementById("flatmmoplus-config-petsBuddy-pet").value;
            this.opts.config[2].options = [];
            for (let skin in this.pets[pet].skins) {
                this.opts.config[2].options.push({value: skin, label: this.pets[pet].skins[skin].name});
            }
            FlatMMOPlus.refreshPanel("plugins");
        }

        addPet(petObj) {
            const pet = {
                name: petObj.name,
                skins: {
                    0: {
                        name: "Default",
                        animations: this.newAnimations(petObj.id, petObj.name, petObj.animations)
                    }
                }
            }

            this.pets[petObj.id] = pet;

            this.opts.config[1].options.push({value: petObj.id, label: petObj.name});
        }

        async addSkin(petObj) {
            //0 = pet, 1 = skin
            //Skins require the pet
            if(petObj.type === 1 && !this.pets.hasOwnProperty(petObj.requiredPet)) {
                await this.downloadPet(petObj.requiredPet);
            }

            this.pets[petObj.requiredPet].skins[petObj.id] = {
                name: petObj.name,
                animations: this.newAnimations(petObj.id, petObj.name ,petObj.animations)
            }

            if(this.config.pet === petObj.requiredPet) {
                this.updateSkins();
            }
        }

        newAnimations(id, petName, animationNames) {
            const animations = {};
            for (let action in animationNames) {
                const sheet = [];
                const speed = animationNames[action].shift();
                animationNames[action].forEach(img => {
                    sheet.push(`http://localhost:7830/images/${id}/${img}.png`);
                })
                animations[action] = new AnimationSheetPlus(petName + action, animationNames[action].length, speed, sheet);
            }
            return animations;
        }

        addDefaultPets() {
            const pig = {
                type: 0,
                id: 1,
                name: "Piggy",
                animations: {
                    stand: [50, "piggy-stand-a1a277d4-fbd7-4506-8c4a-f77d9a8cb38e","piggy-stand-b043b32e-cb9e-46dd-b7ec-4b5178d190bb"],
                    walk: [10, "piggy-walk-1baeb892-f70b-4125-8c40-6b374f41c14c", "piggy-walk-16a40417-19aa-466b-a6ee-c409d9b404aa", "piggy-walk-bee44f7d-5b72-40c9-ab5c-2341b84ca8fc", "piggy-walk-32b2ad99-4eb7-4cbf-9806-a71147494283"],
                    // attack: [20],
                    // fishing_net: [25],
                    // fishing_rod: [25],
                    // harpoon: [25],
                    // mine_rock: [15],
                    // chop_tree: [20]
                }
            }
            const pigHalloween = {
                type: 1,
                id: 2,
                requiredPet: 1,
                name: "Halloween",
                animations: {
                    stand: [50, "piggy-2-stand-0916944a-acfb-4abf-832c-3454cd832017", "piggy-2-stand-2235e326-a791-4ac3-8c25-b55aa9bd2cc7"],
                }
            }
            const pigChristmas = {
                type: 1,
                id: 3,
                requiredPet: 1,
                name: "Christmas",
                animations: {
                    stand: [50, "piggy-3-stand-537aa72a-e3f1-43d4-9cae-ece58f88fac2", "piggy-3-stand-ee3a688b-92e4-4ab6-8895-b23815884c4f"],
                    walk: [10, "piggy-3-walk-b00e8e10-c9f5-459a-ab83-ec16c5073ba0", "piggy-3-walk-649d42d0-5853-41f3-bff2-20d46fab94fe", "piggy-3-walk-3344f9f1-f1b1-4d47-824e-50a96eb3e708", "piggy-3-walk-c13d447d-1022-44d3-914e-22073db965db"],
                    //attack: [20],
                    //fishing_net: [25],
                    //fishing_rod: [25],
                    //harpoon: [25],
                    //mine_rock: [15],
                    //chop_tree: [20]
                }
            }

            this.addPet(pig);
            //this.addSkin(pigHalloween);
            //this.addSkin(pigChristmas);
        }
    }
 
    const plugin = new pets();
    FlatMMOPlus.registerPlugin(plugin);
 
})();