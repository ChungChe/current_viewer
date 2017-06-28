var steps = [];
var load_in_progress = false;
var index = 0;

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
phantom.javascriptEnabled = true;
page.viewportSize = {
    width: 1920,
    height: 420
};

steps = [
    function() { 
        console.log("Step 1: Open submit page...");
        page.open('http://192.168.0.101:8888', function(status) {
        });
    },
    function() {
        console.log("Step 2: select data_1hr.log...");
        page.uploadFile('input[name=upload]', '/home/duntex/data_1hr.log');
        page.evaluate(function() {
            document.getElementById('submit_button').click();
        });
    },
    function() {
        console.log("Step 3: capture current screen...");
        page.render('data_1hr.png');
    },
    function() { 
        console.log("Step 1: Open submit page...");
        page.open('http://192.168.0.101:8888', function(status) {
        });
    },
    function() {
        console.log("Step 4: select data_4hr.log...");
        page.uploadFile('input[name=upload]', '/home/duntex/data_4hr.log');
        page.evaluate(function() {
            document.getElementById('submit_button').click();
        });
    },
    function() {
        console.log("Step 5: capture current screen...");
        page.render('data_4hr.png');
    },
    function() { 
        console.log("Step 1: Open submit page...");
        page.open('http://192.168.0.101:8888', function(status) {
        });
    },
    function() {
        console.log("Step 6: select data_8hr.log...");
        page.uploadFile('input[name=upload]', '/home/duntex/data_8hr.log');
        page.evaluate(function() {
            document.getElementById('submit_button').click();
        });
    },
    function() {
        console.log("Step 7: capture current screen...");
        page.render('data_8hr.png');
    },
];

interval = setInterval(main, 2500);

function main() {
    if (load_in_progress == false && typeof steps[index] == "function") {
        steps[index]();
        index++;
    }
    if (typeof steps[index] != "function") {
        console.log("test complete");
        phantom.exit();
    }
}

page.onLoadStarted = function() {
    load_in_progress = true;
    console.log("Loading stated");
};

page.onLoadFinished = function() {
    load_in_progress = false;
    console.log("Loading finished");
};

