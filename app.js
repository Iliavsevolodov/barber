const lessonLinks=[...document.querySelectorAll('.lesson-link')];
const lessons=[...document.querySelectorAll('.lesson')];
const completeButtons=[...document.querySelectorAll('.complete-btn')];
const topProgress=document.getElementById('topProgress');
const progressText=document.getElementById('progressText');
const resetButton=document.getElementById('resetProgress');
const STORAGE_KEY='barber-academy-block-1';

let state=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{"completed":[],"checklist":[]}');

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function updateProgress(){
  const total=7;
  const percent=Math.round((state.completed.length/total)*100);
  topProgress.style.width=`${percent}%`;
  progressText.textContent=`${percent}%`;
  completeButtons.forEach(btn=>{
    const id=Number(btn.closest('[data-lesson]')?.dataset.lesson);
    const done=state.completed.includes(id);
    btn.classList.toggle('done',done);
    btn.textContent=done?'Пройдено ✓':'Отметить пройденным';
  });
}

lessonLinks.forEach(link=>link.addEventListener('click',()=>{
  const target=link.dataset.target;
  lessonLinks.forEach(x=>x.classList.toggle('active',x===link));
  lessons.forEach(x=>x.classList.toggle('active',x.id===target));
  document.getElementById('lessons').scrollIntoView({behavior:'smooth',block:'start'});
}));

completeButtons.forEach(btn=>btn.addEventListener('click',()=>{
  const id=Number(btn.closest('[data-lesson]').dataset.lesson);
  state.completed=state.completed.includes(id)?state.completed.filter(x=>x!==id):[...state.completed,id].sort();
  save();updateProgress();
}));

document.querySelectorAll('.tool-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tool-tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tool-panel').forEach(x=>x.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tool).classList.add('active');
}));

const checklist=[...document.querySelectorAll('.checklist input')];
checklist.forEach((input,index)=>{
  input.checked=state.checklist.includes(index);
  input.addEventListener('change',()=>{
    state.checklist=checklist.map((x,i)=>x.checked?i:null).filter(x=>x!==null);
    save();
  });
});

document.getElementById('quizForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const score=[data.get('q1')==='b',data.get('q2')==='c',data.get('q3')==='b'].filter(Boolean).length;
  const result=document.getElementById('quizResult');
  result.className='quiz-result '+(score===3?'success':'fail');
  result.textContent=score===3?'3/3 — Отлично. Первый блок усвоен.':'Результат: '+score+'/3. Вернись к урокам и попробуй ещё раз.';
  if(score===3){state.completed=[1,2,3,4,5,6,7];save();updateProgress();}
});

resetButton.addEventListener('click',()=>{
  state={completed:[],checklist:[]};save();
  checklist.forEach(x=>x.checked=false);
  document.getElementById('quizForm').reset();
  const result=document.getElementById('quizResult');result.textContent='';result.className='quiz-result';
  updateProgress();
});

updateProgress();
