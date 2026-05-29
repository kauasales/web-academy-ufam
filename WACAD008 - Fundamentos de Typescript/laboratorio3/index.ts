import { IProduct } from "./product.interface.js";
import { Cart } from "./cart.js";
import { TV, CellPhone, Bicycle } from "./products.js";

const myCart = new Cart<IProduct>(renderScreen);

const productTypeSelect = document.getElementById('product-type') as HTMLSelectElement;
const dynamicFieldsContainer = document.getElementById('dynamic-fields') as HTMLDivElement;
const productForm = document.getElementById('product-form') as HTMLFormElement;

function getInputValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

productTypeSelect.addEventListener('change', () => {
    const type = productTypeSelect.value;
    let html = '';

    if (type === 'tv') {
        html = `
            <div class="form-group">
                <label for="tv-resolution">Resolução:</label>
                <input type="text" id="tv-resolution" placeholder="Ex: 4K, FullHD" required>
            </div>
            <div class="form-group">
                <label for="tv-size">Tamanho (Polegadas):</label>
                <input type="number" id="tv-size" placeholder="Ex: 55" required min="1">
            </div>
        `;
    } else if (type === 'cellphone') {
        html = `
            <div class="form-group">
                <label for="phone-memory">Memória RAM/Armazenamento:</label>
                <input type="text" id="phone-memory" placeholder="Ex: 8GB/256GB" required>
            </div>
        `;
    } else if (type === 'bicycle') {
        html = `
            <div class="form-group">
                <label for="bike-rim">Tamanho do Aro:</label>
                <input type="number" id="bike-rim" placeholder="Ex: 29" required min="1">
            </div>
        `;
    }
    dynamicFieldsContainer.innerHTML = html;
});

productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = Date.now().toString(); // Generates a unique ID
    const model = getInputValue('prod-model');
    const manufacturer = getInputValue('prod-manufacturer');
    const price = parseFloat(getInputValue('prod-price'));
    const type = productTypeSelect.value;

    let newProduct: IProduct;

    if (type === 'tv') {
        const res = getInputValue('tv-resolution');
        const size = parseInt(getInputValue('tv-size'));
        newProduct = new TV(id, model, res, size, manufacturer, price);
    } else if (type === 'cellphone') {
        const mem = getInputValue('phone-memory');
        newProduct = new CellPhone(id, model, mem, manufacturer, price);
    } else {
        const rim = parseInt(getInputValue('bike-rim'));
        newProduct = new Bicycle(id, model, rim, manufacturer, price);
    }

    myCart.addItem(newProduct);
    productForm.reset();
    dynamicFieldsContainer.innerHTML = '';
    productTypeSelect.value = '';
});

function renderScreen(): void {
    // Updating Stats Display
    document.getElementById('stat-qty')!.innerText = myCart.getTotalItems().toString();
    document.getElementById('stat-total')!.innerText = `R$ ${myCart.getTotalPrice().toFixed(2)}`;

    // Updating Table
    const tbody = document.querySelector('#cart-table tbody')!;
    tbody.innerHTML = '';

    myCart.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.getDescription()}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>
                <button class="btn-delete" data-id="${item.id}">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Binding Delete Buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.target as HTMLButtonElement).getAttribute('data-id')!;
            myCart.removeItem(id);
        });
    });
}

renderScreen();