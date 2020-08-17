// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    const burgerMenu = document.getElementById("burger");
    if (burgerMenu) {
        burgerMenu.addEventListener("click", displayToogleNavigation);
    }

    const reception = document.querySelector(".main__catalog");
    if (!reception) return;


    // Calling API to get all products
    fetch("http://localhost:3000/api/teddies")
        .then((response) => response.json())
        .then((data) => {
            if (!data.length) return;

            data.forEach(element => {

                const productCard = document.createElement("div");
                productCard.classList.add("main__product");

                const {
                    imageUrl,
                    name,
                    description,
                    price,
                    _id
                } = element;

                if (imageUrl && name && description && price && _id) {
                    productCard.innerHTML =
                        `<img src="${imageUrl}" alt="${description}" class="main__image">
                    <h3 class="main__name">${name}</h3>
                    <p class="main__description">${description}</p>
                    <p class="main__price">$${price}</p>
                    <div class="main__btn">
                    <a href="routes/product/index.html?id=${_id}">Get to know him</a>
                    </div>`;
                    reception.appendChild(productCard);
                }
            });
        })
});

function displayToogleNavigation() {
    const links = document.querySelector("#myLinks");
    if (links.style.display === "block") {
        links.style.display = "none";
    } else {
        links.style.display = "block";
        links.style.position = "absolute";

        if (window.innerWidth > 420) {
            links.style.top = "64px";
        } else {
            links.style.top = "109px";
        }
    }
}