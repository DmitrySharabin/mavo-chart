!function(t,e){const a=t=>`{${t.replace(/((rgb|hsl)a?\(.+?\))|(#?\w+)/g,t=>`"${t}"`)}}`;Mavo.Plugins.register("chart",{ready:Promise.all([t.include("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"),t.include("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.css")]).then(()=>{t.include("https://cdn.jsdelivr.net/npm/chartjs-plugin-colorschemes").then(()=>{e("canvas[mv-chart-data]:not([mv-chart-series-styles])").forEach(e=>{if(e.chart){let a=e.getAttribute("mv-chart-theme");if(a){const r=Mavo.DOMExpression.search(e,"mv-chart-theme");r&&(r.update(),a=e.getAttribute("mv-chart-theme")),t.extend(e.chart.options.plugins,{colorschemes:{scheme:a.trim(),override:!0}})}e.chart.options.legend.display&&(e.chart.options.legend.display=!1,e.chart.update(),e.chart.options.legend.display=!0),e.chart.update()}})})}),init:function(){Mavo.Expressions.skip.push("mv-chart-options"),Chart.platform.disableCSSInjection=!0},hooks:{"init-end":r=>{e("canvas[mv-chart-data]",r.element).forEach(e=>{let s=e.getAttribute("mv-chart-type");if(s){const t=Mavo.DOMExpression.search(e,"mv-chart-type");t&&(t.update(),s=e.getAttribute("mv-chart-type")),s=s.trim()}let i=e.getAttribute("mv-chart-title-position");if(i){const t=Mavo.DOMExpression.search(e,"mv-chart-title-position");t&&(t.update(),i=e.getAttribute("mv-chart-title-position")),i=i.trim()}let c=e.getAttribute("mv-chart-legend-position");if(c){const t=Mavo.DOMExpression.search(e,"mv-chart-legend-position");t&&(t.update(),c=e.getAttribute("mv-chart-legend-position")),c=c.trim()}const o={type:s||"line",options:{title:{position:i||"top"},legend:{position:c||"top"},plugins:{colorschemes:{scheme:"tableau.Classic20"}}}};if(e.chart=new Chart(e.getContext("2d"),o),e.hasAttribute("mv-chart-data")){const t=(t,e)=>{t.split(";").forEach((t,a)=>{const r=t.split(",").map(t=>+t);e.data.datasets[a]={...e.data.datasets[a],data:r}})};Mavo.DOMExpression.search(e,"mv-chart-data")?e.chartDataObserver=new Mavo.Observer(e,"mv-chart-data",()=>{t(e.getAttribute("mv-chart-data"),e.chart),e.chart.update()}):t(e.getAttribute("mv-chart-data"),e.chart)}if(e.hasAttribute("mv-chart-labels")){const t=t=>t.replace(/\\,/g,"$1").split(",").map(t=>t.replace(/\s{2,}/g," ").trim().replace("$1",","));Mavo.DOMExpression.search(e,"mv-chart-labels")?e.chartLabelsObserver=new Mavo.Observer(e,"mv-chart-labels",()=>{e.chart.data.labels=t(e.getAttribute("mv-chart-labels")),e.chart.update()}):e.chart.data.labels=t(e.getAttribute("mv-chart-labels"))}if(e.hasAttribute("mv-chart-title")){const t=(t,e)=>{const a=t.replace(/\s{2,}/g," ").trim();""===a?e.options.title.display=!1:(e.options.title.text=a,e.options.title.display=!0)};Mavo.DOMExpression.search(e,"mv-chart-title")?e.chartTitleObserver=new Mavo.Observer(e,"mv-chart-title",()=>{t(e.getAttribute("mv-chart-title"),e.chart),e.chart.update()}):t(e.getAttribute("mv-chart-title"),e.chart)}if(e.hasAttribute("mv-chart-legend")){const t=(t,e)=>{const a=t.replace(/\s{2,}/g," ").trim();""===a?e.options.legend.display=!1:(e.options.legend.display=!0,a.replace(/\\,/g,"$1").split(",").forEach((t,a)=>{e.data.datasets[a]={...e.data.datasets[a],label:t.trim().replace("$1",",")}}))};Mavo.DOMExpression.search(e,"mv-chart-legend")?e.chartLegendObserver=new Mavo.Observer(e,"mv-chart-legend",()=>{t(e.getAttribute("mv-chart-legend"),e.chart),e.chart.update()}):t(e.getAttribute("mv-chart-legend"),e.chart)}else e.chart.options.legend.display=!1;if(e.getAttribute("mv-chart-series-styles")){const t=(t,e)=>{try{t.split(";").forEach((t,r)=>e.data.datasets[r]={...e.data.datasets[r],...JSON.parse(a(t))})}catch(t){Mavo.warn(r._("chart-styles-parse-error"))}};Mavo.DOMExpression.search(e,"mv-chart-series-styles")?e.chartStylesObserver=new Mavo.Observer(e,"mv-chart-series-styles",()=>{t(e.getAttribute("mv-chart-series-styles"),e.chart),e.chart.update()}):t(e.getAttribute("mv-chart-series-styles"),e.chart)}if(e.hasAttribute("mv-chart-options"))try{const r=a(e.getAttribute("mv-chart-options"));t.extend(e.chart.options,JSON.parse(r))}catch(t){Mavo.warn(r._("chart-options-parse-error"))}})}}}),Mavo.Locale.register("en",{"chart-styles-parse-error":"Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.","chart-options-parse-error":"Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart."})}(Bliss,Bliss.$);