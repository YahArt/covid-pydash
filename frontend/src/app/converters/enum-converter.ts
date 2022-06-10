import { MapRegion } from "../enums/map-region.enum";
import { Region } from "../enums/region.enum";

export class EnumConverter {
    public static convertRegionToMapRegion(region: Region): MapRegion {
        switch (region) {
            case Region.CH:
                return MapRegion.CH;
            case Region.CHFL:
                return MapRegion.CHFL;
            case Region.AG:
                return MapRegion.AG;
            case Region.AI:
                return MapRegion.AI;
            case Region.AR:
                return MapRegion.AR;
            case Region.BE:
                return MapRegion.BE;
            case Region.BS:
                return MapRegion.BS;
            case Region.BL:
                return MapRegion.BL;
            case Region.FL:
                return MapRegion.FL;
            case Region.FR:
                return MapRegion.FR;
            case Region.GE:
                return MapRegion.GE;
            case Region.GL:
                return MapRegion.GL;
            case Region.GR:
                return MapRegion.GR;
            case Region.JU:
                return MapRegion.JU;
            case Region.LU:
                return MapRegion.LU;
            case Region.NE:
                return MapRegion.NE;
            case Region.NW:
                return MapRegion.NW;
            case Region.OW:
                return MapRegion.OW;
            case Region.SG:
                return MapRegion.SG;
            case Region.SH:
                return MapRegion.SH;
            case Region.SO:
                return MapRegion.SO;
            case Region.SZ:
                return MapRegion.SZ;
            case Region.TG:
                return MapRegion.TG;
            case Region.TI:
                return MapRegion.TI;
            case Region.UR:
                return MapRegion.UR;
            case Region.VD:
                return MapRegion.VD;
            case Region.VS:
                return MapRegion.VS;
            case Region.ZG:
                return MapRegion.ZG;
            case Region.ZH:
                return MapRegion.ZH;
            default:
                return MapRegion.UNDEFINED;
        }
    }
}