var request = require('request');
var settings = require('./settings.js');
var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + settings.weather.lat + '&lon=' + settings.weather.lon + '&units=metric&lang=fi&appid=' + settings.weather.mapApiKey;

module.exports.load =  function(callback){
	console.log('load weather');
	
	request.get({
		url: url,
		json: true,
		headers: {'User-Agent': 'request'}
	  }, function(err, res, data) {
		if (err) {
		  console.log('Error:', err);
		} else if (res.statusCode !== 200) {
		  console.log('Status:', res.statusCode);
		} else {
		  console.log('Data from openweathermap '  + data);
		  var iconUrl = 'http://openweathermap.org/img/w/' + data.weather[0].icon + ".png";
		  var weather = {
			  'city': data.name,
			  'temperature' : data.main.temp,
			  'description' : data.weather[0].description,
			  'icon': iconUrl,
			  'windSpeed' : data.wind.speed,
			  'dt' : data.dt
		  };
		  console.log('Returning weather ' + weather);
		  callback(weather);
		}
	});
}