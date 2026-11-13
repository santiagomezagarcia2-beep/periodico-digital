const articlesData = [
    {
        id: 1,
        featured: true,
        category: "Política",
        title: "Acuerdo histórico en la Cumbre de Energía Limpia redefine la inversión industrial en América Latina",
        subtitle: "Más de cuarenta naciones suscriben un pacto de cooperación tecnológica y financiamiento verde para acelerar la descarbonización antes de 2035.",
        author: "Carlos Mendoza y Sofía Alarcón",
        date: "12 de noviembre de 2026",
        readTime: "6 min de lectura",
        views: 9840,
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
        caption: "Plenario principal durante la firma de los acuerdos multilaterales de energía. Foto: Archivo Editorial.",
        content: [
            "En una jornada marcada por intensas negociaciones diplomáticas, los representantes de 45 países han ratificado esta mañana el Tratado de Infraestructura Energética Sostenible, un mecanismo inédito que movilizará fondos públicos y privados hacia redes eléctricas inteligentes y almacenamiento de hidrógeno verde.",
            "Para América Latina, el acuerdo representa una oportunidad estratégica sin precedentes. Países con alto potencial solar y eólico recibirán transferencia tecnológica directa y créditos preferenciales para modernizar sus parques industriales sin comprometer la estabilidad tarifaria de los hogares.",
            "Los analistas coinciden en que el verdadero reto comenzará en el primer trimestre de 2027, cuando los congresos nacionales deban armonizar sus marcos regulatorios para dar certidumbre jurídica a los proyectos transfronterizos."
        ]
    },
    {
        id: 2,
        featured: false,
        secondaryHero: true,
        category: "Tecnología",
        title: "Nuevos procesadores neuromórficos reducen en 80% el consumo energético de los centros de datos",
        subtitle: "La arquitectura inspirada en el cerebro humano promete resolver el cuello de botella eléctrico de la inteligencia artificial generativa.",
        author: "Javier Ríos",
        date: "12 de noviembre de 2026",
        readTime: "4 min de lectura",
        views: 8420,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        caption: "Oblea de silicio con interconexiones neuromórficas de última generación.",
        content: [
            "El crecimiento exponencial de los modelos de inteligencia artificial había encendido las alarmas sobre la sostenibilidad eléctrica de los grandes centros de cómputo. Sin embargo, una nueva generación de chips neuromórficos presentados esta semana demuestra que es posible procesar datos en el mismo lugar donde se almacenan.",
            "A diferencia de la arquitectura tradicional de Von Neumann, estos circuitos activan únicamente las neuronas artificiales necesarias para cada tarea, logrando reducciones drásticas en disipación térmica y consumo energético."
        ]
    },
    {
        id: 3,
        featured: false,
        secondaryHero: true,
        category: "Economía",
        title: "El comercio regional impulsa el crecimiento manufacturero por sexto trimestre consecutivo",
        subtitle: "La relocalización de cadenas de suministro consolida nuevos polos logísticos en el centro y norte del país.",
        author: "Mariana Treviño",
        date: "12 de noviembre de 2026",
        readTime: "5 min de lectura",
        views: 7650,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        caption: "Distrito financiero y corporativo durante la apertura de mercados.",
        content: [
            "Los indicadores industriales publicados este jueves confirman la resiliencia del sector manufacturero frente a la volatilidad global. La exportación de componentes electrónicos, dispositivos médicos y autopartes eléctricas lideró el avance trimestral.",
            "Especialistas en comercio exterior destacan que la inversión en capacitación técnica y conectividad ferroviaria ha sido determinante para absorber la nueva demanda internacional."
        ]
    },
    {
        id: 4,
        featured: false,
        secondaryHero: true,
        category: "Cultura",
        title: "Restauran murales inéditos del siglo XVI en el corazón histórico de Tlaxcala",
        subtitle: "Un equipo interdisciplinario de arqueólogos y restauradores saca a la luz pigmentos naturales conservados bajo capas de cal.",
        author: "Lucía Paredes",
        date: "12 de noviembre de 2026",
        readTime: "5 min de lectura",
        views: 6910,
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
        caption: "Detalle de los trabajos de conservación patrimonial en el conjunto conventual.",
        content: [
            "Tras dieciocho meses de minucioso trabajo con técnicas láser y análisis espectroscópico, el Instituto Nacional de Antropología presentó los resultados de la restauración de un conjunto mural novohispano de valor incalculable.",
            "Las escenas revelan el sincretismo artístico de los tlacuilos indígenas y los maestros europeos, aportando nuevas claves sobre la historia visual del altiplano central."
        ]
    }
];

