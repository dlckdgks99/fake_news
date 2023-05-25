console.log("INDEX.js 시작")

//크롤링를 해서 js vs python 
//new == href() 
//링크를 가져옵니다
//링크로 들어가서 본문 
//text
function inputTooltip(articleTitle, obj, res) {
  //console.log("inputTooltip 실행");
  var container = document.createElement("div"); 
  container.classList.add("tooltip"); 
  var title = document.createElement("div");
  title.textContent = articleTitle;
  container.appendChild(title); 
  var summary = document.createElement("div");
  summary.textContent =  res;
  container.appendChild(summary); 
  
  var inp = obj.childNodes[0];
  obj.insertBefore(container, inp); 
}


  
async function short_news(href) {
  console.log("short_news 함수 실행합니다");
  var requestData = {
    text: href
  };

  try {
    const response = await fetch('http://localhost:8080/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      referrer: 'client',
      referrerPolicy: 'origin',
      body: JSON.stringify(requestData) // JSON.stringify()로 데이터를 변환합니다.
    });

    if (response.ok) {
      const responseData = await response.json();
      // const responseData = await response.body.json();
      // console.log("서버 응답:", responseData);
      //console.log(responseData);
      return responseData['summary'].toString();
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
    // 오류 처리
    return null;
  }
}



var hoverTimeout; // 마우스 hover 타임아웃 변수

document.addEventListener("mouseover", function(event) {
  var target = event.target; // 이벤트가 발생한 요소를 가져옵니다.
  if (target.tagName.toLowerCase() === "a") { // 요소가 <a> 태그인지 확인합니다.
    hoverTimeout = setTimeout(function() {
      var href = target.getAttribute("href"); // href 속성 값을 가져옵니다.
      var articleTitle = target.textContent.trim(); // 기사 제목을 가져옵니다.

      short_news(href).then(
        (res) => {
          //console.log("short_news 함수가 돌와왔어요");
         // console.log(res);
          inputTooltip(articleTitle,target, res); // 수정된 부분: target과 res를 전달합니다.
        }
      );
    }, 500); // 0.21초(1000ms) 후에 실행됩니다.
  }
});


document.addEventListener("mouseout", function() {
  clearTimeout(hoverTimeout); // 마우스가 요소에서 벗어나면 타임아웃을 제거합니다.
  hoverTimeout = setTimeout(function() {
    var tooltips = document.getElementsByClassName("tooltip");
    for (var i = 0; i < tooltips.length; i++) {
      tooltips[i].remove(); // 모든 툴팁을 삭제합니다.
    }
  }, 200); // 0.5초(500ms) 후에 실행됩니다.
});