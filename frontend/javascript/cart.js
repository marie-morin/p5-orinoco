// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    const destination = document.getElementById("destination");

    // Checking form localStorage content
    if (localStorage.length == 0) {
        // If not, display message in cart
        destination.textContent = "Aucun produits dans le panier";
        destination.classList.add("empty");
    } else {
        // If yes, add a button to remove empty the cart
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete all items";
        destination.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", function () {
            for (let i = 0; i < localStorage.length; i++) {
                localStorage.removeItem(localStorage.key(i));
            }
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

                        article.innerHTML = `<div class="whishlist__image"><img src="${imageUrl}" alt="${description}"></div><div class="whishlist__infos"><h2 class="whishlist__name">${name}</h2><p class="whishlist__description">${description}</p>
                        <p class="whishlist__color">Couleur : ${usableKey.color}</p><p class="whishlist__price">${price}</p><select class="whishlist__select" name="personalisation" id="personalisation"><option value="one">1</option>
                        <option value="two">2</option><option value="tree">3</option>
                        </select><br><a id="${_id}" class="whishlist__remove ${key}" href="../cart/index.html">Remove</a></div>`;

                        destination.appendChild(article);

                        let totalPrice = document.querySelector(".total-price");
                        let bearPrice = price * usableKey.quantity;
                        let actualPrice = Number(totalPrice.textContent);
                        totalPrice.textContent = actualPrice + bearPrice;
                    }
                }

            });
            const removeBtn = document.querySelectorAll(".whishlist__remove");

            removeBtn.forEach(btn => {
                btn.addEventListener("click", function (e) {
                    // e.preventDefault();
                    console.log(btn);
                    let key = btn.classList[1];
                    console.log(key);
                    localStorage.removeItem(key);
                })
            })


        })
});