import particles = require('pixi-particles');

/**
* Model
*
* created on 2019-07-10
* @author shupadhyay
*/
export class Model {

    private totalBet: number = 10;
    private currentWinAmt: number = 960;
    private currency: string = "$";
    private isBigWinRunning: boolean = false;
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


    public setTotalBet(value: number): void {
        this.totalBet = value;
    }

    public getTotalBet(): number {
        return this.totalBet;
    }

    public setCurrentWinAmt(value: number): void {
        this.currentWinAmt = value;
    }

    public getCurrentWinAmt(): number {
        return this.currentWinAmt;
    }

    public setCurrency(value: string): void {
        this.currency = value;
    }

    public getCurrency(): string {
        return this.currency;
    }

    public setIsBigWinRunning(value: boolean): void {
        this.isBigWinRunning = value;
    }

    public getIsBigWinRunning(): boolean {
        return this.isBigWinRunning;
    }

    public setEmitterData(value: particles.EmitterConfig): void {
        this.emitterData = value;
    }

    public getEmitterData(): particles.EmitterConfig {
        return this.emitterData;
    }
}