// Datos de ejemplo
const data1 = [
  {date: new Date(2024, 0, 1), value: 63},
  {date: new Date(2024, 1, 1), value: 62},
  {date: new Date(2024, 2, 1), value: 61},
  {date: new Date(2024, 3, 1), value: 62},
  {date: new Date(2024, 4, 1), value: 61},
  {date: new Date(2024, 5, 1), value: 61}
];

const data2 = [
  {date: new Date(2024, 0, 1), value: 17},
  {date: new Date(2024, 1, 1), value: 16},
  {date: new Date(2024, 2, 1), value: 18},
  {date: new Date(2024, 3, 1), value: 23},
  {date: new Date(2024, 4, 1), value: 25},
  {date: new Date(2024, 5, 1), value: 26}
];

const data3 = [
  {date: new Date(2024, 0, 1), value: 32},
  {date: new Date(2024, 1, 1), value: 31},
  {date: new Date(2024, 2, 1), value: 29},
  {date: new Date(2024, 3, 1), value: 33},
  {date: new Date(2024, 4, 1), value: 32},
  {date: new Date(2024, 5, 1), value: 30}
];

// Configuración del gráfico
const margin = {top: 50, right: 30, bottom: 30, left: 150},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Escalas
const x = d3.scaleTime()
  .domain(d3.extent(data1, d => d.date))
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 100])
  .nice()
  .range([height, 0]);

// Línea
const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));

// Crear el SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Ejes
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

svg.append("g")
  .call(d3.axisLeft(y));


// Tooltip
// const tip = d3.tip().attr('class', 'd3-tip').html(d => `Fecha: ${d.date.toLocaleDateString()}<br>Valor: ${d.value}`);
// svg.call(tip);

// // Líneas de cuadrícula horizontal
// svg.append("g")
//   .attr("class", "grid")
//   .call(d3.axisLeft(y)
//     .tickSize(-width)
//     .tickFormat(''));

// Función para añadir línea, círculo y animación
function addLineAndCircle(data, imageUrl) {

  // Línea del gráfico con animación
  const path = svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Obtener la longitud total del camino
  const totalLength = path.node().getTotalLength();

  // Aplicar la animación al camino
  path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(4500) // Duración de la animación en milisegundos
    .ease(d3.easeLinear) // Efecto de animación (linear)
    .attr("stroke-dashoffset", 0);

  // Añadir la imagen circular y animarla a lo largo del camino
  const img = svg.append("image")
    .attr("xlink:href", imageUrl) // URL de la imagen
    .attr("width", 30) // Ancho de la imagen
    .attr("height", 30) // Altura de la imagen
    .attr("class", "circular-image")
    .attr("transform", `translate(${x(data[0].date) - 15},${y(data[0].value) - 15})`); // Posición inicial

  // Función para mover la imagen a lo largo de la línea
  function transition() {
    img.transition()
        .duration(4500) // Duración de la animación en milisegundos
        .ease(d3.easeLinear) // Efecto de animación (linear)
        .attrTween("transform", translateAlong(path.node()));
  }

  // Función para calcular la transformación a lo largo del camino
  function translateAlong(path) {
    const l = path.getTotalLength();
    return function(d, i, a) {
        return function(t) {
            const p = path.getPointAtLength(t * l);
            return `translate(${p.x - 15},${p.y - 15})`; // Ajustar para centrar la imagen
        };
    };
  }

  // Iniciar la animación
  transition();
}

addLineAndCircle(data1, "https://upload.wikimedia.org/wikipedia/commons/e/ea/Morena_logo_%28Mexico%29.svg");
addLineAndCircle(data2, "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Logo_Partido_Movimiento_Ciudadano_%28M%C3%A9xico%29.svg/2048px-Logo_Partido_Movimiento_Ciudadano_%28M%C3%A9xico%29.svg.png");
addLineAndCircle(data3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScELaTLZWtSZVxlgSKtzUKPstEu4-6iH-HUXsp-AaHRA&s");
