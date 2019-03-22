<template>
	<highcharts :options="options" :constructor-type="'stockChart'" ref="sltpchart"></highcharts>
</template>

<script>
import ChartSlider from '@/utils/dualslider'
import {mapState} from 'vuex'

const ONE_YEAR = 1000*60*60*24*365;

const OPT = {
  MAIN: {
    id: 'main_chart',
    color: '#2196F3'
  },
  SL: {
    id: 'opt_sl_line',
    color: '#EF5350',   // Red
    dashStyle: '',
    axis: 0,
    name: 'Opt SL',
    showInNavigator: true
  },
  TP: {
    id: 'opt_tp_line',
    color: '#4CAF50',   // Green
    dashStyle: '',
    axis: 0,
    name: 'Opt TP',
    showInNavigator: true
  },
  EXT: {
    id: 'opt_ext_line',
    color: 'blue',   // Blue
    dashStyle: '',
    axis: 0,
    name: 'E[x_0] NBC',
    showInNavigator: true
  },
  MAX: {
    id: 'opt_max_Line',
    color: 'yellow',   // Teal
    dashStyle: 'Dot',
    axis: 1,
    name: 'Max EIR',
    showInNavigator: false
  },
  TRADE: {
    id: 'opt_trade_line',
    color: '#E1BEE7',   // Purple
    dashStyle: 'Dot',
    axis: 2,
    name: 'Trad P/L Ratio',
    showInNavigator: false
  },
  PLOT_BAND: {
    id: 'plotband',
    color: 'rgba(0, 0, 0, 0.15)'  // Dark Grey
  }
}

const createSeries = (lastDate, series) => {
	const arr = []
	for(let prop in series) {
		let date = lastDate + (prop * ONE_YEAR)
		arr.push([date, series[prop]])
	}

	return arr;
}

const startTypes = ['mousedown', 'touchstart']
const moveTypes = ['mousemove', 'touchmove']
const endTypes = ['mouseup', 'touchend']

const addListeners = (container, types, fn) => {
	types.forEach(type => {
		container.addEventListener(type, fn, {
			capture: false,
			passive: true
		});
	})
}

const removeListeners = (container, types, fn) => {
	types.forEach(type => {
		container.removeEventListener(type, fn, {
			capture: false,
			passive: true
		});
	})
}

const options = (vm) => {
	return {
		chart: {
			height:500,
      backgroundColor: vm._props.backgroundColor
		},
		rangeSelector: {
			selected: 3	,
			buttons: [{
				type: 'year',
				count: 1,
				text: '1y'
			},{
				type: 'year',
				count: 2,
				text: '2y'
			},{
				type: 'year',
				count: 3,
				text: '3y'
			},{
				type: 'year',
				count: 4,
				text: '4y'
			},
			{
				type: 'year',
				count: 5,
				text: '5y'
			},{
				type: 'all',
				text: 'All'
			}]
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
			ordinal: false,
			title: {
				text: null
			}
		},
		yAxis: [{
      title: {
        text: ''
      },
      crosshair:false,  
      events : {
        afterSetExtremes: function(e) {
          console.log(e)
          // $("#chart_container").trigger("main-chart:setExtremes", e);
        }
      },
      plotLines: [],
      opposite:true,
      visible: true,
      offset: 28,
      tickWidth: 0
      },{
      title: {
        text: 'Information Ratio',
        style: {  
          color:'yellow'
        }
      },
      visible: false,
      opposite:true,
      tickWidth: 0,
      offset: 28,
      labels: {
        style: {  
          color:'yellow'
        }
      }},{
      title: {
        text: 'trad P/L ratio',
        style: {  
          color:'#E1BEE7'
        }
      },
      visible: false,
      opposite:true,
      tickWidth: 0,    
      labels: {
        style: {  
          color:'#E1BEE7'
        }
      }
    }],
		legend: {
			enabled: false
		},
		tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br><br/>',
      valueDecimals: 3,
      shared: true
    },
		plotOptions: {
			series : {
        dataGrouping : {
          dateTimeLabelFormats : {
            millisecond: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            second: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            minute: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            hour: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            day: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            week: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            month: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M'],
            year: ['%e %b %Y', '%m/%e/%y %H:%M', '-%H:%M']
          }
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          chart: {
            height: 300
          },
          subtitle: {
            text: null
          },
          navigator: {
            enabled: true
          },
          rangeSelector: {
            inputEnabled:false
          }
        }
      }]
    }
	}
}

