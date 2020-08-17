// Check for full page load before doing anything
window.addEventListener('DOMContentLoaded', (event) => {

    const search = window.location.search;
    if (!search) return;
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

                colors.forEach(color => {
                    const newColor = document.createElement("option");
                    newColor.textContent = color;
                    newColor.setAttribute("value", color);
                    bearColor.appendChild(newColor);
                });

                destination.appendChild(newBear);

                document.querySelector(".hero__title").textContent = name;
            }
        })
        .then(() => {
            const submitBtn = document.getElementById("submit");
            if (!submitBtn) return;

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