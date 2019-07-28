(function ($, $$) {
    const SELECTOR = 'canvas.mv-chart, canvas[mv-chart-data]';

    // For these types of charts, styles are handled differently
    const specialChartTypes = ['pie', 'doughnut', 'polarArea'];

    // Random color generator
    // Credit: https://www.paulirish.com/2009/random-hex-color-code-snippets/
    const randomColor = () => {
        return `#${Math.random().toString(16).slice(2, 8).slice(-6)}`;
    }

    // Utility function for parsing styles and chart options
    const parseOptions = options => `{${options.replace(/((rgb|hsl)a?\(.+\))|(#?\w+)/g, match => `"${match}"`)}}`;

    Mavo.Plugins.register('chart', {
        dependencies: [
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css'
        ],

        // Disable expressions in the mv-chart-options attribute
        init: function () {
            for (element of $$(SELECTOR)) {
                let ignoredAttributes = ['mv-chart-options'];
                if (element.hasAttribute('mv-expressions-ignore')) {
                    element.getAttribute('mv-expressions-ignore').split(',').forEach(el => {
                        Mavo.pushUnique(ignoredAttributes, el.trim());
                    });
                }
                element.setAttribute('mv-expressions-ignore', ignoredAttributes.join(', '));
            }
        }
    });

    Mavo.Elements.register('chart', {
        default: true,
        selector: SELECTOR,
        attribute: null,
        modes: 'read', // Charts are read-only!

        init: function () {

            // We don't need charts to be stored anywhere
            this.storage = 'none';

            // Parse the static attributes
            let chartType = this.element.getAttribute('mv-chart-type');
            if (chartType) {
                chartType = chartType.replace(/\s{2,}/g, ' ').trim();
            }

            let chartTitlePosition = this.element.getAttribute('mv-chart-title-position');
            if (chartTitlePosition) {
                chartTitlePosition = chartTitlePosition.replace(/\s{2,}/g, ' ').trim();
            }

            let chartLegendPosition = this.element.getAttribute('mv-chart-legend-position');
            if (chartLegendPosition) {
                chartLegendPosition = chartLegendPosition.replace(/\s{2,}/g, ' ').trim();
            }

            // Default chart
            const chartObj = {
                type: chartType ||'line',
                options: {
                    title: {
                        position: chartTitlePosition || 'top'
                    },
                    legend: {
                        position: chartLegendPosition || 'top'
                    }
                }
            }

            const datasets = [];

            // Parse styles of series of data
            let seriesStyles = this.element.getAttribute('mv-chart-series-styles');
            if (seriesStyles) {
                const expr = Mavo.DOMExpression.search(this.element, 'mv-chart-series-styles');
                // If we have an expression, we need to evaluate it first
                if (expr) {
                    expr.update();
                    seriesStyles = this.element.getAttribute('mv-chart-series-styles');
                }
                seriesStyles.split(';').forEach(style => datasets.push(JSON.parse(parseOptions(style))));
            }

            this.chart = new Chart(this.element.getContext('2d'), chartObj);
            $.extend(this.chart.data.datasets, datasets);

            // Observers for live attributes
            if (this.element.hasAttribute('mv-chart-data')) {
                const updateData = (value, chart) => {
                    value
                        .split(';')
                        .forEach((dataset, index) => {
                            const data = dataset.split(',').map(num => +num);
                            chart.data.datasets[index] = { ...chart.data.datasets[index], data };
                            // Styles haven't been set via the mv-chart-series-styles attribute,
                            // or we have a new series of data
                            if (index >= datasets.length) {
                                // Add new styles depending on the chart type
                                if (specialChartTypes.includes(chart.config.type)) {
                                    // What if there were colors already?
                                    // Save previously added colors and add new if needed
                                    let numColors;
                                    if (chart.data.datasets[index].backgroundColor) {
                                        numColors = chart.data.datasets[index].backgroundColor.length;
                                    } else {
                                        chart.data.datasets[index].backgroundColor = [];
                                        numColors = 0;
                                    }
                                    for (let i = numColors; i < data.length; i++) {
                                        chart.data.datasets[index].backgroundColor.push(randomColor());
                                    }
                                } else {
                                    const color = randomColor();
                                    chart.data.datasets[index] = {
                                        ...chart.data.datasets[index],
                                        borderColor: color,
                                        backgroundColor: `${color}4d` // Add the alpha channel to the generated color
                                    };
                                }
                            }
                        });
                }

                // Check whether the mv-chart-data attribute value is an expression
                if (Mavo.DOMExpression.search(this.element, 'mv-chart-data')) {
                    // If yes, add the corresponding observer
                    this.chartDataObserver = new Mavo.Observer(this.element, 'mv-chart-data', () => {
                        updateData(this.element.getAttribute('mv-chart-data'), this.chart);
                        this.chart.update();
                    });
                } else {
                    // Otherwise, parse the attribute value
                    updateData(this.element.getAttribute('mv-chart-data'), this.chart);
                }
            }

            if (this.element.hasAttribute('mv-chart-labels')) {
                const updateLabels = (value) => {
                    return value.split(',').map(label => label.replace(/\s{2,}/g, ' ').trim());
                }

                // Check whether the mv-chart-labels attribute value is an expression
                if (Mavo.DOMExpression.search(this.element, 'mv-chart-labels')) {
                    // If yes, add the corresponding observer
                    this.chartLabelsObserver = new Mavo.Observer(this.element, 'mv-chart-labels', () => {
                        this.chart.data.labels = updateLabels(this.element.getAttribute('mv-chart-labels'));
                        this.chart.update();
                    });
                } else {
                    // Otherwise, parse the attribute value
                    this.chart.data.labels = updateLabels(this.element.getAttribute('mv-chart-labels'));
                }
            }

            if (this.element.hasAttribute('mv-chart-title')) {
                const updateTitle = (value, chart) => {
                    const title = value.replace(/\s{2,}/g, ' ').trim();
                        if (title === '') {
                            chart.options.title.display = false;
                        } else {
                            chart.options.title.text = title;
                            chart.options.title.display = true;
                        }
                }

                // Check whether the mv-chart-title attribute value is an expression
                if (Mavo.DOMExpression.search(this.element, 'mv-chart-title')) {
                    // If yes, add the corresponding observer
                    this.chartTitleObserver = new Mavo.Observer(this.element, 'mv-chart-title', () => {
                        updateTitle(this.element.getAttribute('mv-chart-title'), this.chart);
                        this.chart.update();
                    });
                } else {
                    // Otherwise, parse the attribute value
                    updateTitle(this.element.getAttribute('mv-chart-title'), this.chart);
                }
            }

            if (this.element.hasAttribute('mv-chart-legend')) {
                const updateLegend = (value, chart) => {
                    const legend = value.replace(/\s{2,}/g, ' ').trim();
                        if (legend === '') {
                            chart.options.legend.display = false;
                        } else {
                            chart.options.legend.display = true;
                            legend
                                // What if labels contain commas inside?
                                // TODO: add an escape via backslash feature
                                .split(',')
                                .forEach((label, index) => {
                                    chart.data.datasets[index] = { ...chart.data.datasets[index], label: label.trim() };
                                });
                        }
                }

                // Check whether the mv-chart-legend attribute value is an expression
                if (Mavo.DOMExpression.search(this.element, 'mv-chart-legend')) {
                    // If yes, add the corresponding observer
                    this.chartLegendObserver = new Mavo.Observer(this.element, 'mv-chart-legend', () => {
                        updateLegend(this.element.getAttribute('mv-chart-legend'), this.chart);
                        this.chart.update();
                    });
                } else {
                    // Otherwise, parse the attribute value
                    updateLegend(this.element.getAttribute('mv-chart-legend'), this.chart);
                }
            } else {
                this.chart.options.legend.display = false;
            }

            if (this.element.hasAttribute('mv-chart-options')) {
                // Parse a chart options
                const options = parseOptions(this.element.getAttribute('mv-chart-options'));
                $.extend(this.chart.options, JSON.parse(options));
            }
        }
    });

})(Bliss, Bliss.$);
