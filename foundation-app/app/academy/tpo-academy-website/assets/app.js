
/* ═══ TPO LMS — shared engine: progress, quizzes, grades ═══ */
(function(){
  'use strict';
  var STORE_KEY = 'tpo_lms_v1';

  function load(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {completed:{},quiz:{}}; }
    catch(e){ return {completed:{},quiz:{}}; }
  }
  function save(s){ try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch(e){} }
  var state = load();
  if(!state.completed) state.completed={};
  if(!state.quiz) state.quiz={};

  window.TPO = {
    isDone:function(key){ return !!state.completed[key]; },
    markDone:function(key){ state.completed[key]=Date.now(); save(state); },
    unmark:function(key){ delete state.completed[key]; save(state); },
    toggle:function(key){ if(this.isDone(key)) this.unmark(key); else this.markDone(key); return this.isDone(key); },
    setQuiz:function(key,score,total){
      state.quiz[key]={score:score,total:total,pct:Math.round(score/total*100),ts:Date.now()};
      save(state);
    },
    getQuiz:function(key){ return state.quiz[key]||null; },
    moduleProgress:function(modId, unitIds){
      if(!unitIds.length) return 0;
      var done=0; unitIds.forEach(function(u){ if(state.completed[modId+'.'+u]) done++; });
      return done/unitIds.length;
    },
    overall:function(allKeys){
      if(!allKeys.length) return 0;
      var done=0; allKeys.forEach(function(k){ if(state.completed[k]) done++; });
      return done/allKeys.length;
    },
    letter:function(pct){
      if(pct>=93) return 'A'; if(pct>=90) return 'A-';
      if(pct>=87) return 'B+'; if(pct>=83) return 'B'; if(pct>=80) return 'B-';
      if(pct>=77) return 'C+'; if(pct>=73) return 'C'; if(pct>=70) return 'C-';
      if(pct>=60) return 'D'; return 'F';
    },
    reset:function(){ state={completed:{},quiz:{}}; save(state); }
  };

  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); return; }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target);} });
    },{threshold:0.08});
    els.forEach(function(e){ obs.observe(e); });
  }

  // Quiz: .quiz[data-key]; .quiz-q[data-answer]; .quiz-opt clicked in order
  function initQuizzes(){
    document.querySelectorAll('.quiz').forEach(function(quiz){
      var key = quiz.getAttribute('data-key');
      var questions = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-q'));
      var correctness = {}; // qi -> true/false
      questions.forEach(function(q,qi){
        var ans = parseInt(q.getAttribute('data-answer'),10);
        var opts = Array.prototype.slice.call(q.querySelectorAll('.quiz-opt'));
        opts.forEach(function(opt,oi){
          opt.addEventListener('click',function(){
            if(qi in correctness) return; // locked
            var isCorrect = (oi===ans);
            correctness[qi]=isCorrect;
            opt.classList.add(isCorrect?'correct':'incorrect');
            if(!isCorrect && opts[ans]) opts[ans].classList.add('correct');
            var fb=q.querySelector('.quiz-feedback');
            if(fb) fb.classList.add('show', isCorrect?'ok':'no');
            opts.forEach(function(o){ o.style.cursor='default'; });
            if(Object.keys(correctness).length===questions.length) finish();
          });
        });
      });
      function finish(){
        var score=0;
        questions.forEach(function(q,qi){ if(correctness[qi]) score++; });
        var total=questions.length;
        TPO.setQuiz(key,score,total);
        var pct=Math.round(score/total*100);
        var res=quiz.querySelector('.quiz-result');
        if(res){
          res.classList.add('show');
          res.innerHTML='Score: <span class="score">'+score+'/'+total+' &middot; '+pct+'% ('+TPO.letter(pct)+')</span>';
        }
        // auto-mark unit complete on quiz pass (>=70)
        if(pct>=70 && quiz.getAttribute('data-complete-key')){
          TPO.markDone(quiz.getAttribute('data-complete-key'));
        }
      }
    });
  }

  function initComplete(){
    var btn=document.getElementById('completeBtn');
    if(btn){
      var key=btn.getAttribute('data-key');
      var render=function(){
        if(TPO.isDone(key)){ btn.textContent='\u2713 Lesson Complete'; btn.classList.remove('btn-gold'); btn.classList.add('btn-outline'); }
        else { btn.textContent='Mark Lesson Complete'; btn.classList.add('btn-gold'); btn.classList.remove('btn-outline'); }
      };
      btn.addEventListener('click',function(){ TPO.toggle(key); render(); });
      render();
    }
    document.querySelectorAll('.side-unit').forEach(function(su){
      var k=su.getAttribute('data-key');
      if(k && TPO.isDone(k)){ var d=su.querySelector('.dot'); if(d) d.classList.add('done'); }
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    initReveal(); initQuizzes(); initComplete();
    if(window.TPO_PAGE_INIT) window.TPO_PAGE_INIT();
  });
})();
