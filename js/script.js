// ============================================================
// AnimeCatalogue — js/script.js
// ============================================================

// Liste de tous les animés
let data = [
    {
        id: 1,
        name: "Demon Slayer",
        theme: "Action",
        rating: 9.2,
        year: 2019,
        image: "img/demon slayer.jpg"
    },
    {
        id: 2,
        name: "Attack on Titan",
        theme: "Drame",
        rating: 9.8,
        year: 2013,
        image: "img/SNK.jpg"
    },
    {
        id: 3,
        name: "One Punch Man",
        theme: "Comédie",
        rating: 8.8,
        year: 2015,
        image: "img/OPM.jpg"
    },
    {
        id: 4,
        name: "Fullmetal Alchemist",
        theme: "Fantasy",
        rating: 9.1,
        year: 2003,
        image: "img/FMA.jpg"
    },
    {
        id: 5,
        name: "Death Note",
        theme: "Drame",
        rating: 9.0,
        year: 2006,
        image: "img/death note.jpg"
    },
    {
        id: 6,
        name: "Naruto",
        theme: "Shonen",
        rating: 10,
        year: 2002,
        image: "img/naruto.png"
    },
    {
        id: 7,
        name: "Sword Art Online",
        theme: "Science-Fiction",
        rating: 7.5,
        year: 2012,
        image: "img/SAO.jpg"
    },
    {
        id: 8,
        name: "Your Lie in April",
        theme: "Romance",
        rating: 8.9,
        year: 2014,
        image: "img/your lie in april.jpg"
    },
    {
        id: 9,
        name: "Jujutsu Kaisen",
        theme: "Action",
        rating: 9.0,
        year: 2020,
        image: "img/JJK.jpg"
    },
    {
        id: 10,
        name: "Le voyage de chihiro",
        theme: "Fantasy",
        rating: 9.3,
        year: 2001,
        image: "img/chihiro.jpg"
    }
];

// Récupère les éléments HTML dont on a besoin
const container   = document.getElementById("list");
const searchInput = document.getElementById("search");
const btnSort     = document.getElementById("btn-sort");
const form        = document.getElementById("form-add");
const inputName   = document.getElementById("input-name");
const inputTheme  = document.getElementById("input-theme");
const inputRating = document.getElementById("input-rating");
const inputYear   = document.getElementById("input-year");

// Sens du tri : false = du plus grand au plus petit
let sortAsc = false;

// Affiche les animés dans la page
function displayItems(items) {

    // Guard clause (S13) : si aucun résultat, affiche un message et s'arrête
    if (items.length === 0) {
        container.innerHTML = '<p class="no-result">Aucun résultat pour cette recherche.</p>';
        return;
    }

    // Construit le HTML de toutes les cartes
    let html = "";
    items.forEach(item => {
        // Détermine le nombre d'étoiles selon la note
        let etoiles = "⭐";
        if (item.rating >= 8 && item.rating < 9) {
            etoiles = "⭐⭐";
        } else if (item.rating >= 9) {
            etoiles = "⭐⭐⭐";
        }

        html += `
            <article class="card" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="card-body">
                    <h2>${item.name}</h2>
                    <p>${item.theme} — ${item.year}</p>
                    <span class="rating">${item.rating} ${etoiles}</span>
                    <!-- .btn .btn-danger pour le style, .btn-delete pour la délégation JS (S14) -->
                    <button class="btn btn-danger btn-delete">Supprimer</button>
                </div>
            </article>
        `;
    });

    // Écrit tout le HTML dans la page en une seule fois
    container.innerHTML = html;
}

// Filtre + trie + affiche les animés
function refresh() {
    const query = searchInput.value.toLowerCase();

    // Garde seulement les animés dont le nom contient ce qu'on a tapé
    let result = data.filter(item =>
        item.name.toLowerCase().includes(query)
    );

    // Trie par note selon le sens choisi
    result = [...result].sort((a, b) =>
        sortAsc ? a.rating - b.rating : b.rating - a.rating
    );

    displayItems(result);
}

// Lance un refresh à chaque frappe dans la barre de recherche
searchInput.addEventListener("input", refresh);

// Inverse le sens du tri à chaque clic sur le bouton
btnSort.addEventListener("click", () => {
    sortAsc = !sortAsc;
    btnSort.textContent = sortAsc ? "Trier par note ↑" : "Trier par note ↓";
    refresh();
});

// Quand on soumet le formulaire d'ajout
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const name   = inputName.value.trim();
    const rating = Number(inputRating.value);
    const year   = Number(inputYear.value);

    // Validation JS (S13) — vérifie le nom
    // novalidate sur le <form> désactive la validation HTML5 native
    // c'est donc notre JS qui prend le contrôle complet ici
    if (!name) {
        alert("Le nom est requis.");
        inputName.focus(); // Replace le curseur dans le champ problématique
        return;
    }

    // Validation JS (S13) — vérifie que la note est entre 1 et 10
    // "required" seul ne bloque pas les valeurs comme 0 ou -5
    if (!rating || rating < 1 || rating > 10) {
        alert("La note doit être entre 1 et 10.");
        inputRating.focus();
        return;
    }

    // Crée le nouvel animé
    const newItem = {
        id: Date.now(),         // ID unique basé sur l'horodatage
        name: name,
        theme: inputTheme.value,
        rating: rating,
        year: year || new Date().getFullYear(),
        image: `https://placehold.co/400x300/7f8c8d/white?text=${encodeURIComponent(name)}`
    };

    data.push(newItem); // Ajoute au tableau
    refresh();          // Met à jour l'affichage
    form.reset();       // Vide le formulaire
});

// Écoute les clics sur la liste pour détecter un clic sur "Supprimer"
// Délégation d'événements : un seul listener sur le parent stable (#list)
// car les cartes sont recréées à chaque refresh()
container.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-delete");
    if (!btn) return; // Clic ailleurs → on ignore

    // Récupère l'id de la carte cliquée
    const card = btn.closest(".card");
    const id = Number(card.dataset.id); // dataset.id est une string → convertir

    if (!confirm("Supprimer cet animé ?")) return;

    // Supprime l'animé du tableau et rafraîchit
    data = data.filter(item => item.id !== id);
    refresh();
});

// Affiche les animés au chargement de la page
refresh();
