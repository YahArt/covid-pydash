import { IWidgetSize } from "src/app/models/iwidget-size";

export abstract class WidgetBase {
    public abstract onWidgetResize(widgetSize: IWidgetSize): void; // Called when the widget is resized...
}