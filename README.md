# Mavo Chart

Visualize data in your Mavo apps with animated, customizable, and responsive charts. Uses [Chart.js](https://www.chartjs.org/).

To use, either give a class of `mv-chart` or specify chart data via the `mv-chart-data` attribute to the `canvas` element you want to enable Chart on.

## Demo

```markup

```

## Core attributes

**Note:** The ***Live?*** column refers to whether changes to the value of this attribute (e.g., via [expressions](https://mavo.io/docs/expressions) or even custom JavaScript) will have an effect.

| Name                       | Purpose | Live? | Default Value |
|----------------------------|---------|-------|---------------|
| `mv-chart-type`            |         | ✔︎     | `Line`        |
| `mv-chart-data`            |         | ✔︎     |               |
| `mv-chart-labels`          |         | ✔︎     |               |
| `mv-chart-title`           |         | ✔︎     |               |
| `mv-chart-title-position`  |         |       | `Top`         |
| `mv-chart-legend`          |         | ✔︎     |               |
| `mv-chart-legend-position` |         |       | `Top`         |

## Data series customization

The Chart plugin supports [a number of options for styling data series](https://www.chartjs.org/docs/latest/configuration/elements.html#line-configuration). You can specify these options on a per-series basis by using the `mv-chart-series-styles` attribute.
The syntax of this attribute is a CSS-like list of declarations, where you should use commas to separate the option-value pairs and semicolons to separate style declarations of different series. If you want to set an option to `true`, you can just provide no value.

**Note:** If you want to use a color function (e.g., the `rgba()` function) as the value of an option, you ought to escape via backslash the commas separating the function attributes.

## Advanced customization

**Caution:** This section requires an understanding of JSON. It is aimed at advanced users. You do not need to understand JSON to use Mavo and this plugin!

`mv-chart-options`
