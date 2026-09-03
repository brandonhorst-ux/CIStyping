const DEFAULT=[
  "the dog runs",
  "i see a cat",
  "the dog has a ball",
  "we like to play",
  "the cat is sleeping",
  "i can type",
  "the bird can fly",
  "go to the door",
  "the sun is hot",
  "the puppy is happy"
];

const KEY="typeAndGoSettingsV2";

let s=JSON.parse(localStorage.getItem(KEY)||"null")||{
  sentences:[...DEFAULT],
  soundOn:true,
  volume:.6,
  count:"10",
  wrongMode:"block"
};

let game=[];
let i=0;
let stars=0;
let streak=0;
let ctx=null;

const $=x=>document.getElementById(x);
const inp=$("typingInput");


function save(){
  localStorage.setItem(KEY,JSON.stringify(s));
}


function shuffle(a){
  return [...a].sort(()=>Math.random()-.5);
}


function audio(){
  if(!ctx){
    ctx=new(window.AudioContext||window.webkitAudioContext)();
  }

  if(ctx.state==="suspended"){
    ctx.resume();
  }
}


function tone(f,d=.07,t="sine",g=.035,delay=0){
  if(!s.soundOn)return;

  audio();

  let o=ctx.createOscillator();
  let a=ctx.createGain();

  o.type=t;
  o.frequency.value=f;

  a.gain.setValueAtTime(
    g*s.volume,
    ctx.currentTime+delay
  );

  a.gain.linearRampToValueAtTime(
    g*s.volume,
    ctx.currentTime+delay+.01
  );

  a.gain.exponentialRampToValueAtTime(
    .001,
    ctx.currentTime+delay+d
  );

  o.connect(a).connect(ctx.destination);

  o.start(ctx.currentTime+delay);

  o.stop(
    ctx.currentTime+delay+d+.02
  );
}


/* 
   Displays the sentence one character at a time.
   Spaces are now normal spaces instead of middle dots.
*/
function render(){

  let target=game[i]||"";
  let typed=inp.value;
  let html="";

  for(let n=0;n<target.length;n++){

    let c=
      n<typed.length
        ?(typed[n]===target[n]?"done":"wrong")
        :(n===typed.length?"current":"");

    html+=`<span class="${c}">${target[n]}</span>`;
  }

  $("sentence").innerHTML=html;

  $("progressBar").style.width=
    (game.length?i/game.length*100:0)+"%";
}


function burst(big=false){

  let e=big
    ?["🎉","⭐","🎈","✨","🌟","🐶"]
    :["⭐","✨","🎈","🌟"];

  e.forEach((x,n)=>{

    let q=document.createElement("span");

    q.className="burst";
    q.textContent=x;

    q.style.left="50%";
    q.style.top="45%";

    q.style.setProperty(
      "--x",
      (n-(e.length-1)/2)*90+"px"
    );

    q.style.setProperty(
      "--y",
      -80-Math.abs(n-(e.length-1)/2)*35+"px"
    );

    document.body.appendChild(q);

    setTimeout(()=>{
      q.remove();
    },1000);

  });
}


function reward(){

  let m=[
    "🎉 Great job! 🎉",
    "⭐ Awesome! ⭐",
    "🐶 You did it! 🐶",
    "🌟 Super typing! 🌟",
    "🎈 Nice work! 🎈"
  ];

  $("reward").textContent=
    m[Math.floor(Math.random()*m.length)];

  $("reward").classList.remove("pop");

  void $("reward").offsetWidth;

  $("reward").classList.add("pop");

  $("puppy").classList.remove("dance");

  void $("puppy").offsetWidth;

  $("puppy").classList.add("dance");

  $("puppy").style.left=
    Math.min(76,7+(i+1)*6.8)+"%";

  tone(523,.1);
  tone(659,.12,"sine",.05,.08);
  tone(784,.18,"sine",.05,.18);

  burst();
}


function start(){

  audio();

  game=shuffle(s.sentences).slice(
    0,
    s.count==="all"
      ?s.sentences.length
      :Number(s.count)
  );

  i=0;
  stars=0;
  streak=0;

  $("stars").textContent=0;
  $("streak").textContent=0;

  /* Reset sentence animation */
  $("sentence").classList.remove("sentence-complete");

  $("startModal").classList.remove("show");
  $("finishedModal").classList.remove("show");

  inp.disabled=false;
  inp.value="";

  $("reward").textContent="";

  inp.focus();

  render();
}


