window.addEventListener('DOMContentLoaded', (event) => {

    const productsDestination = document.getElementById("destination");
    const priceDestination = document.querySelector(".total-price");
    const deleteDestination = document.querySelector(".mainBtn");
    const form = document.querySelector(".cartForm");
    const products = [];
    let totalPrice;

    if (!productsDestination || !priceDestination || !deleteDestination || !form) return;

    // Searching for data in localStorage
    if (localStorage.length == 0) {
        // If localStorage empty, display message
        productsDestination.innerHTML = "Your cart is empty";
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
                    const quantity = usableKey.quantity;
                    const localPrice = usableKey.price;

                    // Searching for a match between fetched elements' id and "id" key in localStorage
                    // and display the coresponding element in cart
                    if (localID == _id) {
                        const article = document.createElement("article");
                        article.classList.add("product");

                        article.innerHTML =
                            `<div class="product__showoff">
                            <img class="product__image product__image--fixedWidth" src="${imageUrl}" alt="${description}">
                        </div>
                        <div class="product__infos product__infos--cart">
                            <h2 class="product__name"><a href="../product/index.html?id=${_id}">${name}</a></h2>
                            <p class="product__description">${description}</p>
                            <p class="product__color">Couleur : ${usableKey.color}</p>
                            <p class="product__price">$${price}</p>
                            <select class="product__select ${_id}" name="personalisation" id="personalisation">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select><br>
                            <a id="${_id}" class="product__remove ${key}" href="../cart/index.html">Remove</a>
                        </div>`;

                        productsDestination.appendChild(article);

                        // Reporting selected quantity in cart
                        const options = article.querySelectorAll("#personalisation option");
                        if (!options) return;

                        options.forEach(option => {
                            if (option.value == quantity) {
                                option.setAttribute("selected", "");
                            }
                        })

                        // Reafecting quantity value in localStorage when quantity select button is modify
                        const select = article.querySelector(".product__select");
                        if (!select) return;

                        select.addEventListener("change", function (e) {
                            const orderName = key;
                            const newQuantity = e.target.value;
                            if (newQuantity > 0 && newQuantity <= 3) {
                                const color = usableKey.color;
                                const orderContent = {
                                    "name": name,
                                    "id": localID,
                                    "quantity": newQuantity,
                                    "color": color,
                                    "price": localPrice.toString()
                                };
                                localStorage.removeItem(key);
                                localStorage.setItem(orderName, JSON.stringify(orderContent));

                                // Recalculating total price due
                                totalPrice = calculPrice(priceDestination);
                            }
                        });

                        // Pushing the element's id in products array
                        products.push(localID);

                        // Removing element from localStorage and "remove" btn is clicked
                        const removeBtn = article.querySelector(".product__remove");
                        removeBtn.addEventListener("click", function (e) {
                            localStorage.removeItem(key);
                        });
                    }

                };
            });

            // Assigning total price to total price section in DOM
            totalPrice = calculPrice(priceDestination);

            // Listening for submit to POST
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                document.querySelector(".product__warning").textContent = "";
                // Blocking submit process if cart is empty + displaying message
                if (products.length == 0) {
                    productsDestination.innerHTML += "<br><br><span class='attention'>Your cart must contain at least one product !</span>";
                } else {
                    const firstName = document.getElementById("first").value;
                    const lastName = document.getElementById("last").value;
                    const address = document.getElementById("adress").value;
                    const city = document.getElementById("city").value;
                    const email = document.getElementById("email").value;

                    const unwantedRegex = /[0-9]+/;

                    if (unwantedRegex.test(firstName) || unwantedRegex.test(lastName) || unwantedRegex.test(city)) {
                        document.querySelector(".product__warning").textContent = "Your first name, last name and city must not contain numbers";
                    } else {
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

                        postData("http://localhost:3000/api/teddies/order", body, totalPrice);
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            productsDestination.innerHTML = "Cart not available";
            productsDestination.classList.add("empty");
        })
});