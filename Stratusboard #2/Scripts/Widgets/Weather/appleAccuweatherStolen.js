// Modified from weatherParser.js from Leopard. Apologies to all offended.
// I'm hoping that no-one objects since it's Apple hardware and so forth.

/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

var MiniIcons = //Fix Up for weatherParser.js but also enables standardisation of sorts
[
	"sunny_day", 						// 1 Sunny
	"partly_cloudy_day",						// 2 Mostly Sunny
	"partly_cloudy_day",					// 3 Partly Sunny
	"partly_cloudy_day",					// 4 Intermittent Clouds
	"haze",					// 5 Hazy Sunshione
	"mostly_cloudy_day",					// 6 Mostly Cloudy
	"cloudy",					// 7 Cloudy (am/pm)
	"cloudy",					// 8 Dreary (am/pm)
	"error",						// 9 retired
	"error",						// 10 retired
	"fog",						// 11 fog (am/pm)
	"light_rain",						// 12 showers (am/pm)
	"showers",					// 13 Mostly Cloudy with Showers
	"showers",					// 14 Partly Sunny with Showers
	"tstorms",				// 15 Thunderstorms (am/pm)
	"tstorms",				// 16 Mostly Cloudy with Thunder Showers
	"tstorms",				// 17 Partly Sunnty with Thunder Showers
	"rain",						// 18 Rain (am/pm)
	"flurries",					// 19 Flurries (am/pm)
	"flurries",					// 20 Mostly Cloudy with Flurries
	"flurries",					// 21 Partly Sunny with Flurries
	"snow",						// 22 Snow (am/pm)
	"snow",						// 23 Mostly Cloudy with Snow
	"sleet",						// 24 Ice (am/pm)
	"sleet",						// 25 Sleet (am/pm)
	"freezing_drizzle",						// 26 Freezing Rain (am/pm)
	"error",						// 27 retired
	"error",						// 28 retired
	"rain_snow",					// 29 Rain and Snow Mixed (am/pm)
	"sunny_hot",						// 30 Hot (am/pm)
	"cold",				// 31 Cold (am/pm)
	"windy_blustery",						// 32 Windy (am/pm)
	// Night only Icons;
	"sunny_night",						// 33 Clear
	"partly_cloudy_night",				// 34 Mostly Clear
	"partly_cloudy_night",				// 35 Partly Cloudy
	"partly_cloudy_night",						// 36 Intermittent Clouds
	"sunny_night",						// 37 Hazy
	"mostly_cloudy_night",						// 38 Mostly Cloudy
	"showers",						// 39 Partly Cloudy with Showers
	"showers",			 			// 40 Mostly Cloudy with Showers
	"tstorms",						// 41 Partly Cloudy with Thunder Showers
	"tstorms",						// 42 Mostly Cloudy with Thunder Showers
	"flurries",						// 43 Mostly Cloudy with Flurries
	"flurries"							// 44 Mostly Cloudy with Flurries
];


function findChild (element, nodeName)
{
	var child;
	
	for (child = element.firstChild; child != null; child = child.nextSibling)
	{
		if (child.nodeName == nodeName)
			return child;
	}
	
	return null;
}


function trimWhiteSpace (string)
{
	return string.replace(/^\s*/, '').replace(/\s*$/, '');
}

// returns an anonymous object like so
// object
//		error: 	Boolean false for success
//		errorString: failure string
//		hi:		Fahrenheit
//		lo: 		Fahrenheit
//		temp: 	Fahrenheit
//		realFeel: Farenheit
//		icon	:	accuweather icon code
//		description:	accuweather description
//		city:	City (first caps)
//		time:	time 24 hours(nn:nn)
//		sunset:	time 24 hours (nn:nn)
//		sunrise: time 24 hours (nn:nn)
		
function fetchWeatherData (callback, zip)
{
	//var url = 'http://apple.accuweather.com/adcbin/apple/Apple_Weather_Data.asp?zipcode=';
	var url = 'http://wu.apple.com/adcbin/apple/Apple_Weather_Data.asp?zipcode=';
	
	if (window.timerInterval != 300000)
		window.timerInterval = 300000; // 5 minutes
	
	
	document.getElementById("time").innerHTML='&nbsp;&nbsp;'
	document.getElementById("time2").innerHTML='<img src="throbber.gif"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	var xml_request = new XMLHttpRequest();
	xml_request.onload = function(e) {xml_loaded(e, xml_request, callback);}
	xml_request.overrideMimeType("text/xml");
	xml_request.open("GET", url+zip);
	xml_request.setRequestHeader("Cache-Control", "no-cache");
	xml_request.setRequestHeader("wx", "385");
	xml_request.send(null);
	
	return xml_request;
}

