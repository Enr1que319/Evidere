// Función para crear botones
function createButtons(data) {
    const container = document.getElementById('button-container');
    const clickedButtonIds = [];

    data.forEach(item => {
        const [id, text] = item;
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.addEventListener('click', () => {
            clickedButtonIds.push(id);
            console.log(`Button with ID ${id} clicked. Current list of clicked IDs: `, clickedButtonIds);
        });
        container.appendChild(button);
    });
}

// Función para obtener los datos y crear botones
async function fetchDataAndCreateButtons() {
    try {
        const response = await fetch('/getProp');
        const data = await response.json();
        createButtons(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchDataAndCreateButtons);
