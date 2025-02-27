document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.querySelector('#contactForm');
    const submitButton = formElement.querySelector("button[type='submit']");
    let clickedButtonId = ''; // Armazena o ID do botão clicado
    let isSubmitting = false; // Flag para impedir múltiplos envios
    const phoneInput = document.querySelector("#tel"); // Campo de telefone

    console.log("Script carregado corretamente.");

    // Captura todos os botões que direcionam para o formulário
    document.querySelectorAll('[data-target="contactForm"]').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            clickedButtonId = this.id || 'botao-sem-id'; // Sempre armazena o último botão clicado
            
            console.log("Botão clicado:", clickedButtonId);

            // Faz o scroll suave até o formulário
            document.querySelector('#contactForm').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Adiciona máscara visual ao campo de telefone
    phoneInput.addEventListener("input", function () {
        let value = phoneInput.value.replace(/\D/g, ""); // Remove tudo que não é número
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

        if (value.length > 10) {
            phoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 6) {
            phoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else if (value.length > 2) {
            phoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            phoneInput.value = `(${value}`;
        }
    });

    formElement.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopImmediatePropagation(); // Bloqueia qualquer evento duplicado!

        console.log("Evento de submit acionado.");

        // Se já estiver enviando, impede nova execução
        if (isSubmitting) {
            console.log("Envio bloqueado: já está em andamento.");
            return;
        }

        isSubmitting = true; // Bloqueia novos envios imediatamente
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";

        const name = formElement.querySelector('#name').value.trim();
        const email = formElement.querySelector('#email').value.trim();
        const whatsapp = phoneInput.value.trim();

        // Validação básica
        if (!name || !email || !whatsapp) {
            console.log("Erro: Campos obrigatórios não preenchidos.");
            alert("Por favor, preencha todos os campos corretamente.");
            isSubmitting = false; // Libera envio novamente
            submitButton.disabled = false;
            submitButton.textContent = "Enviar formulário";
            return;
        }

        console.log("Campos validados.");

        // Exibir overlay de carregamento (caso queira colocar)
        displayLoadingOverlay(true);

        // Captura de UTM
        const utms = getUTMs();
        const pageReferrer = window.location.href || 'URL não encontrada';

        // Montagem do payload
        const payload = {
            rules: {
                update: "false",
                filter_status_update: "open",
                equal_pipeline: "true",
                status: "open",
                validate_cpf: "false",
            },
            leads: [
                {
                    id: `FORMULARIO - ${clickedButtonId} - QUARTZOLIT - ${name}`,
                    user: name,
                    email: email,
                    name: name,
                    personal_phone: whatsapp,
                    mobile_phone: whatsapp,
                    last_conversion: {
                        source: `FORMULARIO - ${clickedButtonId} - QUARTZOLIT`
                    },
                    custom_fields: {
                        uniqueId: generateUniqueId(),
                        utm_source: utms.utm_source || "",
                        utm_medium: utms.utm_medium || "",
                        utm_campaign: utms.utm_campaign || "",
                        utm_content: utms.utm_content || "",
                        utm_term: utms.utm_term || "",
                        page_referrer: pageReferrer,
                        button_id: clickedButtonId // Inclui o ID do botão que acionou o formulário
                    }
                }
            ]
        };

        console.log("Enviando payload:", payload);

        try {
            const response = await fetch('https://app.pipe.run/webservice/integradorJson?hash=1e28b707-3c02-4393-bb9d-d3826b060dcd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Resposta da API:", data);
            alert('Formulário enviado com sucesso!');
            formElement.reset();

            // Muda o botão para "Enviado" após sucesso
            submitButton.textContent = "Enviado";
        } catch (error) {
            console.error('Erro no envio:', error);
            alert('Houve um erro ao enviar o formulário.');

            // Em caso de erro, permite o envio novamente
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = "Enviar formulário";
        } finally {
            displayLoadingOverlay(false);
        }
    });

    function generateUniqueId() {
        return new Date().getTime().toString();
    }

    function getUTMs() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_content: urlParams.get('utm_content'),
            utm_term: urlParams.get('utm_term'),
        };
    }

    function displayLoadingOverlay(show) {
        if (show) {
            console.log("Mostrando overlay de carregamento...");
        } else {
            console.log("Removendo overlay de carregamento...");
        }
    }
});
