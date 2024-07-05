document.addEventListener('DOMContentLoaded', () => {
    loadCSV('data/items.csv', (data) => {
        const inventory = parseCSV(data);
        displayItems(inventory);
        populateCategoryFilter(inventory);
        setupSearchAndFilter(inventory);
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

function displayItems(items) {
    const itemsContainer = document.getElementById('inventoryDisplay');
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <p>Color: ${item.color}</p>
            <p>Size: ${item.size}</p>
            <button class="add-to-cart" data-name="${item.name}">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemDiv);
    });
    addCartFunctionality(items);
}


function populateCategoryFilter(items) {
    const categorySelect = document.getElementById('categoryFilter');
    const categories = [...new Set(items.map(item => item.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function setupSearchAndFilter(items) {
    const searchInput = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const categorySelect = document.getElementById('categoryFilter');

    function filterItems() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const filteredItems = items.filter(item => {
            return (
                (item.name.toLowerCase().includes(searchText) || item.category.toLowerCase().includes(searchText)) &&
                (selectedCategory === '' || item.category === selectedCategory)
            );
        });
        displayItems(filteredItems);
    }

    searchButton.addEventListener('click', filterItems);
    categorySelect.addEventListener('change', filterItems);
}

function addCartFunctionality(items) {
    const cartItems = [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            const item = items.find(i => i.name === itemName);
            cartItems.push(item);
            displayCart(cartItems);
        });
    });
}


function displayCart(cartItems) {
    const cartItemsContainer = document.getElementById('cartContents');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    cartItems.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        cartItem.textContent = `${item.name} - $${item.price}`;
        cartItemsContainer.appendChild(cartItem);
        totalPrice += parseFloat(item.price);
    });
    document.getElementById('output').innerText = `Total: $${totalPrice.toFixed(2)}`;
}
