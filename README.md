# Mavo Chart

To use, specify chart data via the `mv-chart-data` attribute to a `canvas` element you want to enable Chart on.

## Demo

```markup
<main mv-app="chartDemo" mv-plugins="chart"
      mv-source="https://dmitrysharabin.github.io/mavo-chart/example.json">
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
    <canvas mv-chart-title="Wildlife Population"
            mv-chart-legend="Bears, Dolphins, Whales"
            mv-chart-legend-position="bottom"
            mv-chart-data="[bears]; [dolphins]; [whales]"
            mv-chart-labels="[year]"
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

    <canvas mv-chart-type="doughnut"
            mv-chart-title="Population of [readable(species)]"
            mv-chart-data="[species]"
            mv-chart-labels="[year]"
            mv-expressions-ignore="mv-chart-series-styles"
            mv-chart-series-styles="backgroundColor: [#5899da, rgb(232, 116, 59), hotpink, rgba(69, 170, 121, 1), hsla(269, 54%, 59%, 1), #6c8893]">
        <p>Your browser doesn't support charts in canvas!</p>
    </canvas>

    <h2>Chart with Theme</h2>
    <canvas mv-chart-type="horizontalBar"
            mv-chart-title="Wildlife Population"
            mv-chart-data="[bears]; [dolphins]; [whales]"
            mv-chart-labels="[year]"
            mv-chart-legend="Bears, Dolphins, Whales"
            mv-chart-theme="tableau.Classic10">
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

**Note:** The ***Live?*** column refers to whether changes to the value of this attribute (e.g., via [expressions](https://mavo.io/docs/expressions) or even custom JavaScript) will have an effect. ***Initially*** means that you can use expressions to set the value of that attribute until Mavo uses it, but nothing will happen if it changes after that point.

| Name                       | Purpose | Live? | Default Value |
|----------------------------|---------|-------|---------------|
| `mv-chart-type`            | Defines a chart type. Possible values: `line`, `bar`, `horizontalBar`, `radar`, `pie`, `doughnut`, `polarArea`, `bubble`, `scatter`. More information about built-in chart types and their options can be found [here](https://www.chartjs.org/docs/latest/charts/).       | Initially      | `line`        |
| `mv-chart-data`            | Defines data series. Every data series is a *comma-separated* list of values that will be plotted on a chart. The format of the values depends on a chart type. If there are a few data series, they are *separated by a semicolon*.        | ✔︎     |               |
| `mv-chart-labels`          | Defines a list of *comma-separated* values that appear as the labels on the category axis.        | ✔︎     |               |
| `mv-chart-title`           | Defines a chart title.        | ✔︎     |               |
| `mv-chart-title-position`  | Defines a chart title position. Possible values: `top`, `right`, `bottom`, `left`.        | Initially      | `top`         |
| `mv-chart-legend`          | Contains a *comma-separated* list of labels that identifies the colors that are assigned to the data series or categories in a chart. **Hint:** The legend elements are interactive—you can switch on/off data series in a chart by clicking the corresponding legend item.| ✔︎     |               |
| `mv-chart-legend-position` | Defines a chart legend position. Possible values: `top`, `right`, `bottom`, `left`.       | Initially      | `top`         |

**Note:** If you need to use a comma as a part of a label and/or the legend item, you need to *escape it via backslash*, like so: `mv-chart-legend="Distance\, km, Area\, square km"`

## Data series customization

The Chart plugin supports [a number of options for styling data series](https://www.chartjs.org/docs/latest/configuration/elements.html#line-configuration). You can specify these options on a per-series basis by using the `mv-chart-series-styles` attribute. The attribute is live.
The syntax of this attribute is a CSS-like list of declarations, where you should use *commas* to separate the option-value pairs and *semicolons* to separate style declarations of different data series.

## Theming

You can pick the perfect color combination for your charts from the predefined color schemes, which are based on popular tools such as [ColorBrewer](http://colorbrewer2.org/), [Microsoft Office](https://products.office.com/), and [Tableau](https://www.tableau.com/). To do so, just pick a scheme from [Color Chart](https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html) and use it as the value of the `mv-chart-theme` attribute. In that case, there is no need to specify styles via the `mv-chart-series-styles` attribute—they will be overridden by the chosen color scheme.

**Note:** If you don't specify any styling for data series via neither `mv-chart-series-styles` or `mv-chart-theme` the default color scheme (**tableau.Classic20** from [Color Chart](https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html)) will be applied.

## Advanced customization

**Caution:** This section requires an understanding of JSON. It is aimed at advanced users. You do not need to understand JSON to use Mavo and this plugin!

The Chart plugin allows you to configure some aspects of a chart look and feel and customize its behavior by setting [options](https://www.chartjs.org/docs/latest/configuration/) via the `mv-chart-options` attribute. The syntax of this attribute is a JSON-like object. `mv-chart-options` does not require curly braces. If you include them, they will be considered part of the JSON object.

Styles of data series can also be specified via a JSON-like value of the `mv-chart-series-styles` attribute. To use JSON-like syntax in the `mv-chart-series-styles` attribute, you need either [disable expressions](https://mavo.io/docs/expressions#disabling-expressions) for this attribute via the `mv-expressions-ignore` or [change the syntax of the expressions](https://mavo.io/docs/expressions#using-expressions) with the `mv-expressions` attribute.

Expressions in the `mv-chart-options` are disabled by default.

Both of these cases are shown in the **Demo** so that you can play with them.

## Localization

In case of an error, while reading the `mv-chart-series-styles` and `mv-chart-options` attributes, the plugin writes warnings in English about that to the console. You can localize these warning messages into a different language.

Here is the list of `id`s of phrases to change/localize and their default values:

| id | Default Value |
|---|---|
| `chart-styles-parse-error` | Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart. |
| `chart-options-parse-error` | Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart. |

## Further explorations

Need more examples? No problem! Examples of different charts with their code can be found [here](https://www.chartjs.org/samples/latest/).

## Credit

Besides [Chart.js](https://www.chartjs.org/) library, this plugin also uses [Colorschemes](https://nagix.github.io/chartjs-plugin-colorschemes/).
