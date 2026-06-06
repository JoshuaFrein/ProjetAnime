// ============================================================
// AnimeCatalogue — js/script.js
// ============================================================

let data = [
    { id: 1,  name: "Demon Slayer",        theme: "Action",          rating: 9.2, year: 2019, image: "img/demon slayer.jpg" },
    { id: 2,  name: "Attack on Titan",     theme: "Drame",           rating: 9.8, year: 2013, image: "img/SNK.jpg" },
    { id: 3,  name: "One Punch Man",       theme: "Comédie",         rating: 8.8, year: 2015, image: "img/OPM.jpg" },
    { id: 4,  name: "Fullmetal Alchemist", theme: "Fantasy",         rating: 9.1, year: 2003, image: "img/FMA.jpg" },
    { id: 5,  name: "Death Note",          theme: "Drame",           rating: 9.0, year: 2006, image: "img/death note.jpg" },
    { id: 6,  name: "Naruto",              theme: "Shonen",          rating: 10,  year: 2002, image: "img/naruto.png" },
    { id: 7,  name: "Sword Art Online",    theme: "Science-Fiction", rating: 7.5, year: 2012, image: "img/SAO.jpg" },
    { id: 8,  name: "Your Lie in April",   theme: "Romance",         rating: 8.9, year: 2014, image: "img/your lie in april.jpg" },
    { id: 9,  name: "Jujutsu Kaisen",      theme: "Action",          rating: 9.0, year: 2020, image: "img/JJK.jpg" },
    { id: 10, name: "Le voyage de chihiro",theme: "Fantasy",         rating: 9.3, year: 2001, image: "img/chihiro.jpg" }
];

const container   = document.getElementById("list");
const searchInput = document.getElementById("search");
const btnSort     = document.getElementById("btn-sort");
const form        = document.getElementById("form-add");
const inputName   = document.getElementById("input-name");
const inputTheme  = document.getElementById("input-theme");
const inputRating = document.getElementById("input-rating");
const inputYear   = document.getElementById("input-year");
// AJOUT : récupère le select de filtre par thème
const filterTheme = document.getElementById("filter-theme");

let sortAsc = false;

function displayItems(items) {
    if (items.length === 0) {
        container.innerHTML = '<p class="no-result">Aucun résultat pour cette recherche.</p>';
        return;
    }

    let html = "";
    items.forEach(item => {
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
                    <button class="btn btn-danger btn-delete">Supprimer</button>
                </div>
            </article>
        `;
    });

    container.innerHTML = html;
}

function refresh() {
    const query = searchInput.value.toLowerCase();
    // AJOUT : récupère le thème sélectionné ("" = tous)
    const theme = filterTheme.value;

    let result = data.filter(item => {
        const matchName  = item.name.toLowerCase().includes(query);
        // AJOUT : si theme est vide on garde tout, sinon on filtre
        const matchTheme = theme === "" || item.theme === theme;
        return matchName && matchTheme;
    });

    result = [...result].sort((a, b) =>
        sortAsc ? a.rating - b.rating : b.rating - a.rating
    );

    displayItems(result);
}

searchInput.addEventListener("input", refresh);

btnSort.addEventListener("click", () => {
    sortAsc = !sortAsc;
    btnSort.textContent = sortAsc ? "Trier par note ↑" : "Trier par note ↓";
    refresh();
});

// AJOUT : relance refresh() à chaque changement du filtre thème
filterTheme.addEventListener("change", refresh);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name   = inputName.value.trim();
    const rating = Number(inputRating.value);
    const year   = Number(inputYear.value);

    if (!name) {
        alert("Le nom est requis.");
        inputName.focus();
        return;
    }

    if (!rating || rating < 1 || rating > 10) {
        alert("La note doit être entre 1 et 10.");
        inputRating.focus();
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        theme: inputTheme.value,
        rating: rating,
        year: year || new Date().getFullYear(),
        image: `https://placehold.co/400x300/7f8c8d/white?text=${encodeURIComponent(name)}`
    };

    data.push(newItem);
    refresh();
    form.reset();
});

container.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-delete");
    if (!btn) return;

    const card = btn.closest(".card");
    const id = Number(card.dataset.id);

    if (!confirm("Supprimer cet animé ?")) return;

    data = data.filter(item => item.id !== id);
    refresh();
});

refresh();