// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    const destination = document.getElementById("destination");
    const deleteDestination = document.querySelector(".deleteDestination");
    if (!destination || !deleteDestination) return;

    if (localStorage.length == 0) {
        destination.textContent = "Aucun produits dans le panier";
        destination.classList.add("empty");
    } else {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete all items";
        deleteBtn.classList.add("deleteBtn");
        deleteDestination.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", function () {
            localStorage.clear();
            location.reload();
        })
    }



    fetch("http://localhost:3000/api/teddies")
        .then((response) => response.json())
        .then((data) => {
            if (!data.length) return;

            data.forEach(element => {
                const {
                    imageUrl,
                    name,
                    description,
                    price,
                    _id
                } = element;

                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let usableKey = JSON.parse(localStorage.getItem(key));
                    let localID = usableKey.id;

                    if (localID == _id) {
                        const article = document.createElement("article");
                        article.classList.add("whishlist");

                        article.innerHTML =
                            `<div class="whishlist__image">
                        <img src="${imageUrl}" alt="${description}">
                        </div>
                        <div class="whishlist__infos">
                        <h2 class="whishlist__name">${name}</h2>
                        <p class="whishlist__description">${description}</p>
                        <p class="whishlist__color">Couleur : ${usableKey.color}</p>
                        <p class="whishlist__price">${price}</p>
                        <select class="whishlist__select ${_id}" name="personalisation" id="personalisation">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        </select>
                        <br>
                        <a id="${_id}" class="whishlist__remove ${key}" href="../cart/index.html">Remove</a>
                        </div>`;

                        destination.appendChild(article);

                        let totalPrice = document.querySelector(".total-price");
                        let bearPrice = price * usableKey.quantity;
                        let actualPrice = Number(totalPrice.textContent);
                        totalPrice.textContent = actualPrice + bearPrice;

                        const quantity = usableKey.quantity;
                        const options = article.querySelectorAll("#personalisation option");
                        options.forEach(option => {
                            if (option.value == quantity) {
                                option.setAttribute("selected", "");
                            }
                        })
                    }
                };
            });


            // selects.forEach(select => {
            //     select.addEventListener("change", function (e) {
            //         const value = e.target.value;
            //         let id = select.classList[1];

            //         for (let i = 0; i < localStorage.length; i++) {
            //             let key = localStorage.key(i);
            //             console.log(key);
            //             let usableKey = JSON.parse(localStorage.getItem(key));
            //             let localID = usableKey.id;
            //             if (localID == id) {
            //                 localStorage.setItem(usableKey[2], value);
            //             }
            //         }
            //     })
            // });

            const removeBtn = document.querySelectorAll(".whishlist__remove");
            removeBtn.forEach(btn => {
                btn.addEventListener("click", function (e) {
                    let key = btn.classList[1];
                    localStorage.removeItem(key);
                })
            })
        })
        .then(function () {
            const form = document.querySelector("form");
            const products = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const id = JSON.parse(localStorage.getItem(key)).id;
                products.push(id);
            };

            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const contact = {
                    firstName: document.getElementById("first").value,
                    lastName: document.getElementById("last").value,
                    address: document.getElementById("adress").value,
                    city: document.getElementById("city").value,
                    email: document.getElementById("email").value
                };

                const body = {
                    contact,
                    products
                };

                fetch("http://localhost:3000/api/teddies/order", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body),
                    })
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem("orderRecap", JSON.stringify(data));
                        window.location.replace("../confirmation/index.html");
                    })
            });
        })
});