document.addEventListener('DOMContentLoaded', function () {
    // Holt den aktuellen Pfad ohne Query-Parameter und Fragment
    let currentPath = window.location.pathname.toLowerCase().split('/').filter(Boolean).pop();

    // Wenn currentPath leer ist, setze ihn auf 'index.html'
    if (!currentPath) currentPath = 'index.html';

    // Wählt alle Links in der Navbar aus
    const menuLinks = document.querySelectorAll('.navbar-menu li a');

    // Schleife durch alle Links und markiert den passenden als aktiv
    menuLinks.forEach(link => {
        // Holt den href-Wert des Links und vergleicht ihn mit dem aktuellen Pfad
        const linkPath = link.getAttribute('href').toLowerCase();

        // Setzt nur dann die Klasse 'active', wenn die URL exakt übereinstimmt
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            // Entfernt die Klasse 'active' von anderen Links
            link.classList.remove('active');
        }
    });
});
