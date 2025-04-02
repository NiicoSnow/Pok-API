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
                        <ul>
                            <li><span>HP :</span> ${stats.hp}</li>
                            <li><span>Attaque :</span> ${stats.attack}</li>
                            <li><span>Défense :</span> ${stats.defense}</li>
                            <li><span>Attaque Spéciale :</span> ${stats['special-attack']}</li>
                            <li><span>Défense Spéciale :</span> ${stats['special-defense']}</li>
                            <li><span>Vitesse :</span> ${stats.speed}</li>
                        </ul>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            result.innerHTML = `<div class="error-message">${err.message}</div>`;
        });
});


