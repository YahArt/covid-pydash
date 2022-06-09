export interface ICovidDeath {
    date: number;
    sumTotal: number; // Total ammount of deaths until this point in time.
    current: number; // Death count for this point in time
}