const cardSection = document.getElementById("card-section");
const categoryFilter = document.getElementById("category-filter");
const filterByCategory = document.getElementById("category-filter");
const filterByRating = document.getElementById("rating-filter");
const sortBy = document.getElementById("sort-by");
const searchAreaForm = document.getElementById("search-input");
const searchBar = document.getElementById("search-bar");
const resultCountDisplay = document.getElementById("result-count");
let currentList = products;

// render the products when the script loads
renderProductList(products);

// reset button
document.getElementById("reset").addEventListener("click", (e) => {
    e.preventDefault();
    currentList = products;
    renderProductList(currentList);
    categoryFilter.selectedIndex = 0;
    filterByCategory.selectedIndex = 0;
    filterByRating.selectedIndex = 0;
    sortBy.selectedIndex = 0;
    searchBar.value = "";
})

//dynamically create the category options in the filter section
let categories = [];
products.forEach(product => {
    if (!categories.includes(product.category)) {
        categories.push(product.category);
    }
})
categories.forEach(category => {
    let option = document.createElement("option");
    option.innerText = category;
    categoryFilter.appendChild(option);
})

// event listeners
searchAreaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyOptions();
})

const formElements = [sortBy, filterByCategory, filterByRating];
formElements.forEach( el => {
    el.addEventListener("input", () => {
        applyOptions();
    });
})


function renderProductList(data = products) {
    cardSection.innerHTML = "";

    if (data.length === 0) {
        let p = document.createElement("p");
        p.innerText = "No results";
        cardSection.append(p);
    }

    data.forEach((product) => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = createCard(product);

        // Alternative (hard) version
        // card = createCard2(card, product);

        cardSection.append(card);
    })

    resultCountDisplay.innerText = data.length;
}

function createCard(product) {
    const html = `
    <p class="product-title">${product.title}</p>
    <div class="image-container">
        <img class="product-image" src="${product.image}" alt="">
    </div>
    <p class="product-description">${product.description}</p>
    <div class="details-section">
        <p class="product-price">${product.price.toFixed(2)} €</p>
        <p class="product-rating">
            ${product.rating.rate}
            <i class="bi bi-star-fill rating-star"></i>    
            <span class="rating-count">(${product.rating.count} ratings)</span>
        </p>
    </div>
    `
    return html;
}

function createCard2(card, product) {
    let title = document.createElement("p");
    title.classList.add("product-title");
    title.innerText = product.title;

    card.appendChild(title);

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    let image = document.createElement("img");
    image.classList.add("product-image");
    image.src = product.image;
    imageContainer.appendChild(image);

    card.appendChild(imageContainer);

    let description = document.createElement("p");
    description.classList.add("product-description");
    description.innerText = product.description;

    card.appendChild(description);

    let detailsSection = document.createElement("div");
    detailsSection.classList.add("details-section");

    let price = document.createElement("p");
    let rating = document.createElement("p");
    let ratingCount = document.createElement("span");
    price.classList.add("product-price");
    rating.classList.add("product-rating");
    ratingCount.classList.add("rating-count");
    price.innerText = product.price.toFixed(2);
    rating.innerHTML = `
    <i class="bi bi-star-fill rating-star"></i>    
    (${product.rating.count} ratings)
    `;
    rating.appendChild(ratingCount);

    detailsSection.appendChild(price);
    detailsSection.appendChild(rating);

    card.appendChild(detailsSection);

    return card;
}

function search(list, searchString) {
    const items = list.filter(x => x.title.toLowerCase().includes(searchString.toLowerCase()) ||
        x.description.toLowerCase().includes(searchString.toLowerCase()));
    return items;
}

function sortByFunc(list, input) {
    if (!input || list.length === 0) {
        return list;
    }

    let items = [];

    switch (input) {
        case "a-z":
            items = list.sort(function (a, b) {
                return a.title.localeCompare(b.title);
            });
            break;
        case "z-a":
            items = list.sort(function (a, b) {
                return b.title.localeCompare(a.title);
            });
            break;
        case "price-lowest":
            items = list.sort(function (a, b) {
                return a.price - b.price;
            });
            break;
        case "price-highest":
            items = list.sort(function (a, b) {
                return b.price - a.price;
            });
            break;
        case "rating":
            items = list.sort(function (a, b) {
                return b.rating.rate - a.rating.rate;
            });
            break;

    }
    return items;
}

function filterByFunc(list, filter, type) {
    if (!filter || list.length === 0) {
        return list;
    }

    let items = [];

    if (type === "category") {
        items = list.filter(el => el.category === filter);
    }
    else if (type === "rating") {
        items = list.filter(el => el.rating.rate >= parseInt(filter));
    }
    return items;
}

function applyOptions() {
    let currentProducts = products;

    const searchString = searchBar.value;
    currentProducts = search(currentProducts, searchString);

    const input = sortBy.value;
    currentProducts = sortByFunc(currentProducts, input);

    let categoryFilter = filterByCategory.value;
    currentProducts = filterByFunc(currentProducts, categoryFilter, "category");

    let ratingFilter = filterByRating.value;
    currentProducts = filterByFunc(currentProducts, ratingFilter, "rating");

    renderProductList(currentProducts);

}



