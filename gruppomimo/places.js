let autocomplete;

console.log("Reading places.js");
initAutoComplete();

var closestRestaurant = document.getElementById("nos-restaurants-closest");

function initAutoComplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('adress-input'),
        {
            componentRestrictions: {'country' : ['FR'] },
            fields: ['name', 'geometry']
        });
        autocomplete.addListener('place_changed', onPlaceChanged);

}

function onPlaceChanged() {
    var place = autocomplete.getPlace();
    var places = document.getElementsByClassName('nos-restaurants-cms-item');
    var distancesContainers = document.getElementsByClassName('distance-to-place-container');
    const service = new google.maps.DistanceMatrixService();
    console.log(service)
    var destinations = new Array(places.length);
    console.log(places);
    var macaronsClosest = document.getElementsByClassName('macaron-closest');

    
    Array.prototype.forEach.call(macaronsClosest, function(macaronsClosest){
        macaronsClosest.classList.add('hide');
    });

    if(place){
        if (!place.geometry) {
            document.getElementById('adress-input').placeholder = 'Tapez votre adresse, code postal, ville';
            distancesContainers.forEach( (item) => item.style.display = "none");
        } else {
            // Calcul distances dans un array
    
            for (let i = 0; i < distancesContainers.length; i++){
                distancesContainers[i].style.display="flex";
                destinations[i] = new google.maps.LatLng(places[i].attributes.lat.value,places[i].attributes.long.value);
            }

            const request = {
                origins: [place.geometry.location],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            };

            // Afficher la chaine en JSON
            // document.getElementById("request").innerText = JSON.stringify(request, null, 2);

            service.getDistanceMatrix(request).then((response) => {


                 // Afficher la rep en JSON
/*                  document.getElementById("response").innerText = JSON.stringify(
                  response,
                  null,
                  2,
                ); */

                var distances = document.getElementsByClassName('distance-to-place');
                var distancesValue = new Array(distances.length)

                for (let i = 0; i < destinations.length; i++){
                    var str = response.rows[0].elements[i].distance.text
                    distances[i].innerHTML = str.split(" ")[0];
                    distancesValue[i] = distances[i].innerHTML;
                    console.log(distances[i].innerHTML);
                    places[i].setAttribute('distance',distancesValue[i]);
                }

                var minDistance = parseFloat(distancesValue[0]);
                var minIndex = 0;

                for (let i = 0; i < places.length; i++){
                    places[i].style.order = parseFloat(places[i].attributes.distance.value);
                    if (parseFloat(places[i].attributes.distance.value) < parseFloat(minDistance)){
                        minIndex = i;
                        minDistance = places[i].attributes.distance.value;
                    }
                }
                newOrderPlaces = document.getElementsByClassName('nos-restaurants-cms-item');
                document.getElementsByClassName('macaron-closest')[minIndex].classList.remove('hide');

                

                var fragment = document.createDocumentFragment();
                fragment.appendChild(closestRestaurant);
                document.getElementsByClassName('nos-restaurants-cms-list')[0].appendChild(fragment);
                places[minIndex].style.order -=1; 
                closestRestaurant.style.order = parseFloat(minDistance);
                document.getElementById('distance-closest').innerHTML = places[minIndex].attributes.distance.value;
            });
        
        }
    
}

}