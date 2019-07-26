(function ($) {
    const SELECTOR = 'canvas.mv-chart, canvas[mv-chart-data]';

    Mavo.Plugins.register('chart', {
        dependencies: [
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css'
        ]
    });

    Mavo.Elements.register('chart', {
        default: true,
        selector: SELECTOR,
        attribute: null,
        modes: 'read', // Charts are read-only!

        init: function () {

            // We don't need charts to be stored anywhere
            this.storage = 'none';

            // Default chart
            const chartObj = {
                type: this.element.getAttribute('mv-chart-type') ||'line',
                options: {
                    title: {
                        position: this.element.getAttribute('mv-chart-title-position') || 'top'
                    },
                    legend: {
                        position: this.element.getAttribute('mv-chart-legend-position') || 'top'
                    }
                }
            }

            const datasets = [];

            // Parse styles of series of data
            const seriesStyles = this.element.getAttribute('mv-chart-series-styles');
            if (seriesStyles) {
                seriesStyles
                    .replace(/\s{2,}/g, ' ')
                    .trim()
                    .split(';').forEach(style => {
                        // Known issue: need to escape commas in color functions (e.g., rgb())
                        datasets.push(Mavo.options(style));
                    });
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
                this.element.setAttribute('mv-expressions-ignore', 'mv-chart-options');
                // Parse a chart options
                const options = this.element.getAttribute('mv-chart-options').replace(/'/g, '"');
                $.extend(this.chart.options, JSON.parse(options));
            }
            console.log(this.chart.data);
        }
    });

})(Bliss);