function constructError (string)
{
	return {error:true, errorString:string};
}

// parses string of the form nn:nn
function parseTimeString(string)
{
	var obj = null;
	try {
		var array = string.match (/\d{1,2}/g);
		
		obj = {hour:parseInt(array[0], 10), minute:parseInt(array[1],10)};
	}
	catch (ex)
	{
		// ignore
	}
	
	return obj;
}


// parses string of the form nn:nn
function parsehour(string)
{
	var obj = null;
	try {
		var array = string.match (/\d{1,2}/g);
		
		obj = {hour:parseInt(array[0], 10)};
	}
	catch (ex)
	{
		// ignore
	}
	
	return obj;
}

function parseDayCode (dayCode)
{
	return trimWhiteSpace(dayCode).substr (0, 3).toUpperCase();
}



function xml_loaded (event, request, callback)
{
	if (request.responseXML)
	{
		var obj = {error:false, errorString:null};
		var adc_Database = findChild (request.responseXML, "adc_Database");
		var adc_Data = findChild (request.responseXML, "Forecast");
		if (adc_Database == null) {callback(constructError("no <adc_Database>")); return;}
		
		var CurrentConditions = findChild (adc_Database, "CurrentConditions");
		var TodayConditions = findChild (adc_Database, "Forecast");
		if (CurrentConditions == null) {callback(constructError("no <CurrentConditions>")); return;}
		if (TodayConditions == null) {callback(constructError("no <todayConditions>")); return;}
		
		  var currentTime = new Date ( );

		  var currentHours = currentTime.getHours ( );
		  var currentMinutes = currentTime.getMinutes ( );
		
		
			
		

		// Pad the minutes and seconds with leading zeros, if required
		  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
		

		  // Compose the string for display
		  var currentTimeString = currentHours + ":" + currentMinutes;
		obj.time = currentTimeString; 	
					
		

		tag = findChild (CurrentConditions, "City");
		if (tag == null) {callback(constructError("no <City>")); return;}
		obj.city =  trimWhiteSpace(tag.firstChild.data.toString()).toLowerCase();
		
		
		var todaytag = findChild (TodayConditions, "day");
		if (todaytag == null) {callback(constructError("no <todaytag>")); return;}
	
		tag = findChild (todaytag, "TXT_Long");	
		if (tag == null) {callback(constructError("no <text>")); return;}
		obj.todaydesc =  trimWhiteSpace(tag.firstChild.data.toString()).toLowerCase();
	
		tag = findChild (todaytag, "Rain_Amount");	
		if (tag == null) {callback(constructError("no <text>")); return;}
		obj.rain =  parseInt(tag.firstChild.data*100);
		

		tag = findChild (CurrentConditions, "Temperature");
		if (tag == null) {callback(constructError("no <Temperature>")); return;}
		obj.temp = parseInt (tag.firstChild.data);
		
		tag = findChild (todaytag, "High_Temperature");
		if (tag == null) {callback(constructError("no <Temperature>")); return;}
		obj.temp2 = parseInt (tag.firstChild.data);
		
		tag = findChild (todaytag, "Low_Temperature");
		if (tag == null) {callback(constructError("no <Temperature>")); return;}
		obj.temp3 = parseInt (tag.firstChild.data);
	
		tag = findChild (CurrentConditions, "RealFeel");
		if (tag == null) {callback(constructError("no <RealFeel>")); return;}
		obj.realFeel = parseInt (tag.firstChild.data);
		
		tag = findChild (CurrentConditions, "WeatherText");
		if (tag == null)
			obj.description = null;
		else
			obj.description = trimWhiteSpace(tag.firstChild.data);
					
		tag = findChild (CurrentConditions, "WeatherIcon");
		if (tag == null) {callback(constructError("no <WeatherIcon>")); return;}
		obj.icon = parseInt(tag.firstChild.data, 10);
		obj.icon -= 1; //Accuweather starts at 1

		
		tag = findChild (todaytag, "WeatherIcon");
		if (tag == null) {callback(constructError("no <WeatherIcon>")); return;}
		obj.icon2 = parseInt (tag.firstChild.data, 10);
		obj.icon2 -= 1; //Accuweather starts at 1
			
		obj.sunset = null;
		obj.sunrise = null;
		var Planets = findChild (adc_Database, "Planets");
		if (Planets != null)
		{
			tag = findChild (Planets, "Sun");
			if (tag != null)
			{
				var rise = tag.getAttribute("rise");
				var set = tag.getAttribute("set");
				
				if (rise != null && set != null)
				{
					obj.sunset = parseTimeString (set);
					obj.sunrise = parseTimeString(rise);
				}
			}
		}
		
		
		obj.forecast = new Array;
		var Forecast = findChild (adc_Database, "Forecast");
		if (Forecast == null) {callback(constructError("no <Forecast>")); return;}
		
		// assume the days are in order, 1st entry is today
		var child;
		var j=0;
		var firstTime = true;
		
		for (child = Forecast.firstChild; child != null; child = child.nextSibling)
		{
			if (child.nodeName == 'day')
			{
				if (firstTime) // today
				{
					obj.hi = 0;
					tag = findChild(child, 'High_Temperature');
					if (tag != null)
						obj.hi = parseInt (tag.firstChild.data);
					
					obj.lo = 0;
					tag = findChild(child, 'Low_Temperature');
					if (tag != null)
						obj.lo = parseInt (tag.firstChild.data);
					
					firstTime = false;
				}

				var foreobj = {daycode:null, hi:0, lo:0, icon:-1};

				tag = findChild(child, 'DayCode');
				if (tag != null)
					foreobj.daycode = trimWhiteSpace(tag.firstChild.data.toString());

				tag = findChild(child, 'Rain_Amount');
				if (tag != null)
					foreobj.rain = parseInt (tag.firstChild.data*100);;

				tag = findChild(child, 'TXT_Long');
				if (tag != null)
					foreobj.desc = trimWhiteSpace(tag.firstChild.data.toString());
				
				tag = findChild(child, 'High_Temperature');
				if (tag != null)
					foreobj.hi = parseInt (tag.firstChild.data);
					
				tag = findChild(child, 'Low_Temperature');
				if (tag != null)
					foreobj.lo = parseInt (tag.firstChild.data);					
				
				tag = findChild(child, 'WeatherIcon');
				if (tag != null)
				{
					foreobj.icon = parseInt (tag.firstChild.data, 10);
					foreobj.ouricon = MiniIcons[foreobj.icon-1];
				}
					
				//tag = findChild (child, "DayCode");
				//if (tag != null)
				//	foreobj.daycode = parseDayCode(tag.firstChild.data);
				//else
				//	foreobj.daycode = null;

				//alert(j);
					
				obj.forecast[j++]=foreobj;
				if (j == 7) break; // only look ahead 7 days
			}
		}

		
		callback (obj); 
		
	}
	else
	{
		callback ({error:true, errorString:"XML request failed. no responseXML"}); //Could be any number of things..
	}
}

