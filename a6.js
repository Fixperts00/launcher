const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const currentSlides = [1, 1];
const tabImageCounts = [5, 24]; // 첫 번째 탭: 5개, 두 번째 탭: 24개
let currentTabIndex = 0; // 현재 활성화된 탭 인덱스

// 단계별 안내 텍스트 정의
const stepDescriptions = {
  0: [ // 안드로이드 버전 확인
    "1. 앱스를 선택합니다.",
    "2. 설정 앱을 실행합니다.",
    "3. 설정 화면에서 디바이스 정보(태블릿 정보)를 선택합니다.",
    "4. 소프트웨어 정보를 선택합니다.",
    "5. 안드로이드 버전을 확인합니다. 안드로이드 버전이 6.0.1 버전이 아닐 경우 고객센터로 연락 부탁드립니다."
  ],
  1: [ // 런처 설치 (24개)
    "1. 앱스를 터치합니다.",
    "2. Google 폴더를 터치합니다.",
    "3. Chrome 앱을 실행합니다.",
    "4. 주소창에 <m.milkt.co.kr/sp/main>을 입력하여 이동한 후, '밀크T 런처'를 터치합니다.",
    "5. 권한을 요청할 경우 '권한 업데이트'를 터치합니다.",
    "6. 작업 허용을 요청할 경우 '허용'을 터치합니다.",
    "7. '확인'을 터치하여 밀크T 런처 파일을 다운로드합니다.",
    "8. 파일이 다운로드 되었다는 알림창이 뜰 경우 '열기'를 터치합니다.",
    "9. 내 파일 앱에서 밀크T 런처 apk 파일을 터치합니다.",
    "10. 설치가 차단되었다는 알림창이 뜬다면 '설정'을 터치합니다.",
    "11. 출처를 알 수 없는 앱의 버튼을 터치하여 활성화합니다.",
    "12. '허용'을 터치합니다.",
    "13. '설치'를 터치하여 밀크T 홈을 설치합니다.",
    "14. 밀크T 홈 설치가 완료되면 '열기'를 터치합니다.",
    "15. 디바이스 관리자를 실행합니다.",
    "16. '허용'을 눌러 밀크T 홈의 파일 액세스 권한을 허용합니다.",
    "17. '허용'을 눌러 밀크T 홈의 위치 액세스 권한을 허용합니다.",
    "18. 가입한 서비스를 선택한 후 '다음'을 터치합니다.",
    "19. 와이파이 연결 확인, 배터리 상태 확인이 완료되면 '다음'을 터치합니다.",
    "20. 개인정보 수집, 이용동의서의 약관동의를 체크 후 확인을 터치합니다.",
    "21. 태블릿 시리얼 인증이 완료된 후 '다음'을 터치합니다.",
    "22. '설치 준비중'이 '설치하기'로 변경되면 터치합니다.",
    "23. 디바이스 관리자를 실행합니다.",
    "24. 학습에 필요한 콘텐츠를 설치하는데는 상황에 따라 20분~50분 가량 소요됩니다. 콘텐츠 설치가 완료되면 '시작하기'를 터치하여 학습 이용 가능합니다."
  ]
};

// 이미지 아래 추가 설명 (특정 단계만)
const additionalNotes = {
  1: { // 런처 설치
    9: "'취소'와 '설정'이 보이지 않고 '확인'만 노출될 경우, 자녀 보호 기능(패밀리 링크)앱에 의해 설치가 차단된 상황입니다. 태블릿에 설치된 자녀 보호 기능 앱 실행 > 우측 상단의 메뉴 터치 > 감독 중지를 통해 밀크T 태블릿을 관리 목록에서 제외시켜주세요",
    18: "'다음'이 보이지 않을 경우 와이파이 연결이 되지 않았거나 배터리가 30% 미만인 상황입니다. 충전기를 연결하면 배터리 30%가 되지 않더라도 '다음'버튼이 활성화됩니다.",
    20: "인증이 너무 오래 걸리거나 실패했다고 나온다면 와이파이 공유기 재부팅을 부탁드립니다. 그럼에도 해결되지 않을 경우, 번거로우시겠지만 밀크T 고객센터로 연락 부탁드립니다."
  }
};

