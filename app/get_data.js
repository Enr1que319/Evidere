const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { groupBy, shuffle } = require('lodash');

// Función para leer los archivos CSV
async function openCsv(csvFile) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

// Función que regresa una propuesta de cada candidato en forma aleatoria
async function getProp(category) {
    try {
        const propData = await openCsv(path.join(__dirname, `../data/prop_${category}.csv`));
        propData.sort((a, b) => a.id_presidente.localeCompare(b.id_presidente));
        
        const candGroups = groupBy(propData, 'id_presidente');
        const choicesQz = Object.keys(candGroups).map(idPresidente => {
            const propuestas = candGroups[idPresidente];
            const randomProp = propuestas[Math.floor(Math.random() * propuestas.length)].Propuesta;
            return [parseInt(idPresidente, 10), randomProp];
        });

        // Mezclar el orden de la lista final
        return shuffle(choicesQz);
    } catch (err) {
        throw new Error("The schema is not correct, please check the csv file");
    }
}

module.exports = {
    openCsv,
    getProp
};
