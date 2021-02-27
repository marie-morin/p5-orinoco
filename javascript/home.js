window.addEventListener("DOMContentLoaded", (event) => {
  const productDestination = document.querySelector(".catalog");

  if (!productDestination) return;

  // Fetching products
  const data = getData("https://p5-orinoco-backend.herokuapp.com/api/teddies");

  if (!data) {
    productDestination.innerHTML = "Aucun produits disponibles";
    productDestination.classList.add("empty");
    return;
  }

  data
    .then((data) => {
      data.forEach((product) => {
        const { imageUrl, name, description, price, _id } = product;

        const productCard = document.createElement("article");
        productCard.classList.add("product");
        productCard.classList.add("product--column");

        if (imageUrl && name && description && price && _id) {
          productCard.innerHTML = `<div class="product__showoff">
                    <img src="${imageUrl}" alt="${description}" class="product__image product__image--fixedHeight">
                </div>
                <div class="product__infos">
                    <h3 class="product__name">${name}</h3>
                    <p class="product__description">${description}</p>
                    <p class="product__price">$${price}</p>
                    <div class="mainBtn">
                        <a href="routes/product/index.html?id=${_id}" class="mainBtn__btn">Get to know him</a>
                    </div>
                </div>`;

          productDestination.appendChild(productCard);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      productDestination.innerHTML = "Aucun produit disponible";
      productDestination.classList.add("empty");
    });
});
