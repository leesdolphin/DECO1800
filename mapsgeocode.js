url = "mapsapi.php";
$.getJSON(url, function (r) {
	geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address='. $row['TownName'] .'&reigon=au';
	$.getJSON(geocode, function (r) {
		// If they select the ocean then there will be no address components, so tell the user to not do that
		try {
			town = r.results[0].address_components;
		}
		catch (err) {
			alert('Why are you selecting the ocean, this is a town timeline!');
			return;
		}
		len = town.length;
		var final;
		var country;
		// Find the townname in the JSON
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
			alert('That place is not in the database');
			return
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
});