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

// Crear el tooltip
const tooltip = d3.select("#chart")
  .append("div")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("display", "none");

// Función para mostrar el tooltip
function showTooltip(event, data) {
  const date = x.invert(d3.pointer(event)[0]);
  const bisectDate = d3.bisector(d => d.date).left;
  const i = bisectDate(data, date);
  const d0 = data[i - 1];
  const d1 = data[i];
  const dClosest = !d0 || !d1 ? d1 || d0 : date - d0.date > d1.date - date ? d1 : d0;

  tooltip
    .html(`Fecha: ${dClosest.date.toLocaleDateString()}<br>Valor: ${dClosest.value}`)
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 28) + "px")
    .style("display", "block");
}

// Función para ocultar el tooltip
function hideTooltip() {
  tooltip.style("display", "none");
}

// Función para añadir línea, círculo y animación
function addLineAndCircle(data, imageUrl, color) {
  // Línea del gráfico con animación
  const path = svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2.5)
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

  // Añadir el área invisible para capturar los eventos del ratón
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "none")
    .attr("pointer-events", "all")
    .attr("d", line)
    .on("mouseover", (event) => showTooltip(event, data))
    .on("mousemove", (event) => showTooltip(event, data))
    .on("mouseout", hideTooltip);

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

addLineAndCircle(data1, "https://upload.wikimedia.org/wikipedia/commons/e/ea/Morena_logo_%28Mexico%29.svg", "rgb(144,0,0)");
addLineAndCircle(data2, "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Logo_Partido_Movimiento_Ciudadano_%28M%C3%A9xico%29.svg/2048px-Logo_Partido_Movimiento_Ciudadano_%28M%C3%A9xico%29.svg.png", "orange");
addLineAndCircle(data3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScELaTLZWtSZVxlgSKtzUKPstEu4-6iH-HUXsp-AaHRA&s", "steelblue");
