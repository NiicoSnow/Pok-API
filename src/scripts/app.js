"use strict";

document.getElementById('pokemonForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameOrId = document.getElementById('pokemonInput').value.trim().toLowerCase();
    const result = document.getElementById('result');

    result.innerHTML = '';

    const apiURL = `https://web.mayfly.ovh/proxy/pokeapi.php?endpoint=pokemon/${nameOrId}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon non trouvé');
            }
            return response.json();
        })
        .then(data => {
            const stats = data.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
            }, {});

            const type = data.types[0].type.name;
            const typeClass = `type-${type}`;

            // Génère une ligne de tableau avec barre colorée
            const statRow = (label, value) => {
                return `
                    <tr>
                        <td>${label}</td>
                        <td>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: ${value > 100 ? 100 : value}%; background-color: ${getStatColor(value)};">
                                    ${value}
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            };

            result.innerHTML = `
                <div class="pokemon-card ${typeClass}">
                    <h2 class="pokemon-name">${data.name} (#${data.id})</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p><span>Taille :</span> ${data.height / 10} m</p>
                    <p><span>Poids :</span> ${data.weight / 10} kg</p>
                    <p><span>Types :</span> ${data.types.map(t => t.type.name).join(', ')}</p>
                    <div class="pokemon-stats">
                        <h3>Statistiques :</h3>
                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Stat</th>
                                    <th>Valeur</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${statRow('HP', stats.hp)}
                                ${statRow('Attaque', stats.attack)}
                                ${statRow('Défense', stats.defense)}
                                ${statRow('Attaque Spéciale', stats['special-attack'])}
                                ${statRow('Défense Spéciale', stats['special-defense'])}
                                ${statRow('Vitesse', stats.speed)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            result.innerHTML = `<div class="error-message">${err.message}</div>`;
        });
});

// Fonction qui retourne une couleur selon la valeur de la statistique
function getStatColor(value) {
    if (value >= 120) return '#4ade80'; // vert vif
    if (value >= 90) return '#a3e635';  // vert clair
    if (value >= 60) return '#facc15';  // jaune
    if (value >= 40) return '#f97316';  // orange
    return '#ef4444'; // rouge
}


