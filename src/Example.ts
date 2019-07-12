import { Application, IAssetsDictionary } from "./Application";
import { Model } from "./Model";
import { TweenMax, Linear } from "gsap";
import particles = require('pixi-particles');

/**
* Class description
*
* created on 2017-04-19
* @author jowa
*/
export class Example extends Application {


    private model: Model;
    private amountInTickup: number;
    private tickupLevel: number;
    private nextTickUpState: string;
    private tickupTween: TweenMax;
    private bgTextTween: TweenMax;
    private bgMeterTextTween: TweenMax;
    private bigWinAmt: number;
    private megaWinAmt: number;
    private superMegaWinAmt: number;
    private bgContainer: PIXI.Container;
    private bgText: PIXI.Text;
    private bgMeterText: PIXI.Text;
    private bwIntro: PIXI.extras.AnimatedSprite;
    private bwNextLvl: PIXI.extras.AnimatedSprite;
    private tickerValue: PIXI.Text;

    private static _gameText = {
        BIG_WIN_TEXT: "BIG WIN",
        MEGA_WIN_TEXT: "MEGA WIN",
        SUPER_MEGA_WIN_TEXT: "SUPER MEGA WIN"
    }

    private static _constants = {
        BigWinState: "bigWin",
        MegaWinState: "megaWin",
        SuperMegaWinState: "superMegaWin",
        CompleteState: "complete",
        BigWinMultiplier: 15,
        MegaWinMultiplier: 30,
        SuperMegaWinMultiplier: 60,
        BigWinTickUpTime: 3,
        MegaWinTickUpTime: 3,
        SuperMegaWinTickUpTime: 4,
    }

    constructor(assets: IAssetsDictionary, model: Model) {
        super(assets, "../media/");
        this.model = model;
    }

    private subscribeEvents(): void {
        this._backgroundLayer.interactive = true;
        this._backgroundLayer.on("click", this.onStageClick, this);
    }

    private onStageClick(): void {
        if (this.model.getIsBigWinRunning()) {
            this.abortBigWin();
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 32:
                if (this.model.getIsBigWinRunning()) {
                    this.abortBigWin();
                }
                break;
        }
    }

    protected initAnimations(): void {
        super.initAnimations();
        this.subscribeEvents();
        this.initTickerText();
        this.initializeBigWin();
        if (this.model.getCurrentWinAmt() >= Example._constants.BigWinMultiplier * this.model.getTotalBet()) {
            this.showBigWin();
        }
    }

    private initTickerText(): void {
        this.tickerValue = new PIXI.Text("0");
        this.tickerValue.visible = false;
    }

    private initializeBigWin(): void {
        let bgTextStyle: PIXI.TextStyleOptions = {
            "fontFamily": "Futura LT",
            "fontSize": "72px",
            "fontWeight": "400",
            "fill": "#f7f18a"
        };
        this.amountInTickup = 0;
        this.tickupLevel = 0;

        this.bgContainer = new PIXI.Container();
        this.bgContainer.pivot.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bgContainer.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bgContainer.visible = false;
        this._foregroundLayer.addChild(this.bgContainer);


        this.bgText = new PIXI.Text(Example._gameText.BIG_WIN_TEXT, bgTextStyle);
        this.bgText.anchor.set(0.5, 0.5);
        this.bgText.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5 - 210);
        this.bgContainer.addChild(this.bgText);

