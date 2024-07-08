// script.js
document.getElementById('convert').addEventListener('click', convertCurrency);

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    if (!amount) {
        alert('Por favor, ingrese un monto.');
        return;
    }

    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        const rate = data[currency].valor;
        const result = amount / rate;

        document.getElementById('result').textContent = `Monto en ${currency.toUpperCase()}: ${result.toFixed(2)}`;

        // Fetch historical data and update chart
        updateChart(currency);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function updateChart(currency) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        const data = await response.json();

        const labels = data.serie.slice(0, 10).map(item => item.fecha.split('T')[0]).reverse();
        const values = data.serie.slice(0, 10).map(item => item.valor).reverse();

        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial de ${currency.toUpperCase()}`,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}
