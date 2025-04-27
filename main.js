// 기본 챌린지
const defaultChallenges = [
  "오늘은 10분간 명상하기",
  "하루 동안 물 2리터 마시기",
  "가까운 공원 산책하기",
  "감사한 일 3가지 적어보기",
  "휴대폰 없이 1시간 보내기",
  "새로운 음악 한 곡 들어보기",
  "책 10페이지 읽기",
  "친구에게 안부 문자 보내기",
  "스트레칭 5분 하기",
  "오늘 할 일 리스트 작성하기",
  "처음 보는 단어 하나 찾아서 배우기",
"집안 물건 하나 정리하기",
"오늘 하루 칭찬 3번 하기",
"새로운 간단한 요리 도전하기",
"1분 동안 눈 감고 깊게 숨쉬기",
"길거리 쓰레기 하나 줍기",
"모르는 사람에게 미소 짓기",
"버스나 지하철에서 자리 양보하기",
"오늘 하루 동안 긍정적인 말 5번 하기",
"하루 동안 군것질 참기",
"하루 동안 SNS 사용 30분 이하로 제한하기",
"오늘 가장 기뻤던 순간 기록하기",
"자신에게 짧은 편지 써보기",
"일상에서 감사한 것 사진 찍기",
"하루 동안 엘리베이터 대신 계단 이용하기",
"물 마실 때마다 10초간 스트레칭하기",
"다른 사람 칭찬 1번 이상 하기",
"오늘 하루 동안 투덜거리기 금지",
"이름 모르는 꽃 사진 찍어오기",
"평소 가던 길 말고 다른 길로 가보기",
"감정 일기 3줄 쓰기",
"가족에게 '고맙다' 말하기",
"혼자 카페 가서 시간 보내기",
"오늘은 야식 금지",
"오래된 이메일 하나 정리하기",
"편의점 가서 새로운 음료 하나 사보기",
"새로운 운동 동작 하나 따라해보기",
"30분 동안 뉴스/인터넷 끄고 조용히 있기",
"하루 동안 자신에게 부정적인 말 금지",
"좋아하는 영화나 드라마 한 편 보기",
"밖에 나가서 하늘 한 번 보기",
"손글씨로 '오늘의 나' 써보기",
"친구나 가족에게 짧은 편지 써보기",
"하루 동안 소소한 친절 3번 실천하기",
"아침에 일어나서 스트레칭 1분 하기"
];

// LocalStorage에서 데이터 불러오기
function loadChallenges() {
  const custom = JSON.parse(localStorage.getItem('customChallenges')) || [];
  return defaultChallenges.concat(custom);
}

function saveCustomChallenges(customChallenges) {
  localStorage.setItem('customChallenges', JSON.stringify(customChallenges));
}

function loadCompletedChallenges() {
  return JSON.parse(localStorage.getItem('completedChallenges')) || [];
}

function saveCompletedChallenges(completedChallenges) {
  localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
}

function loadCurrentChallenge() {
  return localStorage.getItem('currentChallenge') || '';
}

function saveCurrentChallenge(challenge) {
  localStorage.setItem('currentChallenge', challenge);
}

// 변수 선언
let challenges = loadChallenges();
let completedChallenges = loadCompletedChallenges();

const recommendBtn = document.querySelector('.recommend-btn');
const challengeDisplay = document.getElementById('challenge-display');
const completedList = document.getElementById('completed-list');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');

// 완료 챌린지 목록 렌더링 (클릭 영역 넓게)
function renderCompletedChallenges() {
  completedList.innerHTML = '';
  completedChallenges.forEach((challenge, idx) => {
    const li = document.createElement('li');
    li.className = 'completed-item';

    // 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'completed-checkbox';
    checkbox.dataset.index = idx;

    // 체크박스 클릭 시 이벤트 버블링 방지
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // li 클릭 시 체크박스 토글
    li.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
    });

    // 텍스트
    const span = document.createElement('span');
    span.textContent = challenge;

    li.appendChild(checkbox);
    li.appendChild(span);
    completedList.appendChild(li);
  });
}

