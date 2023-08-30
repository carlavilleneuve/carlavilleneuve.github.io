let autocomplete;

console.log("Reading places.js");
initAutoComplete();

function initAutoComplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('adress-input'),
        {
            componentRestrictions: {'country' : ['FR'] },
            fields: [name, geometry]
        });
    
        autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    var place = autocomplete.getPlace();
    var distancesContainers = document.getElementsByClassName('distance-to-place-container');

    if (!place.geometry) {
        document.getElementById('adress-input').placeholder = 'Tapez votre adresse, code postal, ville';
        distancesContainers.forEach( (item) => item.style.display = "none");
    } else {
        document.getElementById('adress-input').placeholder = place.name;
        // Calcul distances dans un array

        for (let i = 0; i < distancesContainers.length; i++){
            //Calcul distance
            distancesContainers[i].style.display="flex";
        }
    }
}