/**
 * MÓDULO DE API - Gestión de llamadas a Open-Meteo
 * ================================================
 * Este módulo maneja todas las comunicaciones con la API de Open-Meteo
 * para obtener coordenadas y datos climáticos.
 */

// Configuración de las APIs
const API_CONFIG = {
    GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER: 'https://api.open-meteo.com/v1/forecast'
};

/**
 * Obtiene las coordenadas de una ciudad usando la API de Geocodificación
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<Object>} Objeto con coordenadas y información de la ciudad
 * @throws {Error} Si la ciudad no se encuentra o hay error en la API
 */
async function getCoordinates(cityName) {
    try {
        // Validación de entrada
        if (!cityName || cityName.trim() === '') {
            throw new Error('El nombre de la ciudad no puede estar vacío');
        }

        // Construcción de la URL con parámetros
        const url = new URL(API_CONFIG.GEOCODING);
        url.searchParams.append('name', cityName.trim());
        url.searchParams.append('count', '1'); // Obtener solo el primer resultado
        url.searchParams.append('language', 'es'); // Respuestas en español
        url.searchParams.append('format', 'json');

        console.log(`🔍 Buscando coordenadas para: ${cityName}`);

        // Realizar la llamada a la API
        const response = await fetch(url.toString());

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error de la API: ${response.status}`);
        }

        const data = await response.json();

        // Verificar si se encontraron resultados
        if (!data.results || data.results.length === 0) {
            throw new Error(`No se encontró la ciudad: "${cityName}". Verifica el nombre e intenta nuevamente.`);
        }

        // Extraer la información del primer resultado
        const locationData = data.results[0];
        const coordinates = {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            name: locationData.name,
            admin1: locationData.admin1 || '', // Región/Estado
            country: locationData.country || '', // País
            timezone: locationData.timezone || 'UTC'
        };

        console.log(`✅ Coordenadas encontradas:`, coordinates);
        return coordinates;

    } catch (error) {
        console.error('❌ Error al obtener coordenadas:', error.message);
        throw error;
    }
}

/**
 * Obtiene los datos del clima para unas coordenadas específicas
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object>} Objeto con datos del clima actual
 * @throws {Error} Si hay error en la llamada a la API
 */
async function getWeatherData(latitude, longitude) {
    try {
        // Construcción de la URL con parámetros
        const url = new URL(API_CONFIG.WEATHER);
        url.searchParams.append('latitude', latitude);
        url.searchParams.append('longitude', longitude);
        url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m');
        url.searchParams.append('timezone', 'auto'); // Detectar zona horaria automáticamente

        console.log(`🌍 Obteniendo datos del clima para lat: ${latitude}, lon: ${longitude}`);

        // Realizar la llamada a la API
        const response = await fetch(url.toString());

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error de la API: ${response.status}`);
        }

        const data = await response.json();

        // Extraer datos actuales
        const currentWeather = data.current;
        const weatherInfo = {
            temperature: currentWeather.temperature_2m,
            apparentTemperature: currentWeather.apparent_temperature,
            humidity: currentWeather.relative_humidity_2m,
            windSpeed: currentWeather.wind_speed_10m,
            windDirection: currentWeather.wind_direction_10m,
            weatherCode: currentWeather.weather_code,
            timezone: data.timezone
        };

        console.log(`✅ Datos del clima obtenidos:`, weatherInfo);
        return weatherInfo;

    } catch (error) {
        console.error('❌ Error al obtener datos del clima:', error.message);
        throw error;
    }
}

/**
 * Interpreta el código de clima de WMO y retorna un emoji y descripción
 * @param {number} code - Código de clima WMO
 * @returns {Object} Objeto con emoji y descripción del clima
 */
function getWeatherEmoji(code) {
    const weatherCodes = {
        0: { emoji: '☀️', description: 'Cielo despejado' },
        1: { emoji: '🌤️', description: 'Mayormente despejado' },
        2: { emoji: '⛅', description: 'Parcialmente nublado' },
        3: { emoji: '☁️', description: 'Nublado' },
        45: { emoji: '🌫️', description: 'Niebla' },
        48: { emoji: '🌫️', description: 'Niebla con depósito de escarcha' },
        51: { emoji: '🌧️', description: 'Llovizna ligera' },
        53: { emoji: '🌧️', description: 'Llovizna moderada' },
        55: { emoji: '🌧️', description: 'Llovizna densa' },
        61: { emoji: '🌧️', description: 'Lluvia ligera' },
        63: { emoji: '🌧️', description: 'Lluvia moderada' },
        65: { emoji: '⛈️', description: 'Lluvia fuerte' },
        71: { emoji: '❄️', description: 'Nieve ligera' },
        73: { emoji: '❄️', description: 'Nieve moderada' },
        75: { emoji: '❄️', description: 'Nieve fuerte' },
        77: { emoji: '❄️', description: 'Aguanieve' },
        85: { emoji: '❄️', description: 'Chubascos de nieve ligeros' },
        86: { emoji: '❄️', description: 'Chubascos de nieve fuertes' },
        80: { emoji: '⛈️', description: 'Tormenta ligera' },
        81: { emoji: '⛈️', description: 'Tormenta moderada o fuerte' },
        82: { emoji: '⛈️', description: 'Tormenta violenta con granizo' }
    };

    // Retornar la descripción del código, o un valor por defecto
    return weatherCodes[code] || { emoji: '🌤️', description: 'Clima desconocido' };
}

/**
 * Función completa que obtiene todo: coordenadas y clima
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<Object>} Objeto completo con coordenadas y clima
 */
async function getCompleteWeatherData(cityName) {
    try {
        
        // Paso 1: Obtener coordenadas
        const coordinates = await getCoordinates(cityName);

        // Paso 2: Obtener datos del clima
        const weather = await getWeatherData(coordinates.latitude, coordinates.longitude);

        // Paso 3: Combinar toda la información
        const completeData = {
            ...coordinates,
            ...weather,
            weatherEmoji: getWeatherEmoji(weather.weatherCode)
        };

        return completeData;

    } catch (error) {
        console.error('❌ Error en getCompleteWeatherData:', error.message);
        throw error;
    }
}

/**
 * Obtiene el clima de varias ciudades en paralelo
 */
async function getMultipleWeather(citiesArray) {
    const promises = citiesArray.map(city => getCompleteWeatherData(city));
    // Promise.all espera a que todas las peticiones terminen
    return await Promise.all(promises);
}

