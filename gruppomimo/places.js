let autocomplete;
var closestRestaurant = document.getElementById("nos-restaurants-closest");
var inputAdress = document.getElementById("adress-input");
var macaronsClosest = document.getElementsByClassName('macaron-closest');
var distancesContainers = document.getElementsByClassName('distance-to-place-container');
var places = document.getElementsByClassName('nos-restaurants-cms-item');
var distances = document.getElementsByClassName('distance-to-place');

initAutoComplete();
inputAdress.addEventListener('change', checkResetValue);

function initAutoComplete() {

    // Ajout de l'autocomplétion sur le champ input 
    autocomplete = new google.maps.places.Autocomplete(
        inputAdress,
        {
            componentRestrictions: {'country' : ['FR'] },
            fields: ['name', 'geometry']
        });
        autocomplete.addListener('place_changed', onPlaceChanged);
}

function checkResetValue(){

    // Reset de la page si on supprime l'adresse dans l'input
    if (inputAdress.value == ''){
        closestRestaurant.style.display = 'none';
        Array.prototype.forEach.call(macaronsClosest, function(macaronsClosest){
            macaronsClosest.classList.add('hide');
        });
        Array.from(distancesContainers).forEach((element) => element.style.display='none');
    }
}

function onPlaceChanged() {

    var place = autocomplete.getPlace();
    var destinations = new Array(places.length);

    const service = new google.maps.DistanceMatrixService();

    if(place){
        if (!place.geometry) {
            document.getElementById('adress-input').placeholder = 'Tapez votre adresse, code postal, ville';
        } else {

            // Creation d'un tableau formaté de destinations en LatLng
            for (let i = 0; i < distancesContainers.length; i++){
                destinations[i] = new google.maps.LatLng(places[i].attributes.lat.value,places[i].attributes.long.value);
            }

            // Setup de la requete HTTP pour DistanceMatrix
            const request = {
                origins: [place.geometry.location],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            };

            // Envoie de la requete HTTP DistanceMatrix et definition de la fonction de callback
            service.getDistanceMatrix(request).then((response) => {

                var distancesValue = new Array(distances.length);

                
                for (let i = 0; i < destinations.length; i++){

                    // Récupération de la valeur de distance dans la reponse HTTP
                    var str = response.rows[0].elements[i].distance.text
                    console.log(str);
                    // Ajout de la valeur de distance dans le distance-to-place-container
                    distances[i].innerHTML = str.split(" ")[0];
                    console.log(distances[i].innerHTML);

                    // Ajout d'un attribut avec la valeur de distance pour chaque restaurant pour préparer le tri
                    places[i].setAttribute('distance',distances[i].innerHTML);
                    
                }

                // Affichage des distancesContainer
                Array.from(distancesContainers).forEach((element) => element.style.display='flex');

                
                var minDistance = parseFloat(distances[0].innerHTML);
                var minIndex = 0;

                for (let i = 0; i < places.length; i++){
                    // Ajout de l'ordre d'affichage du restaurant en fonction de sa distance
                    console.log(places[i].attributes.distance.value);
                    places[i].style.order = parseInt(places[i].attributes.distance.value);
                    console.log(places[i].style.order);

                    // Recherche de la plus petite valeur de distance pour affichage du macaron
                    if (parseFloat(places[i].attributes.distance.value) < parseFloat(minDistance)){
                        minIndex = i;
                        minDistance = places[i].attributes.distance.value;
                    }
                }

                // Ajout du macaron le plus proche
                Array.prototype.forEach.call(macaronsClosest, function(macaronsClosest){
                    macaronsClosest.classList.add('hide');
                });
                document.getElementsByClassName('macaron-closest')[minIndex].classList.remove('hide');
                distancesContainers[minIndex].style.display='none';

                // Déplacement du bloc closest-restaurant en 2ème position
                var fragment = document.createDocumentFragment();
                fragment.appendChild(closestRestaurant);
                document.getElementsByClassName('nos-restaurants-cms-list')[0].appendChild(fragment);
                places[minIndex].style.order -=1; 
                closestRestaurant.style.order = parseFloat(minDistance);
                closestRestaurant.style.display = 'flex';
                document.getElementById('distance-closest').innerHTML = places[minIndex].attributes.distance.value;

                // Gestion des décimales

                for (let i=0; i < distances.length; i++){
                    distances[i].innerHTML = parseInt(distances[i].innerHTML);
                }
            });
        }
    }
}