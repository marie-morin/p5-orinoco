// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    const productDestination = document.getElementById("destination");
    const productTemplate = document.getElementById("template");
    const search = window.location.search;

    if (!search) return;
    // Extracting id from url
    const sliceId = search.split('=')[1];

    if (!productDestination || !productTemplate || !sliceId) return;

    // Fetching product
    const data = getData("http://localhost:3000/api/teddies/" + sliceId);

    if (!data) return;

    data.then(product => {
        const {
            imageUrl,
            name,
            description,
            price,
            _id,
            colors
        } = product;


        if (imageUrl && name && description && price && _id) {
            // Giving the hero the product's name
            document.querySelector(".hero__title").textContent = name;

            const newProduct = document.importNode(productTemplate.content, true);
            const productName = newProduct.querySelectorAll(".product__name");
            const productDescription = newProduct.querySelector(".product__description");
            const productPrice = newProduct.querySelector(".product__price");
            const productImage = newProduct.querySelector(".product__image");
            const productColor = newProduct.querySelector(".product__select");

            productName.forEach(element => {
                element.textContent = name;
            });

            productDescription.textContent = description;
            productPrice.textContent = `$${price}`;
            productImage.setAttribute("alt", description);
            productImage.src = imageUrl;

            // Creating an option for every entry in colors array
            colors.forEach(color => {
                const newColor = document.createElement("option");
                newColor.textContent = color;
                newColor.setAttribute("value", color);
                productColor.appendChild(newColor);
            });

            productDestination.appendChild(newProduct);
        }

        const submitBtn = document.getElementById("submit");
        if (!submitBtn) return;

        submitBtn.addEventListener("click", function (e) {
            // Storing data form form in localStorage using product name as "key" (supresing whitespace)
            const name = document.querySelector(".product__name").textContent.replace(/\s/g, "");
            const color = document.getElementById("color");
            const colorSelected = color.options[color.selectedIndex].text;
            const orderName = name + colorSelected.replace(/\s/g, "");
            let quantity = parseInt(document.getElementById("quantity").value);

            // If orderName matchs the key of an already stored item in localStorage
            // -> supress the element and replace it with a new one which you add the previous element's quantity to
            if (localStorage.length >= 1) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const previousColor = JSON.parse(localStorage.getItem(key)).color;

                    if (key == orderName && colorSelected == previousColor) {
                        quantity += parseInt(JSON.parse(localStorage.getItem(key)).quantity);
                        localStorage.removeItem(orderName);
                    }
                }
            }

            const orderContent = {
                "id": sliceId,
                "name": name,
                "quantity": quantity,
                "color": colorSelected,
                "price": price.toString(),
            };
            if (colorSelected != "Please chose a color") {
                localStorage.setItem(orderName, JSON.stringify(orderContent));
            }
        })
    })
});