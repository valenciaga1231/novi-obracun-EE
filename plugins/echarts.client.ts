// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";

// Import bar charts, all suffixed with Chart
import { BarChart } from "echarts/charts";

// Import required components
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";

// Features like Universal Transition and Label Layout
import { LabelLayout, UniversalTransition } from "echarts/features";

// Import the Canvas renderer
// Note that including the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from "echarts/renderers";

export default defineNuxtPlugin(() => {
    echarts.use([BarChart, TooltipComponent, GridComponent, LabelLayout, UniversalTransition, CanvasRenderer, LegendComponent]);
    return {
        provide: {
            echarts: echarts, // Provide bundled echarts to NuxtApp
        },
    };
});
