function format(s){
    let n = s.length;
    let ans="";
    for(let i=0 ; i<n ;  i++){
        if((s.charCodeAt(i) >= "A".charCodeAt(0)) && (s.charCodeAt(i)<="Z".charCodeAt(0))){
            ans+=" ";
        }
        ans+=s[i];
    }
    return ans;
}
async function submitInput(){
    let box = document.getElementById("input1").value;
    let output = document.getElementById("allocation");
    let tab = document.getElementById("prev");
    if(!box){
        alert("Enter valid input");
        return;
    }
    let form = new FormData();
    form.append("numinput" , box);
    output.innerHTML = "<h2>Wait,Let AI create your portfolio..</h2>";
    tab.innerHTML="";
    let send = await fetch('/process' , {
        method:"POST",
        body: form
    });
    if(!(send.ok)){
        output.innerHTML = "<h2>An Error Occured! Try reloading the page after a few minutes!</h2>";
        return;
    }
    else{
        k = await send.json();
        if(k.funds.length===0){
            output.innerHTML = "<h2>HighValueError: The value" + box + " % is too high to guarantee!! Try entering Lower value.</h2>"
            return;
        }
        else{
            let m = "<h1> Your Portfolio Allocation </h1>"
            m+= "<div><table>   <thead>    <th> Fund </th>   <th> Allocation(in %)  </th>   </thead>";
            for(let i=0 ; i<k.funds.length ; i++){
                m+="<tr>"+"<td>"+format(k.funds[i])+"</td>    "+"<td>"+k.allocations[i]+"</td>   </tr>"
            }
            m+="</table>"
            output.innerHTML = m;
            m = "<h1> Let's see how your portfolio did in last 11 years: </h1>";
            m+= "<table>  <thead> <th> Year </th> <th> Return(in %) </th>    </thead>";
            for(let i=0 ; i<k.returns.length ; i++){
                m+= "<tr> <td>"+(2014+i)+"</td>   "+"<td>"+k.returns[i]+"</td>   </tr>"
            }
            m+="</table></div>"
            tab.innerHTML = m;
            m = "<h1>Your average annual return is: "+(k.ans)+"% </h1>"
            tab.innerHTML+=m;
        }
    }
}
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popupImage');
const closeBtn = document.getElementById('closePopup');
const sliderContainer = document.getElementById('sliderContainer');

const popupDots = document.querySelector('.popup-dots');

let index = 0;
let interval;
let isPopup = false;
let popupPaused = false;

function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === i);
    dots[idx].classList.toggle('active', idx === i);
  });
  updatePopup(i);
}

function updatePopup(i) {
  popupImg.src = slides[i].src;

  // Rebuild popup dots
  popupDots.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (idx === i) dot.classList.add('active');
    dot.onclick = () => {
      index = idx;
      showSlide(index);
      resumePopupAutoplay();
    };
    popupDots.appendChild(dot);
  });
}

function startAutoplay() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (isPopup && popupPaused) return; // Pause only if popup mode AND paused
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);
}

function pauseAutoplay() {
  clearInterval(interval);
}

function resumePopupAutoplay() {
  popupPaused = false;
  startAutoplay();
}

document.querySelector('.prev').onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
  resumePopupAutoplay();
};

document.querySelector('.next').onclick = () => {
  index = (index + 1) % slides.length;
  showSlide(index);
  resumePopupAutoplay();
};

dots.forEach((dot, i) => {
  dot.onclick = () => {
    index = i;
    showSlide(i);
    resumePopupAutoplay();
  };
});

slides.forEach((slide, i) => {
  slide.addEventListener('click', () => {
    isPopup = true;
    popupPaused = false;
    popup.style.display = 'flex';
    index = i;
    showSlide(index);
    startAutoplay();
  });
});

// Pause/resume slideshow on hover (main slider)
sliderContainer.addEventListener('mouseenter', pauseAutoplay);
sliderContainer.addEventListener('mouseleave', () => {
  if (!isPopup) startAutoplay();
});

// Toggle pause/resume on popup image click
popupImg.onclick = () => {
  popupPaused = !popupPaused;
  if (!popupPaused) startAutoplay();
};

// Close popup
closeBtn.onclick = () => {
  popup.style.display = 'none';
  isPopup = false;
  popupPaused = false;
  startAutoplay();
};

// Clicking outside image also closes popup
window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
    isPopup = false;
    popupPaused = false;
    startAutoplay();
  }
});

// Start
showSlide(index);
startAutoplay();