export default {
	data() {
		return {
			options: options(this)
		}
	},
	props: {
		height: {
			type: Number,
			default: 280
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		},
	},
	computed: {
		...mapState('fit', ['strategy', 'opt', 'userDate'])
	},
	watch: {
		strategy() {
			this.drawStrategyChart();
		},
		opt() {
      this.drawOptChart()
		}
	},
	mounted() {
		this.drawStrategyChart();
	},
	methods: {

		drawStrategyChart() {
			const chart = this.$refs.sltpchart.chart
			const existing = chart.get(OPT.MAIN.id)
			if(existing) {
				existing.remove();
			}
			if(this.strategy.ts.data) {
				chart.addSeries({
					type: 'line',
					data: this.strategy.ts.data,
					id: OPT.MAIN.id,
          color: OPT.MAIN.color,
          showInNavigator: true,
          name: this.strategy.name
				});
			}
			chart.reflow()
    },
    
    drawOptChart() {
      let maxHorizon = this.userDate;
      
      if(this.opt.SL) {
        let data = createSeries(this.userDate, this.opt.SL)
        maxHorizon = Math.max(maxHorizon, data[data.length - 1][0])
        this.drawOptLine(OPT.SL, data)
        
        data = createSeries(this.userDate, this.opt.TP)
        maxHorizon = Math.max(maxHorizon, data[data.length - 1][0])
        this.drawOptLine(OPT.TP, data)

        
        data = createSeries(this.userDate, this.opt.Ext)
        maxHorizon = Math.max(maxHorizon, data[data.length - 1][0])
        this.drawOptLine(OPT.EXT, data)

        data = createSeries(this.userDate, this.opt.maxVal)
        maxHorizon = Math.max(maxHorizon, data[data.length - 1][0])
        this.drawOptLine(OPT.MAX, data)

        data = createSeries(this.userDate, this.opt.tradePL)
        maxHorizon = Math.max(maxHorizon, data[data.length - 1][0])
        this.drawOptLine(OPT.TRADE, data)

        this.addPlotBand(this.userDate, maxHorizon)
        this.addToolTipListeners()
      }
    },

    drawOptLine(opts, data) {
      const chart = this.$refs.sltpchart.chart
			const existing = chart.get(opts.id)
			if(existing) {
				existing.remove();
      }
      
      chart.addSeries({
        type: 'line',
        data: data,
        id: opts.id,
        name: opts.name,
        color: opts.color,
        showInNavigator: opts.showInNavigator,
        yAxis: opts.axis,
        dashStyle: opts.dashStyle
      });

      chart.yAxis[opts.axis].update({visible:true})
      
			chart.reflow()
    },

		addPlotBand(from, to) {
      const chart = this.$refs.sltpchart.chart
      const existing = chart.get(OPT.PLOT_BAND.id)
			if(existing) {
				existing.remove();
			}
      chart.xAxis[0].addPlotBand({
        from: from,
        to: to,
        color: OPT.PLOT_BAND.color,
        id: OPT.PLOT_BAND.id,
        zIndex:20,
        events: {
          click: function (e) {
            // self.eventBus.trigger('main-chart:fixBands')
          }
        }
      });
      chart.xAxis[0].setExtremes(from - 4 * ONE_YEAR, to); // my addition as it was going to 'all' by default
    },

    addToolTipListeners() {
      const fn = () => {
        const toolTips = this.$el.querySelectorAll('.highcharts-tooltip text')
        for(let tip of toolTips) {
          let txt = tip.textContent
          if(txt && (txt.indexOf('opt TP') != -1 || 
                     txt.indexOf('opt SL') != -1 || 
                     txt.indexOf('opt Exp') != -1)) {
              let str = txt.split(':');
              this.$emit('tooltip-move', {
                control: str[0],
                value:str[1]
              })
          }
          else if(txt && txt.indexOf(':') == -1) {
            this.$emit('tooltip-move', {
              control: 'Date',
              value: txt
            })
          }
        }
      }
      removeListeners(this.$el, moveTypes, fn)
      addListeners(this.$el, moveTypes, fn)
    },

    addPlotLines(max, min) {
      const chart = this.$refs.sltpchart.chart
      chart.yAxis[0].addPlotLine({
          value: min, // orig: min
          color: 'red',  // TODO: add param to define whether SL or TP (TP = green, SL = red)
          width: 2,
          label: {
            align:'center',
            useHTML: true,
            text: '<span class="axis-label lower"></span>'
          },
          id:'sl-plotline'
      });
      chart.yAxis[0].addPlotLine({
          value: max, // orig: max
          color: 'green',  // TODO: add param to define whether SL or TP (TP = green, SL = red)
          width: 2,
          label: {
            align:'center',
            useHTML: true,
            text: '<span class="axis-label upper"></span>'
          },
          id:'tp-plotline'
      });
    },
	}
}
</script>

<style scoped>
.axis-label {
	width: 22px;
	height: 22px;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	cursor: ew-resize;
	background-color:#42A5F5;
	position: relative;
	top:6px;
	left:120px;
}
</style>