let articleComments = {
    1: [
        { author: "Dr. Héctor Domínguez", time: "Hace 2 horas", text: "Excelente cobertura. La clave estará en los mecanismos de auditoría financiera." }
    ]
};

let currentCategory = "Todas";
let currentSearch = "";
let activeArticleId = null;
let editingArticleId = null;
let pendingImageDataUrl = null;
let globalEditMode = false;

const originalMediaMap = {};
articlesData.forEach(art => {
    originalMediaMap[art.id] = { image: art.image, caption: art.caption };
});

const STORAGE_KEY_MEDIA = "observador_custom_media_v1";

function loadSavedMediaFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_MEDIA);
        if (!raw) return;
        const savedMap = JSON.parse(raw);
        let hasChanges = false;
        articlesData.forEach(art => {
            if (savedMap[art.id]) {
                if (savedMap[art.id].image) art.image = savedMap[art.id].image;
                if (savedMap[art.id].caption !== undefined) art.caption = savedMap[art.id].caption;
                hasChanges = true;
            }
        });
        updateResetButtonVisibility(hasChanges);
    } catch (err) {
        console.warn("No se pudieron cargar imágenes guardadas:", err);
    }
}

function persistMediaToStorage() {
    try {
        const customMap = {};
        let hasChanges = false;
        articlesData.forEach(art => {
            const orig = originalMediaMap[art.id];
            if (art.image !== orig.image || art.caption !== orig.caption) {
                customMap[art.id] = { image: art.image, caption: art.caption };
                hasChanges = true;
            }
        });
        if (hasChanges) {
            localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(customMap));
        } else {
            localStorage.removeItem(STORAGE_KEY_MEDIA);
        }
        updateResetButtonVisibility(hasChanges);
    } catch (err) {
        showToast("Aviso: El archivo excede el límite de almacenamiento local.");
    }
}

function updateResetButtonVisibility(hasChanges) {
    const btn = document.getElementById("reset-images-btn");
    if (btn) btn.classList.toggle("hidden", !hasChanges);
}

function toggleGlobalEditMode() {
    globalEditMode = !globalEditMode;
    const toggleBtn = document.getElementById("edit-mode-toggle");
    const label = document.getElementById("edit-mode-label");
    label.textContent = globalEditMode ? "Modo Edición: ON" : "Modo Edición: OFF";
    if (globalEditMode) {
        toggleBtn.classList.add("bg-red-800", "text-white", "border-red-800");
        showToast("Modo Edición activado: haz clic en 'Cambiar foto' en cualquier imagen");
    } else {
        toggleBtn.classList.remove("bg-red-800", "text-white", "border-red-800");
    }
    renderNewspaper();
}

