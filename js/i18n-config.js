// Função que atualiza o conteúdo da página com as traduções corretas
function updateContent() {
    // Atualiza o título da aba do navegador primeiro
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-i18n');
        document.title = i18next.t(titleKey);
    }

    // Encontra todos os outros elementos que marcamos com a etiqueta 'data-i18n'
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        // Verifica se a chave é para traduzir um atributo (ex: [placeholder]...)
        if (key.startsWith('[')) {
            const attrMatch = key.match(/\[(.*?)\]/);
            if (attrMatch) {
                const attrName = attrMatch[1]; // Pega o nome do atributo (ex: "placeholder")
                const realKey = key.substring(attrMatch[0].length); // Pega o resto da chave
                const translation = i18next.t(realKey);
                
                // Aplica a tradução ao atributo (ex: placeholder="Your name")
                element.setAttribute(attrName, translation);
            }
        } else {
            // Se for para traduzir o texto normal do elemento
            const translation = i18next.t(key);
            
            // Colocamos a tradução usando .innerHTML. Isso vai renderizar tags como <strong> corretamente.
            element.innerHTML = translation;

            // Tratamento especial para os botões com o efeito 'data-text'
            if (element.hasAttribute('data-text')) {
                element.setAttribute('data-text', translation);
            }
        }
    });


}

// Função principal que inicializa todo o sistema de tradução
async function initializeI18next() {
    // Inicia a biblioteca e usa o plugin para detectar o idioma do navegador
    await i18next
        .use(window.i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: 'en-US', // Se o idioma do navegador não for um dos nossos, usa inglês.
            debug: false,         // Mude para 'true' para ver logs de depuração no console
            detection: {
              order: ['navigator'] // Apenas detecta pelo navegador, já que não temos botões
            }
        });

    // Carrega todos os nossos dicionários de forma assíncrona
    const languages = ['pt-BR', 'en-US', 'es'];
    const fetchPromises = languages.map(lang => 
        fetch(`locales/${lang}.json`)
            .then(response => response.json())
            .then(data => i18next.addResourceBundle(lang, 'translation', data))
            .catch(error => console.error(`Falha ao carregar o arquivo de tradução: ${lang}.json`, error))
    );
    
    // Espera que TODOS os dicionários sejam carregados antes de continuar
    await Promise.all(fetchPromises);

    // Finalmente, chama a função para traduzir a página
    updateContent();
}

// Ponto de entrada: espera o HTML carregar e então inicia nosso app de tradução
document.addEventListener('DOMContentLoaded', initializeI18next);