// 페이지 로드 시 스크롤 이미지 생성 및 초기 설정
window.addEventListener('load', function() {
  generateScrollImages();
  
  // 초기 슬라이드 이미지 설정
  for (let tabIndex = 0; tabIndex < 2; tabIndex++) {
    const slideImg = document.getElementById(`slideImage${tabIndex}`);
    if (slideImg) {
      slideImg.src = getImageSrc('a6', tabIndex, currentSlides[tabIndex]);
    }
    const counter = document.getElementById(`counter${tabIndex}`);
    if (counter) {
      counter.innerText = `${currentSlides[tabIndex]} / ${tabImageCounts[tabIndex]}`;
    }
    // 초기 단계 설명 설정
    updateStepDescription(tabIndex, currentSlides[tabIndex]);
  }
  
  // 초기 네비게이션 설정
  updateNavigation();
});

// 화면 회전 시 이미지 업데이트
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    generateScrollImages();
    
    // 현재 슬라이드 이미지도 업데이트
    for (let tabIndex = 0; tabIndex < 2; tabIndex++) {
      const slideImg = document.getElementById(`slideImage${tabIndex}`);
      if (slideImg) {
        slideImg.src = getImageSrc('a6', tabIndex, currentSlides[tabIndex]);
      }
      updateStepDescription(tabIndex, currentSlides[tabIndex]);
    }
  }, 100);
});

// 윈도우 리사이즈 시에도 업데이트 (PC에서 브라우저 크기 변경 시)
window.addEventListener('resize', function() {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    generateScrollImages();
    
    // 현재 슬라이드 이미지도 업데이트
    for (let tabIndex = 0; tabIndex < 2; tabIndex++) {
      const slideImg = document.getElementById(`slideImage${tabIndex}`);
      if (slideImg) {
        slideImg.src = getImageSrc('a6', tabIndex, currentSlides[tabIndex]);
      }
      updateStepDescription(tabIndex, currentSlides[tabIndex]);
    }
  }, 300);
});

function generateScrollImages() {
  for (let tabIndex = 0; tabIndex < 2; tabIndex++) {
    const container = document.getElementById(`scrollImages${tabIndex}`);
    container.innerHTML = '';
    const totalImages = tabImageCounts[tabIndex];
    
    for (let i = 1; i <= totalImages; i++) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'image-wrapper';
      
      // 단계 설명 텍스트 추가
      const stepText = document.createElement('div');
      stepText.className = 'step-text';
      stepText.textContent = stepDescriptions[tabIndex][i - 1] || `단계 ${i} 설명`;
      
      const img = document.createElement('img');
      img.src = getImageSrc('a6', tabIndex, i);
      img.alt = `단계 ${i}`;
      img.onclick = () => openModal('a6', tabIndex, i);
      img.className = 'scroll-image';
      
      imageWrapper.appendChild(stepText);
      imageWrapper.appendChild(img);
      
      // 추가 설명이 있는 경우 이미지 아래에 추가
      if (additionalNotes[tabIndex] && additionalNotes[tabIndex][i - 1]) {
        const additionalNote = document.createElement('div');
        additionalNote.className = 'additional-note';
        additionalNote.textContent = additionalNotes[tabIndex][i - 1];
        imageWrapper.appendChild(additionalNote);
      }
      
      container.appendChild(imageWrapper);
    }
  }
}

function updateStepDescription(tabIndex, slideIndex) {
  const descriptionElement = document.getElementById(`stepDescription${tabIndex}`);
  if (descriptionElement) {
    descriptionElement.textContent = stepDescriptions[tabIndex][slideIndex - 1] || `단계 ${slideIndex} 설명`;
  }
  
  // 가로 모드에서 추가 설명 업데이트
  updateSlideAdditionalNote(tabIndex, slideIndex);
}

function updateSlideAdditionalNote(tabIndex, slideIndex) {
  const slideAdditionalNote = document.getElementById(`slideAdditionalNote${tabIndex}`);
  
  if (slideAdditionalNote) {
    // 추가 설명이 있는 경우
    if (additionalNotes[tabIndex] && additionalNotes[tabIndex][slideIndex - 1]) {
      slideAdditionalNote.textContent = additionalNotes[tabIndex][slideIndex - 1];
      slideAdditionalNote.style.display = 'block';
    } else {
      slideAdditionalNote.style.display = 'none';
    }
  }
}

