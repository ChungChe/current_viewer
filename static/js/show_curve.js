// this method is called when chart is first inited as we listen for "rendered" event
function zoomChart(chart, chartData) {
    if (chartData == null) {
        return;
    }
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 30000, chartData.length - 1);
}

function generateChartData(data_from_python) {
    var chartData = [];

    for (i in data_from_python) {
        datetimeStr = data_from_python[i].datetime;
        dateTime = datetimeStr.split(" ")
        var date = dateTime[0].split("/");
        var yy = date[0];
        var mm = date[1]-1;
        var dd = date[2];

        var time = dateTime[1].split(":");
        var hh = time[0];
        var m = time[1];
        var ss = parseInt(time[2]);

        var newDate = new Date(yy, mm, dd, hh, m, ss);
        var amp = parseFloat(data_from_python[i].value)
        chartData.push({
            date: newDate,
            value: amp,
            temp: parseFloat(data_from_python[i].temp),
            value6: parseFloat(data_from_python[i].value6)
        });
    }
    return chartData;
}

function update_amchart(json_data) {
    var chart_data = generateChartData(json_data);
	var chart = AmCharts.makeChart("my_amchart", {
		"type": "serial",
		"theme": "light",
		"fontSize": 16,
		"marginRight": 80,
		"autoMarginOffset": 20,
		"marginTop": 10,
		"dataProvider": chart_data,
        "legend": {
			"autoMargins": false,
			"borderAlpha": 0.2,
			"equalWidths": false,
			"horizontalGap": 10,
			"markerSize": 20,
			"useGraphSettings": true,
			"valueAlign": "left",
			"valueWidth": 10
    	},
		"valueAxes": [{
            "id": "currentAxis",
			"axisAlpha": 0.2,
			"dashLength": 1,
			"position": "left"
		}, {
            "id": "tempAxis",
            "axisAlpha": 0.1,
            "dashLength" : 1,
            "position": "right"
        }],
		"mouseWheelZoomEnabled": true,
		"graphs": [{
			"balloonText": "filter: [[value]] A",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"hideBulletsCount": 50,
			"title": "濾濾機",
			"valueField": "value",
            "legendPeriodValueText": "[[value]] A",
			"useLineColorForBulletBorder": true,
			"balloon":{
				"drop":true
			},
            "fillAlphas": 0.2,
            "valueAxis": "currentAxis",
            "negativeLineColor": "#b60000",
            "negativeBase": 80
		}, { 
			"balloonText": "6th: [[value]] A",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"hideBulletsCount": 50,
			"title": "第六台",
			"valueField": "value6",
            "legendPeriodValueText": "[[value]] A",
			"useLineColorForBulletBorder": true,
			"balloon":{
				"drop":true
			},
            "fillAlphas": 0.0,
            "valueAxis": "currentAxis",
        }, {
			"balloonText": "[[value]]°C",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"hideBulletsCount": 50,
			"title": "溫度",
			"valueField": "temp",
			"useLineColorForBulletBorder": true,
            "legendPeriodValueText": "[[value]] °C",
			"balloon":{
				"drop":true
			},
            "fillAlphas": 0.0,
            "valueAxis": "tempAxis",

        }],
		"chartScrollbar": {
			"autoGridCount": true,
			"scrollbarHeight": 40
		},
		"chartCursor": {
		},
		"categoryField": "date",
		"categoryAxis": {
            "minPeriod" : "ss",
			"parseDates": true,
			"axisColor": "#DADADA",
			"dashLength": 1,
			"minorGridEnabled": true,
		},
		"export": {
			"enabled": true
		}
	});
	chart.addListener("rendered", zoomChart);
	zoomChart(chart, chart_data);
}

$(function() {
        json_data = [];
        for (i = 0; i < qq['data'].length; ++i) {
            var toks = qq['data'][i].split(" ");
            json_data.push({'datetime': toks[0] + " " + toks[1], 
                    'value': parseFloat(toks[2]), 
                    'temp': parseFloat(toks[3]),
                    'value6': parseFloat(toks[4])});
        }
        update_amchart(json_data)
});
