/**
 * Japanese Era Year Converter - Modular Implementation
 * Supports multiple languages with era name translations
 */
class JpYearConverter {
    constructor() {
        this.eras = {
            reiwa: 2019,
            heisei: 1989,
            showa: 1926,
            taisho: 1912,
            meiji: 1868
        };
        
        this.currentLang = document.documentElement.lang || 'en';
        this.selectedEra = "reiwa";
        
        // Language-specific era names and translations
        this.languageData = this.getLanguageData();
        
        this.init();
    }

    getLanguageData() {
        const lang = this.currentLang;
        
        const translations = {
            'en': {
                eraNames: {
                    reiwa: "Reiwa (令和)",
                    heisei: "Heisei (平成)",
                    showa: "Showa (昭和)",
                    taisho: "Taisho (大正)",
                    meiji: "Meiji (明治)"
                },
                messages: {
                    toWareki: " corresponds to ",
                    toSeireki: " is equivalent to Gregorian ",
                    noMatch: "This year does not correspond to any supported era.",
                    yearSuffix: ""
                }
            },
            'ja': {
                eraNames: {
                    reiwa: "令和",
                    heisei: "平成",
                    showa: "昭和",
                    taisho: "大正",
                    meiji: "明治"
                },
                messages: {
                    toWareki: "年 は",
                    toSeireki: "年 は 西暦",
                    noMatch: "この年は対応している元号に該当しません。",
                    yearSuffix: "年 です。"
                }
            },
            'ko': {
                eraNames: {
                    reiwa: "레이와(令和)",
                    heisei: "헤이세이(平成)",
                    showa: "쇼와(昭和)",
                    taisho: "다이쇼(大正)",
                    meiji: "메이지(明治)"
                },
                messages: {
                    toWareki: "년은 ",
                    toSeireki: "년은 서기 ",
                    noMatch: "이 연도는 지원되는 연호에 해당하지 않습니다.",
                    yearSuffix: "년입니다."
                }
            },
            'vi': {
                eraNames: {
                    reiwa: "Reiwa (令和)",
                    heisei: "Heisei (平成)",
                    showa: "Showa (昭和)",
                    taisho: "Taisho (大正)",
                    meiji: "Meiji (明治)"
                },
                messages: {
                    toWareki: " tương ứng với ",
                    toSeireki: " tương đương với dương lịch ",
                    noMatch: "Năm này không thuộc niên hiệu nào được hỗ trợ.",
                    yearSuffix: "."
                }
            }
        };

        return translations[lang] || translations['en'];
    }

    init() {
        this.setupEventListeners();
        this.populateGregorianYears();
        this.setupEraTabs();
        this.populateEraYears(this.selectedEra);
        this.setupModeToggle();
    }

