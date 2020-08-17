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

async function getData(url) {
    const dataStream = await fetch(url);
    const data = await dataStream.json();
    return data;
}

async function postData(url, data) {
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
            localStorage.setItem("orderRecap", JSON.stringify(data));
            window.location.replace("../confirmation/index.html");
        })
        .catch(err => console.error(err))
}