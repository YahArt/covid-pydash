export interface ICovidDeathsReponse {
    geoRegion: string; // 'CH'
    data: Array<{ datum: number, sumTotal: number, entries: number }>;
}