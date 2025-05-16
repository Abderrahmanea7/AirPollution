const API_KEY = '055b7fe3ce51be3ca57e757e2bee533a'; 

document.getElementById('fetch-data').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert("Veuillez entrer une ville.");
        return;
    }
    fetchCityCoordinates(city);
});

async function fetchCityCoordinates(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            alert('Ville non trouvée ou erreur de données. Veuillez réessayer.');
            document.getElementById('alert-message').innerText = 'Ville introuvable. Vérifiez le nom et réessayez.';
            return;
        }

        const { lat, lon } = data[0];
        fetchAirQualityData(lat, lon);
    } catch (error) {
        console.error('Erreur lors de la récupération des coordonnées de la ville :', error);
        document.getElementById('alert-message').innerText = 'Impossible de charger les données pour cette ville.';
    }
}

async function fetchAirQualityData(lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        displayAirQualityData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        document.getElementById('alert-message').innerText = 'Impossible de charger les données de qualité de l\'air.';
    }
}

function displayAirQualityData(data) {
    const pollutants = data.list[0].components;
    const pollutantsList = document.getElementById('pollutants-list');
    pollutantsList.innerHTML = '';

    for (const [key, value] of Object.entries(pollutants)) {
        const listItem = document.createElement('li');
        listItem.innerText = `${key.toUpperCase()}: ${value} µg/m³`;
        pollutantsList.appendChild(listItem);
    }

    const alertMessage = document.getElementById('alert-message');
    const aqi = data.list[0].main.aqi;
    if (aqi > 3) {
        alertMessage.innerText = 'Qualité de l\'air mauvaise. Prenez des précautions.';
        alertMessage.style.color = 'red';
    } else if (aqi === 3) {
        alertMessage.innerText = 'Qualité de l\'air moyenne. Soyez vigilant.';
        alertMessage.style.color = 'orange';
    } else {
        alertMessage.innerText = 'Qualité de l\'air satisfaisante.';
        alertMessage.style.color = 'green';
    }
    
// CO (Monoxyde de carbone) 
// NO (Monoxyde d'azote) 
// NO₂ (Dioxyde d'azote)
// O₃ (Ozone)
// SO₂ (Dioxyde de soufre) 
// PM₂.₅ (Particules fines, diamètre inférieur à 2,5 micromètres)
// PM₁₀ (Particules grossières, diamètre inférieur à 10 micromètres) 
// NH₃ (Ammoniac) 
    document.getElementById('health-advice').innerText = aqi > 3 
        ? 'Évitez les activités physiques en plein air.\nRester à l intérieur autant que possible, particulièrement pour les enfants, les personnes âgées et les personnes ayant des problèmes respiratoires (asthme, bronchites, etc.).\nLimiter toute activité physique à l extérieur.\nSi une sortie est nécessaire, éviter les périodes de pointe de pollution et préférez les activités calmes.\nFermer toutes les fenêtres pour éviter l intrusion de l air pollué à l intérieur de la maison.\nÉviter les zones très polluées comme les zones industrielles ou à forte circulation.' 
        : (aqi === 3 ? 'Limitez vos activités physiques en plein air.\nLimiter les activités physiques intenses à l extérieur, surtout pour les enfants, les personnes âgées, ou ceux ayant des problèmes respiratoires ou cardiovasculaires.\nÉviter de rester longtemps à l extérieur dans les zones où la pollution est plus forte (zones à fort trafic ou industrielles).\nFermer les fenêtres pendant les périodes de pollution plus élevée pour limiter l exposition à l air extérieur.' :
             'Vous pouvez sortir sans risque.\nPas de restrictions particulières pour les activités à l extérieur.\nEncouragez les enfants et les personnes âgées à profiter du plein air, tout en maintenant des niveaux d activité modérés.\nContinuer à adopter un mode de vie actif à l extérieur (promenades, jeux en plein air, etc.).\nSi vous souffrez d allergies ou de conditions respiratoires spécifiques, soyez vigilant aux symptômes mais les risques sont faibles en cette période.');
}

