window.addEventListener('DOMContentLoaded', (event) => {

    const burgerMenu = document.getElementById("burger");
    const productDestination = document.querySelector(".main__catalog");

    if (burgerMenu) burgerMenu.addEventListener("click", displayToogleNavigation);

    if (!productDestination) return;

    const data = getData("http://localhost:3000/api/teddies");

    if (!data) return;

    data.then(data => {
        data.forEach(product => {
            const {
                imageUrl,
                name,
                description,
                price,
                _id
            } = product;

            const productCard = document.createElement("div");
            productCard.classList.add("main__product");

            if (imageUrl && name && description && price && _id) {
                productCard.innerHTML =
                    `<img src="${imageUrl}" alt="${description}" class="main__image">
                <h3 class="main__name">${name}</h3>
                <p class="main__description">${description}</p>
                <p class="main__price">$${price}</p>
                <div class="mainBtn">
                <a href="routes/product/index.html?id=${_id}" class="mainBtn__btn">Get to know him</a>
                </div>`;
                productDestination.appendChild(productCard);
            }
        });
    })
});