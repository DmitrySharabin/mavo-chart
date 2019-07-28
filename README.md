# Mavo Chart

To use, either give a class of `mv-chart` or specify chart data via the `mv-chart-data` attribute to the `canvas` element you want to enable Chart on.

## Demo

```markup
<main mv-app="chartDemo" mv-source="example.json">
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

    <!-- Chart -->
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
```

## Core attributes

**Note:** The ***Live?*** column refers to whether changes to the value of this attribute (e.g., via [expressions](https://mavo.io/docs/expressions) or even custom JavaScript) will have an effect.

| Name                       | Purpose | Live? | Default Value |
|----------------------------|---------|-------|---------------|
| `mv-chart-type`            |         |       | `Line`        |
| `mv-chart-data`            |         | ✔︎     |               |
| `mv-chart-labels`          |         | ✔︎     |               |
| `mv-chart-title`           |         | ✔︎     |               |
| `mv-chart-title-position`  |         |       | `Top`         |
| `mv-chart-legend`          |         | ✔︎     |               |
| `mv-chart-legend-position` |         |       | `Top`         |

## Data series customization

The Chart plugin supports [a number of options for styling data series](https://www.chartjs.org/docs/latest/configuration/elements.html#line-configuration). You can specify these options on a per-series basis by using the `mv-chart-series-styles` attribute.
The syntax of this attribute is a CSS-like list of declarations, where you should use commas to separate the option-value pairs and semicolons to separate style declarations of different series.

## Advanced customization

**Caution:** This section requires an understanding of JSON. It is aimed at advanced users. You do not need to understand JSON to use Mavo and this plugin!

`mv-chart-options`

Examples of different charts with their code can be found [here](https://www.chartjs.org/samples/latest/).