function showTab(index) {
  currentTabIndex = index; // 현재 탭 인덱스 업데이트
  
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    contents[i].classList.toggle("active", i === index);
  });
  
  // 네비게이션 업데이트
  updateNavigation();
}

function updateNavigation() {
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (currentTabIndex === 0) {
    // 1. 안드로이드 버전 확인 탭
    backBtn.textContent = '← 기종 선택으로';
    nextBtn.textContent = '다음 단계로 →';
    nextBtn.style.display = 'block';
  } else {
    // 2. 런처 설치 탭
    backBtn.textContent = '← 이전 단계로';
    nextBtn.style.display = 'none';
  }
}

function handleBackClick() {
  if (currentTabIndex === 0) {
    // 1번 탭에서: 기종 선택 페이지로 이동
    location.href = 'index.html';
  } else {
    // 2번 탭에서: 1번 탭으로 이동
    showTab(0);
  }
}

function handleNextClick() {
  if (currentTabIndex === 0) {
    // 1번 탭에서: 2번 탭으로 이동
    showTab(1);
  }
  // 2번 탭에서는 다음 버튼이 없으므로 이 함수가 호출되지 않음
}

function changeSlide(tabIndex, direction) {
  const maxSlides = tabImageCounts[tabIndex];
  currentSlides[tabIndex] += direction;
  
  // 순환 슬라이드 로직
  if (currentSlides[tabIndex] < 1) {
    currentSlides[tabIndex] = maxSlides; // 1번에서 왼쪽 화살표 누르면 마지막 슬라이드로
  }
  if (currentSlides[tabIndex] > maxSlides) {
    currentSlides[tabIndex] = 1; // 마지막에서 오른쪽 화살표 누르면 1번 슬라이드로
  }
  
  // 슬라이드 이미지 업데이트
  document.getElementById(`slideImage${tabIndex}`).src = getImageSrc('a6', tabIndex, currentSlides[tabIndex]);
  document.getElementById(`counter${tabIndex}`).innerText = `${currentSlides[tabIndex]} / ${maxSlides}`;
  
  // 단계 설명 업데이트
  updateStepDescription(tabIndex, currentSlides[tabIndex]);
}

let modalDevice = 'a6';
let modalTabIndex = 0;
let modalSlideIndex = 1;

function openModal(device, tabIndex, slideIndex) {
  modalDevice = device;
  modalTabIndex = tabIndex;
  modalSlideIndex = slideIndex;
  document.getElementById("modalImage").src = getImageSrc(device, tabIndex, slideIndex);
  document.getElementById("imageModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function navigateModal(direction) {
  const maxSlides = tabImageCounts[modalTabIndex];
  modalSlideIndex += direction;
  
  // 모달에서도 순환 기능 적용
  if (modalSlideIndex < 1) {
    modalSlideIndex = maxSlides;
  }
  if (modalSlideIndex > maxSlides) {
    modalSlideIndex = 1;
  }
  
  document.getElementById("modalImage").src = getImageSrc(modalDevice, modalTabIndex, modalSlideIndex);
}

function getImageSrc(device, tabIndex, slideIndex) {
  if (device === 'a6' && tabIndex === 0) {
    // A6 안드로이드 버전 확인 (5장) - 가로/세로 모드 모두 a6os 레포 사용
    const paddedIndex = slideIndex.toString().padStart(2, '0');
    return `https://raw.githubusercontent.com/skyhigh79/a6os/main/a6_android_check_${paddedIndex}.png`;
  } else if (device === 'a6' && tabIndex === 1) {
    // A6 런처 설치 (24장) - ins 레포의 실제 이미지 사용
    const paddedIndex = slideIndex.toString().padStart(2, '0');
    return `https://raw.githubusercontent.com/skyhigh79/ins/main/a6_launcher_install_${paddedIndex}.png`;
  }
  
  // 기본값 (테스트용 이미지)
  return `https://raw.githubusercontent.com/skyhigh79/aa/main/ex.png`;
}

// 맨 위로 버튼 기능
const scrollToTopBtn = document.getElementById('scrollToTop');

// 스크롤 이벤트 리스너
window.addEventListener('scroll', function() {
  // 세로 모드에서만 작동
  if (window.innerHeight > window.innerWidth) {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

// 맨 위로 스크롤 함수
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}