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
    private emitter: particles.Emitter;

    /**
     * Text used in big win
     */
    private _gameText = {
        BIG_WIN_TEXT: "BIG WIN",
        MEGA_WIN_TEXT: "MEGA WIN",
        SUPER_MEGA_WIN_TEXT: "SUPER MEGA WIN"
    }

    /**
     * Constants values used in big win
     */
    private _constants = {
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

    /**
     * 
     * @param assets {IAssetsDictionary} Assets list for preload
     * @param model {Model} Model for get big win data
     */
    constructor(assets: IAssetsDictionary, model: Model) {
        super(assets, "../media/");
        this.model = model;
    }

    /**
     * Subscribe click event on stage
     */
    private subscribeEvents(): void {
        this._backgroundLayer.interactive = true;
        this._backgroundLayer.on("click", this.onStageClick, this);
    }

    /**
     * Abort big win animation on stage click
     */
    private onStageClick(): void {
        if (this.model.getIsBigWinRunning()) {
            this.abortBigWin();
        }
    }

    /**
     * Overrided this function to add abort big win on space bar tap
     * @param event {KeyboardEvent}
     */
    protected onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 32:
                if (this.model.getIsBigWinRunning()) {
                    this.abortBigWin();
                }
                break;
        }
    }

    /**
     * Overrided this function to initialize big win and show big win celebration
     */
    protected initAnimations(): void {
        super.initAnimations();
        this.subscribeEvents();
        this.initTickerText();
        this.initializeBigWin();
        if (this.model.getCurrentWinAmt() >= this._constants.BigWinMultiplier * this.model.getTotalBet()) {
            this.showBigWin();
        }
    }

    /**
     * initialized tickup text and used it to show big win tickup
     */
    private initTickerText(): void {
        this.tickerValue = new PIXI.Text("0");
        this.tickerValue.visible = false;
    }

    /**
     * Initialized big win animation
     */
    private initializeBigWin(): void {
        /**
         * Big win text font style
         */
        let bgTextStyle: PIXI.TextStyleOptions = {
            "fontFamily": "Futura LT",
            "fontSize": "72px",
            "fontWeight": "400",
            "fill": "#f7f18a"
        };
        this.amountInTickup = 0;
        this.tickupLevel = 0;

        /**
         * Created Big win container, it contains big win text and big win meter
         */
        this.bgContainer = new PIXI.Container();
        this.bgContainer.pivot.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bgContainer.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bgContainer.visible = false;
        this._foregroundLayer.addChild(this.bgContainer);


        /**
         * Created Big win text, same text will update to Mega|Super mega win
         */
        this.bgText = new PIXI.Text(this._gameText.BIG_WIN_TEXT, bgTextStyle);
        this.bgText.anchor.set(0.5, 0.5);
        this.bgText.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5 - 210);
        this.bgContainer.addChild(this.bgText);

        /**
         * Created Big win meter
         */
        this.bgMeterText = new PIXI.Text(this.model.getCurrency() + (this.amountInTickup / 100).toFixed(2), bgTextStyle);
        this.bgMeterText.anchor.set(0.5, 0.5);
        this.bgMeterText.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5 + 210);
        this.bgContainer.addChild(this.bgMeterText);

        /**
         * Created Big win intro animation
         */
        this.bwIntro = new PIXI.extras.AnimatedSprite(this.getTextures("bwInro"));
        this.bwIntro.anchor.set(0.5, 0.5);
        this.bwIntro.scale.set(0.75, 0.75);
        this.bwIntro.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bwIntro.loop = false;
        this.bwIntro.animationSpeed = 0.40;
        this.bwIntro.visible = false;
        this._foregroundLayer.addChild(this.bwIntro);

        /**
         * Created Big win next level animation
         */
        this.bwNextLvl = new PIXI.extras.AnimatedSprite(this.getTextures("bwNextLvl"));
        this.bwNextLvl.anchor.set(0.5, 0.5);
        this.bwNextLvl.scale.set(0.75, 0.75);
        this.bwNextLvl.position.set(this._stageWidth * 0.5, this._stageHeight * 0.5);
        this.bwNextLvl.loop = false;
        this.bwNextLvl.animationSpeed = 0.40;
        this.bwNextLvl.visible = false;
        this._foregroundLayer.addChild(this.bwNextLvl);
    }

    /**
     * Play big win intro animation and start win animation after intro animation
     */
    private playBigWinIntroAnim(): void {
        /**
         * Update next state to mega win|complete state
         */
        if (this.tickupLevel === 1) {
            this.nextTickUpState = this._constants.CompleteState;
        } else {
            this.nextTickUpState = this._constants.MegaWinState;
        }
        this.bgContainer.visible = false;
        this.bwNextLvl.visible = false;
        this.bwIntro.visible = true;
        this.bwIntro.play();
        this.bwIntro.onComplete = () => {
            this.startBigWin();
        };
    }

    /**
     * Stop big win intro animation
     */
    private stopBigWinIntroAnim(): void {
        this.bwIntro.visible = false;
        this.bwIntro.gotoAndStop(0);
    }

    /**
     * Play big win next level animation
     */
    private playBigWinNextLvlAnim(): void {
        this.bwIntro.visible = false;
        this.bwNextLvl.visible = true;
        this.bwNextLvl.gotoAndStop(0);
        this.bwNextLvl.play();
    }

    /**
     * Stop big win next level animation
     */
    private stopBigWinNextLvlAnim(): void {
        this.bwNextLvl.visible = true;
        this.bwNextLvl.gotoAndStop(0);
    }

    /**
     * Start big win state and start tickup for big win
     */
    private startBigWin(): void {
        /**
         * Show big win meter and big win text and play tween animation on big win text 
         */
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

        /**
         * Play tween animation on big win meter and start tickup to bigWinAmt
         */
        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.30, {
            x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                        this.tickupTween = TweenMax.to(this.tickerValue, this._constants.BigWinTickUpTime, {
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

    /**
     * Start mega win state and start tickup for mega win
     */
    private startMegaWin(): void {
        /**
         * Update next state to super mega win|complete state
         */
        if (this.tickupLevel === 2) {
            this.nextTickUpState = this._constants.CompleteState;
        } else {
            this.nextTickUpState = this._constants.SuperMegaWinState;
        }

        /**
         * Play tween animation on big win text and switch to mega win 
         */
        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgText.text = this._gameText.MEGA_WIN_TEXT;
                this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                    x: 1.2, y: 1.2, ease: Linear.easeInOut, onComplete: () => {
                        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut
                        });
                    }
                });
            }
        });

        /**
         * Play tween animation on big win meter and start tickup to megaWinAmt
         */
        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                                this.tickupTween = TweenMax.to(this.tickerValue, this._constants.MegaWinTickUpTime, {
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

    /**
     * Start super mega win state and start tickup for super mega win
     */
    private startSuperMegaWin(): void {
        /**
         * Update next state to complete state
         */
        this.nextTickUpState = this._constants.CompleteState;

        /**
         * Play tween animation on mega win text and switch to super mega win 
         */
        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgText.text = this._gameText.SUPER_MEGA_WIN_TEXT;
                this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                    x: 1.2, y: 1.2, ease: Linear.easeInOut, onComplete: () => {
                        this.bgTextTween = TweenMax.to(this.bgText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut
                        });
                    }
                });
            }
        });

        /**
         * Play tween animation on big win meter and start tickup to superMegaWinAmt
         */
        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
            x: 0.9, y: 0.9, ease: Linear.easeInOut, onComplete: () => {
                this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                    x: 1.1, y: 1.1, ease: Linear.easeInOut, onComplete: () => {
                        this.bgMeterTextTween = TweenMax.to(this.bgMeterText.scale, 0.15, {
                            x: 1, y: 1, ease: Linear.easeInOut, onComplete: () => {
                                this.tickupTween = TweenMax.to(this.tickerValue, this._constants.SuperMegaWinTickUpTime, {
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

    /**
     * Show final amount after big win complete and stop coin shower animation
     */
    private bigWinCompleteState(): void {
        this.bgMeterText.text = this.model.getCurrency() + (this.amountInTickup / 100).toFixed(2);
        this.model.setIsBigWinRunning(false);
        this.hideBigWin();
        this.emitter.destroy();
		this.emitter = null;
    }

    /**
    * Getting tickup level that it is for big, super or mega win
    * @returns {number} returning 0, 1, 2, and 3 for set the level of big win as that is big, super or mega win
    */
    public getTickupAndAmountLevel(): number {
        let totalBet: number = this.model.getTotalBet();
        if (this.amountInTickup > this._constants.SuperMegaWinMultiplier * totalBet) {
            this.bigWinAmt = this._constants.BigWinMultiplier * totalBet;
            this.megaWinAmt = this._constants.MegaWinMultiplier * totalBet;
            this.superMegaWinAmt = this.amountInTickup;
            return 3;
        } else if (this.amountInTickup > this._constants.MegaWinMultiplier * totalBet) {
            this.bigWinAmt = this._constants.BigWinMultiplier * totalBet;
            this.megaWinAmt = this.amountInTickup;
            this.superMegaWinAmt = 0;
            return 2;
        } else if (this.amountInTickup >= this._constants.BigWinMultiplier * totalBet) {
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
    * Update big win lable and tickup amount according to big win level that it is big mega or super mega win
    */
    public updateBigwinTickup(): void {
        switch (this.nextTickUpState) {
            case this._constants.BigWinState:
                this.playBigWinIntroAnim();
                break;
            case this._constants.MegaWinState:
                this.startMegaWin();
                break;
            case this._constants.SuperMegaWinState:
                this.startSuperMegaWin();
                break;
            case this._constants.CompleteState:
                this.bigWinCompleteState();
                break;
        }
    }

    /**
     * Show big win animation
     */
    private showBigWin(): void {
        this.nextTickUpState = this._constants.BigWinState;
        this.amountInTickup = this.model.getCurrentWinAmt();
        this.tickupLevel = this.getTickupAndAmountLevel();
        this.bgMeterText.text = this.model.getCurrency() + "0.00";
        this.tickerValue.text = "0";
        this.updateBigwinTickup();
        this.model.setIsBigWinRunning(true);
        this.playCoinShowerAnimation();

    }

    /**
     * Hide big win animation and clear data
     */
    private hideBigWin(): void {
        // TODO: write code for hide big win celebration
    }

    /**
     * Abort big win animation and show final amount
     */
    private abortBigWin(): void {
        this.nextTickUpState = this._constants.CompleteState;
        this.tickupTween.kill();
        this.bgTextTween.kill();
        this.bgMeterTextTween.kill();
        this.stopBigWinIntroAnim();
        this.stopBigWinNextLvlAnim();
        if (this.tickupLevel === 3) {
            this.bgText.text = this._gameText.SUPER_MEGA_WIN_TEXT;
        } else if (this.tickupLevel === 2) {
            this.bgText.text = this._gameText.MEGA_WIN_TEXT;
        } else if (this.tickupLevel === 1) {
            this.bgText.text = this._gameText.BIG_WIN_TEXT;
        }
        this.updateBigwinTickup();
    }

    /**
     * Play coin shower animation using particles.Emitter
     */
    private playCoinShowerAnimation(): void {
        this.emitter = new particles.Emitter(
            this._foregroundLayer,
            [
                this.getTexture("coin2"),
                this.getTexture("coin3"),
                this.getTexture("coin4"),
                this.getTexture("coin5"),
                this.getTexture("diamond")
            ],
            this.model.getEmitterData()
        );

        // Calculate the current time
        let elapsed = Date.now();
        let updateId;

		// Update function every frame
		let update = () => {

			// Update the next frame
			updateId = requestAnimationFrame(update);

			let now = Date.now();
			if (this.emitter)
				this.emitter.update((now - elapsed) * 0.001);

			elapsed = now;

		};
        this.emitter.emit = true;
        update();

    }
}