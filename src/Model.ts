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
}