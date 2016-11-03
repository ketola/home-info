console.log('Loading function lambda-weather');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();
var WeatherService = require('./WeatherService.js');

exports.handler = function(event, context) {
	console.log("Request received:\n", JSON.stringify(event));
	console.log("Context received:\n", JSON.stringify(context));
	
	var tableName = "weather";
	
    WeatherService.load(function(weather){
		console.log("Weather received:" + JSON.stringify(weather));
    
		dynamodb.put({
				"TableName": tableName,
				"Item": weather
			}, function(err, data) {
			if (err) {
				context.fail('ERROR: Dynamo failed: ' + err);
			} else {
				console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
				context.succeed(data);
			}
        });
	});
}