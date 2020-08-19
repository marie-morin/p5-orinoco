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
                const productName = newProduct.querySelector(".product__name");
                const productDescription = newProduct.querySelector(".product__description");
                const productPrice = newProduct.querySelector(".product__price");
                const productImage = newProduct.querySelector(".product__image");
                const productColor = newProduct.querySelector(".product__select");

                productName.textContent = name;
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
        })

        .then(() => {
            const submitBtn = document.getElementById("submit");
            if (!submitBtn) return;

            submitBtn.addEventListener("click", function (e) {

                // Storing data form form in localStorage using product name as "key"
                const orderName = document.querySelector(".product__name").textContent.replace(/\s/g, "");
                const quantity = document.getElementById("quantity").value;
                const color = document.getElementById("color");
                if (!orderName || !quantity || !color) return;

                const colorSelected = color.options[color.selectedIndex].text;
                const orderContent = {
                    "id": sliceId,
                    "quantity": quantity,
                    "color": colorSelected
                };
                localStorage.setItem(orderName, JSON.stringify(orderContent));
            })
        })
});