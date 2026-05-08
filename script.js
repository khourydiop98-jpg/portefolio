 // 1. CURSEUR PERSONNALISÉ
        const cursor = document.getElementById('cursor');
        const hoverTargets = document.querySelectorAll('.hover-target');

        if (window.matchMedia("(pointer: fine)").matches) {
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                });
            });

            hoverTargets.forEach(target => {
                target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        }

        // 2. ANIMATIONS AU DÉFILEMENT (REVEAL)
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        revealElements.forEach(el => revealObserver.observe(el));

        // 3. LOGIQUE DE L'ASSISTANT IA
        const aiToggleBtn = document.getElementById('ai-toggle-btn');
        const aiCloseBtn = document.getElementById('ai-close-btn');
        const aiWindow = document.getElementById('ai-chatbot-window');
        const aiInput = document.getElementById('ai-input');
        const aiSendBtn = document.getElementById('ai-send-btn');
        const aiMessages = document.getElementById('ai-messages');

        aiToggleBtn.addEventListener('click', () => aiWindow.classList.toggle('open'));
        aiCloseBtn.addEventListener('click', () => aiWindow.classList.remove('open'));

        const apiKey = ""; // Insérez votre clé API Gemini ici
        const systemPrompt = `Tu es l'assistant virtuel exclusif du portfolio de Khoury DIOP. Khoury est une Référente Digitale et Stratège Web. Ses services: Développement Web, IA & Solutions Innovantes, Transformation Digitale, Gestion de Projet, Community Management. Ses Soft Skills: Rigueur, Créativité, Collaboration, Gestion d'équipe, Communication. Ton but: Répondre poliment en français, de manière très courte, chaleureuse et concise. Mets en valeur l'expertise de Khoury.`;

        function appendMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm ${sender === 'user' ? 'message-user self-end rounded-tr-none ml-auto' : 'message-bot rounded-tl-none'}`;
            msgDiv.innerHTML = text.replace(/\n/g, '<br>'); // Permet de gérer les retours à la ligne
            aiMessages.appendChild(msgDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const id = 'typing-' + Date.now();
            const typingDiv = document.createElement('div');
            typingDiv.id = id;
            typingDiv.className = 'message-bot p-4 rounded-2xl rounded-tl-none self-start max-w-[85%] typing-indicator shadow-sm';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            aiMessages.appendChild(typingDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;
            return id;
        }

        async function fetchGeminiResponse(userQuery) {
            try {
                // Remplacement de l'URL du modèle pour correspondre à la documentation standard si besoin
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    })
                });
                if (!response.ok) throw new Error("Erreur API");
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je ne peux pas répondre pour le moment.";
            } catch (error) {
                return "Désolé, une erreur est survenue (Avez-vous bien inséré votre clé API dans le code ?). Veuillez utiliser le formulaire de contact en attendant.";
            }
        }

        async function handleSendMessage() {
            const text = aiInput.value.trim();
            if (!text) return;
            appendMessage(text, 'user');
            aiInput.value = '';
            const typingId = showTypingIndicator();
            const botResponseText = await fetchGeminiResponse(text);
            document.getElementById(typingId)?.remove();
            appendMessage(botResponseText, 'bot');
        }

        aiSendBtn.addEventListener('click', handleSendMessage);
        aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