// 챌린지 표시
function showChallenge(challenge) {
  challengeDisplay.innerHTML = `
    <span>${challenge}</span>
    <button class="complete-btn">완료하기</button>
  `;
  const completeBtn = document.querySelector('.complete-btn');
  // 이미 완료한 챌린지는 버튼 비활성화
  if (completedChallenges.includes(challenge)) {
    completeBtn.disabled = true;
    completeBtn.textContent = "완료됨";
  }
  completeBtn.addEventListener('click', () => completeChallenge(challenge, completeBtn));
  saveCurrentChallenge(challenge);
}

// 오늘 날짜 구하기 (YYYY-MM-DD)
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// 오늘 완료 챌린지 불러오기/저장
function loadCompletedToday() {
  const data = JSON.parse(localStorage.getItem('completedToday')) || {};
  return data[getToday()] || [];
}

function saveCompletedToday(list) {
  const data = JSON.parse(localStorage.getItem('completedToday')) || {};
  data[getToday()] = list;
  localStorage.setItem('completedToday', JSON.stringify(data));
}

// 오늘 완료 카운트 배지 렌더링
function renderTodayCountBadge() {
  const badge = document.getElementById('today-count-badge');
  const todayList = loadCompletedToday();
  badge.textContent = `${todayList.length}개 완료!`;
}

// 챌린지 완료 처리
function completeChallenge(challenge, button) {
  if (!completedChallenges.includes(challenge)) {
    completedChallenges.push(challenge);
    saveCompletedChallenges(completedChallenges);
    renderCompletedChallenges();
  }
  // 오늘 완료 챌린지 처리
  let todayList = loadCompletedToday();
  if (!todayList.includes(challenge)) {
    todayList.push(challenge);
    saveCompletedToday(todayList);
    renderTodayCountBadge();
  }
  button.disabled = true;
  button.textContent = "완료됨";
}

// 챌린지 추천
recommendBtn.addEventListener('click', () => {
  challenges = loadChallenges(); // 항상 최신 챌린지 반영
  const todayCompleted = loadCompletedToday();

  // 오늘 완료한 챌린지는 추천 대상에서 제외
  const availableChallenges = challenges.filter(
    (challenge) => !todayCompleted.includes(challenge)
  );

  if (availableChallenges.length === 0) {
    challengeDisplay.innerHTML = `<span>오늘 할 수 있는 새로운 챌린지가 없습니다!</span>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableChallenges.length);
  const challenge = availableChallenges[randomIndex];
  showChallenge(challenge);
});

// 선택 삭제 기능
if (deleteSelectedBtn) {
  deleteSelectedBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.completed-checkbox');
    const toDelete = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        // 체크박스 옆의 텍스트(챌린지 내용)로 삭제 대상 찾기
        const challengeText = cb.nextSibling.textContent;
        toDelete.push(challengeText);
      }
    });
    if (toDelete.length === 0) {
      alert('삭제할 챌린지를 선택하세요!');
      return;
    }
    // completedChallenges에서 선택된 항목 삭제
    completedChallenges = completedChallenges.filter(ch => !toDelete.includes(ch));
    saveCompletedChallenges(completedChallenges);

    // 오늘 완료 챌린지에서도 삭제
    let todayList = loadCompletedToday();
    todayList = todayList.filter(ch => !toDelete.includes(ch));
    saveCompletedToday(todayList);

    renderCompletedChallenges();
    renderTodayCountBadge();
  });
}

// 페이지 로드시 데이터 복원
window.addEventListener('DOMContentLoaded', () => {
  // 완료 챌린지
  renderCompletedChallenges();
  renderTodayCountBadge();
  // 마지막 추천 챌린지
  const lastChallenge = loadCurrentChallenge();
  if (lastChallenge) {
    showChallenge(lastChallenge);
  }
}); 