/**
 * Korean Election Age Checker for 2025 Presidential Election
 * Modular implementation matching the inline JavaScript functionality
 */
class ElectionAgeChecker {
    constructor() {
        this.electionDate = new Date('2025-06-03');
        this.minVotingAge = 18;
        this.currentLang = document.documentElement.lang || 'ko';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.attachCalculateFunction();
    }

    setupEventListeners() {
        const birthDateInput = document.getElementById('birthdate');
        if (birthDateInput) {
            birthDateInput.addEventListener('change', () => this.calculateAge());
        }

        // Find the button that calls calculateAge()
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.onclick && button.onclick.toString().includes('calculateAge')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.calculateAge();
                });
                // Remove the inline onclick to prevent double execution
                button.onclick = null;
            }
        });
    }

    attachCalculateFunction() {
        // Attach calculateAge function to global scope to match inline implementation
        window.calculateAge = () => this.calculateAge();
    }

    calculateAge() {
        const input = document.getElementById("birthdate");
        const resultElement = document.getElementById("result");
        
        if (!input || !resultElement) return;

        const inputValue = input.value;
        if (!inputValue) {
            resultElement.innerHTML = `<span class="vote-no">⚠️ 생년월일을 입력해주세요.</span>`;
            return;
        }

        const birthDate = new Date(inputValue);
        const 기준일 = new Date("2025-06-03");
        
        let age = 기준일.getFullYear() - birthDate.getFullYear();
        const isBeforeBirthday = 기준일.getMonth() < birthDate.getMonth() || 
                                (기준일.getMonth() === birthDate.getMonth() && 기준일.getDate() < birthDate.getDate());
        
        if (isBeforeBirthday) age--;

        if (age >= 18) {
            resultElement.innerHTML = `<span class="vote-yes">🗳️ 만 ${age}세입니다. 2025년 6월 3일 기준으로 만 18세 이상으로 <strong>투표 가능한 나이</strong>입니다!<br>소중한 한표 부탁드려요.</span>`;
        } else {
            resultElement.innerHTML = `<span class="vote-no">🔒 만 ${age}세입니다. 2025년 6월 3일 기준으로는<br><strong>투표할 수 없습니다.</strong><br>다음 선거를 기대해주세요.</span>`;
        }
    }

    // Additional utility methods for enhanced functionality
    calculateDetailedAge(birthDate) {
        const electionYear = this.electionDate.getFullYear();
        const electionMonth = this.electionDate.getMonth();
        const electionDay = this.electionDate.getDate();

        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        let age = electionYear - birthYear;

        if (electionMonth < birthMonth || 
            (electionMonth === birthMonth && electionDay < birthDay)) {
            age--;
        }

        const isEligible = age >= this.minVotingAge;
        const daysUntilEligible = isEligible ? 0 : this.calculateDaysUntilEligible(birthDate);

        return {
            age: age,
            isEligible: isEligible,
            birthDate: birthDate,
            electionDate: this.electionDate,
            daysUntilEligible: daysUntilEligible,
            birthdayThisYear: new Date(electionYear, birthMonth, birthDay)
        };
    }

    calculateDaysUntilEligible(birthDate) {
        const eligibleBirthday = new Date(birthDate);
        eligibleBirthday.setFullYear(eligibleBirthday.getFullYear() + this.minVotingAge);
        
        if (eligibleBirthday <= this.electionDate) return 0;
        
        const timeDiff = eligibleBirthday.getTime() - this.electionDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    formatDate(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Global function for backward compatibility with inline onclick handlers
function calculateAge() {
    if (window.electionChecker) {
        window.electionChecker.calculateAge();
    }
}

// Initialize checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('electionAgeChecker')) {
        window.electionChecker = new ElectionAgeChecker();
    }
});