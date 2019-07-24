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
        hasChildren: true,
        modes: 'read', // Charts are read-only!

        init: function () {

            // Default chart
            const chartObj = {
                type: 'line',
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
                        // Known issue: can't use color functions (e.g., rgb())
                        datasets.push(Mavo.options(style));
                    });
            }

            this.chart = new Chart(this.element.getContext('2d'), chartObj);
            $.extend(this.chart.data.datasets, datasets);

            // Observers for live attributes
            if (this.element.hasAttribute('mv-chart-type')) {
                const updateType = (value) => {
                    return value.replace(/\s{2,}/g, ' ').trim();
                }

                if (Mavo.DOMExpression.search(this.element, 'mv-chart-type')) {
                    this.chartTypeObserver = new Mavo.Observer(this.element, 'mv-chart-type', () => {
                        this.chart.config.type = updateType(this.element.getAttribute('mv-chart-type'));
                        this.chart.update();
                    });
                } else {
                    this.chart.config.type = updateType(this.element.getAttribute('mv-chart-type'));
                }
            }

            if (this.element.hasAttribute('mv-chart-data')) {
                const updateData = (value, chart) => {
                    value
                        .split(';')
                        .forEach((dataset, index) => {
                            const data = dataset.split(',').map(num => +num);
                            chart.data.datasets[index] = { ...chart.data.datasets[index], data };
                        });
                }

                if (Mavo.DOMExpression.search(this.element, 'mv-chart-data')) {
                    this.chartDataObserver = new Mavo.Observer(this.element, 'mv-chart-data', () => {
                        updateData(this.element.getAttribute('mv-chart-data'), this.chart);
                        this.chart.update();
                    });
                } else {
                    updateData(this.element.getAttribute('mv-chart-data'), this.chart);
                }
            }

            if (this.element.hasAttribute('mv-chart-labels')) {
                const updateLabels = (value) => {
                    return value.split(',').map(label => label.replace(/\s{2,}/g, ' ').trim());
                }

                if (Mavo.DOMExpression.search(this.element, 'mv-chart-labels')) {
                    this.chartLabelsObserver = new Mavo.Observer(this.element, 'mv-chart-labels', () => {
                        this.chart.data.labels = updateLabels(this.element.getAttribute('mv-chart-labels'));
                        this.chart.update();
                    });
                } else {
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

                if (Mavo.DOMExpression.search(this.element, 'mv-chart-title')) {
                    this.chartTitleObserver = new Mavo.Observer(this.element, 'mv-chart-title', () => {
                        updateTitle(this.element.getAttribute('mv-chart-title'), this.chart);
                        this.chart.update();
                    });
                } else {
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
                                // What if labels contain semicolon inside?
                                // TODO: add an attribute for a delimiter
                                .split(';')
                                .forEach((label, index) => {
                                    chart.data.datasets[index] = { ...chart.data.datasets[index], label: label.trim() };
                                });
                        }
                }

                if (Mavo.DOMExpression.search(this.element, 'mv-chart-legend')) {
                    this.chartLegendObserver = new Mavo.Observer(this.element, 'mv-chart-legend', () => {
                        updateLegend(this.element.getAttribute('mv-chart-legend'), this.chart);
                        this.chart.update();
                    });
                } else {
                    updateLegend(this.element.getAttribute('mv-chart-legend'), this.chart);
                }

            }
        }
    });

})(Bliss);
