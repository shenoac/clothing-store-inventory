document.addEventListener('DOMContentLoaded', () => {
    // Replace 'items.csv' with the actual path to your CSV file
    loadCSV('data/items.csv', (data) => {
        const inventory = parseCSV(data);
        // Display the name of the first item to check if the data is loaded correctly
        document.getElementById("output").innerText = inventory[0].name;
        console.log(inventory);
    });
});

function loadCSV(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => callback(data))
        .catch(error => console.error('Error loading CSV file:', error));
}

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const items = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const item = {};
            headers.forEach((header, index) => {
                item[header] = line[index].trim();
            });
            items.push(item);
        }
    }
    return items;
}
