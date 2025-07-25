
# 유틸리티 계산기 모음 서비스 상세 명세서

## 🚀 서비스 개요
- **서비스명**: 유틸리티 계산기 모음 (Utility Calculator Collection)
- **도메인**: https://utilities.mahalohana-bruce.com
- **운영 플랫폼**: Replit
- **서버**: Python HTTP Server (포트 8000)
- **배포 방식**: GitHub Pages + Replit 동시 운영

## 🌍 다국어 지원
### 지원 언어 (4개국)
- **한국어** (ko): 메인 타겟
- **일본어** (ja): 일본 관련 도구로 인한 주요 타겟
- **영어** (en): 글로벌 사용자
- **베트남어** (vi): 아시아 시장 확장

### 자동 언어 감지
- 브라우저 언어 설정 기반 자동 리다이렉트
- 중국어(zh) → 일본어로 리다이렉트

## 🛠️ 제공 도구

### 1. 일본 연호 변환기 (Japanese Era Converter)
**경로**: `/jp-year-converter/{언어}/`
**기능**:
- 서기 ↔ 일본 연호 양방향 변환
- 지원 연호: 메이지(1868-1912), 다이쇼(1912-1926), 쇼와(1926-1989), 헤이세이(1989-2019), 레이와(2019-현재)
- 실시간 계산 및 결과 표시
- 크로스 체크용 연호 참조 표 제공

**주요 기술적 특징**:
- 정확한 연호 종료일 반영
- 연호별 최대 연수 자동 계산
- 반응형 UI 디자인

### 2. 간지(干支) 계산기 (Chinese Zodiac Calculator)
**경로**: `/jp-eto-calculator/{언어}/`
**기능**:
- 생년월일 기반 십이지 계산
- 동물: 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지
- 입춘 기준 정확한 계산
- 운세 정보 제공

### 3. 선거 연령 확인기 (Election Age Checker)
**경로**: `/election-age-checker/ko/`
**기능**:
- 한국 선거 연령 자격 확인
- 생년월일 기반 투표 가능 여부 계산

## 🎨 UI/UX 디자인

### 디자인 시스템
- **테마**: 다크/라이트 모드 지원
- **색상**: 그라데이션 기반 모던 디자인
- **레이아웃**: 반응형 그리드 시스템
- **애니메이션**: CSS 기반 페이드인 효과

### 접근성 (Accessibility)
- 키보드 네비게이션 지원
- 스크린 리더 호환
- ARIA 라벨링
- 고대비 모드 지원

## 📱 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **Vanilla JavaScript**: ES6+ 문법 사용
- **AMP**: 모바일 최적화

### 백엔드
- **Python**: HTTP 서버 (내장 모듈)
- **포트**: 8000 (개발), 80/443 (프로덕션)

### 운영/배포
- **Replit**: 개발 환경
- **GitHub**: 버전 관리
- **GitHub Actions**: 자동 배포
- **GitHub Pages**: 정적 호스팅

## 🔧 개발 워크플로우

### 자동화 시스템
1. **파일 변경 감지**: `watch_changes.py`
2. **자동 커밋**: `auto_commit.py`
3. **사이트맵 생성**: `sitemap_generator.py`
4. **배포 자동화**: GitHub Actions

### 워크플로우
- **Development Server**: 개발 서버 실행
- **Start Server**: HTTP 서버 시작
- **Auto Commit Watcher**: 변경사항 자동 감지

## 📊 SEO 및 마케팅

### 검색엔진 최적화
- **구조화된 데이터**: JSON-LD 스키마
- **다국어 SEO**: hreflang 태그
- **메타 태그**: 언어별 최적화
- **사이트맵**: 자동 생성 및 제출

### 광고 수익화
- **Google AdSense**: ca-pub-5508768187151867
- **AMP 광고**: 모바일 최적화
- **배너 광고**: 반응형 배치

### 웹마스터 도구
- **Google Analytics**: G-WF8ZL9QJHF
- **Google Search Console**: 등록 완료
- **Naver Webmaster**: 등록 완료
- **Yandex Webmaster**: 등록 완료

## 🗂️ 파일 구조
```
/
├── {언어}/index.html           # 메인 페이지 (4개 언어)
├── jp-year-converter/          # 연호 변환기
│   └── {언어}/index.html
├── jp-eto-calculator/          # 간지 계산기
│   └── {언어}/index.html
├── election-age-checker/       # 선거 연령 확인기
│   └── ko/index.html
├── .github/workflows/          # GitHub Actions
├── favicon.ico, favicon.png    # 파비콘
├── sitemap.xml                 # 사이트맵
├── robots.txt                  # 로봇 규칙
└── 운영 스크립트들
```

## 🌐 트래픽 및 성능

### 타겟 사용자
- **주요**: 일본 문화/역사 관심자
- **부수**: 점성술, 운세 관심자
- **지역**: 한국, 일본, 동남아시아

### 성능 최적화
- **정적 파일**: 최소화된 CSS/JS
- **이미지**: 압축 및 WebP 지원
- **캐싱**: 브라우저 캐시 활용
- **CDN**: GitHub Pages 글로벌 배포

## 🔒 보안 및 운영

### 보안 정책
- **HTTPS**: 강제 적용
- **CSP**: Content Security Policy
- **로봇 차단**: robots.txt 관리

### 모니터링
- **에러 추적**: 콘솔 로그 기반
- **성능 모니터링**: 웹 바이탈 추적
- **사용자 행동**: Google Analytics

## 📈 향후 계획

### 기능 확장
- [ ] 추가 일본 문화 계산기
- [ ] 음력/양력 변환기
- [ ] 일본어 학습 도구

### 기술 개선
- [ ] PWA 구현
- [ ] 오프라인 지원
- [ ] 다크 모드 개선

### 시장 확장
- [ ] 추가 언어 지원 (태국어, 인도네시아어)
- [ ] 소셜 미디어 통합
- [ ] API 서비스 제공

---
**마지막 업데이트**: 2025년 7월 25일  
**버전**: 1.0  
**관리자**: 브루스 (Replit 기반 운영)
