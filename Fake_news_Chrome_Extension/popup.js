// function showFake()
document.getElementById('clickme').addEventListener('click', function () {
    alert("가짜 뉴스 탐지 프로그램을 실행했습니다.");
    chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function () {
        chrome.tabs.executeScript(null, { file: "index.js" });
    });
});