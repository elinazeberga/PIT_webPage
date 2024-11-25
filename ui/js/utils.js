export function injectHTML(url, elementId, callback = null) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(err => console.error(`Error fetching ${url}:`, err));
}
