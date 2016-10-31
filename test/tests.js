var assert = require('assert');
var nock = require('nock');
var mock = require('mock-require');

describe('hooks', function() {
	beforeEach(function() {
		var openweathermap = nock('http://api.openweathermap.org')
                .get('/data/2.5/weather?lat=60.3008461&lon=25.0314642&units=metric&lang=fi&appid=xxxxxx')
                .reply(200, 
				{"coord":{"lon":25.04,"lat":60.29},
				"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],
				"base":"stations",
				"main":{"temp":5.9,"pressure":1024.59,"humidity":100,"temp_min":5.9,"temp_max":5.9,"sea_level":1024.88,"grnd_level":1024.59},
				"wind":{"speed":10.41,"deg":2.50381},
				"rain":{"3h":0.18},
				"clouds":{"all":88},
				"dt":1477821908,
				"sys":{"message":0.0136,"country":"FI","sunrise":1477805995,"sunset":1477837557},
				"id":632453,
				"name":"Vantaa",
				"cod":200});
		nock.disableNetConnect();
	});
	
	describe('WeatherService', function() {
		mock('../settings.js', {weather : {
			mapApiKey : 'xxxxxx',
			lat : 60.3008461,
			lon: 25.0314642 }
		});
		var WeatherService = mock.reRequire('../WeatherService.js');
		
		describe('#load', function() {
			it('should return weather for Vantaa', function(done){
				WeatherService.load(
					function(data){
						assert.equal(data.city, "Vantaa");
						assert.equal(data.temperature, 5.9);
						assert.equal(data.description, "pieni sade");
						assert.equal(data.icon, "http://openweathermap.org/img/w/10d.png");
						assert.equal(data.windSpeed, 10.41);
						assert.equal(data.dt, 1477821908);
						done();
					}
				);
			});
			
		});
	});

	describe('lambda-weather', function() {
		var weatherServiceHasBeenCalled = false;
		mock('../WeatherService.js', {load : function(callback){
					weatherServiceHasBeenCalled = true;
					callback({city:'Vantaa'});
				}});
		
		var dynamoPutItemHasBeenCalled = false;
		mock('aws-sdk', { 
			DynamoDB : { 
					DocumentClient : function() {
						return { 
							put : function(){
								dynamoPutItemHasBeenCalled = true;
						}
					};
				} 
			}
		});
		
		var lambdaWeather = mock.reRequire('../index.js');
		
		describe('#handler', function() {
			it('should call weather service', function(done){
				lambdaWeather.handler();
				assert.equal(weatherServiceHasBeenCalled, true);
				assert.equal(dynamoPutItemHasBeenCalled, true);
				done();
			});
			
		});
	});
});


