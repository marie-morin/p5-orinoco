// Burger menu display
function displayToogleNavigation() {
    const links = document.querySelector("#myLinks");
    if (!links) return;
    if (links.style.display === "block") {
        links.style.display = "none";
    } else {
        links.style.display = "block";
        links.style.position = "absolute";

        if (window.innerWidth > 420) {
            links.style.top = "64px";
        } else {
            links.style.top = "109px";
        }
    }
}

// AJAX GET
async function getData(url) {
    const dataStream = await fetch(url);
    const data = await dataStream.json();
    return data;
}

// AJAX POST
async function postData(url, data, total) {
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-type': 'application/json'
        })
    }
    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            // Stocks data in localStorage
            localStorage.setItem("orderRecap", JSON.stringify(data));
            // Storing total price in localStorage
            localStorage.setItem("price", total.toString());
            // Redirecting to geetings page
            window.location.replace("../confirmation/index.html");
        })
        .catch(err => console.error(err))
}

// Calculating cart total price
function calculPrice(destination) {
    let sum = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const usableKey = JSON.parse(localStorage.getItem(key));
        sum += usableKey.quantity * usableKey.price;
    }
    destination.textContent = sum;
    return sum;
}