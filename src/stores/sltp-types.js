/**
 * Definitions SLTP charts
 */

export const OPT = {
    MAIN: {
        id: "main_chart",
        color: "#26A69A",
        axis: 0
    },
    SL: {
        id: "opt_sl_line",
        color: "#EF9A9A",
        dashStyle: "",
        axis: 0,
        name: "Opt SL",
        showInNavigator: true
    },
    TP: {
        id: "opt_tp_line",
        color: "#4CAF50",
        dashStyle: "",
        axis: 0,
        name: "Opt TP",
        showInNavigator: true
    },
    EXT: {
        id: "opt_ext_line",
        color: "#64B5F6",
        dashStyle: "",
        axis: 0,
        name: "Opt E[x_0] NBC",
        showInNavigator: true
    },
    MAX: {
        id: "opt_max_Line",
        color: "yellow",
        dashStyle: "Dot",
        axis: 1,
        name: "Opt Max EIR",
        showInNavigator: false
    },
    TRADE: {
        id: "opt_trade_line",
        color: "#E1BEE7",
        dashStyle: "Dot",
        axis: 2,
        name: "Opt Trad P/L Ratio",
        showInNavigator: false
    },
    PLOT_BAND: {
        id: "plotband",
        color: "rgba(0, 0, 0, 0.15)" // Dark Grey
    }
};