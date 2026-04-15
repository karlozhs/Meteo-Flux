
# 🌤️ Meteo Flux - Open-Meteo


Una aplicación web moderna y ligera para consultar el clima en tiempo real de cualquier ciudad del mundo. El proyecto utiliza la API gratuita de **Open-Meteo** para obtener datos precisos de geolocalización y meteorología sin necesidad de llaves de API (API Keys).

## Licencia y atribución
Este proyecto utiliza datos de Open-Meteo (https://open-meteo.com/)

## 🚀 Características

- **Búsqueda Global:** Encuentra ciudades en cualquier parte del mundo gracias a la integración con la API de geocodificación.
- **Datos en Tiempo Real:** Proporciona temperatura actual, sensación térmica, humedad, velocidad y dirección del viento.
- **Interfaz Responsiva:** Construida con **Bootstrap 5**, asegurando que la aplicación se vea bien en dispositivos móviles, tablets y computadoras de escritorio.
- **Feedback Visual:** Incluye indicadores de carga (spinners) y manejo detallado de errores para una mejor experiencia de usuario.
- **Traducción de Códigos WMO:** Convierte los códigos climáticos técnicos de la API en descripciones legibles en español y emojis ilustrativos.

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica de la web.
- **CSS3:** Estilos personalizados (alojados en `css/styles.css`).
- **JavaScript (ES6+):** Lógica de la aplicación, manejo de Promesas y consumo de APIs de forma asíncrona (`fetch`, `async/await`).
- **Bootstrap 5:** Framework de diseño para componentes responsivos y estilos rápidos.
- **Open-Meteo API:** Servicio de pronóstico meteorológico y geocodificación.

## 📂 Estructura del Proyecto

```text
├── index.html          # Interfaz de usuario principal
├── css/
│   └── styles.css      # Estilos personalizados de las tarjetas y contenedores
└── js/
    ├── api.js          # Lógica de comunicación con las APIs de Open-Meteo
    └── main.js         # Manipulación del DOM e interacción con el usuario
⚙️ Cómo Funciona
La aplicación opera en dos etapas principales:

Geocodificación: Cuando el usuario ingresa el nombre de una ciudad, el sistema consulta geocoding-api.open-meteo.com para obtener la latitud, longitud y el nombre oficial de la ubicación.

Consulta Meteorológica: Con las coordenadas obtenidas, se realiza una segunda llamada a api.open-meteo.com para extraer los datos climáticos actuales basados en la ubicación exacta y la zona horaria del lugar.

🔧 Instalación y Uso
Clona este repositorio o descarga los archivos.

Asegúrate de mantener la estructura de carpetas (css/ y js/).

Abre el archivo index.html en cualquier navegador web moderno.

¡Ingresa una ciudad y presiona "Buscar"!

📄 Notas Técnicas
No requiere configuración de servidores ni variables de entorno.

El módulo de API incluye un intérprete para los códigos de clima de la Organización Meteorológica Mundial (WMO).

Se implementó un sistema de validación para evitar búsquedas vacías o errores de red inesperados.

Proyecto desarrollado como parte de un aprendizaje en integración de APIs y desarrollo frontend con JavaScript.