function getEditButtonHTML(articleId, compact = false) {
    const visibilityClass = globalEditMode
        ? "opacity-100 ring-2 ring-amber-400 bg-red-800"
        : "opacity-85 sm:opacity-0 sm:group-hover:opacity-100 bg-zinc-950/85 hover:bg-red-800";
    if (compact) {
        return `
            <button type="button" onclick="openImageEditor(${articleId}, event)" title="Cambiar foto"
                class="${visibilityClass} absolute bottom-1 right-1 z-10 text-white p-1.5 rounded-md shadow-md backdrop-blur-sm transition flex items-center gap-1 text-[10px] font-bold">
                <span>📷</span>
            </button>
        `;
    }
    return `
        <button type="button" onclick="openImageEditor(${articleId}, event)" title="Editar fotografía"
            class="${visibilityClass} absolute bottom-2.5 right-2.5 z-10 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-1.5 transition">
            <span>📷 Cambiar foto</span>
        </button>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    loadSavedMediaFromStorage();
    renderNewspaper();
    renderMostRead();
    setupEventListeners();
    setupImageEditorListeners();
});

function renderNewspaper() {
    const heroSection = document.getElementById("hero-section");
    const heroContainer = document.getElementById("hero-container");
    const articlesFeed = document.getElementById("articles-feed");
    const filterBanner = document.getElementById("filter-banner");
    const filterTitle = document.getElementById("filter-title");

    const filtered = articlesData.filter(art => {
        const matchesCat = currentCategory === "Todas" || art.category === currentCategory;
        const query = currentSearch.toLowerCase().trim();
        const matchesSearch = !query || 
            art.title.toLowerCase().includes(query) || 
            art.subtitle.toLowerCase().includes(query) ||
            art.category.toLowerCase().includes(query) ||
            art.author.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });

    if (currentCategory !== "Todas" || currentSearch.trim() !== "") {
        filterBanner.classList.remove("hidden");
        filterTitle.textContent = currentSearch ? `Búsqueda: "${currentSearch}"` : `Sección: ${currentCategory}`;
        heroSection.classList.add("hidden");
    } else {
        filterBanner.classList.add("hidden");
        heroSection.classList.remove("hidden");
    }

    const highlightRing = globalEditMode ? "ring-2 ring-red-700 ring-offset-2 dark:ring-offset-zinc-950" : "";

    if (currentCategory === "Todas" && currentSearch.trim() === "") {
        const mainStory = articlesData.find(a => a.featured);
        const sideStories = articlesData.filter(a => a.secondaryHero);

        heroContainer.innerHTML = `
            <article onclick="openArticleModal(${mainStory.id})" class="lg:col-span-8 group cursor-pointer flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-300 dark:border-zinc-800 pb-6 lg:pb-0 lg:pr-8">
                <div>
                    <div class="relative overflow-hidden rounded-xl mb-5 bg-zinc-200 dark:bg-zinc-800 aspect-[16/9] ${highlightRing}">
                        <img src="${mainStory.image}" alt="${mainStory.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <span class="absolute top-3 left-3 bg-red-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow">
                            ${mainStory.category} • Portada
                        </span>
                        ${getEditButtonHTML(mainStory.id, false)}
                    </div>
                    <h2 class="font-serif text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-zinc-950 dark:text-white leading-[1.12] group-hover:text-red-800 transition mb-3">
                        ${mainStory.title}
                    </h2>
                    <p class="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                        ${mainStory.subtitle}
                    </p>
                </div>
                <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <span class="font-semibold text-zinc-800 dark:text-zinc-200">Por ${mainStory.author}</span>
                    <span>${mainStory.readTime}</span>
                </div>
            </article>

            <div class="lg:col-span-4 flex flex-col justify-between space-y-6">
                ${sideStories.map((story, idx) => `
                    <article onclick="openArticleModal(${story.id})" class="group cursor-pointer ${idx !== sideStories.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800 pb-5' : ''}">
                        <div class="flex gap-4 items-start">
                            <div class="flex-1">
                                <span class="text-[11px] font-bold uppercase tracking-wider text-red-800 dark:text-red-400">${story.category}</span>
                                <h3 class="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-snug mt-1 group-hover:text-red-800 transition">
                                    ${story.title}
                                </h3>
                                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2">${story.author} • ${story.readTime}</p>
                            </div>
                            <div class="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800 ${highlightRing}">
                                <img src="${story.image}" alt="${story.title}" class="w-full h-full object-cover">
                                ${getEditButtonHTML(story.id, true)}
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }

    const feedArticles = (currentCategory === "Todas" && currentSearch.trim() === "")
        ? articlesData.filter(a => !a.featured && !a.secondaryHero)
        : filtered;

    articlesFeed.innerHTML = `
        <div>
            <div class="flex items-center justify-between border-b-2 border-zinc-900 dark:border-zinc-200 pb-2 mb-6">
                <h3 class="font-serif text-2xl font-bold uppercase tracking-tight">Artículos y Reportajes</h3>
                <span class="text-xs text-zinc-500">${feedArticles.length} artículos</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${feedArticles.map(art => `
                    <article onclick="openArticleModal(${art.id})" class="group cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div class="relative h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-800 ${highlightRing}">
                                <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                                <span class="absolute top-3 left-3 bg-zinc-900/85 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                    ${art.category}
                                </span>
                                ${getEditButtonHTML(art.id, false)}
                            </div>
                            <div class="p-5">
                                <h4 class="font-serif text-xl font-bold text-zinc-900 dark:text-white leading-snug mb-2 group-hover:text-red-800 transition">
                                    ${art.title}
                                </h4>
                                <p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">${art.subtitle}</p>
                            </div>
                        </div>
                        <div class="px-5 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                            <span>${art.author}</span>
                            <span class="text-red-800 dark:text-red-400 font-semibold">${art.readTime}</span>
                        </div>
                    </article>
                `).join('')}
            </div>
        </div>
    `;
}

function renderMostRead() {
    const top5 = [...articlesData].sort((a, b) => b.views - a.views).slice(0, 5);
    const listEl = document.getElementById("most-read-list");
    listEl.innerHTML = top5.map((art, index) => `
        <li onclick="openArticleModal(${art.id})" class="group cursor-pointer flex items-start gap-3.5 pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 last:pb-0">
            <span class="font-serif text-2xl font-black text-red-800/80 leading-none w-6 shrink-0">${index + 1}</span>
            <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">${art.category}</span>
                <h4 class="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-800 transition leading-snug">${art.title}</h4>
            </div>
        </li>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    renderNewspaper();
}

function openArticleModal(id) {
    const art = articlesData.find(a => a.id === id);
    if (!art) return;
    activeArticleId = id;
    document.getElementById("modal-category").textContent = art.category;
    document.getElementById("modal-title").textContent = art.title;
    document.getElementById("modal-subtitle").textContent = art.subtitle;
    document.getElementById("modal-author").textContent = `Por ${art.author}`;
    document.getElementById("modal-date").textContent = art.date;
    document.getElementById("modal-readtime").textContent = art.readTime;
    document.getElementById("modal-image").src = art.image;
    document.getElementById("modal-caption").textContent = art.caption;
    document.getElementById("modal-body").innerHTML = art.content.map(p => `<p>${p}</p>`).join('');
    document.getElementById("article-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeArticleModal() {
    document.getElementById("article-modal").classList.add("hidden");
    document.body.style.overflow = "";
    activeArticleId = null;
}

function openImageEditor(articleId, event) {
    if (event) event.stopPropagation();
    const art = articlesData.find(a => a.id === articleId);
    if (!art) return;
    editingArticleId = articleId;
    pendingImageDataUrl = null;
    document.getElementById("editor-preview-img").src = art.image;
    document.getElementById("editor-url-input").value = art.image.startsWith("data:") ? "" : art.image;
    document.getElementById("editor-caption-input").value = art.caption || "";
    document.getElementById("image-editor-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeImageEditor() {
    document.getElementById("image-editor-modal").classList.add("hidden");
    if (!activeArticleId) document.body.style.overflow = "";
    editingArticleId = null;
}

function showToast(msg) {
    const toast = document.getElementById("toast-notification");
    document.getElementById("toast-message").textContent = msg;
    toast.classList.remove("translate-y-24", "opacity-0");
    setTimeout(() => toast.classList.add("translate-y-24", "opacity-0"), 3000);
}

function setupEventListeners() {
    document.getElementById("search-input").addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderNewspaper();
    });
    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });
    document.getElementById("image-editor-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const art = articlesData.find(a => a.id === editingArticleId);
        if (!art) return;
        const urlVal = document.getElementById("editor-url-input").value.trim();
        const newCaption = document.getElementById("editor-caption-input").value.trim();
        if (urlVal) art.image = urlVal;
        if (newCaption) art.caption = newCaption;
        persistMediaToStorage();
        renderNewspaper();
        closeImageEditor();
        showToast("Imagen actualizada con éxito");
    });
}