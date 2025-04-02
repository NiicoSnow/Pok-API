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
            result.innerHTML = `
                <div class="pokemon-card">
                    <h2 class="pokemon-name">${data.name} (#${data.id})</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p><strong>Taille :</strong> ${data.height / 10} m</p>
                    <p><strong>Poids :</strong> ${data.weight / 10} kg</p>
                    <p><strong>Types :</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                </div>
            `;
        })
        .catch(err => {
            result.innerHTML = `<div class="error-message">${err.message}</div>`;
        });
});

