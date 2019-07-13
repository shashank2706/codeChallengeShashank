import particles = require('pixi-particles');

/**
* Model
*
* created on 2019-07-10
* @author shupadhyay
*/
export class Model {

    /**
     * Total bet amount
     */
    private totalBet: number = 10; // Change this value if you need to play on another bet

    /**
     * Current win amount
     */
    private currentWinAmt: number = 960; // Change this value if you need to play only big win|mega win|super mega win|no big win celebration

    /**
     * Currency symbol
     */
    private currency: string = "$";
    
    /**
     * Is big win running or not
     */
    private isBigWinRunning: boolean = false;
    
    /**
     * Emitter data for particle animation using in big win celebration
     */
    private emitterData: particles.EmitterConfig = {
        
        scale: {
            list: [
                {
                    value: 0.75,
                    time: 0
                },
                {
                    value: 0.75,
                    time: 0
                }
            ],
            isStepped: false
        },
        minimumScaleMultiplier: 0.5,
        speed: {
            list: [
                {
                    value: 300,
                    time: 0
                },
                {
                    value: 300,
                    time: 0
                }
            ],
            isStepped: false
        },
        startRotation: {
            min: 90,
            max: 90
        },
        rotationSpeed: {
            min: 100,
            max: 300
        },
        lifetime: {
            min: 4,
            max: 4
        },
        ease: [
            {
                s: 0,
                cp: 0.379,
                e: 0.548
            },
            {
                s: 0.548,
                cp: 0.717,
                e: 0.676
            },
            {
                s: 0.676,
                cp: 0.635,
                e: 1
            }
        ],
        frequency: 0.030,
        emitterLifetime: 0,
        maxParticles: 1000,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: true,
        spawnType: "rect",
        spawnRect: {
            x: 0,
            y: 0,
            w: 1280,
            h: -50
        }
    };


    /**
     * Set total bet amount
     * @param value {number}
     */
    public setTotalBet(value: number): void {
        this.totalBet = value;
    }

    /**
     * Get total bet amount
     * @returns {number}
     */
    public getTotalBet(): number {
        return this.totalBet;
    }

    /**
     * Set current win amount
     * @param value {number}
     */
    public setCurrentWinAmt(value: number): void {
        this.currentWinAmt = value;
    }

    /**
     * Get current win amount
     * @returns {number}
     */
    public getCurrentWinAmt(): number {
        return this.currentWinAmt;
    }

    /**
     * Set currency symbol
     * @param value {string}
     */
    public setCurrency(value: string): void {
        this.currency = value;
    }

    /**
     * Get currency symbol
     * @returns {string}
     */
    public getCurrency(): string {
        return this.currency;
    }

    /**
     * Set is big win running true|false
     * @param value {boolean}
     */
    public setIsBigWinRunning(value: boolean): void {
        this.isBigWinRunning = value;
    }

    /**
     * Get is big win running true|false
     * @returns {boolean}
     */
    public getIsBigWinRunning(): boolean {
        return this.isBigWinRunning;
    }

    /**
     * Set emitter data for particle emitter
     * @param value {particles.EmitterConfig}
     */
    public setEmitterData(value: particles.EmitterConfig): void {
        this.emitterData = value;
    }

    /**
     * Get emitter data for particle emitter
     * @returns {particles.EmitterConfig}
     */
    public getEmitterData(): particles.EmitterConfig {
        return this.emitterData;
    }
}