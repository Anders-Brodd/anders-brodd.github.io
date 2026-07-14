document.addEventListener('DOMContentLoaded', () => {
    const config = window.marketConfig;
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true';

    // DOM Elements
    const grid = document.getElementById('market-grid');
    const adminPanel = document.getElementById('admin-panel');
    const adminList = document.getElementById('admin-items-list');
    const exportBtn = document.getElementById('export-config-btn');
    const exportModal = document.getElementById('export-modal');
    const exportTextarea = document.getElementById('export-textarea');
    const copyExportBtn = document.getElementById('copy-export-btn');

    const itemModal = document.getElementById('item-modal');
    const closeModals = document.querySelectorAll('.close-modal');

    // Currently selected item for the modal
    let currentItemName = '';

    // Initialize Page
    initAdminPanel();
    renderGrid();
    setupModals();
    setupCalculator();

    // --- Core Rendering ---

    function renderGrid() {
        grid.innerHTML = '';
        for (const [name, data] of Object.entries(config.items)) {
            const card = document.createElement('div');
            card.className = 'market-card';
            
            // Check stock
            if (data.stock <= 0) {
                card.classList.add('out-of-stock');
            }

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="images/${name}.png" alt="${name}" class="resource-icon" onerror="this.src='https://via.placeholder.com/150?text=${name}'">
                    ${data.stock <= 0 ? '<div class="stock-overlay">NO STOCK</div>' : ''}
                </div>
                <h3>${name}</h3>
                <p class="price">Price: ${data.price} <img src="images/${data.currency}.png" alt="${data.currency}" class="currency-icon" onerror="this.src='https://via.placeholder.com/20?text=${data.currency}'"></p>
                <p class="stock-info">Stock: ${data.stock} | Min: ${data.minPurchase}</p>
            `;

            card.addEventListener('click', () => {
                openItemModal(name, data);
            });

            grid.appendChild(card);
        }
    }

    // --- Modals & Calculator ---

    function setupModals() {
        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                itemModal.classList.add('hidden');
                exportModal.classList.add('hidden');
            });
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === itemModal) itemModal.classList.add('hidden');
            if (e.target === exportModal) exportModal.classList.add('hidden');
        });
    }

    function openItemModal(name, data) {
        currentItemName = name;
        document.getElementById('modal-item-icon').src = `images/${name}.png`;
        document.getElementById('modal-item-icon').onerror = function() { this.src = `https://via.placeholder.com/60?text=${name}`; };
        document.getElementById('modal-item-name').innerText = name;
        document.getElementById('modal-item-stock').innerText = data.stock;
        document.getElementById('modal-item-min').innerText = data.minPurchase;
        document.getElementById('modal-item-price').innerText = data.price;
        
        const cIconSrc = `images/${data.currency}.png`;
        document.getElementById('modal-currency-icon').src = cIconSrc;
        document.getElementById('modal-currency-icon').onerror = function() { this.src = `https://via.placeholder.com/20?text=${data.currency}`; };
        document.getElementById('calc-currency-icon-1').src = cIconSrc;
        document.getElementById('calc-currency-icon-1').onerror = function() { this.src = `https://via.placeholder.com/20?text=${data.currency}`; };
        document.getElementById('calc-currency-icon-2').src = cIconSrc;
        document.getElementById('calc-currency-icon-2').onerror = function() { this.src = `https://via.placeholder.com/20?text=${data.currency}`; };

        document.getElementById('purchase-amount').value = data.minPurchase;
        document.getElementById('purchase-amount').min = data.minPurchase;
        
        updateCalculator();
        itemModal.classList.remove('hidden');
    }

    function setupCalculator() {
        document.getElementById('purchase-amount').addEventListener('input', updateCalculator);
        document.getElementById('gear-type').addEventListener('change', updateCalculator);
    }

    function updateCalculator() {
        if (!currentItemName) return;
        
        const data = config.items[currentItemName];
        let amount = parseInt(document.getElementById('purchase-amount').value) || data.minPurchase;
        if (amount < data.minPurchase) amount = data.minPurchase;

        const baseTotal = amount * data.price;
        document.getElementById('calc-base-total').innerText = baseTotal;

        const gearTypeN = parseInt(document.getElementById('gear-type').value);
        
        // Tax formula: yield per gear = n - 1
        const yieldPerGear = gearTypeN - 1;
        
        // Number of gears needed to satisfy the baseTotal
        const gearsNeeded = Math.ceil(baseTotal / yieldPerGear);
        
        // Total raw materials the buyer has to use to craft those gears
        const rawMaterialsNeeded = gearsNeeded * gearTypeN;

        document.getElementById('calc-gear-amount').innerText = gearsNeeded;
        document.getElementById('calc-raw-materials').innerText = rawMaterialsNeeded;
    }

    // --- Admin Functionality ---

    function initAdminPanel() {
        if (!isAdmin) return;
        adminPanel.classList.remove('hidden');

        for (const [name, data] of Object.entries(config.items)) {
            const row = document.createElement('div');
            row.className = 'admin-item-row';
            
            row.innerHTML = `
                <h4>${name}</h4>
                <div class="admin-controls">
                    <label>Price: 
                        <input type="range" data-item="${name}" data-field="price" min="1" max="1000" value="${data.price}">
                        <span class="price-val">${data.price}</span>
                    </label>
                    <label>Currency: 
                        <select data-item="${name}" data-field="currency">
                            ${config.currencies.map(c => `<option value="${c}" ${c === data.currency ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </label>
                    <label>Stock: <input type="number" data-item="${name}" data-field="stock" value="${data.stock}"></label>
                    <label>Min Qty: <input type="number" data-item="${name}" data-field="minPurchase" value="${data.minPurchase}"></label>
                </div>
            `;
            adminList.appendChild(row);
        }

        // Listen for changes
        adminList.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                const item = e.target.getAttribute('data-item');
                const field = e.target.getAttribute('data-field');
                let val = e.target.value;
                
                if (field === 'price' && e.target.nextElementSibling) {
                    e.target.nextElementSibling.innerText = val;
                }
                
                if (field !== 'currency') {
                    val = parseFloat(val) || 0;
                }
                
                config.items[item][field] = val;
                renderGrid(); // Re-render grid on change
            }
        });

        // Export functionality
        exportBtn.addEventListener('click', () => {
            const exportStr = `// This file contains the configuration for the market page.
// If you update things in the Admin panel, you can export the new config and paste it here.

window.marketConfig = ${JSON.stringify(config, null, 4)};`;
            
            exportTextarea.value = exportStr;
            exportModal.classList.remove('hidden');
        });

        copyExportBtn.addEventListener('click', () => {
            exportTextarea.select();
            document.execCommand('copy');
            copyExportBtn.innerText = 'Copied!';
            setTimeout(() => { copyExportBtn.innerText = 'Copy to Clipboard'; }, 2000);
        });
    }
});
