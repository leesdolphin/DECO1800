url = "mapapi.php";
$.getJSON(url, function (d) {
	var the = d.Towns;
	var something = the.length;
	for (e = 0; e < something; e++){
		var currenttown = the[e].Townname;
		geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currenttown +'&reigon=au';
		$.getJSON(geocode, function (r) {
			// If they select the ocean then there will be no address components, so tell the user to not do that
			try {
				town = r.results[0].address_components;
			}
			catch (err) {
				console.log('The town ' + currenttown + ' couldnt be geocoded')
				return;
			}
			len = town.length;
			
			rlen = r.results.length;
			for (i=0; i<rlen; i++){
				var final;
				var country;
				try {
					town = r.results[i];
				}
				catch (err) {
					console.log('The town ' + currenttown + ' couldnt be geocoded')
					return;
				}
				
				for (i = 0; i < len; i++) {
					e = r.results[0].address_components[i].types[0]
					// The townname has the type of 'locality'
					if (e == "locality") {
						final = r.results[0].address_components[i].long_name;
					}
					// Also we don't want to get results from other countries
					if (e == "country") {
						if (r.results[0].address_components[i].long_name == "Australia"){
							country = 1;
						}
					}
				}
				
					
			// If we get nothing back, the tell the user to get better. They should never get this message but better safe then sorry
			if (!final) {
				console.log('Pls');
			}
			
			// And if they select another country berate them as well.
			if (!country){
				alert('Please select a location in Australia');
				return;
			}
			
			console.log(final);
			document.getElementById('town-name').value = final;
			
			// Configure map so it has the same settings for next time
			maplat = latcoord;
			maplong = longcoord;
		});
	}
});



// I hate the google geocoding API. SO many for loops
url = "mapapi.php";
$.getJSON(url, function (d) {
	var phplist = d.Towns;
	var phplength = phplist.length;
	for (var town = 0; town < phplength; town++) {
		var currenttown = phplist[town].Townname;
		geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currenttown +'&reigon=au';
		$.getJSON(geocode, function (r) {
			var listlen = r.results.length;
			if (!listlen){
				return;
			}
			for (var i = 0, i < listlen, i++){
				var finalname, country;
				comp = r.results[i].address_components
				for (var d = 0, d < comp.length, d++){
					e = r.results[0].address_components[i].types[0]
					// The townname has the type of 'locality'
					if (e == "locality") {
						final = r.results[0].address_components[i].long_name;
					}
					if (e == "country") {
						if (r.results[0].address_components[i].long_name == "Australia"){
							country = 1;
						}
					}
				}
				if (finalname && country){
					var lat = r.results[i].geometry.location.lat;
					var lng = r.results[i].geometry.location.lng;
				}
			}
		});
	}
});