// Diccionario simple para códigos de clima (puedes expandirlo)
const weatherDescriptions = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    // ... agregar más según la documentación de Open-Meteo
};

async function obtenerCoordenadas(ciudad) {
    if (!ciudad?.trim()) {
        throw new Error("Por favor, introduce un nombre de ciudad válido.");
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!datos.results?.length) {
            throw new Error(`No se encontró la ciudad: "${ciudad}"`);
        }

        const { latitude, longitude, name, country } = datos.results[0];
        return { latitude, longitude, name, country };
    } catch (error) {
        // Mantenemos la causa original del error para debugging
        throw new Error("Fallo en la geocodificación", { cause: error });
    }
}

/**
 * Consulta los datos meteorológicos actuales desde la API de Open-Meteo.
 * * @async
 * @function obtenerClima
 * @description Esta función realiza una petición asíncrona a la API de pronóstico 
 * de Open-Meteo utilizando coordenadas geográficas. Retorna un objeto con la 
 * temperatura, velocidad del viento y códigos de estado climático.
 * * @param {number} latitude - La latitud de la ubicación (ej: 20.6668).
 * @param {number} longitude - La longitud de la ubicación (ej: -103.3918).
 * * @returns {Promise<Object>} Promesa que resuelve a un objeto `current_weather` con:
 * - {number} temperature: Temperatura actual en grados Celsius.
 * - {number} windspeed: Velocidad del viento en km/h.
 * - {number} weathercode: Código numérico del estado del clima (WMO).
 * - {string} time: Marca de tiempo de la lectura.
 * * @throws {Error} Lanza un error si la respuesta de red no es exitosa (200 OK)
 * o si ocurre un fallo en la conexión.
 * * @example
 * // Ejemplo de uso:
 * const clima = await obtenerClima(20.66, -103.34);
 * console.log(`Temperatura: ${clima.temperature}°C`);
 */
async function obtenerClima(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;

    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error al consultar el clima: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos.current_weather;
        
    } catch (error) {
        // Envolvemos el error original para dar contexto sin perder la traza técnica
        throw new Error("No se pudieron obtener los datos meteorológicos", { cause: error });
    }
}

async function mostrarClimaDeCiudad(ciudad) {
    try {
        const { latitude, longitude, name, country } = await obtenerCoordenadas(ciudad);
        const clima = await obtenerClima(latitude, longitude);

        const descripcion = weatherDescriptions[clima.weathercode] || "Condición desconocida";

        console.log(`--- Clima en ${name}, ${country} ---`);
        console.log(`Temperatura: ${clima.temperature}°C`);
        console.log(`Viento: ${clima.windspeed} km/h`);
        console.log(`Estado: ${descripcion}`);
    } catch (error) {
        // Aquí decides cómo mostrarlo al usuario final
        console.error(`⚠️ Mensaje: ${error.message}`);
        if (error.cause) {
            console.debug(`🔍 Detalle técnico: ${error.cause.message}`);
        }
    }
}

mostrarClimaDeCiudad("Guadalajara");