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
                // Chart type, make it lazy to give expressions a chance and then observe changes
                $.lazy(this.chart.config, 'type', () => {
                    this.chartTypeObserver = new Mavo.Observer(this.element, 'mv-chart-type', () => {
                        this.chart.config.type = this.element.getAttribute('mv-chart-type').replace(/\s{2,}/g, ' ').trim();
                        this.chart.update();
                    });

                    return this.element.getAttribute('mv-chart-type').replace(/\s{2,}/g, ' ').trim();
                });
            }

            if (this.element.hasAttribute('mv-chart-data')) {
                // Chart data, make it lazy to give expressions a chance and then observe changes
                // TODO

                this.chartDataObserver = new Mavo.Observer(this.element, 'mv-chart-data', () => {
                    this.element.getAttribute('mv-chart-data')
                        .split(';')
                        .forEach((dataset, index) => {
                            const data = dataset.split(',').map(num => +num);
                            this.chart.data.datasets[index] = { ...this.chart.data.datasets[index], data };
                        });
                    this.chart.update();
                });
            }

            if (this.element.hasAttribute('mv-chart-labels')) {
                // Chart labels, make it lazy to give expressions a chance and then observe changes
                $.lazy(this.chart.data, 'labels', () => {
                    this.chartLabelsObserver = new Mavo.Observer(this.element, 'mv-chart-labels', () => {
                        this.chart.data.labels = this.element.getAttribute('mv-chart-labels').split(',').map(label => label.replace(/\s{2,}/g, ' ').trim());
                        this.chart.update();
                    });

                    return this.element.getAttribute('mv-chart-labels').split(',').map(label => label.replace(/\s{2,}/g, ' ').trim());
                });
            }

            if (this.element.hasAttribute('mv-chart-title')) {
                // Chart title, make it lazy to give expressions a chance and then observe changes
                $.lazy(this.chart.options.title, 'text', () => {
                    this.chartTitleObserver = new Mavo.Observer(this.element, 'mv-chart-title', () => {
                        const title = this.element.getAttribute('mv-chart-title').replace(/\s{2,}/g, ' ').trim();
                        if (title === '') {
                            this.chart.options.title.display = false;
                        } else {
                            this.chart.options.title.text = title;
                            this.chart.options.title.display = true;
                        }
                        this.chart.update();
                    });

                    return this.element.getAttribute('mv-chart-title').replace(/\s{2,}/g, ' ').trim();
                });

                if (this.chart.options.title.text !== '') {
                    this.chart.options.title.display = true;
                }
            }

            if (this.element.hasAttribute('mv-chart-legend')) {
                // Chart legend, make it lazy to give expressions a chance and then observe changes
                // TODO

                this.chartLegendObserver = new Mavo.Observer(this.element, 'mv-chart-legend', () => {
                    const legend = this.element.getAttribute('mv-chart-legend').replace(/\s{2,}/g, ' ').trim();
                    if (legend === '') {
                        this.chart.options.legend.display = false;
                    } else {
                        this.chart.options.legend.display = true;
                        legend
                            // What if labels contain semicolon inside?
                            .split(';')
                            .forEach((label, index) => {
                                this.chart.data.datasets[index] = { ...this.chart.data.datasets[index], label: label.trim() };
                            });
                    }
                    this.chart.update();
                });
            }
        }
    });

})(Bliss);
