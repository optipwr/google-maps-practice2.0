/* GOOGLE MAPS HERE */

var map = new google.maps.Map(
	document.getElementById('map'),
	{
		center:{lat: 39.8282, lng: -98.5795},
		zoom: 4,
		styles: mapStyles
	}
);

var infoWindow = new google.maps.InfoWindow({});
var markers = [];

// a function to place a marker at a city location
function createMarker(city){
	var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569'
	var cityLL = {
		lat: city.lat,
		lng: city.lon
	}
	var marker = new google.maps.Marker({
		position: cityLL,
		map: map,
		title: city.city,
		icon: icon
	})
	google.maps.event.addListener(marker, 'click', function(){
		infoWindow.setContent(`<h2> ${city.city}</h2><div>${city.state}</div><div>${city.yearEstimate}</div><a href="" onClick='clickToZoom()'>Click to zoom</a>`);
		infoWindow.open(map, marker);
	});
	// Push the marker just created above onto the global markers
	markers.push(marker);
}

/* -------------REACT BELOW------------*/

var StartOption = React.createClass({
	render: function(){
		var cityStateRows = [];
		cities.map(function(currentCity, index){
			var currCityAndState = cities[index].city + ', ' + cities[index].state;
			cityStateRows.push(<option value={currCityAndState} key={index}>{cities[index].city}</option>)
		});
		return(
			<select id="start">{cityStateRows}</select>
		)
	}
})

var EndOption = React.createClass({
	render: function(){
		var cityStateRows = [];
		cities.map(function(currentCity, index){
			var currCityAndState = cities[index].city + ', ' + cities[index].state;
			cityStateRows.push(<option value={currCityAndState} key={index}>{cities[index].city}</option>)
		});
		return(
			<select id="end">{cityStateRows}</select>
		)
	}
})

var PanelNav = React.createClass({
	render: function(){
		return(
			<div id="floating-panel">
				<b>Start:</b>
					<StartOption />
				<b>End:</b>
					<EndOption />
			</div>
		)
	}
})

var GoogleCity = React.createClass({

	handleClickedCity: function(event){
		google.maps.event.trigger(markers[this.props.cityObject.yearRank - 1], "click")
	},

	render: function(){
		return(
			<tr>
				<td className="city-name" onClick={this.handleClickedCity}>{this.props.cityObject.city}</td>
				<td className="city-rank">{this.props.cityObject.yearRank}</td>
			</tr>
		)
	}
});

var Cities = React.createClass({

	getInitialState: function() {
		return{
			currCities: this.props.cities
		}
	},

	handleInputChange: function(event){
		var newFilterValue = event.target.value;
		var filteredCitiesArray = [];
		this.props.cities.map(function(currCity, index){
			// Below convert the city to lower case in the array map results
			var lowerCaseCity = currCity.city.toLowerCase();
			// Below convert the value typed in the input box to lower
			newFilterValue = newFilterValue.toLowerCase();
			if(lowerCaseCity.indexOf(newFilterValue) !== -1){
				// A match was found because not equal to negative one
				filteredCitiesArray.push(currCity);
			}
		});
		this.setState({
			currCities: filteredCitiesArray
		})
	},

	updateMarkers: function(event){
		event.preventDefault();
		markers.map(function(marker, index){
			marker.setMap(null);
		});
		this.state.currCities.map(function(city, index){
			createMarker(city)
		})
	},

	render: function(){
		var cityRows = [];
		this.state.currCities.map(function(currentCity, index){
			createMarker(currentCity);
			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />)
		});
		return(
			<div>
				<PanelNav />
				<form onSubmit={this.updateMarkers}>
					<input type="text" onChange={this.handleInputChange} />
					<input type="submit" value="Update Markers" />
				</form>
				<table>
					<thead>
						<tr>
							<th>City Name</th>
							<th>City Rank</th>
						</tr>
					</thead>
					<tbody>
						{cityRows}
					</tbody>
				</table>
			</div>
		)
	}
})

ReactDOM.render(
	<Cities cities={cities} />,
	document.getElementById('cities-container')
)

// ----------Normal JavaScript-----------

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

initMap();
