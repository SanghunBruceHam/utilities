/**
 * Japanese Zodiac (Eto) Calculator - Compatible with existing HTML structure
 */
class JpEtoCalculator {
    constructor() {
        this.etoAnimals = {
            ko: ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'],
            ja: ['子（ねずみ）', '丑（うし）', '寅（とら）', '卯（うさぎ）', '辰（たつ）', '巳（へび）', '午（うま）', '未（ひつじ）', '申（さる）', '酉（とり）', '戌（いぬ）', '亥（いのしし）'],
            en: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
            vi: ['Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)', 'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)', 'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Heo)']
        };
        
        this.etoEmojis = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐓', '🐕', '🐷'];
        this.fortuneList = {
            'ko': ['대길! 오늘은 매우 좋은 날이 될 것 같습니다.', '중길. 평온한 하루를 보낼 수 있을 것입니다.', '소길. 신중하게 행동하면 길합니다.', '말길. 너무 무리하지 말고 자연스럽게.', '흉. 조심스럽게 지내세요.'],
            'ja': ['大吉！今日はとても良い日になりそうです。', '中吉。平穏な一日を過ごせるでしょう。', '小吉。慎重に行動すれば吉。', '末吉。あまり無理をせず、自然体で。', '凶。注意深く過ごしましょう。'],
            'en': ['Great fortune! Today will be a wonderful day.', 'Good fortune. You will have a peaceful day.', 'Small fortune. Be careful and you will be blessed.', 'Minor fortune. Don\'t push too hard, be natural.', 'Bad luck. Be careful today.'],
            'vi': ['Đại cát! Hôm nay sẽ là một ngày tuyệt vời.', 'Trung cát. Bạn sẽ có một ngày bình yên.', 'Tiểu cát. Hãy cẩn thận và bạn sẽ được ban phước.', 'Mạt cát. Đừng ép buộc quá, hãy tự nhiên.', 'Hung. Hãy cẩn thận hôm nay.']
        };
        
        this.currentLang = document.documentElement.lang || 'ko';
        this.countMap = new Array(12).fill(0);
        this.historyLog = [];
        this.lastShareData = null;
        
        this.init();
        this.setupGlobalFunctions();
    }

    init() {
        this.setupEventListeners();
        this.generateYearOptions();
        this.generateMonthOptions();
        this.updateDays();
        this.setDefaultValues();
    }

    calculateEto(year, useRisshun = true) {
        // Handle traditional spring (Risshun) calculation if needed
        let etoYear = year;
        if (useRisshun && this.birthDate) {
            const risshun = new Date(year, 1, 4); // February 4th
            if (this.birthDate < risshun) {
                etoYear = year - 1;
            }
        }
        
        // Traditional calculation: (year - 1984 + 12) % 12 to match original
        return (etoYear - 1984 + 12) % 12;
    }

    getEtoInfo(dateStr) {
        if (!dateStr) return null;
        
        const date = new Date(dateStr);
        this.birthDate = date;
        const year = date.getFullYear();
        
        const etoIndex = this.calculateEto(year, true);
        return {
            index: etoIndex,
            animal: this.etoAnimals[this.currentLang][etoIndex],
            emoji: this.etoEmojis[etoIndex],
            year: year,
            etoYear: date < new Date(year, 1, 4) ? year - 1 : year
        };
    }