        this.bgMeterText = new PIXI.Text(this.model.getCurrency() + (this.amountInTickup / 100).toFixed(2), bgTextStyle);
        this.bgMeterText.anchor.set(0.5, 0.5);
        this.bgMeterText.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5 + 210);
        this.bgContainer.addChild(this.bgMeterText);

        this.bwIntro = new PIXI.extras.AnimatedSprite(this.getTextures("bwInro"));
        this.bwIntro.anchor.set(0.5, 0.5);
        this.bwIntro.scale.set(0.75, 0.75);
        this.bwIntro.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bwIntro.loop = false;
        this.bwIntro.animationSpeed = 0.40;
        this.bwIntro.visible = false;
        this._foregroundLayer.addChild(this.bwIntro);

        this.bwNextLvl = new PIXI.extras.AnimatedSprite(this.getTextures("bwNextLvl"));
        this.bwNextLvl.anchor.set(0.5, 0.5);
        this.bwNextLvl.scale.set(0.75, 0.75);
        this.bwNextLvl.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bwNextLvl.loop = false;
        this.bwNextLvl.animationSpeed = 0.40;
        this.bwNextLvl.visible = false;
        this._foregroundLayer.addChild(this.bwNextLvl);
    }

    private playBigWinIntroAnim(): void {
        if (this.tickupLevel === 1) {
            this.nextTickUpState = Example._constants.CompleteState;
        } else {
            this.nextTickUpState = Example._constants.MegaWinState;
        }
        this.bgContainer.visible = false;
        this.bwNextLvl.visible = false;
        this.bwIntro.visible = true;
        this.bwIntro.play();
        this.bwIntro.onComplete = () => {
            this.startBigWin();
        };
    }

    private stopBigWinIntroAnim(): void {
        this.bwIntro.visible = false;
        this.bwIntro.gotoAndStop(0);
    }

    private playBigWinNextLvlAnim(): void {
        this.bwIntro.visible = false;
        this.bwNextLvl.visible = true;
        this.bwNextLvl.gotoAndStop(0);
        this.bwNextLvl.play();
    }

    private stopBigWinNextLvlAnim(): void {
        this.bwNextLvl.visible = true;
        this.bwNextLvl.gotoAndStop(0);
    }

    private startBigWin(): void {
        this.bgText.scale.set(0.9, 0.9);
        this.bgMeterText.scale.set(0.9, 0.9);
        this.bgContainer.visible = true;
        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.30, {
            x: 1.2, y: 1.2, ease: Linear.easeInOut, onComplete: () => {
                this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                    x: 1, y: 1, ease: Linear.easeInOut
                });
            }
        });
        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.30, {
            x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                        this.tickupTween = TweenMax.to(this.tickerValue, Example._constants.BigWinTickUpTime, {
                            text: this.bigWinAmt, ease: Linear.easeInOut, onUpdate: () => {
                                this.bgMeterText.text = this.model.getCurrency() + (Number(this.tickerValue.text) / 100).toFixed(2);
                            }, onComplete: () => {
                                this.updateBigwinTickup();
                            }
                        });
                    }
                });
            }
        });
        this.playBigWinNextLvlAnim();
    }

    private startMegaWin(): void {
        if (this.tickupLevel === 2) {
            this.nextTickUpState = Example._constants.CompleteState;
        } else {
            this.nextTickUpState = Example._constants.SuperMegaWinState;
        }
        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgText.text = Example._gameText.MEGA_WIN_TEXT;
                this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                    x: 1.2, y: 1.2, ease: Linear.easeInOut, onComplete: () => {
                        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut
                        });
                    }
                });
            }
        });

        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                                this.tickupTween = TweenMax.to(this.tickerValue, Example._constants.MegaWinTickUpTime, {
                                    text: this.megaWinAmt, ease: Linear.easeInOut, onUpdate: () => {
                                        this.bgMeterText.text = this.model.getCurrency() + (Number(this.tickerValue.text) / 100).toFixed(2);
                                    }, onComplete: () => {
                                        this.updateBigwinTickup();
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
        this.playBigWinNextLvlAnim();
    }

    private startSuperMegaWin(): void {
        this.nextTickUpState = Example._constants.CompleteState;
        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgText.text = Example._gameText.SUPER_MEGA_WIN_TEXT;
                this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                    x: 1.2, y: 1.2, ease: Linear.easeInOut, onComplete: () => {
                        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut
                        });
                    }
                });
            }
        });

        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                                this.tickupTween = TweenMax.to(this.tickerValue, Example._constants.SuperMegaWinTickUpTime, {
                                    text: this.superMegaWinAmt, ease: Linear.easeInOut, onUpdate: () => {
                                        this.bgMeterText.text = this.model.getCurrency() + (Number(this.tickerValue.text) / 100).toFixed(2);
                                    }, onComplete: () => {
                                        this.updateBigwinTickup();
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
        this.playBigWinNextLvlAnim();
    }

    private bigWinCompleteState(): void {
        // TODO:
        this.bgMeterText.text = this.model.getCurrency() + (this.amountInTickup / 100).toFixed(2);
        this.model.setIsBigWinRunning(false);
        this.hideBigWin();
    }

    /**
    * getting tickup level that it is for big, super or mega win
    * @returns {number} returning 0, 1, 2, and 3 for set the level of big win as that is big, super or mega win
    */
    public getTickupAndAmountLevel(): number {
        let totalBet: number = this.model.getTotalBet();
        if (this.amountInTickup > Example._constants.SuperMegaWinMultiplier * totalBet) {
            this.bigWinAmt = Example._constants.BigWinMultiplier * totalBet;
            this.megaWinAmt = Example._constants.MegaWinMultiplier * totalBet;
            this.superMegaWinAmt = this.amountInTickup;
            return 3;
        } else if (this.amountInTickup > Example._constants.MegaWinMultiplier * totalBet) {
            this.bigWinAmt = Example._constants.BigWinMultiplier * totalBet;
            this.megaWinAmt = this.amountInTickup;
            this.superMegaWinAmt = 0;
            return 2;
        } else if (this.amountInTickup >= Example._constants.BigWinMultiplier * totalBet) {
            this.bigWinAmt = this.amountInTickup;
            this.megaWinAmt = 0;
            this.superMegaWinAmt = 0;
            return 1;
        } else {
            this.bigWinAmt = 0;
            this.megaWinAmt = 0;
            this.superMegaWinAmt = 0;
            return 0;
        }
    }

    /**
    * update big win lable and tickup amount according to big win level that it is big mega or super mega win
    */
    public updateBigwinTickup(): void {
        switch (this.nextTickUpState) {
            case Example._constants.BigWinState:
                this.playBigWinIntroAnim();
                break;
            case Example._constants.MegaWinState:
                this.startMegaWin();
                break;
            case Example._constants.SuperMegaWinState:
                this.startSuperMegaWin();
                break;
            case Example._constants.CompleteState:
                this.bigWinCompleteState();
                break;
        }
    }

    private showBigWin(): void {
        this.nextTickUpState = Example._constants.BigWinState;
        this.amountInTickup = this.model.getCurrentWinAmt();
        this.tickupLevel = this.getTickupAndAmountLevel();
        this.bgMeterText.text = this.model.getCurrency() + "0.00";
        this.tickerValue.text = "0";
        this.updateBigwinTickup();
        this.model.setIsBigWinRunning(true);
        this.bigWinCelebration();

    }

    private hideBigWin(): void {
        // TODO: write code for hide big win celebration
    }

    private abortBigWin(): void {
        this.nextTickUpState = Example._constants.CompleteState;
        this.tickupTween.kill();
        this.bgTextTween.kill();
        this.bgMeterTextTween.kill();
        this.stopBigWinIntroAnim();
        this.stopBigWinNextLvlAnim();
        if (this.tickupLevel === 3) {
            this.bgText.text = Example._gameText.SUPER_MEGA_WIN_TEXT;
        } else if (this.tickupLevel === 2) {
            this.bgText.text = Example._gameText.MEGA_WIN_TEXT;
        } else if (this.tickupLevel === 1) {
            this.bgText.text = Example._gameText.BIG_WIN_TEXT;
        }
        this.updateBigwinTickup();
    }

    private bigWinCelebration(): void {
        const emitterData: particles.EmitterConfig = {
            alpha: {
                list: [
                    {
                        value: 0.8,
                        time: 0
                    },
                    {
                        value: 0.1,
                        time: 1
                    }
                ],
                isStepped: false
            },
            scale: {
                list: [
                    {
                        value: 1,
                        time: 0
                    },
                    {
                        value: 0.3,
                        time: 1
                    }
                ],
                isStepped: false
            },
            color: {
                list: [
                    {
                        value: "fb1010",
                        time: 0
                    },
                    {
                        value: "f5b830",
                        time: 1
                    }
                ],
                isStepped: false
            },
            speed: {
                list: [
                    {
                        value: 200,
                        time: 0
                    },
                    {
                        value: 100,
                        time: 1
                    }
                ],
                isStepped: false
            },
            startRotation: {
                min: 0,
                max: 360
            },
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.5,
                max: 0.5
            },
            frequency: 0.008,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0.31,
            maxParticles: 1000,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: "circle",
            spawnCircle: {
                x: 0,
                y: 0,
                r: 10
            }
        };
        const emitter: particles.Emitter = new particles.Emitter(
            this._foregroundLayer,
            [
                this.getTexture("coin2"),
                this.getTexture("coin3"),
                this.getTexture("coin4"),
                this.getTexture("coin5"),
                this.getTexture("diamond")
            ],
            emitterData
        );
        emitter.emit = true;

    }
}