    setupEventListeners() {
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.handleConvert());
        }
    }

    populateGregorianYears() {
        const gregorianYearSelect = document.getElementById("gregorian-year");
        if (!gregorianYearSelect) return;

        gregorianYearSelect.innerHTML = "";
        for (let y = new Date().getFullYear(); y >= 1868; y--) {
            gregorianYearSelect.innerHTML += `<option value="${y}">${y}</option>`;
        }
    }

    setupEraTabs() {
        const eraTabsContainer = document.getElementById("era-tabs");
        if (!eraTabsContainer) return;

        eraTabsContainer.innerHTML = "";
        
        Object.keys(this.eras).forEach((era) => {
            const div = document.createElement("div");
            div.textContent = this.languageData.eraNames[era];
            div.className = "era-tab" + (era === this.selectedEra ? " active" : "");
            div.dataset.era = era;
            div.addEventListener("click", () => {
                this.selectedEra = era;
                this.updateEraTabs();
                this.populateEraYears(this.selectedEra);
            });
            eraTabsContainer.appendChild(div);
        });
    }

    updateEraTabs() {
        document.querySelectorAll(".era-tab").forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.era === this.selectedEra);
        });
    }

    populateEraYears(era) {
        const eraYearSelect = document.getElementById("era-year");
        if (!eraYearSelect) return;

        const start = this.eras[era];
        const current = new Date().getFullYear();
        
        // Define exact end years for each era
        const eraEndYears = {
            meiji: 1912,   // Meiji 45 (ended July 30, 1912)
            taisho: 1926,  // Taisho 15 (ended December 25, 1926)
            showa: 1989,   // Showa 64 (ended January 7, 1989)
            heisei: 2019,  // Heisei 31 (ended April 30, 2019)
            reiwa: current // Current era, ongoing
        };
        
        const endYear = eraEndYears[era];
        const max = endYear - start + 1;
        
        eraYearSelect.innerHTML = "";
        for (let i = 1; i <= max; i++) {
            eraYearSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
    }

    setupModeToggle() {
        const modeSelect = document.getElementById("mode");
        const westernInputs = document.getElementById("western-inputs");
        const japaneseInputs = document.getElementById("japanese-inputs");
        const gregorianYearSelect = document.getElementById("gregorian-year");
        const eraYearSelect = document.getElementById("era-year");

        if (!modeSelect || !westernInputs || !japaneseInputs) return;

        const applyModeUI = () => {
            const isToWareki = modeSelect.value === "toWareki";
            // Show only the active section
            westernInputs.style.display = isToWareki ? "block" : "none";
            japaneseInputs.style.display = isToWareki ? "none" : "block";
            // Disable hidden inputs to avoid accidental interaction
            if (gregorianYearSelect) gregorianYearSelect.disabled = !isToWareki;
            if (eraYearSelect) eraYearSelect.disabled = isToWareki;
            // Clear previous result when switching mode
            const result = document.getElementById("result");
            if (result) result.innerHTML = "";
        };

        modeSelect.addEventListener("change", applyModeUI);
        // Apply once on load to ensure consistent initial state
        applyModeUI();
    }

    handleConvert() {
        const result = document.getElementById("result");
        if (!result) return;

        result.innerHTML = "";
        
        const modeSelect = document.getElementById("mode");
        const mode = modeSelect ? modeSelect.value : "toWareki";

        if (mode === "toWareki") {
            this.convertToWareki();
        } else {
            this.convertToSeireki();
        }
    }

    convertToWareki() {
        const gregorianYearSelect = document.getElementById("gregorian-year");
        const result = document.getElementById("result");
        
        if (!gregorianYearSelect || !result) return;

        const year = parseInt(gregorianYearSelect.value);
        
        // Sort eras by start year descending to find the correct era
        const sortedEras = Object.entries(this.eras).sort((a, b) => b[1] - a[1]);
        
        for (const [era, start] of sortedEras) {
            if (year >= start) {
                const ey = year - start + 1;
                const eraName = this.languageData.eraNames[era];
                const message = this.languageData.messages.toWareki;
                const suffix = this.languageData.messages.yearSuffix;
                
                result.innerHTML = `
                    <div class="result-box result-success">
                        <div style="font-size: 1.3em; line-height: 1.6; font-weight: 500;">
                            <span class="highlight-text">${year}</span>${message}<span class="highlight-text">${eraName} ${ey}</span>${suffix}
                        </div>
                    </div>
                `;
                return;
            }
        }
        
        result.innerHTML = `
            <div class="result-box result-error">
                <div style="font-size: 1.1em; font-weight: 600;">
                    ${this.languageData.messages.noMatch}
                </div>
            </div>
        `;
    }

    convertToSeireki() {
        const eraYearSelect = document.getElementById("era-year");
        const result = document.getElementById("result");
        
        if (!eraYearSelect || !result) return;

        const ey = parseInt(eraYearSelect.value);
        const year = this.eras[this.selectedEra] + ey - 1;
        const eraName = this.languageData.eraNames[this.selectedEra];
        const message = this.languageData.messages.toSeireki;
        const suffix = this.languageData.messages.yearSuffix;
        
        result.innerHTML = `
            <div class="result-box result-success">
                <div style="font-size: 1.3em; line-height: 1.6; font-weight: 500;">
                    <span class="highlight-text">${eraName} ${ey}</span>${message}<span class="highlight-text">${year}</span>${suffix}
                </div>
            </div>
        `;
    }
}

// Initialize converter when DOM is loaded
const __bootJpYearConverter = () => {
    // Check if we're on a JP Year Converter page by looking for specific elements
    const container = document.querySelector('.container');
    const convertBtn = document.getElementById('convertBtn');
    const modeSelect = document.getElementById('mode');

    if (container && convertBtn && modeSelect) {
        new JpYearConverter();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __bootJpYearConverter);
} else {
    // DOM is already ready when this script loads at the bottom
    __bootJpYearConverter();
}
