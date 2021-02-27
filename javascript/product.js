// Check for full page load before doing anything
window.addEventListener("DOMContentLoaded", (event) => {
  const productDestination = document.getElementById("destination");
  const productTemplate = document.getElementById("template");
  let alertMessage;

  // Extracting id from url
  const search = window.location.search;
  if (!search) return;
  const sliceId = search.split("=")[1];

  if (!productDestination || !productTemplate || !sliceId) return;

  // Fetching product
  const data = getData(
    "https://p5-orinoco-backend.herokuapp.com/api/teddies/" + sliceId
  );

  if (!data) return;

  data
    .then((product) => {
      const { imageUrl, name, description, price, _id, colors } = product;

      if (imageUrl && name && description && price && _id) {
        // Giving the hero the product's name
        document.querySelector(".hero__title").textContent = name;

        // Importing template
        const newProduct = document.importNode(productTemplate.content, true);

        // Filling template
        const productName = newProduct.querySelectorAll(".product__name");
        const productDescription = newProduct.querySelector(
          ".product__description"
        );
        const productPrice = newProduct.querySelector(".product__price");
        const productImage = newProduct.querySelector(".product__image");
        const productColor = newProduct.querySelector(".product__select");
        alertMessage = newProduct.querySelector(".product__warning");

        productName.forEach((element) => {
          element.textContent = name;
        });

        productDescription.textContent = description;
        productPrice.textContent = `$${price}`;
        productImage.setAttribute("alt", description);
        productImage.src = imageUrl;

        // Creating an option for every entry in colors array
        colors.forEach((color) => {
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
        alertMessage.textContent = "";

        // Storing data form form in localStorage using product name as "key" (supresing whitespace)
        const compressedName = whiteSpaceSupressor(
          document.querySelector(".product__name").textContent
        );
        const color = document.getElementById("color");
        const colorSelected = color.options[color.selectedIndex].text;
        const orderName = compressedName + whiteSpaceSupressor(colorSelected);
        let quantity = parseInt(document.getElementById("quantity").value);

        // If orderName matchs the key of an already stored item in localStorage
        // -> supress the element and replace it with a new one which you add the previous element's quantity to
        if (localStorage.length >= 1) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const previousColor = JSON.parse(localStorage.getItem(key)).color;

            if (key == orderName && colorSelected == previousColor) {
              const previousQuantity = parseInt(
                JSON.parse(localStorage.getItem(key)).quantity
              );
              quantity = quantity + previousQuantity;
              if (quantity > 3) {
                quantity = 3;
                alertMessage.textContent =
                  "Only 3 identical products can be added to cart.";
                e.preventDefault();
              }
              localStorage.removeItem(orderName);
            }
          }
        }

        const orderContent = {
          id: sliceId,
          name: name,
          quantity: quantity,
          color: colorSelected,
          price: price.toString(),
        };

        if (colors.indexOf(colorSelected) >= 0) {
          localStorage.setItem(orderName, JSON.stringify(orderContent));
        }
      });
    })
    .catch((err) => {
      console.log(err);
      productDestination.innerHTML = "Product not available";
      productDestination.classList.add("empty");
    });
});