    setupEventListeners() {
        const convertBtn = document.getElementById('convertBtn');
        const dateInput = document.getElementById('birthDate');
        const yearSel = document.getElementById('birthYear');
        const monthSel = document.getElementById('birthMonth');
        const daySel = document.getElementById('birthDay');

        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.handleCalculate());
        }

        if (dateInput) {
            dateInput.addEventListener('change', () => this.showResult(dateInput.value));
            dateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.showResult(dateInput.value);
                }
            });
        }

        if (yearSel) {
            yearSel.addEventListener('change', () => {
                this.updateDays();
                this.handleSelectChange();
            });
        }

        if (monthSel) {
            monthSel.addEventListener('change', () => {
                this.updateDays();
                this.handleSelectChange();
            });
        }

        if (daySel) {
            daySel.addEventListener('change', () => this.handleSelectChange());
        }
    }

    handleCalculate() {
        const dateInput = document.getElementById('birthDate');
        if (dateInput && dateInput.value) {
            this.showResult(dateInput.value);
        }
    }

    handleSelectChange() {
        const yearSel = document.getElementById('birthYear');
        const monthSel = document.getElementById('birthMonth'); 
        const daySel = document.getElementById('birthDay');
        
        if (yearSel && monthSel && daySel && yearSel.value && monthSel.value && daySel.value) {
            const year = yearSel.value;
            const month = ('0' + monthSel.value).slice(-2);
            const day = ('0' + daySel.value).slice(-2);
            this.showResult(year + '-' + month + '-' + day);
        }
    }

    showResult(dateStr) {
        if (!dateStr) return;
        
        const etoInfo = this.getEtoInfo(dateStr);
        if (!etoInfo) return;

        const resultDiv = document.getElementById('result');
        const historyDiv = document.getElementById('history');
        const shareDiv = document.getElementById('share');

        if (resultDiv) {
            // Show the result box
            resultDiv.style.display = 'block';
            
            const fortuneMessages = this.fortuneList[this.currentLang] || this.fortuneList['ja'];
            const fortune = fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
            const translations = {
                'ko': {
                    yearSuffix: '년의 간지는 ',
                    fortunePrefix: '오늘의 운세: '
                },
                'ja': {
                    yearSuffix: '年の干支は ',
                    fortunePrefix: '今日の運勢: '
                },
                'en': {
                    yearSuffix: ' zodiac is ',
                    fortunePrefix: 'Today\'s fortune: '
                },
                'vi': {
                    yearSuffix: ' con giáp là ',
                    fortunePrefix: 'Vận may hôm nay: '
                }
            };
            
            const trans = translations[this.currentLang] || translations['ja'];
            
            resultDiv.innerHTML = `
                <div class="eto-result">
                    <div class="eto-emoji">${etoInfo.emoji}</div>
                    <div>
                        <div style="font-size: 1.2em; margin-bottom: 8px;">
                            ${etoInfo.etoYear}${trans.yearSuffix}<span class="highlight-result">${etoInfo.animal}</span>
                        </div>
                        <div style="font-size: 0.9em; color: var(--success-color);">
                            ${trans.fortunePrefix}${fortune}
                        </div>
                    </div>
                </div>
            `;
        }

        // Update history
        if (historyDiv) {
            this.historyLog.unshift(etoInfo.etoYear + '年 - ' + etoInfo.animal);
            if (this.historyLog.length > 3) this.historyLog.pop();
            
            const historyLabels = {
                'ko': '최근 결과:',
                'ja': '最近の結果:',
                'en': 'Recent Results:',
                'vi': 'Kết quả gần đây:'
            };
            const historyLabel = historyLabels[this.currentLang] || historyLabels['ja'];
            historyDiv.innerHTML = historyLabel + '<br>' + this.historyLog.map(h => '・' + h).join('<br>');
        }

        // Popularity counter removed for cleaner interface

        // Update share buttons
        if (shareDiv) {
            const shareTexts = {
                'ko': `🐲 ${etoInfo.etoYear}년의 간지는 「${etoInfo.animal}」입니다! ${etoInfo.emoji} 무료 간지 계산기로 확인해보세요!`,
                'ja': `🐲 ${etoInfo.etoYear}年の干支は「${etoInfo.animal}」です！${etoInfo.emoji} 無料干支計算機でチェック！`,
                'en': `🐲 The ${etoInfo.etoYear} zodiac is "${etoInfo.animal}"! ${etoInfo.emoji} Check yours with our free calculator!`,
                'vi': `🐲 Con giáp năm ${etoInfo.etoYear} là "${etoInfo.animal}"! ${etoInfo.emoji} Kiểm tra của bạn với máy tính miễn phí!`
            };
            const shareText = shareTexts[this.currentLang] || shareTexts['ja'];
            const encodedShareText = encodeURIComponent(shareText);
            
            const urls = {
                'ko': 'https://utilities.mahalohana-bruce.com/jp-eto-calculator/ko/index.html',
                'ja': 'https://utilities.mahalohana-bruce.com/jp-eto-calculator/ja/index.html',
                'en': 'https://utilities.mahalohana-bruce.com/jp-eto-calculator/en/index.html',
                'vi': 'https://utilities.mahalohana-bruce.com/jp-eto-calculator/vi/index.html'
            };
            const url = urls[this.currentLang] || urls['ja'];
            
            // Store share data globally
            this.lastShareData = {
                text: shareText,
                url: url,
                lang: this.currentLang
            };
            
            const shareLabels = {
                'ko': '🎉 결과 공유하기',
                'ja': '🎉 結果をシェア',
                'en': '🎉 Share Result',
                'vi': '🎉 Chia sẻ kết quả'
            };
            const shareLabel = shareLabels[this.currentLang] || shareLabels['ja'];
            
            const copyLabels = {
                'ko': '복사 완료!',
                'ja': 'コピー完了！',
                'en': 'Copied!',
                'vi': 'Đã sao chép!'
            };
            const copyLabel = copyLabels[this.currentLang] || copyLabels['ja'];
            
            shareDiv.innerHTML = `
                <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg); border: 1px solid #e2e8f0;">
                    <h4 style="margin: 0 0 var(--spacing-md) 0; color: var(--primary-dark); font-size: 1rem;">${shareLabel}</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); justify-content: center; margin-bottom: var(--spacing-md);">
                        <a href="https://twitter.com/intent/tweet?text=${encodedShareText}&url=${url}&hashtags=${this.getHashtags()}" target="_blank" class="btn btn-sm" style="background: #1DA1F2; color: white; text-decoration: none; border: none;">
                            🐦 X (Twitter)
                        </a>
                        <a href="https://threads.net/intent/post?text=${encodedShareText}%20${url}" target="_blank" class="btn btn-sm" style="background: #000000; color: white; text-decoration: none; border: none;">
                            🧵 Threads
                        </a>
                        <a href="https://social-plugins.line.me/lineit/share?url=${url}&text=${encodedShareText}" target="_blank" class="btn btn-sm" style="background: #00B900; color: white; text-decoration: none; border: none;">
                            💬 LINE
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedShareText}" target="_blank" class="btn btn-sm" style="background: #4267B2; color: white; text-decoration: none; border: none;">
                            📘 Facebook
                        </a>
                        <a href="https://t.me/share/url?url=${url}&text=${encodedShareText}" target="_blank" class="btn btn-sm" style="background: #0088CC; color: white; text-decoration: none; border: none;">
                            ✈️ Telegram
                        </a>
                        <a href="https://wa.me/?text=${encodedShareText}%20${url}" target="_blank" class="btn btn-sm" style="background: #25D366; color: white; text-decoration: none; border: none;">
                            📱 WhatsApp
                        </a>
                    </div>
                    <div style="display: flex; gap: var(--spacing-sm); justify-content: center;">
                        <button onclick="copyEtoResult('text')" class="btn btn-sm btn-outline" style="font-size: 0.85rem;">
                            📋 ${this.getCopyTextLabel()}
                        </button>
                        <button onclick="copyEtoResult('url')" class="btn btn-sm btn-outline" style="font-size: 0.85rem;">
                            🔗 ${this.getCopyUrlLabel()}
                        </button>
                    </div>
                </div>
            `;
        }
    }

    generateYearOptions() {
        const yearSel = document.getElementById('birthYear');
        if (!yearSel) return;

        yearSel.innerHTML = '';
        for (let y = 1900; y <= new Date().getFullYear(); y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y + '年';
            yearSel.appendChild(opt);
        }
    }

    generateMonthOptions() {
        const monthSel = document.getElementById('birthMonth');
        if (!monthSel) return;

        monthSel.innerHTML = '';
        for (let m = 1; m <= 12; m++) {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m + '月';
            monthSel.appendChild(opt);
        }
    }

    updateDays() {
        const yearSel = document.getElementById('birthYear');
        const monthSel = document.getElementById('birthMonth');
        const daySel = document.getElementById('birthDay');
        
        if (!yearSel || !monthSel || !daySel) return;

        daySel.innerHTML = '';
        const year = parseInt(yearSel.value);
        const month = parseInt(monthSel.value);
        
        if (year && month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d + '日';
                daySel.appendChild(opt);
            }
        }
    }

    setDefaultValues() {
        const yearSel = document.getElementById('birthYear');
        const monthSel = document.getElementById('birthMonth');
        const daySel = document.getElementById('birthDay');
        
        if (yearSel) yearSel.value = 2000;
        if (monthSel) monthSel.value = 1;
        this.updateDays();
        if (daySel) daySel.value = 1;
        
        // Show initial result
        this.showResult('2000-01-01');
    }
    
    getCopyTextLabel() {
        const labels = {
            'ko': '결과 텍스트 복사',
            'ja': '結果テキストをコピー',
            'en': 'Copy Result Text',
            'vi': 'Sao chép văn bản kết quả'
        };
        return labels[this.currentLang] || labels['ja'];
    }
    
    getCopyUrlLabel() {
        const labels = {
            'ko': 'URL 복사',
            'ja': 'URLをコピー',
            'en': 'Copy URL',
            'vi': 'Sao chép URL'
        };
        return labels[this.currentLang] || labels['ja'];
    }
    
    getHashtags() {
        const hashtags = {
            'ko': '간지계산기,십이지,띠,무료도구,2025년',
            'ja': '干支計算機,十二支,無料ツール,2025年',
            'en': 'zodiac,calculator,ChineseZodiac,freetool,2025',
            'vi': 'CanChi,ConGiap,MayTinhMienPhi,2025'
        };
        return hashtags[this.currentLang] || hashtags['ja'];
    }
    
    setupGlobalFunctions() {
        const self = this;
        window.copyEtoResult = function(type) {
            if (!self.lastShareData) return;
            
            const copyLabels = {
                'ko': '복사 완료!',
                'ja': 'コピー完了！',
                'en': 'Copied!',
                'vi': 'Đã sao chép!'
            };
            const copyLabel = copyLabels[self.lastShareData.lang] || copyLabels['ja'];
            
            let textToCopy = '';
            if (type === 'text') {
                textToCopy = self.lastShareData.text + ' ' + self.lastShareData.url;
            } else if (type === 'url') {
                textToCopy = self.lastShareData.url;
            }
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    self.showCopyFeedback(event.target, copyLabel);
                }).catch(err => {
                    console.error('복사 실패:', err);
                    self.fallbackCopyTextToClipboard(textToCopy, event.target, copyLabel);
                });
            } else {
                self.fallbackCopyTextToClipboard(textToCopy, event.target, copyLabel);
            }
        };
    }
    
    showCopyFeedback(button, message) {
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        const originalColor = button.style.color;
        
        button.textContent = message;
        button.style.backgroundColor = 'var(--success-color)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
            button.style.color = originalColor;
        }, 2000);
    }
    
    fallbackCopyTextToClipboard(text, button, message) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback(button, message);
        } catch (err) {
            console.error('복사 실패:', err);
        }
        
        textArea.remove();
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('etoCalculator')) {
        new JpEtoCalculator();
    }
});