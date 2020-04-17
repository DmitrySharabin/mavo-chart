(function ($, $$) {
    const SELECTOR = 'canvas[mv-chart-data]';

    // Utility function for parsing styles and chart options
    const parseOptions = options => `{${options.replace(/((rgb|hsl)a?\(.+?\))|(#?\w+)/g, match => `"${match}"`)}}`;

    Mavo.Plugins.register('chart', {
        ready: Promise.all([
            $.include('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js'),
            $.include('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css')
        ]).then(() => {
            $.include('https://cdn.jsdelivr.net/npm/chartjs-plugin-colorschemes')
        }),

        // Disable expressions in the mv-chart-options attribute
        init: function () {
            Mavo.Expressions.skip.push('mv-chart-options');
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
                const expr = Mavo.DOMExpression.search(this.element, 'mv-chart-type');
                // If we have an expression, we need to evaluate it first
                if (expr) {
                    expr.update();
                    chartType = this.element.getAttribute('mv-chart-type');
                }
                chartType = chartType.trim();
            }

            let chartTitlePosition = this.element.getAttribute('mv-chart-title-position');
            if (chartTitlePosition) {
                const expr = Mavo.DOMExpression.search(this.element, 'mv-chart-title-position');
                // If we have an expression, we need to evaluate it first
                if (expr) {
                    expr.update();
                    chartTitlePosition = this.element.getAttribute('mv-chart-title-position');
                }
                chartTitlePosition = chartTitlePosition.trim();
            }

            let chartLegendPosition = this.element.getAttribute('mv-chart-legend-position');
            if (chartLegendPosition) {
                const expr = Mavo.DOMExpression.search(this.element, 'mv-chart-legend-position');
                // If we have an expression, we need to evaluate it first
                if (expr) {
                    expr.update();
                    chartLegendPosition = this.element.getAttribute('mv-chart-legend-position');
                }
                chartLegendPosition = chartLegendPosition.trim();
            }

            // Default chart
            const chartObj = {
                type: chartType || 'line',
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
                try {
                    seriesStyles.split(';').forEach(style => datasets.push(JSON.parse(parseOptions(style))));
                } catch (error) {
                    Mavo.warn(this.mavo._('chart-styles-parse-error'));
                }
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
                    return value
                        // What if labels contain commas inside?
                        // We let users escape them via backslash
                        .replace(/\\,/g, '$1')
                        .split(',')
                        .map(label => label.replace(/\s{2,}/g, ' ').trim().replace('$1', ','));
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
                            // What if legend contains commas inside?
                            // We let users escape them via backslash
                            .replace(/\\,/g, '$1')
                            .split(',')
                            .forEach((label, index) => {
                                chart.data.datasets[index] = { ...chart.data.datasets[index], label: label.trim().replace('$1', ',') };
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
                try {
                    // Parse a chart options
                    const options = parseOptions(this.element.getAttribute('mv-chart-options'));
                    $.extend(this.chart.options, JSON.parse(options));
                } catch (error) {
                    Mavo.warn(this.mavo._('chart-options-parse-error'));
                }
            }

            // Add a theme to a chart if needed and override the default styling
            let theme = this.element.getAttribute('mv-chart-theme');
            if (theme) {
                const expr = Mavo.DOMExpression.search(this.element, 'mv-chart-theme');
                // If we have an expression, we need to evaluate it first
                if (expr) {
                    expr.update();
                    theme = this.element.getAttribute('mv-chart-theme');
                }
                this.chart.options.plugins = {
                    colorschemes: {
                        scheme: theme.trim(),
                        override: true
                    }
                };
            } else {
                this.chart.options.plugins = {
                    colorschemes: {
                        scheme: 'tableau.Classic20' // Apply default color scheme
                    }
                };
            }
        }
    });

    // Think of localization from the very beginning :)
    Mavo.Locale.register('en', {
        'chart-styles-parse-error': 'Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.',
        'chart-options-parse-error': 'Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.',
    });

})(Bliss, Bliss.$);
