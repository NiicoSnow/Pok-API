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

            result.innerHTML = `
                <div class="pokemon-card">
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
                                <tr><td>HP</td><td>${stats.hp}</td></tr>
                                <tr><td>Attaque</td><td>${stats.attack}</td></tr>
                                <tr><td>Défense</td><td>${stats.defense}</td></tr>
                                <tr><td>Attaque Spéciale</td><td>${stats['special-attack']}</td></tr>
                                <tr><td>Défense Spéciale</td><td>${stats['special-defense']}</td></tr>
                                <tr><td>Vitesse</td><td>${stats.speed}</td></tr>
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


