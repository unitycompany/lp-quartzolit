document.addEventListener('DOMContentLoaded', function(){
    const searchInput = document.getElementById('pesquisa');
    const searchIcon  = document.getElementById('search-icon');

    // Array com os nomes dos produtos de argamassa da Quartzolit
    const searchItems = [
        { name: "Argamassa de Assentamento Quartzolit", anchor: "#argamassa" },
        { name: "Argamassa Corrida Quartzolit", anchor: "#argamassa" },
        { name: "Argamassa para Reboco Quartzolit", anchor: "#argamassa" },
        { name: "Argamassa para Revestimento Quartzolit", anchor: "#argamassa" },
        { name: "Argamassa Colante Quartzolit", anchor: "#argamassa" }
    ];

    // Configura o Fuse.js para busca com tolerância a erros
    const fuse = new Fuse(searchItems, {
        keys: ['name'],
        threshold: 0.3 // ajuste o threshold conforme necessário
    });

    // Executa a busca e, se encontrar, faz scroll até a âncora da seção
    function performSearch() {
        const query = searchInput.value.trim();
        if (query === "") return;
        const results = fuse.search(query);
        if (results.length > 0) {
        const targetAnchor = results[0].item.anchor;
        const targetElement = document.querySelector(targetAnchor);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        } else {
        console.log("Produto ou categoria não encontrado.");
        // Opcional: exibir uma mensagem de "nenhum resultado" para o usuário
        }
    }

    // Aciona a busca ao pressionar Enter
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
        }
    });
    // Aciona a busca ao clicar no ícone de pesquisa
    searchIcon.addEventListener('click', performSearch);
    });
