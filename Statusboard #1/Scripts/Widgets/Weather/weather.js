$("document").ready(function() {
	if ($.cookie('loc_longitude') && $.cookie('loc_latitude')) {
		getWeather();
	} else {
		$.getJSON("http://www.geoplugin.net/json.gp?callback=?", function(data) {
			eval(data);
		});
	}
});

function geoPlugin(data) {
	$.cookie('loc_latitude', data.geoplugin_latitude, {expires: 1});	
	$.cookie('loc_longitude', data.geoplugin_longitude, {expires: 1});
	$.cookie('loc_country', data.geoplugin_countryName, {expires: 1});
	$.cookie('loc_region', data.geoplugin_region, {expires: 1});
	$.cookie('loc_city', data.geoplugin_city, {expires: 1});
	$.cookie('loc_country_code', data.geoplugin_countryCode, {expires: 1});
	getWeather();
}

function getWeather() {
	var latitude = $.cookie('loc_latitude');
	var longitude = $.cookie('loc_longitude');
	
	var loc_conditions = $.cookie('loc_conditions');
	var loc_conditions_img = $.cookie('loc_conditions_img');
	var loc_temp = $.cookie('loc_temp');
	var loc_humidity = $.cookie('loc_humidity');
	
	if (loc_conditions && loc_conditions_img) {
		setConditions(loc_conditions, loc_conditions_img, loc_temp, loc_humidity);
	} else {
		var url = "http://ws.geonames.org/findNearByWeatherJSON?lat=" + latitude + "&lng=" + longitude + "&callback=?";
		$.getJSON(url, function(data) {
			var clouds = data.weatherObservation.clouds;
			var weather = data.weatherObservation.weatherCondition;
			var temp = data.weatherObservation.temperature;
			var humidity = data.weatherObservation.humidity;
			
			var conditions_img = getConditions(clouds, weather);
			
			var conditions = '';
			if (weather == 'n/a') {
				if (clouds == 'n/a') {
					conditions = 'fine';
				} else {
					conditions = clouds;
				}
			} else {
				conditions = weather;
			}
			
			$.cookie('loc_conditions', conditions);	
			$.cookie('loc_conditions_img', conditions_img);	
			$.cookie('loc_temp', temp);	
			$.cookie('loc_humidity', humidity);	
			setConditions(conditions, conditions_img, temp, humidity);
		});
	}
}

function getConditions(clouds, weather) {
	if (weather == 'n/a') {
		switch (clouds) {
			case 'n/a':
				return 'Green.png';
			case 'clear sky':
				return 'Green.png';
			case 'few clouds':
				return 'Green.png';
			case 'scattered clouds':
				return 'Green.png';
			case 'broken clouds':
				return 'Green.png';
			default:
				return 'Green.png';
		}
	} else {
		weather = weather.replace('light ', '').replace('heavy ', '').replace(' in vicinity', '');
		switch(weather) {
			case 'drizzle':
				return 'Amber.png';
			case 'rain':
				return 'Amber.png';
			case 'snow':
				return 'Blue.png';
			case 'snow grains':
				return 'Blue.png';
			case 'ice crystals':
				return 'Blue.png';
			case 'ice pellets':
				return 'Blue.png';
			case 'hail':
				return 'Purple.png';
			case 'small hail':
				return 'Blue.png';
			case 'snow pellets':
				return 'Amber.png';
			case 'unknown precipitation':
				return 'Red.png';
			case 'mist':
				return 'Amber.png';
			case 'fog':
				return 'Amber.png';
			case 'smoke':
				return 'Blue.png';
			case 'volcanic ash':
				return 'Red.png';
			case 'sand':
				return 'Blue.png';
			case 'haze':
				return 'Amber.png';
			case 'spray':
				return 'Amber.png';
			case 'widespread dust':
				return 'Blue.png';
			case 'squall':
				return 'Amber.png';
			case 'sandstorm':
				return 'Purple.png';
			case 'duststorm':
				return 'Purple.png';
			case 'well developed dust':
				return 'Amber.png';
			case 'sand whirls':
				return 'Amber.png';
			case 'funnel cloud':
				return 'Blue.png';
			case 'tornado':
				return 'Red.png';
			case 'waterspout':
				return 'Red.png';
			case 'showers':
				return 'Blue.png';
			case 'thunderstorm':
				return 'Purple.png';
			default:
				if (weather.indexOf("rain")) {
					return 'Amber.png';
				} else if (weather.indexOf("snow")) {
					return 'Blue.png';
				} else if (weather.indexOf("thunder")) {
					return 'Blue.png';
				} else if (weather.indexOf("dust")) {
					return 'Blue.png';
				} else {
					return 'Green.png';
				}
		}
	}
}

function setConditions(conditions, conditions_img, temp, humidity) {
	var country = $.cookie('loc_country');
	var region = $.cookie('loc_region');
	var city = $.cookie('loc_city');
	var loc_country_code = $.cookie('loc_country_code');
	if (loc_country_code == 'US') {
		temp = parseInt(temp) + 32;
		temp_type = "F";
	} else {
		temp_type = "Centigrade";
	}

	$("#weather_widget").append("<div id='weather_conditions'><p id='weather_country'>" + "</p><p id='weather_city'>" + "</p><p id='weather_temp'>" + temp + "&deg; " + temp_type + "</p><p id='weather_hum'>Humidity: " + humidity + "%</p><p id='weather_cond'>" + conditions.substr(0, 1).toUpperCase() + conditions.substr(1) + "</p></div>");
}