/*
   Prevents incorrect letters when "block wrong letters"
   is selected.
*/
inp.addEventListener("keydown",e=>{

  if(e.key.length===1){

    if(s.wrongMode==="block"){

      let t=game[i]||"";
      let p=inp.value.length;

      if(
        p>=t.length ||
        e.key!==t[p]
      ){
        e.preventDefault();

        tone(
          170,
          .06,
          "sine",
          .018
        );

        return;
      }
    }

    tone(
      e.key===" "?230:360,
      .045,
      "sine",
      .025
    );
  }
});


/*
   Checks typing progress and detects when
   the sentence has been completed.
*/
inp.addEventListener("input",()=>{

  inp.value=inp.value.toLowerCase();

  let t=game[i]||"";


  /* Sentence completed */
  if(inp.value===t && t){

    /*
       Clear the last typed letter immediately.
       This prevents the final character from
       getting stuck in the input box.
    */
    inp.value="";


    /*
       Fade and shrink the completed sentence.
    */
    $("sentence").classList.add(
      "sentence-complete"
    );


    stars++;
    streak++;

    $("stars").textContent=stars;
    $("streak").textContent=streak;

    reward();

    inp.disabled=true;

    i++;


    /*
       Give the reward animation time to play
       before moving to the next sentence.
    */
    setTimeout(()=>{

      /* Finished all sentences */
      if(i>=game.length){

        $("progressBar").style.width="100%";

        [523,659,784,1047].forEach(
          (f,n)=>
            tone(
              f,
              .18,
              "triangle",
              .055,
              n*.1
            )
        );

        burst(true);

        $("finalMessage").textContent=
          `You typed ${game.length} sentence${game.length===1?"":"s"} and earned ${stars} ⭐!`;

        $("finishedModal").classList.add(
          "show"
        );

      }

      /* Move to next sentence */
      else{

        inp.disabled=false;

        inp.value="";

        $("reward").textContent="";

        /*
           Remove the fade class before
           displaying the next sentence.
        */
        $("sentence").classList.remove(
          "sentence-complete"
        );

        inp.focus();

        render();
      }

    },1100);

  }

  /* Still typing */
  else{

    render();

  }

});


function edit(){

  let e=$("sentenceEditor");

  e.innerHTML="";

  s.sentences.forEach((x,n)=>{

    let r=document.createElement("div");

    r.className="editorRow";

    let q=document.createElement("input");

    q.value=x;

    q.oninput=v=>{
      s.sentences[n]=
        v.target.value.toLowerCase();
    };

    let b=document.createElement("button");

    b.className="delete";
    b.textContent="Delete";

    b.onclick=()=>{
      s.sentences.splice(n,1);
      edit();
    };

    r.append(q,b);

    e.append(r);

  });
}


function settings(){

  $("soundOn").checked=s.soundOn;

  $("volume").value=s.volume*100;

  $("count").value=s.count;

  $("wrongMode").value=s.wrongMode;

  edit();

  $("settingsModal").classList.add("show");
}


$("addSentence").onclick=()=>{

  s.sentences.push("i like to type");

  edit();

};


$("resetSentences").onclick=()=>{

  s.sentences=[...DEFAULT];

  edit();

};


$("saveSettings").onclick=()=>{

  s.soundOn=
    $("soundOn").checked;

  s.volume=
    $("volume").value/100;

  s.count=
    $("count").value;

  s.wrongMode=
    $("wrongMode").value;

  s.sentences=
    s.sentences
      .map(x=>x.trim().toLowerCase())
      .filter(Boolean);

  if(!s.sentences.length){
    s.sentences=[...DEFAULT];
  }

  save();

  $("settingsModal").classList.remove(
    "show"
  );

};


$("closeSettings").onclick=()=>
  $("settingsModal").classList.remove("show");


$("settingsBtn").onclick=settings;



$("modalStart").onclick=start;


$("startBtn").onclick=start;


$("againBtn").onclick=start;


/* Initial display */
render();
