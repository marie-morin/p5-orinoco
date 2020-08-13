// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    //Searching for everythnong after "?" in URL
    const search = window.location.search;
    if (!search) return;

    // Getting the ID in URL
    const slice = search.split('=')[1];

    const destination = document.getElementById("destination");
    const productTemplate = document.getElementById("template");
    if (!destination || !productTemplate || !slice) return;

    fetch("http://localhost:3000/api/teddies/" + slice)
        .then((response) => response.json())
        .then((element) => {
            const {
                imageUrl,
                name,
                description,
                price,
                _id,
                colors
            } = element;

            if (imageUrl && name && description && price && _id) {
                const newBear = document.importNode(productTemplate.content, true);
                const bearName = newBear.querySelector(".product__name");
                const bearDescription = newBear.querySelector(".product__description");
                const bearPrice = newBear.querySelector(".product__price");
                const bearImage = newBear.querySelector(".product__image img");
                const bearColor = newBear.querySelector(".product__select");

                bearName.textContent = name;
                bearDescription.textContent = description;
                bearPrice.textContent = `$${price}`;
                bearImage.setAttribute("alt", description);
                bearImage.src = imageUrl;

                // Creating an option for every product color
                colors.forEach(color => {
                    const newColor = document.createElement("option");
                    newColor.textContent = color;
                    newColor.setAttribute("value", color);
                    bearColor.appendChild(newColor);
                });

                destination.appendChild(newBear);

                //Setting product's name in h1
                document.querySelector(".hero__title").textContent = name;
            }
        })
        // We need all the option element to be added to the DOM before adding a eventlinstener on it
        .then(() => {
            const submitBtn = document.getElementById("submit");
            if (!submitBtn) return;

            // Adding the element to localStorage when use clicks "ADD TO CART"
            submitBtn.addEventListener("click", function (e) {
                const orderName = document.querySelector(".product__name").textContent.replace(/\s/g, "");
                const quantity = document.getElementById("quantity").value;
                const color = document.getElementById("color");
                const colorSelected = color.options[color.selectedIndex].text;
                const orderContent = {
                    "id": slice,
                    "quantity": quantity,
                    "color": colorSelected
                };

                localStorage.setItem(orderName, JSON.stringify(orderContent));
            })
        })
});