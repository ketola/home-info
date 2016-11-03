console.log('Loading function lambda-weather');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
	console.log("Request received:\n", JSON.stringify(event));
	console.log("Context received:\n", JSON.stringify(context));
	
	var tableName = "weather";
	
	switch (event.httpMethod) {
	case 'GET':{
		dynamodb.get({
			"TableName": tableName,
			"Key" : {"city" : "Vantaa"}
		}, function(err, data) {
		if (err) {
			context.fail('ERROR: Dynamo failed: ' + err);
		} else {
		  var response =  {
            "statusCode": 200,
            "headers": { "Content-Type": "application/json"},
            "body": JSON.stringify(data)
            }
			//callback(null, data);
			context.succeed(response);
		}
	});
		break;
	}
	default:
		done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
}