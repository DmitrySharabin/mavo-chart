!function(t,e){const s=t=>`{${t.replace(/((rgb|hsl)a?\(.+?\))|(#?\w+)/g,t=>`"${t}"`)}}`;Mavo.Plugins.register("chart",{dependencies:["https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js","https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css","https://cdn.jsdelivr.net/npm/chartjs-plugin-colorschemes"],init:function(){Mavo.Expressions.skip.push("mv-chart-options")}}),Mavo.Elements.register("chart",{default:!0,selector:"canvas.mv-chart, canvas[mv-chart-data]",attribute:null,modes:"read",init:function(){this.storage="none";let e=this.element.getAttribute("mv-chart-type");if(e){const t=Mavo.DOMExpression.search(this.element,"mv-chart-type");t&&(t.update(),e=this.element.getAttribute("mv-chart-type")),e=e.trim()}let a=this.element.getAttribute("mv-chart-title-position");if(a){const t=Mavo.DOMExpression.search(this.element,"mv-chart-title-position");t&&(t.update(),a=this.element.getAttribute("mv-chart-title-position")),a=a.trim()}let i=this.element.getAttribute("mv-chart-legend-position");if(i){const t=Mavo.DOMExpression.search(this.element,"mv-chart-legend-position");t&&(t.update(),i=this.element.getAttribute("mv-chart-legend-position")),i=i.trim()}const r={type:e||"line",options:{title:{position:a||"top"},legend:{position:i||"top"},plugins:{colorschemes:{scheme:"tableau.Classic20"}}}},h=[];let n=this.element.getAttribute("mv-chart-series-styles");if(n){const t=Mavo.DOMExpression.search(this.element,"mv-chart-series-styles");t&&(t.update(),n=this.element.getAttribute("mv-chart-series-styles"));try{n.split(";").forEach(t=>h.push(JSON.parse(s(t))))}catch(t){Mavo.warn(this.mavo._("chart-styles-parse-error"))}}if(this.chart=new Chart(this.element.getContext("2d"),r),t.extend(this.chart.data.datasets,h),this.element.hasAttribute("mv-chart-data")){const t=(t,e)=>{t.split(";").forEach((t,s)=>{const a=t.split(",").map(t=>+t);e.data.datasets[s]={...e.data.datasets[s],data:a}})};Mavo.DOMExpression.search(this.element,"mv-chart-data")?this.chartDataObserver=new Mavo.Observer(this.element,"mv-chart-data",()=>{t(this.element.getAttribute("mv-chart-data"),this.chart),this.chart.update()}):t(this.element.getAttribute("mv-chart-data"),this.chart)}if(this.element.hasAttribute("mv-chart-labels")){const t=t=>t.replace(/\\,/g,"$1").split(",").map(t=>t.replace(/\s{2,}/g," ").trim().replace("$1",","));Mavo.DOMExpression.search(this.element,"mv-chart-labels")?this.chartLabelsObserver=new Mavo.Observer(this.element,"mv-chart-labels",()=>{this.chart.data.labels=t(this.element.getAttribute("mv-chart-labels")),this.chart.update()}):this.chart.data.labels=t(this.element.getAttribute("mv-chart-labels"))}if(this.element.hasAttribute("mv-chart-title")){const t=(t,e)=>{const s=t.replace(/\s{2,}/g," ").trim();""===s?e.options.title.display=!1:(e.options.title.text=s,e.options.title.display=!0)};Mavo.DOMExpression.search(this.element,"mv-chart-title")?this.chartTitleObserver=new Mavo.Observer(this.element,"mv-chart-title",()=>{t(this.element.getAttribute("mv-chart-title"),this.chart),this.chart.update()}):t(this.element.getAttribute("mv-chart-title"),this.chart)}if(this.element.hasAttribute("mv-chart-legend")){const t=(t,e)=>{const s=t.replace(/\s{2,}/g," ").trim();""===s?e.options.legend.display=!1:(e.options.legend.display=!0,s.replace(/\\,/g,"$1").split(",").forEach((t,s)=>{e.data.datasets[s]={...e.data.datasets[s],label:t.trim().replace("$1",",")}}))};Mavo.DOMExpression.search(this.element,"mv-chart-legend")?this.chartLegendObserver=new Mavo.Observer(this.element,"mv-chart-legend",()=>{t(this.element.getAttribute("mv-chart-legend"),this.chart),this.chart.update()}):t(this.element.getAttribute("mv-chart-legend"),this.chart)}else this.chart.options.legend.display=!1;if(this.element.hasAttribute("mv-chart-options"))try{const e=s(this.element.getAttribute("mv-chart-options"));t.extend(this.chart.options,JSON.parse(e))}catch(t){Mavo.warn(this.mavo._("chart-options-parse-error"))}let l=this.element.getAttribute("mv-chart-theme");if(l){const t=Mavo.DOMExpression.search(this.element,"mv-chart-theme");t&&(t.update(),l=this.element.getAttribute("mv-chart-theme")),this.chart.options.plugins={colorschemes:{scheme:l.trim(),override:!0}}}}}),Mavo.Locale.register("en",{"chart-styles-parse-error":"Invalid mv-chart-series-styles attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart.","chart-options-parse-error":"Invalid mv-chart-options attribute value. For more information, visit the plugin page on https://plugins.mavo.io/plugin/chart."})}(Bliss,Bliss.$);