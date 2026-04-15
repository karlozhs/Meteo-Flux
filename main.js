/**
 * MÓDULO PRINCIPAL DE LA APLICACIÓN
 * ==================================
 * Maneja la interacción del usuario y la presentación de resultados
 */

// Elementos del DOM
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultsContainer = document.getElementById('resultsContainer');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');

/**
 * Maneja el envío del formulario
 * @param {Event} event - Evento del formulario
 */
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const input = cityInput.value.trim();
    if (!input) return;

    // Convertimos el texto en un Array (separando por comas)
    const cities = input.split(',').map(c => c.trim()).filter(c => c !== "");

    if (cities.length > 1) {
        await searchMultipleWeather(cities);
    } else {
        await searchWeather(cities[0]); // Mantiene tu función original para una sola ciudad
    }
});

async function searchMultipleWeather(cities) {
    try {
        showLoading();
        setButtonLoading(true);

        const results = await getMultipleWeather(cities);
        
        hideLoading();
        displayComparativeTable(results); // Nueva función de renderizado
        cityInput.value = '';
    } catch (error) {
        hideLoading();
        showError("Una o más ciudades no fueron encontradas.");
    } finally {
        setButtonLoading(false);
    }
}

/**
 * Busca y muestra los datos del clima
 * @param {string} cityName - Nombre de la ciudad a buscar
 */
async function searchWeather(cityName) {
    try {
        // Limpiar mensajes previos
        hideError();
        clearResults();

        // Mostrar mensaje de carga
        showLoading();

        // Deshabilitar el botón durante la carga
        setButtonLoading(true);

        // Obtener datos completos del clima
        console.log(`🔄 Iniciando búsqueda para: ${cityName}`);
        const weatherData = await getCompleteWeatherData(cityName);

        // Ocultar mensaje de carga
        hideLoading();

        // Mostrar los resultados
        displayWeatherResults(weatherData);

        // Limpiar el input
        cityInput.value = '';

    } catch (error) {
        // Ocultar mensaje de carga
        hideLoading();

        // Mostrar error
        showError(error.message);

        console.error('Error en búsqueda:', error);

    } finally {
        // Habilitar el botón
        setButtonLoading(false);
    }
}

/**
 * Muestra los resultados del clima en la página
 * @param {Object} data - Datos del clima
 */
function displayWeatherResults(data) {
    // Construir HTML con los resultados
    const html = `
        <div class="col-md-8 mx-auto">
            <div class="weather-card">
                <div class="card-body">
                    <!-- Información de la ciudad -->
                    <div class="city-info">
                        ${data.name}
                        ${data.admin1 ? `, ${data.admin1}` : ''}
                        ${data.country ? ` - ${data.country}` : ''}
                    </div>
                    <div class="city-coordinates">
                        📍 ${data.latitude.toFixed(4)}°, ${data.longitude.toFixed(4)}° | Zona horaria: ${data.timezone}
                    </div>

                    <!-- Temperatura y clima principal -->
                    <div class="d-flex align-items-center mb-3">
                        <div class="weather-emoji">${data.weatherEmoji.emoji}</div>
                        <div>
                            <div class="temperature-main">
                                ${Math.round(data.temperature)}<span class="temperature-unit">°C</span>
                            </div>
                            <div class="weather-description">
                                ${data.weatherEmoji.description}
                            </div>
                        </div>
                    </div>

                    <!-- Temperatura aparente -->
                    <div class="alert alert-info mb-3" role="alert">
                        <strong>Sensación térmica:</strong> ${Math.round(data.apparentTemperature)}°C
                    </div>

                    <!-- Detalles del clima -->
                    <div class="weather-details">
                        <div class="detail-item">
                            <div class="detail-label">💧 Humedad</div>
                            <div class="detail-value">${data.humidity}%</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">💨 Viento</div>
                            <div class="detail-value">${Math.round(data.windSpeed)} km/h</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">🧭 Dirección</div>
                            <div class="detail-value">${getWindDirection(data.windDirection)}°</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">📊 Código Clima</div>
                            <div class="detail-value">${data.weatherCode}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Información adicional -->
            <div class="alert alert-secondary mt-3" role="alert">
                <small>
                    <strong>ℹ️ Información:</strong> Datos obtenidos de Open-Meteo API. 
                    La información se actualiza en tiempo real.
                </small>
            </div>
        </div>
    `;

    // Insertar HTML en el contenedor
    resultsContainer.innerHTML = html;

    console.log('✅ Resultados mostrados en pantalla');
}

