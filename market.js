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
            
            // Build prices HTML
            let pricesHtml = '';
            let hasPrice = false;
            for (const [curr, price] of Object.entries(data.prices || {})) {
                if (price > 0) {
                    hasPrice = true;
                    pricesHtml += `<span style="display:inline-block; margin-right:10px; margin-bottom:5px; background:rgba(0,0,0,0.5); padding:2px 6px; border-radius:4px; border:1px solid #333;">${price} <img src="images/${curr}.png" alt="${curr}" class="currency-icon inline" onerror="this.src='https://via.placeholder.com/20?text=${curr}'"></span>`;
                }
            }
            if (!hasPrice) {
                pricesHtml = '<span style="color:var(--text-muted);">Not for sale</span>';
            }

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="images/${name}.png" alt="${name}" class="resource-icon" onerror="this.src='https://via.placeholder.com/150?text=${name}'">
                    ${data.stock <= 0 ? '<div class="stock-overlay">NO STOCK</div>' : ''}
                </div>
                <h3>${name}</h3>
                <div class="price-list" style="margin-bottom:0.5rem; font-size:0.9rem;">${pricesHtml}</div>
                <p class="stock-info">Stock: ${data.stock} | Min: ${data.minPurchase}</p>
            `;

            card.addEventListener('click', () => {
                if (hasPrice) {
                    openItemModal(name, data);
                }
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
        
        // Populate Currency Selector
        const currencySelect = document.getElementById('currency-select');
        currencySelect.innerHTML = '';
        for (const [curr, price] of Object.entries(data.prices || {})) {
            if (price > 0) {
                const opt = document.createElement('option');
                opt.value = curr;
                opt.innerText = `${curr} (${price} per unit)`;
                currencySelect.appendChild(opt);
            }
        }

        document.getElementById('purchase-amount').value = data.minPurchase;
        document.getElementById('purchase-amount').min = data.minPurchase;
        
        updateCalculator();
        itemModal.classList.remove('hidden');
    }

    function setupCalculator() {
        document.getElementById('purchase-amount').addEventListener('input', updateCalculator);
        document.getElementById('gear-type').addEventListener('change', updateCalculator);
        document.getElementById('currency-select').addEventListener('change', updateCalculator);
    }

    function updateCalculator() {
        if (!currentItemName) return;
        
        const data = config.items[currentItemName];
        let amount = parseInt(document.getElementById('purchase-amount').value) || data.minPurchase;
        if (amount < data.minPurchase) amount = data.minPurchase;
        
        const currencySelect = document.getElementById('currency-select');
        const selectedCurrency = currencySelect.value;
        const basePrice = data.prices[selectedCurrency] || 0;

        const baseTotal = amount * basePrice;
        document.getElementById('calc-base-total').innerText = baseTotal;

        // Set currency icons
        const cIconSrc = `images/${selectedCurrency}.png`;
        document.getElementById('calc-currency-icon-1').src = cIconSrc;
        document.getElementById('calc-currency-icon-1').onerror = function() { this.src = `https://via.placeholder.com/20?text=${selectedCurrency}`; };
        document.getElementById('calc-currency-icon-2').src = cIconSrc;
        document.getElementById('calc-currency-icon-2').onerror = function() { this.src = `https://via.placeholder.com/20?text=${selectedCurrency}`; };
        document.getElementById('calc-currency-icon-3').src = cIconSrc;
        document.getElementById('calc-currency-icon-3').onerror = function() { this.src = `https://via.placeholder.com/20?text=${selectedCurrency}`; };

        const taxedCurrencies = ["Darksteel", "adamantite", "vicanite"];
        const gearSelectContainer = document.getElementById('gear-select-container');
        const taxedBox = document.getElementById('taxed-result-box');
        const untaxedBox = document.getElementById('untaxed-result-box');

        if (taxedCurrencies.includes(selectedCurrency)) {
            // Apply Tax
            gearSelectContainer.classList.remove('hidden');
            taxedBox.classList.remove('hidden');
            untaxedBox.classList.add('hidden');

            const gearTypeN = parseInt(document.getElementById('gear-type').value);
            const yieldPerGear = gearTypeN - 1;
            const gearsNeeded = Math.ceil(baseTotal / yieldPerGear);
            const rawMaterialsNeeded = gearsNeeded * gearTypeN;

            document.getElementById('calc-gear-amount').innerText = gearsNeeded;
            document.getElementById('calc-raw-materials').innerText = rawMaterialsNeeded;
        } else {
            // No Tax
            gearSelectContainer.classList.add('hidden');
            taxedBox.classList.add('hidden');
            untaxedBox.classList.remove('hidden');

            document.getElementById('calc-untaxed-materials').innerText = baseTotal;
        }
    }

    // --- Admin Functionality ---

    function initAdminPanel() {
        if (!isAdmin) return;
        adminPanel.classList.remove('hidden');

        for (const [name, data] of Object.entries(config.items)) {
            const row = document.createElement('div');
            row.className = 'admin-item-row';
            
            let pricesInputsHtml = '';
            config.currencies.forEach(c => {
                let currentVal = data.prices && data.prices[c] !== undefined ? data.prices[c] : 0;
                pricesInputsHtml += `
                    <label style="display:flex; flex-direction:column; align-items:flex-start; margin-right:10px;">
                        <span style="font-size:0.7rem; color:var(--text-muted);">${c}</span>
                        <input type="number" data-item="${name}" data-currency="${c}" value="${currentVal}" min="0" style="width:60px;">
                    </label>
                `;
            });

            row.innerHTML = `
                <h4>${name}</h4>
                <div class="admin-controls" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; flex-wrap:wrap; gap:10px; padding:10px; background:#0a0a0a; border-radius:4px;">
                        <strong style="width:100%; font-size:0.8rem; margin-bottom:5px;">Prices (Set 0 to disable)</strong>
                        ${pricesInputsHtml}
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <label>Stock: <input type="number" data-item="${name}" data-field="stock" value="${data.stock}"></label>
                        <label>Min Qty: <input type="number" data-item="${name}" data-field="minPurchase" value="${data.minPurchase}"></label>
                    </div>
                </div>
            `;
            adminList.appendChild(row);
        }

        // Listen for changes
        adminList.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT') {
                const item = e.target.getAttribute('data-item');
                const field = e.target.getAttribute('data-field');
                const currency = e.target.getAttribute('data-currency');
                let val = parseFloat(e.target.value) || 0;
                
                if (currency) {
                    if (!config.items[item].prices) config.items[item].prices = {};
                    config.items[item].prices[currency] = val;
                } else if (field) {
                    config.items[item][field] = val;
                }
                
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
