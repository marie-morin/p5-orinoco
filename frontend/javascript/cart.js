window.addEventListener('DOMContentLoaded', (event) => {

    const productsDestination = document.getElementById("destination");
    const deleteDestination = document.querySelector(".mainBtn");
    const form = document.querySelector(".cartForm");
    const products = [];

    if (!productsDestination || !deleteDestination || !form) return;

    // Searching for data in localStorage
    if (localStorage.length == 0) {
        // If localStorage empty, display message
        productsDestination.textContent = "Aucun produits dans le panier";
        productsDestination.classList.add("empty");
    } else {
        // If localStorage contains something, create button to be able to empty cart
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete all items";
        deleteBtn.classList.add("mainBtn__btn");
        deleteBtn.classList.add("mainBtn__btn--yellow");
        deleteDestination.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", function () {
            localStorage.clear();
            location.reload();
        })
    }

    // Fetching data
    const data = getData("http://localhost:3000/api/teddies");

    data.then(data => {
        if (!data.length) return;

        data.forEach(product => {
            const {
                imageUrl,
                name,
                description,
                price,
                _id
            } = product;

            // Looping trougth localStorage to extract "id" key
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const usableKey = JSON.parse(localStorage.getItem(key));
                const localID = usableKey.id;

                // Searching for a match between fetched elements' id and "id" key in localStorage
                // and display the coresponding element in cart
                if (localID == _id) {
                    const article = document.createElement("article");
                    article.classList.add("product");

                    article.innerHTML =
                        `<div class="product__showoff">
                            <img class="product__image product__image--fixedWidth" src="${imageUrl}" alt="${description}">
                        </div>
                        <div class="product__infos">
                            <h2 class="product__name">${name}</h2>
                            <p class="product__description">${description}</p>
                            <p class="product__color">Couleur : ${usableKey.color}</p>
                            <p class="product__price">$${price}</p>
                            <select class="product__select ${_id}" name="personalisation" id="personalisation">
                                <option value="one">1</option>
                                <option value="two">2</option>
                                <option value="tree">3</option>
                            </select><br>
                            <a id="${_id}" class="product__remove ${key}" href="../cart/index.html">Remove</a>
                        </div>`;

                    productsDestination.appendChild(article);

                    // Updating total price at every loop
                    const quantity = usableKey.quantity;
                    const totalPrice = document.querySelector(".total-price");
                    if (!totalPrice) return;

                    const bearPrice = price * quantity;
                    const actualPrice = Number(totalPrice.textContent);
                    totalPrice.textContent = actualPrice + bearPrice;

                    // Reporting selected quantity in cart
                    const options = article.querySelectorAll("#personalisation option");
                    options.forEach(option => {
                        if (option.value == quantity) {
                            option.setAttribute("selected", "");
                        }
                    })

                    // Pushing the element's id in products array
                    products.push(localID);
                }

                // Listening for submit to POST
                form.addEventListener("submit", function (e) {
                    e.preventDefault();
                    const firstName = document.getElementById("first").value;
                    const lastName = document.getElementById("last").value;
                    const address = document.getElementById("adress").value;
                    const city = document.getElementById("city").value;
                    const email = document.getElementById("email").value;

                    if (!firstName || !lastName || !address || !city || !email) return;

                    const contact = {
                        firstName,
                        lastName,
                        address,
                        city,
                        email
                    };

                    const body = {
                        contact,
                        products
                    };

                    postData("http://localhost:3000/api/teddies/order", body);
                });
            };

        })
    })
});