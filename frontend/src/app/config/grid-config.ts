import { CompactType, DisplayGrid, GridsterItem, GridType } from "angular-gridster2";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export class GridConfig {
    public static getDefaultForWidgetType(widgetType: DashboardWidgetType): any {
        switch (widgetType) {
            case DashboardWidgetType.LineChart: {
                return {
                    cols: 4,
                    rows: 4,
                    y: 0,
                    x: 0,
                    minItemRows: 4,
                    minItemCols: 4,
                };
            }
            case DashboardWidgetType.BarChart: {
                return {
                    cols: 4,
                    rows: 4,
                    y: 0,
                    x: 0,
                    minItemRows: 4,
                    minItemCols: 4,
                };
            }
            default:
                return {
                    cols: 1,
                    rows: 2,
                    y: 0,
                    x: 0,
                    minItemRows: 2,
                    minItemCols: 2,
                };
        }
    }


    public static readonly DEFAULT = {
        gridType: GridType.Fixed,
        compactType: CompactType.None,
        margin: 20,
        outerMargin: true,
        outerMarginTop: null,
        outerMarginRight: null,
        outerMarginBottom: null,
        outerMarginLeft: null,
        useTransformPositioning: true,
        mobileBreakpoint: 640,
        useBodyForBreakpoint: false,
        minCols: 1,
        maxCols: 105,
        minRows: 1,
        maxRows: 105,
        maxItemCols: 100,
        minItemCols: 1,
        maxItemRows: 100,
        minItemRows: 1,
        maxItemArea: 2500,
        minItemArea: 1,
        defaultItemCols: 1,
        defaultItemRows: 1,
        fixedColWidth: 105,
        fixedRowHeight: 105,
        keepFixedHeightInMobile: false,
        keepFixedWidthInMobile: false,
        scrollSensitivity: 10,
        scrollSpeed: 20,
        enableEmptyCellClick: false,
        enableEmptyCellContextMenu: false,
        enableEmptyCellDrop: false,
        enableEmptyCellDrag: false,
        enableOccupiedCellDrop: false,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        ignoreMarginInRow: false,
        draggable: {
            enabled: false
        },
        resizable: {
            enabled: false
        },
        swap: false,
        pushItems: true,
        disablePushOnDrag: false,
        disablePushOnResize: false,
        pushDirections: { north: true, east: true, south: true, west: true },
        pushResizeItems: false,
        displayGrid: DisplayGrid.None,
        disableWindowResize: false,
        disableWarnings: false,
        scrollToNewItems: false
    };
}