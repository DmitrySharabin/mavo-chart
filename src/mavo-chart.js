(function ($, $$) {
    const SELECTOR = 'canvas[mv-chart-data]';

    // Utility function for parsing styles and chart options
    const parseOptions = options => `{${options.replace(/((rgb|hsl)a?\(.+?\))|(#?\w+)/g, match => `"${match}"`)}}`;

    Mavo.Plugins.register('chart', {
        ready: Promise.all([
            $.include('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js'),
            $.include('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css')
        ]).then(() => {
            $.include('https://cdn.jsdelivr.net/npm/chartjs-plugin-colorschemes')
        }),

        // Disable expressions in the mv-chart-options attribute
        init: function () {
            Mavo.Expressions.skip.push('mv-chart-options');
        },

        hooks: {
            "init-end": env => {
                $$(SELECTOR, env.element).forEach(el =>{
                    // Parse the static attributes
                    let chartType = el.getAttribute('mv-chart-type');
                    if (chartType) {
                        const expr = Mavo.DOMExpression.search(el, 'mv-chart-type');
                        // If we have an expression, we need to evaluate it first
                        if (expr) {
                            expr.update();
                            chartType = el.getAttribute('mv-chart-type');
                        }
                        chartType = chartType.trim();
                    }
    
                    let chartTitlePosition = el.getAttribute('mv-chart-title-position');
                    if (chartTitlePosition) {
                        const expr = Mavo.DOMExpression.search(el, 'mv-chart-title-position');
                        // If we have an expression, we need to evaluate it first
                        if (expr) {
                            expr.update();
                            chartTitlePosition = el.getAttribute('mv-chart-title-position');
                        }
                        chartTitlePosition = chartTitlePosition.trim();
                    }
    
                    let chartLegendPosition = el.getAttribute('mv-chart-legend-position');
                    if (chartLegendPosition) {
                        const expr = Mavo.DOMExpression.search(el, 'mv-chart-legend-position');
                        // If we have an expression, we need to evaluate it first
                        if (expr) {
                            expr.update();
                            chartLegendPosition = el.getAttribute('mv-chart-legend-position');
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
                            },
                            plugins: {
                                colorschemes: {
                                    scheme: 'tableau.Classic20' // Apply default color scheme
                                }
                            }
                        }
                    }
    
                    const datasets = [];
    
                    // Parse styles of series of data
                    let seriesStyles = el.getAttribute('mv-chart-series-styles');
                    if (seriesStyles) {
                        const expr = Mavo.DOMExpression.search(el, 'mv-chart-series-styles');
                        // If we have an expression, we need to evaluate it first
                        if (expr) {
                            expr.update();
                            seriesStyles = el.getAttribute('mv-chart-series-styles');
                        }
                        try {
                            seriesStyles.split(';').forEach(style => datasets.push(JSON.parse(parseOptions(style))));
                        } catch (error) {
                            Mavo.warn(env._('chart-styles-parse-error'));
                        }
                    }
    
                    el.chart = new Chart(el.getContext('2d'), chartObj);
                    $.extend(el.chart.data.datasets, datasets);
    
                    // Observers for live attributes
                    if (el.hasAttribute('mv-chart-data')) {
                        const updateData = (value, chart) => {
                            value
                                .split(';')
                                .forEach((dataset, index) => {
                                    const data = dataset.split(',').map(num => +num);
                                    chart.data.datasets[index] = { ...chart.data.datasets[index], data };
                                });
                        }
    
                        // Check whether the mv-chart-data attribute value is an expression
                        if (Mavo.DOMExpression.search(el, 'mv-chart-data')) {
                            // If yes, add the corresponding observer
                            el.chartDataObserver = new Mavo.Observer(el, 'mv-chart-data', () => {
                                updateData(el.getAttribute('mv-chart-data'), el.chart);
                                el.chart.update();
                            });
                        } else {
                            // Otherwise, parse the attribute value
                            updateData(el.getAttribute('mv-chart-data'), el.chart);
                        }
                    }
    
                    if (el.hasAttribute('mv-chart-labels')) {
                        const updateLabels = (value) => {
                            return value
                                // What if labels contain commas inside?
                                // We let users escape them via backslash
                                .replace(/\\,/g, '$1')
                                .split(',')
                                .map(label => label.replace(/\s{2,}/g, ' ').trim().replace('$1', ','));
                        }
    
                        // Check whether the mv-chart-labels attribute value is an expression
                        if (Mavo.DOMExpression.search(el, 'mv-chart-labels')) {
                            // If yes, add the corresponding observer
                            el.chartLabelsObserver = new Mavo.Observer(el, 'mv-chart-labels', () => {
                                el.chart.data.labels = updateLabels(el.getAttribute('mv-chart-labels'));
                                el.chart.update();
                            });
                        } else {
                            // Otherwise, parse the attribute value
                            el.chart.data.labels = updateLabels(el.getAttribute('mv-chart-labels'));
                        }
                    }
    
                    if (el.hasAttribute('mv-chart-title')) {
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
                        if (Mavo.DOMExpression.search(el, 'mv-chart-title')) {
                            // If yes, add the corresponding observer
                            el.chartTitleObserver = new Mavo.Observer(el, 'mv-chart-title', () => {
                                updateTitle(el.getAttribute('mv-chart-title'), el.chart);
                                el.chart.update();
                            });
                        } else {
                            // Otherwise, parse the attribute value
                            updateTitle(el.getAttribute('mv-chart-title'), el.chart);
                        }
                    }
    
                    if (el.hasAttribute('mv-chart-legend')) {
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
                        if (Mavo.DOMExpression.search(el, 'mv-chart-legend')) {
                            // If yes, add the corresponding observer
                            el.chartLegendObserver = new Mavo.Observer(el, 'mv-chart-legend', () => {
                                updateLegend(el.getAttribute('mv-chart-legend'), el.chart);
                                el.chart.update();
                            });
                        } else {
                            // Otherwise, parse the attribute value
                            updateLegend(el.getAttribute('mv-chart-legend'), el.chart);
                        }
                    } else {
                        el.chart.options.legend.display = false;
                    }
    
                    if (el.hasAttribute('mv-chart-options')) {
                        try {
                            // Parse a chart options
                            const options = parseOptions(el.getAttribute('mv-chart-options'));
                            $.extend(el.chart.options, JSON.parse(options));
                        } catch (error) {
                            Mavo.warn(env._('chart-options-parse-error'));
                        }
                    }
    
                    // Add a theme to a chart if needed and override the default styling
                    let theme = el.getAttribute('mv-chart-theme');
                    if (theme) {
                        const expr = Mavo.DOMExpression.search(el, 'mv-chart-theme');
                        // If we have an expression, we need to evaluate it first
                        if (expr) {
                            expr.update();
                            theme = el.getAttribute('mv-chart-theme');
                        }
                        el.chart.options.plugins = {
                            colorschemes: {
                                scheme: theme.trim(),
                                override: true
                            }
                        }
                    }
                });
            }
        }
    });

    // Think of localization from the very beginning :)
    Mavo.Locale.register('en', {
        'chart-styles-parse-error': 'Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.',
        'chart-options-parse-error': 'Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.',
    });

})(Bliss, Bliss.$);
