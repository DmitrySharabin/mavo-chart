# Mavo Chart

To use, either give a class of `mv-chart` or specify chart data via the `mv-chart-data` attribute to the `canvas` element you want to enable Chart on. The `canvas` element must be a **property**.

## Demo

```markup
<main mv-app="chartDemo" mv-plugins="chart"
      mv-source="https://raw.githubusercontent.com/DmitrySharabin/mavo-chart/master/example.json" >
    <header>
        <h1>Mavo Chart Plugin Demo</h1>
    </header>

    <aside class="mv-bar">
        <button class="mv-edit">Edit table data</button>
    </aside>
    <!-- Data table -->
    <table>
        <thead>
            <tr>
                <th>&nbsp;</th>
                <th>Bears</th>
                <th>Dolphins</th>
                <th>Whales</th>
            </tr>
        </thead>
        <tbody>
            <tr property="stats" mv-multiple>
                <th property="year"></th>
                <td property="bears"></td>
                <td property="dolphins"></td>
                <td property="whales"></td>
            </tr>
        </tbody>
    </table>

    <!-- Charts -->
    <canvas property="lineChart"
            mv-chart-title="Wildlife Population"
            mv-chart-legend="Bears, Dolphins, Whales"
            mv-chart-legend-position="bottom"
            mv-chart-data="[stats.bears]; [stats.dolphins]; [stats.whales]"
            mv-chart-labels="[stats.year]"
            mv-chart-series-styles="backgroundColor: transparent, borderColor: royalblue; backgroundColor: transparent, borderColor: gray; backgroundColor: transparent, borderColor: orange"
            mv-chart-options="scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: Year
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: Quantity
                    }
                }]
            }">
        <p>Your browser doesn't support charts in canvas!</p>
    </canvas>

    <label>
        Show prediction about:
        <select property="species">
            <option value="bears">Bears</option>
            <option value="dolphins">Dolphins</option>
            <option value="whales">Whales</option>
        </select>
    </label>

    <canvas property="doughnutChart"
            mv-chart-type="doughnut"
            mv-chart-title="Population of [readable(species)]"
            mv-chart-data="[if(species = 'bears', stats.bears, if(species = 'dolphins', stats.dolphins, stats.whales))]"
            mv-chart-labels="[stats.year]"
            mv-expressions-ignore="mv-chart-series-styles"
            mv-chart-series-styles="backgroundColor: [#5899da, rgb(232, 116, 59), hotpink, rgba(69, 170, 121, 1), hsla(269, 54%, 59%, 1), #6c8893]">
        <p>Your browser doesn't support charts in canvas!</p>
    </canvas>
    <p>
        <b>Credit:</b> the example is taken from <a href="https://www.excel-easy.com/examples/line-chart.html">here</a>.
    </p>
</main>
<style>
    .mv-bar {
        margin: 0.5em 0;
    }

    table {
        border-collapse: collapse;
        width: 30em;
    }

    td,
    th {
        border: 1px solid #ddd;
        padding: 0.5em;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    th {
        padding-top: 0.8em;
        padding-bottom: 0.8em;
        text-align: left;
        background-color: rgb(67, 96, 116);
        color: white;
    }

    canvas {
        max-width: 50em;
    }
</style>
```

## Core attributes

**Note:** The ***Live?*** column refers to whether changes to the value of this attribute (e.g., via [expressions](https://mavo.io/docs/expressions) or even custom JavaScript) will have an effect.

| Name                       | Purpose | Live? | Default Value |
|----------------------------|---------|-------|---------------|
| `mv-chart-type`            | Defines a chart type. Possible values: `line`, `bar`, `horizontalBar`, `radar`, `pie`, `doughnut`, `polarArea`, `bubble`, `scatter`. More information about built-in chart types and their options can be found [here](https://www.chartjs.org/docs/latest/charts/).       |       | `line`        |
| `mv-chart-data`            | Defines data series. Every data series is a *comma-separated* list of values that will be plotted on a chart. The format of the values depends on a chart type. If there are a few data series, they are *separated by a semicolon*.        | ✔︎     |               |
| `mv-chart-labels`          | Defines a list of *comma-separated* values that appear as the labels on the category axis.        | ✔︎     |               |
| `mv-chart-title`           | Defines a chart title.        | ✔︎     |               |
| `mv-chart-title-position`  | Defines a chart title position. Possible values: `top`, `right`, `bottom`, `left`.        |       | `top`         |
| `mv-chart-legend`          | Contains a *comma-separated* list of labels that identifies the colors that are assigned to the data series or categories in a chart. | ✔︎     |               |
| `mv-chart-legend-position` | Defines a chart legend position. Possible values: `top`, `right`, `bottom`, `left`.       |       | `top`         |

**Note:** If you need to use a comma as a part of a label and/or the legend item, you need to *escape it via backslash*, like so: `mv-chart-legend="Distance\, km, Area\, square km"`

## Data series customization

The Chart plugin supports [a number of options for styling data series](https://www.chartjs.org/docs/latest/configuration/elements.html#line-configuration). You can specify these options on a per-series basis by using the `mv-chart-series-styles` attribute.
The syntax of this attribute is a CSS-like list of declarations, where you should use *commas* to separate the option-value pairs and *semicolons* to separate style declarations of different data series.

## Advanced customization

**Caution:** This section requires an understanding of JSON. It is aimed at advanced users. You do not need to understand JSON to use Mavo and this plugin!

The Chart plugin allows you to configure some aspects of a chart look and feel and customize its behavior by setting [options](https://www.chartjs.org/docs/latest/configuration/) via the `mv-chart-options` attribute. The syntax of this attribute is a JSON-like object. `mv-chart-options` does not require curly braces. If you include them, they will be considered part of the JSON object.

Styles of data series can also be specified via a JSON-like value of the `mv-chart-series-styles` attribute. To use JSON-like syntax in the `mv-chart-series-styles` attribute, you need either [disable expressions](https://mavo.io/docs/expressions#disabling-expressions) for this attribute via the `mv-expressions-ignore` or [change the syntax of the expressions](https://mavo.io/docs/expressions#using-expressions) with the `mv-expressions` attribute.

Expressions in the `mv-chart-options` are disabled by default.

Both of these cases are shown in the **Demo** so that you can play with it.

## Localization

In case of an error, while reading the `mv-chart-series-styles` and `mv-chart-options` attributes, the plugin writes warnings in English about that to the console. You can localize these warning messages into a different language.

Here is the list of `id`s of phrases to change/localize and their default values:

| id | Default Value |
|---|---|
| `chart-styles-parse-error` | Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart. |
| `chart-options-parse-error` | Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart. |

## Further explorations

Need more examples? No problem! Examples of different charts with their code can be found [here](https://www.chartjs.org/samples/latest/).
