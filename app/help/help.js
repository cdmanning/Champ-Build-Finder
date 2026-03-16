document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('champTableBody');
    const searchInput = document.getElementById('champSearch');
    let championsData = [];

    fetch('../champions.json')
        .then(response => response.json())
        .then(data => {
            championsData = data.champions;
            renderTable(championsData);
        })
        .catch(err => console.error("Could not load champions:", err));

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="2" style="padding: 30px; color: var(--text-secondary);">No champions found matching that name.</td></tr>`;
            return;
        }
        data.forEach(champ => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><strong style="color: var(--purple)">${champ.id}</strong></td><td style="color: var(--text-secondary)">${champ.names.join(', ')}</td>`;
            tableBody.appendChild(row);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = championsData.filter(champ =>
            champ.id.includes(query) ||
            champ.names.some(name => name.toLowerCase().includes(query))
        );
        renderTable(filtered);
    });
});