// returns an anonymous object like so
// object
//		error: 	Boolean false for success
//		errorString: failure string
//		cities:	array (alphabetical by name)
//			object
//				name: city name
//				zip: postal code
//				state: city state
//		refine: boolean - true if the search is too generic
function validateWeatherLocation (location, callback)
{
	//var url = 'http://apple.accuweather.com/adcbin/apple/Apple_find_city.asp?location=';
	var url = 'http://wu.apple.com/adcbin/apple/Apple_find_city.asp?location=';
	
	var xml_request = new XMLHttpRequest();
	xml_request.onload = function(e) {xml_validateloaded(e, xml_request, callback);}
	xml_request.overrideMimeType("text/xml");
	xml_request.open("GET", url+location);
	xml_request.setRequestHeader("Cache-Control", "no-cache");
	xml_request.send(null);
}

function xml_validateloaded (event, request, callback)
{
	if (request.responseXML)
	{
		var obj = {error:false, errorString:null, cities:new Array, refine:false};
		var adc_Database = findChild (request.responseXML, "adc_Database");
		if (adc_Database == null) {callback(constructError("no <adc_Database>")); return;}
		
		var CityList = findChild (adc_Database, "CityList");
		if (CityList == null) {callback(constructError("no <CityList>")); return;}
		
		if (CityList.getAttribute('extra_cities') == '1')
			obj.refine = true;

		for (child = CityList.firstChild; child != null; child = child.nextSibling)
		{
			if (child.nodeName == "location")
			{
				var city = child.getAttribute("city");
				var state = child.getAttribute("state");
				var zip = child.getAttribute("postal");
				
				if (city && state && zip)
				{
					obj.cities[obj.cities.length] = {name:city, state:state, zip:zip};
				}
			}
		}
		
		callback (obj);
	}
	else
	{
		callback ({error:true, errorString:"No Response"});
	}
}

function createGoToURL (location)
{
	return 'http://apple.accuweather.com/adcbin/apple/Apple_weather.asp?location=' + escape(location);
}