/**
 * Convierte grados de dirección del viento a texto descriptivo
 * @param {number} degrees - Grados (0-360)
 * @returns {string} Dirección cardinal (N, NE, E, etc.)
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * Muestra el mensaje de carga
 */
function showLoading() {
    loadingMessage.classList.remove('d-none');
    resultsContainer.innerHTML = '';
    console.log('⏳ Mostrando mensaje de carga...');
}

/**
 * Oculta el mensaje de carga
 */
function hideLoading() {
    loadingMessage.classList.add('d-none');
    console.log('✅ Ocultando mensaje de carga...');
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('d-none');
    resultsContainer.innerHTML = '';
    console.error('❌ Error mostrado:', message);
}

/**
 * Oculta el mensaje de error
 */
function hideError() {
    errorMessage.classList.add('d-none');
    errorText.textContent = '';
    console.log('✅ Error ocultado');
}

/**
 * Limpia los resultados mostrados
 */
function clearResults() {
    resultsContainer.innerHTML = '';
    console.log('🗑️ Resultados limpiados');
}

/**
 * Cambia el estado de carga del botón
 * @param {boolean} isLoading - true para mostrar carga, false para ocultar
 */
function setButtonLoading(isLoading) {
    if (isLoading) {
        searchBtn.disabled = true;
        btnText.textContent = 'Buscando...';
        spinner.classList.remove('d-none');
    } else {
        searchBtn.disabled = false;
        btnText.textContent = 'Buscar';
        spinner.classList.add('d-none');
    }
}

/**
 * Inicializar la aplicación cuando el DOM esté cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicación de clima iniciada');
    console.log('✅ Elementos del DOM cargados correctamente');
    
    // Enfocar el input automáticamente
    cityInput.focus();
});

// Cerrar error al hacer clic fuera del mensaje
document.addEventListener('click', (event) => {
    if (!errorMessage.contains(event.target) && 
        !cityInput.contains(event.target) && 
        !searchBtn.contains(event.target)) {
        // Opcional: puedes agregar lógica adicional aquí si necesitas
    }
});

function displayComparativeTable(dataArray) {
    let html = `
        <div class="col-12 mt-4">
            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white">Comparativa de Clima</div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Ciudad</th>
                                <th>Temp.</th>
                                <th>Sensación</th>
                                <th>Viento</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    dataArray.forEach(city => {
        html += `
            <tr>
                <td><strong>${city.name}</strong>, ${city.country}</td>
                <td><span class="badge bg-primary">${Math.round(city.temperature)}°C</span></td>
                <td>${Math.round(city.apparentTemperature)}°C</td>
                <td>${Math.round(city.windSpeed)} km/h ${getWindDirection(city.windDirection)}</td>
                <td>${city.weatherEmoji.emoji} ${city.weatherEmoji.description}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div></div></div>`;
    resultsContainer.innerHTML = html;
}
// Este código no solo cambia el tema, sino que recuerda la preferencia del usuario aunque recargue la página.
const themeToggler = document.getElementById('themeToggler');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const htmlElement = document.documentElement;

// Al cargar la página, revisar si ya había una preferencia guardada
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-bs-theme', savedTheme);
updateButton(savedTheme);

themeToggler.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Aplicar el nuevo tema
    htmlElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateButton(newTheme);
});

function updateButton(theme) {
    if (theme === 'dark') {
        themeIcon.innerText = '☀️';
        themeText.innerText = 'Modo Claro';
    } else {
        themeIcon.innerText = '🌙';
        themeText.innerText = 'Modo Oscuro';
    }
}