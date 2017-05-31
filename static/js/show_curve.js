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
            value: amp
        });
    }
    return chartData;
}

function update_amchart(json_data) {
    var chart_data = generateChartData(json_data);
	var chart = AmCharts.makeChart("my_amchart", {
		"type": "serial",
		"theme": "light",
		"marginRight": 80,
		"autoMarginOffset": 20,
		"marginTop": 7,
		"dataProvider": chart_data,
		"valueAxes": [{
			"axisAlpha": 0.2,
			"dashLength": 1,
			"position": "left"
		}],
		"mouseWheelZoomEnabled": true,
		"graphs": [{
			"id": "g1",
			"balloonText": "[[value]]",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"hideBulletsCount": 50,
			"title": "red line",
			"valueField": "value",
			"useLineColorForBulletBorder": true,
			"balloon":{
				"drop":true
			},
            "fillAlphas": 0.2
		}],
		"chartScrollbar": {
			"autoGridCount": true,
			"graph": "g1",
			"scrollbarHeight": 40
		},
		"chartCursor": {
		   "limitToGraph":"g1"
		},
		"categoryField": "date",
		"categoryAxis": {
            "minPeriod" : "ss",
			"parseDates": true,
			"axisColor": "#DADADA",
			"dashLength": 1,
			"minorGridEnabled": true
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
            json_data.push({'datetime': toks[0] + " " + toks[1], 'value': parseFloat(toks[2])});
        }
        update_amchart(json_data)
});
