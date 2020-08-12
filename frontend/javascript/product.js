// Find the page's URL et extract ID
const search = window.location.search;
const slice = search.split('=')[1];


// Div where the product is going
const destination = document.getElementById("destination");
// The template used
const productTemplate = document.getElementById("template");



fetch("http://localhost:3000/api/teddies/" + slice)
    .then((response) => response.json())
    .then((element) => {
        console.log(element);

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
            bearName.textContent = name;

            const bearDescription = newBear.querySelector(".product__description");
            bearDescription.textContent = description;

            const bearPrice = newBear.querySelector(".product__price");
            bearPrice.textContent = `$${price}`;

            const bearImage = newBear.querySelector(".product__image img");
            bearImage.setAttribute("alt", description);
            bearImage.src = imageUrl;

            const bearColor = newBear.querySelector(".product__select");
            colors.forEach(color => {
                const newColor = document.createElement("option");
                newColor.textContent = color;
                newColor.setAttribute("value", color);
                bearColor.appendChild(newColor);
            });

            destination.appendChild(newBear);

            document.querySelector(".hero__title").textContent = name;

            const quantity = document.getElementById("quantity");
            console.log(quantity);
            const color = document.getElementById("color");
            console.log(color);

            const submitBtn = document.getElementById("submit");
            console.log(submitBtn);
            submitBtn.addEventListener("click", function (e) {
                e.preventDefault;
                e.stopImmediatePropagation();
            })
        }
    });

// submitBtn.addEventListener("submit", function (e) {
//     e.preventDefault();
//     console.log(e);
//     localStorage.setItem("quantity", "bob");
//     localStorage.setItem("color", "mich");
// })