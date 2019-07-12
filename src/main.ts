///<reference path="../typings/pixi-particles.d.ts"/>
///<reference path="../typings/pixi-spine.d.ts"/>


import {StageManager} from "./core/StageManager";
import {BasicStageConfig} from "./config/BasicStageConfig";
import { IAssetsDictionary } from "./Application";
import { Model } from "./Model";
import {Example} from "./Example";


require("pixi.js");
require("pixi-spine");
require("pixi-particles");
require("gsap");
require("sat");


let stagemanager = new StageManager(document.body, new BasicStageConfig());

let assets: IAssetsDictionary = {
    "coin2": "animations/coin2.png",
    "coin3": "animations/coin3.png",
    "coin4": "animations/coin4.png",
    "coin5": "animations/coin5.png",
    "diamond": "animations/diamond.png",
    "bwInro": "animations/bw-intro.json",
    "bwNextLvl": "animations/bw-nextlvl.json"
};

let model = new Model();

//Entry point for your application. Just instantiate yor main class here.
let game = new Example(assets, model);