let S={sl:{q1:null,q2:null,q3:null,q4:null,q5:null,q6:null,q7:null,q8:null,wmain:null,woff:null,helmet:null,armor:null,boots:null,backpack:null,lantern:null},pool:[],bt:[],fc:[],qb:[],skillPairs:{}};
let wF='all',qF='all';

function fW(id){for(const k in WD){const f=WD[k].find(w=>w.id===id);if(f)return Object.assign({},f,{cat:k})}return null}
function fS(id){for(const k in SDD){const f=SDD[k].sk.find(s=>s.id===id);if(f)return f}return null}
function fC(id){return CSD.find(c=>c.id===id)}
function esc(s){const d=document.createElement('div');d.textContent=String(s);return d.innerHTML}

function setS(slot,item){S.sl[slot]=item;uSUI(slot);uQB();uStats()}
function clS(slot){S.sl[slot]=null;uSUI(slot);uQB();uStats()}

function uSUI(slot){
const el=document.getElementById('sl-'+slot);
if(!el)return;
const tp=document.getElementById('tp-'+slot);
const icEl=el.querySelector('.ic');
const item=S.sl[slot];
if(item){
el.classList.add('f');
el.classList.add('has-img');
// Ищем картинку предмета
let imgUrl=item.img;
if(!imgUrl){
const allData=[...HELMETS,...ARMORS,...BOOTS,...BACKPACKS,...LANTERNS];
const found=allData.find(x=>x.id===item.id);
if(found)imgUrl=found.img;
if(!imgUrl){
for(const k in WD){
const w=WD[k].find(x=>x.id===item.id);
if(w){imgUrl=w.img;break}
}
}
if(!imgUrl){
for(const k in SDD){
const s=SDD[k].sk.find(x=>x.id===item.id);
if(s){imgUrl=s.img;break}
}
}
}
if(imgUrl){
icEl.innerHTML='<img src="'+imgUrl+'" onerror="this.parentNode.innerHTML=\'&nbsp;\'">';
}else{
icEl.innerHTML='&nbsp;';
}
if(tp)tp.innerHTML='<b style="color:#c9a227">'+esc(item.ru||item.n)+'</b><br><span style="color:#8b7355">'+esc(item.d||item.st||'')+'</span>';
}
else{
el.classList.remove('f');
el.classList.remove('has-img');
icEl.innerHTML='&nbsp;';
if(tp)tp.innerHTML='';
}
}

function uQB(){
// Панель крестом как в игре — обновляем слоты напрямую
for(let i=1;i<=8;i++){uSUI('q'+i)}
uSUI('wmain');uSUI('woff');
}

let armorSlot='helmet',armorFilter='all';

function rPool(){
updateTrainerLock();
document.getElementById('poolItems').innerHTML=S.pool.map((x,i)=>
'<div class="ow-pool-item" data-pi="'+i+'" title="'+esc(x.ru||x.n)+'">'
+esc(x.ic||'◆')
+'<span class="rm" data-rm="'+i+'">✕</span></div>').join('')||'<div style="color:#8b7355;font-size:.8em;padding:10px"><i>Пусто — добавьте навыки и расходники</i></div>';
document.querySelectorAll('#poolItems .ow-pool-item').forEach(el=>{
el.addEventListener('click',(e)=>{
if(e.target.classList.contains('rm')){
const idx=parseInt(e.target.dataset.rm);
const item=S.pool[idx];
if(item.src==='skill'&&fS(item.id)&&fS(item.id).pair){S.skillPairs[fS(item.id).pair]=null;rS()}
S.pool.splice(idx,1);rPool();rC();return;
}
// Клик — на панель
const idx=parseInt(el.dataset.pi);
const item=S.pool[idx];
// Ищем свободный слот
for(let i=1;i<=8;i++){
if(!S.sl['q'+i]){
S.sl['q'+i]=item;
S.pool.splice(idx,1);
uSUI('q'+i);uQB();rPool();
return;
}
}
alert('Все 8 слотов заняты!');
});
});
}

function rArmor(){
const slot=document.getElementById('armorSlot').value;
armorSlot=slot;
let items=[];
if(slot==='helmet')items=HELMETS;
else if(slot==='armor')items=ARMORS;
else if(slot==='boots')items=BOOTS;
else if(slot==='backpack')items=BACKPACKS;
else if(slot==='lantern')items=LANTERNS;

// Фильтр
let filtered=items;
if(armorFilter==='set')filtered=items.filter(x=>x.src&&x.src.indexOf('Set')>-1);
else if(armorFilter==='unique')filtered=items.filter(x=>x.src==='Unique');
else if(armorFilter==='craft')filtered=items.filter(x=>x.craft);
else if(armorFilter==='legacy')filtered=items.filter(x=>x.legacy);

const cur=S.sl[slot];
document.getElementById('armorGrid').innerHTML=filtered.map(x=>{
const isSel=cur&&cur.id===x.id;
let stats='';
if(slot==='backpack'||slot==='lantern'){stats='<span>📦 '+esc(x.st)+'</span>'}
else{stats='<span>Физ:<b>'+x.ph+'</b></span><span>Имп:<b>'+x.im+'</b></span>'+(x.ma!==undefined?'<span>Маг:<b>'+(x.ma||0)+'</b></span>':'')+'<span>❄<b>'+x.co+'</b></span><span>🔥<b>'+x.he+'</b></span>'}
let badges='';
if(x.legacy)badges+='<span style="background:#ffd700;color:#000;padding:1px 5px;font-size:.6em;border-radius:2px;margin-right:4px">Наследие</span>';
if(x.craft)badges+='<span style="background:#3498db;color:#fff;padding:1px 5px;font-size:.6em;border-radius:2px;margin-right:4px">Крафт</span>';
if(x.src&&x.src.indexOf('Set')>-1)badges+='<span style="background:#9b59b6;color:#fff;padding:1px 5px;font-size:.6em;border-radius:2px;margin-right:4px">Сет</span>';
return '<div class="ow-c'+(isSel?' sel':'')+'" data-aid="'+x.id+'">'
+(x.img?'<img class="img" src="'+x.img+'" loading="lazy" onerror="this.style.display=\'none\'">':'')
+'<h4>'+esc(x.ru||x.n)+'</h4>'
+'<div style="color:#8b7355;font-size:.7em">'+esc(x.n)+'</div>'
+'<div style="margin:4px 0">'+badges+'</div>'
+'<div class="s">'+stats+'</div>'
+'<div class="d">'+esc(x.d)+'</div>'
+(x.bo?'<div class="d" style="color:#9b59b6">'+esc(x.bo)+'</div>':'')
+(x.craftChain?'<div class="d" style="color:#3498db;font-size:.75em;margin-top:4px"><b>Крафт:</b> '+esc(x.craftChain)+'</div>':'')
+(x.legacyChain?'<div class="d" style="color:#ffd700;font-size:.75em;margin-top:4px"><b>Наследие:</b> '+esc(x.legacyChain)+'</div>':'')
+'</div>'}).join('');
document.querySelectorAll('#armorGrid .ow-c').forEach(el=>{
el.addEventListener('click',()=>{
const id=el.dataset.aid;
if(S.sl[slot]&&S.sl[slot].id===id){clS(slot)}
else{
const x=items.find(i=>i.id===id);
const icons={helmet:'🪖',armor:'🛡',boots:'🥾',backpack:'🎒',lantern:'🏮'};
setS(slot,{id:x.id,n:x.n,ru:x.ru,ic:icons[slot],d:x.d+' '+(x.bo||x.st||'')});
}
rArmor();uStats();
});
});
}

document.getElementById('armorSlot').addEventListener('change',rArmor);
document.querySelectorAll('#armorFilters .ow-fb').forEach(btn=>{
btn.addEventListener('click',()=>{
armorFilter=btn.dataset.af;
document.querySelectorAll('#armorFilters .ow-fb').forEach(b=>b.classList.remove('on'));
btn.classList.add('on');
rArmor();
});
});

function showArmorDetail(){
const h=HELMETS.find(x=>x.id===document.getElementById('selHelmet').value);
const a=ARMORS.find(x=>x.id===document.getElementById('selArmor').value);
const b=BOOTS.find(x=>x.id===document.getElementById('selBoots').value);
let html='';
if(h)html+='<div class="ow-c sel" style="margin-bottom:6px">'+(h.img?'<img class="img" src="'+h.img+'">':'')+'<h4>🪖 '+esc(h.ru||h.n)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(h.n)+'</div><div class="s"><span>Физ:<b>'+h.ph+'</b></span><span>Имп:<b>'+h.im+'</b></span><span>❄<b>'+h.co+'</b></span><span>🔥<b>'+h.he+'</b></span></div><div class="d">'+esc(h.d)+'</div>'+(h.bo?'<div class="d" style="color:#9b59b6">'+esc(h.bo)+'</div>':'')+'</div>';
if(a)html+='<div class="ow-c sel" style="margin-bottom:6px">'+(a.img?'<img class="img" src="'+a.img+'">':'')+'<h4>🛡 '+esc(a.ru||a.n)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(a.n)+'</div><div class="s"><span>Физ:<b>'+a.ph+'</b></span><span>Имп:<b>'+a.im+'</b></span><span>Маг:<b>'+(a.ma||0)+'</b></span><span>❄<b>'+a.co+'</b></span><span>🔥<b>'+a.he+'</b></span></div><div class="d">'+esc(a.d)+'</div>'+(a.bo?'<div class="d" style="color:#9b59b6">'+esc(a.bo)+'</div>':'')+'</div>';
if(b)html+='<div class="ow-c sel" style="margin-bottom:6px">'+(b.img?'<img class="img" src="'+b.img+'">':'')+'<h4>🥾 '+esc(b.ru||b.n)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(b.n)+'</div><div class="s"><span>Физ:<b>'+b.ph+'</b></span><span>Имп:<b>'+b.im+'</b></span><span>❄<b>'+b.co+'</b></span><span>🔥<b>'+b.he+'</b></span></div><div class="d">'+esc(b.d)+'</div>'+(b.bo?'<div class="d" style="color:#9b59b6">'+esc(b.bo)+'</div>':'')+'</div>';
document.getElementById('armorDetail').innerHTML=html;
}

function rW(){
const cat=document.getElementById('wCat').value;
const list=WD[cat]||[];
const f=wF==='all'?list:list.filter(w=>w.e===wF);
document.getElementById('wGr').innerHTML=f.map(w=>{
const im=S.sl.wmain&&S.sl.wmain.id===w.id,io=S.sl.woff&&S.sl.woff.id===w.id;
const isShield=cat==='shields',isLex=cat==='lexicons';
let stats='';
if(isShield)stats='<span>🛡<b>'+w.ph+'</b></span><span>💥<b>'+w.im+'</b></span>';
else if(isLex)stats='<span>🔮<b>'+w.ma+'</b></span>';
else stats='<span>⚔<b>'+w.dmg+'</b></span><span>💥<b>'+w.imp+'</b></span><span>⚡<b>'+w.sp+'</b></span>';
return '<div class="ow-c'+(im||io?' sel':'')+'" data-wid="'+w.id+'">'
+(w.img?'<img class="img" src="'+w.img+'" loading="lazy">':'')
+'<h4>'+esc(w.ic)+' '+esc(w.ru||w.n)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(w.n)+'</div><div class="t">'+esc(w.t)+'</div>'
+'<div class="s">'+stats+'</div>'
+'<div class="d">'+esc(w.d)+'</div></div>'}).join('');
document.querySelectorAll('#wGr .ow-c').forEach(el=>{el.addEventListener('click',()=>pW(el.dataset.wid))});
}

const MAX_TRAINERS=3;
let selectedTrainers=[];

function getSkillTrainer(skillId){
for(const k in SDD){
if(SDD[k].sk.find(s=>s.id===skillId))return k;
}
return null;
}

function updateTrainerLock(){
// Определяем выбранные профессии по навыкам в пуле и на панели
const trainers=new Set();
S.pool.forEach(x=>{const t=getSkillTrainer(x.id);if(t)trainers.add(t)});
Object.keys(S.sl).forEach(k=>{if(S.sl[k]){const t=getSkillTrainer(S.sl[k].id);if(t)trainers.add(t)}});
selectedTrainers=[...trainers];
// Блокируем/разблокируем в UI
document.querySelectorAll('#sCt .ow-tree').forEach(tree=>{
const h4=tree.querySelector('h4');
const trainerName=h4.textContent;
const key=Object.keys(SDD).find(k=>SDD[k].ru===trainerName||SDD[k].name===trainerName);
if(!key)return;
const isLocked=selectedTrainers.length>=MAX_TRAINERS&&!selectedTrainers.includes(key);
tree.style.opacity=isLocked?'0.4':'1';
tree.style.pointerEvents=isLocked?'none':'auto';
if(isLocked){h4.innerHTML=(SDD[key].ru||SDD[key].name)+' <span style="color:#c0392b;font-size:.7em">🔒 Макс. 3 профессии</span>'}
else{h4.textContent=SDD[key].ru||SDD[key].name}
});
}

function rS(){
const tr=document.getElementById('sTr').value;
const ks=tr==='all'?Object.keys(SDD):[tr];
let html='';
ks.forEach(k=>{
const t=SDD[k];
html+='<div class="ow-tree"><h4>'+esc(t.ru||t.name)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(t.name)+'</div><div class="tr">'+esc(t.tr)+'</div>';
const t1=t.sk.filter(s=>s.t===1);
const t2=t.sk.filter(s=>s.t===2);
const t3=t.sk.filter(s=>s.t===3);
if(t1.length)html+='<div style="color:#8b7355;font-size:.7em;margin-bottom:4px">TIER 1</div>'+t1.map(s=>skillHTML(s)).join('');
if(t2.length)html+='<div style="color:#8b7355;font-size:.7em;margin:8px 0 4px">TIER 2 (Breakthrough)</div>'+t2.map(s=>skillHTML(s)).join('');
if(t3.length){
html+='<div style="color:#9b59b6;font-size:.7em;margin:8px 0 4px">TIER 3 (выбрать ОДИН из пары)</div>';
const paired=t3.filter(s=>s.pair);
const unpaired=t3.filter(s=>!s.pair);
const pairs={};
paired.forEach(s=>{if(!pairs[s.pair])pairs[s.pair]=[];pairs[s.pair].push(s)});
Object.values(pairs).forEach(pair=>{
html+='<div class="ow-pair"><div class="ow-pair-title">Выбрать один:</div>'+pair.map(s=>skillHTML(s)).join('')+'</div>';
});
if(unpaired.length)html+=unpaired.map(s=>skillHTML(s)).join('');
}
html+='</div>';
});
document.getElementById('sCt').innerHTML=html;
document.querySelectorAll('#sCt .ow-sk').forEach(el=>{el.addEventListener('click',()=>pS(el.dataset.sid))});
const cnt=S.pool.length;
document.getElementById('sCn').textContent=cnt;
updateTrainerLock();
}

function skillHTML(s){
const inSlot=Object.keys(S.sl).some(key=>S.sl[key]&&S.sl[key].id===s.id);
const isLocked=s.pair&&S.skillPairs[s.pair]&&S.skillPairs[s.pair]!==s.id;
let badge='';
if(s.active)badge='<span style="background:#e74c3c;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">АКТИВ</span>';
else if(s.passive)badge='<span style="background:#27ae60;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">ПАССИВ</span>';
return '<div class="ow-sk'+(inSlot?' sel':'')+(isLocked?' locked':'')+'" data-sid="'+s.id+'">'
+'<div class="ic">'+(s.img?'<img src="'+s.img+'" style="width:24px;height:24px;object-fit:contain" onerror="this.style.display=\'none\';this.parentNode.textContent=\''+esc(s.i||'•')+'\'">':esc(s.i||'•'))+'</div>'
+'<div class="in"><div class="nm">'+badge+esc(s.ru||s.n)+'</div><div style="color:#8b7355;font-size:.65em">'+esc(s.n)+'</div><div class="ds">'+esc(s.d)+'</div></div>'
+'<span class="tb t'+s.t+'">T'+s.t+'</span><span class="cs">'+esc(s.c)+'</span></div>';
}

function pS(id){
const s=fS(id);
const trainer=getSkillTrainer(id);
// Проверка лимита профессий
if(trainer&&!selectedTrainers.includes(trainer)&&selectedTrainers.length>=MAX_TRAINERS){
alert('Максимум 3 профессии! Сначала уберите навыки из одной из выбранных.');
return;
}
if(s.pair){
if(S.skillPairs[s.pair]===id){
S.skillPairs[s.pair]=null;
S.pool=S.pool.filter(x=>x.id!==id);
rS();rPool();return;
}
if(S.skillPairs[s.pair]&&S.skillPairs[s.pair]!==id){alert('Можно выбрать только один из пары!');return}
S.skillPairs[s.pair]=id;
S.pool.push({id:s.id,n:s.n,ru:s.ru,ic:s.i||'✨',d:s.d,src:'skill'});
rS();rPool();return;
}
// Уже в пуле?
if(S.pool.find(x=>x.id===id)){S.pool=S.pool.filter(x=>x.id!==id);rS();rPool();return}
S.pool.push({id:s.id,n:s.n,ru:s.ru,ic:s.i||'✨',d:s.d,src:'skill'});
rS();rPool();
}

function rC(){
document.getElementById('cGr').innerHTML=CSD.map(c=>{
const ins=Object.keys(S.sl).some(k=>S.sl[k]&&S.sl[k].id===c.id);
return '<div class="ow-cc'+(ins?' sel':'')+'" data-cid="'+c.id+'">'
+'<div class="ic">'+esc(c.ic)+'</div><h5>'+esc(c.ru||c.n)+'</h5><p>'+esc(c.d)+'</p></div>'}).join('');
document.querySelectorAll('#cGr .ow-cc').forEach(el=>{el.addEventListener('click',()=>pC(el.dataset.cid))});
}

function pC(id){
const c=fC(id);
if(S.pool.find(x=>x.id===id)){S.pool=S.pool.filter(x=>x.id!==id);rC();rPool();return}
S.pool.push({id:c.id,n:c.n,ru:c.ru,ic:c.ic,d:c.d,src:'cons'});
rC();rPool();
}

function rBT(){
document.getElementById('btGr').innerHTML=BTDD.map(b=>
'<div class="ow-c'+(S.bt.indexOf(b.id)>-1?' sel':'')+'" data-btid="'+b.id+'">'
+'<h4>'+esc(b.ru||b.n)+' <span style="color:'+(b.r==='S'?'#e74c3c':b.r==='A'?'#f39c12':'#95a5a6')+';font-size:.75em">['+b.r+']</span></h4>'
+'<div style="color:#8b7355;font-size:.7em">'+esc(b.n)+'</div>'
+'<div class="t">'+esc(b.tr)+'</div><div class="d">'+esc(b.d)+'</div></div>').join('');
document.querySelectorAll('#btGr .ow-c').forEach(el=>{el.addEventListener('click',()=>pBT(el.dataset.btid))});
document.getElementById('btCn').textContent=S.bt.length;
document.getElementById('btW').style.display=S.bt.length>=3?'block':'none';
}

function pBT(id){const i=S.bt.indexOf(id);if(i>-1){S.bt.splice(i,1)}else{if(S.bt.length>=3){alert('Только 3 прорыва!');return}S.bt.push(id)}rBT();uStats()}

// ============ ФРАКЦИИ С ЛОГИКОЙ КОНФЛИКТОВ ============
function rF(){
document.getElementById('facGr').innerHTML=FCDD.map(f=>{
const isSelected=S.fc.indexOf(f.id)>-1;
const isCompatible=checkFactionCompatible(f.id);
return '<div class="ow-c'+(isSelected?' sel':'')+(isCompatible?'':' disabled')+'" data-fid="'+f.id+'">'
+(f.img?'<img class="img" src="'+f.img+'" loading="lazy" onerror="this.style.display=\'none\'">':'')
+'<h4>'+esc(f.ru||f.n)+'</h4><div style="color:#8b7355;font-size:.7em">'+esc(f.n)+'</div>'
+(f.conflicts.length===0?'<div style="color:#27ae60;font-size:.7em">✅ Совместима со всеми фракциями</div>':'')
+'<div class="t" style="color:#c9a227">'+esc(f.b)+'</div><div class="d">'+esc(f.d)+'</div></div>'}).join('');
document.querySelectorAll('#facGr .ow-c').forEach(el=>{
el.addEventListener('click',()=>{
if(el.classList.contains('disabled')){alert('Эта фракция конфликтует с уже выбранной!');return}
pF(el.dataset.fid);
});
});
}

function checkFactionCompatible(fid){
if(S.fc.length===0)return true;
const newFac=FCDD.find(f=>f.id===fid);
// Соробор совместим со всеми
if(newFac.conflicts.length===0)return true;
// Проверяем конфликты с выбранными
for(const selId of S.fc){
if(selId===fid)continue;
const selFac=FCDD.find(f=>f.id===selId);
if(newFac.conflicts.indexOf(selId)>-1)return false;
if(selFac.conflicts.indexOf(fid)>-1)return false;
}
return true;
}

function pF(id){
const idx=S.fc.indexOf(id);
if(idx>-1){
// Снимаем фракцию и её квесты
S.fc.splice(idx,1);
const fac=FCDD.find(f=>f.id===id);
S.qb=S.qb.filter(qid=>{
const q=QBDD.find(x=>x.id===qid);
return !q.fac||q.fac!==id;
});
}else{
// Проверяем совместимость
if(!checkFactionCompatible(id)){alert('Эта фракция конфликтует с уже выбранной!');return}
S.fc.push(id);
}
rF();rQ();uStats();
}

// ============ КВЕСТОВЫЕ БОНУСЫ С ЛОГИКОЙ ФРАКЦИЙ ============
function rQ(){
const allQ=QBDD.concat(ACTIVE_QBDD||[]);
const f=qF==='all'?allQ:allQ.filter(q=>q.t===qF);
document.getElementById('qLi').innerHTML=f.map(q=>{
const isSelected=S.qb.indexOf(q.id)>-1;
const isAvailable=checkQuestAvailable(q);
let badge='';
if(q.active)badge='<span style="background:#e74c3c;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">АКТИВ</span>';
else if(q.passive)badge='<span style="background:#27ae60;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">ПАССИВ</span>';
return '<div class="ow-q'+(isSelected?' sel':'')+(isAvailable?'':' disabled')+'" data-qid="'+q.id+'">'
+(q.img?'<img src="'+q.img+'" style="width:40px;height:40px;object-fit:contain;flex-shrink:0" onerror="this.style.display=\'none\'">':'<div class="cb"></div>')
+'<div class="qi"><div class="qn">'+badge+esc(q.ru||q.n)+'</div>'
+'<div style="color:#8b7355;font-size:.7em">'+esc(q.n)+'</div>'
+'<div class="qs">'+esc(q.s)+'</div><div class="qd">'+esc(q.d)+'</div></div>'
+'<span class="qt '+(q.t==='positive'?'pos':q.t==='negative'?'neg':'spc')+'">'+(q.t==='positive'?'ПОЗ':q.t==='negative'?'НЕГ':'ОСОБ')+'</span></div>'}).join('');
document.querySelectorAll('#qLi .ow-q').forEach(el=>{
el.addEventListener('click',()=>{
if(el.classList.contains('disabled')){alert('Этот квест недоступен при выбранных фракциях!');return}
pQ(el.dataset.qid);
});
});
}

function checkQuestAvailable(q){
// Если квест не привязан к фракции — доступен всегда
if(!q.fac)return true;
// Если фракция выбрана — доступен
if(S.fc.indexOf(q.fac)>-1)return true;
// Если фракция не выбрана — недоступен
return false;
}

function pQ(id){const i=S.qb.indexOf(id);if(i>-1){S.qb.splice(i,1)}else{S.qb.push(id)}rQ();uStats()}

function pW(id){
const w=fW(id);
if(S.sl.wmain&&S.sl.wmain.id===id){clS('wmain')}
else if(S.sl.woff&&S.sl.woff.id===id){clS('woff')}
else{if(!S.sl.wmain)setS('wmain',w);else if(!S.sl.woff)setS('woff',w);else setS('wmain',w)}
rW();uStats()}

// ============ СТАТИСТИКА С ПОЛНЫМ ПЕРЕЧНЕМ БОНУСОВ ============
function uStats(){
let hp=100,st=100,mp=0,pd=0,ed=0,sp=0,df=0,cr=0,hr=0;
const bonuses=[];
// Экипировка
const h=HELMETS.find(x=>S.sl.helmet&&x.id===S.sl.helmet.id);
const a=ARMORS.find(x=>S.sl.armor&&x.id===S.sl.armor.id);
const b=BOOTS.find(x=>S.sl.boots&&x.id===S.sl.boots.id);
const bp=BACKPACKS.find(x=>S.sl.backpack&&x.id===S.sl.backpack.id);
const l=LANTERNS.find(x=>S.sl.lantern&&x.id===S.sl.lantern.id);
if(h){df+=h.ph;cr+=h.co;hr+=h.he;if(h.bo&&h.bo.indexOf('Speed')>-1){sp+=10;bonuses.push(['🪖 '+(h.ru||h.n),'+10% скорость'])}bonuses.push(['🪖 '+(h.ru||h.n),'+'+h.ph+' защита'])}
if(a){df+=a.ph;cr+=a.co;hr+=a.he;bonuses.push(['🛡 '+(a.ru||a.n),'+'+a.ph+' защита'])}
if(b){df+=b.ph;cr+=b.co;hr+=b.he;bonuses.push(['🥾 '+(b.ru||b.n),'+'+b.ph+' защита'])}
if(bp){const m=bp.st.match(/\+(\d+) защита/);if(m){df+=parseInt(m[1]);bonuses.push(['🎒 '+(bp.ru||bp.n),'+'+m[1]+' защита'])}}
if(l){const m=l.st.match(/\+(\d+) защита/);if(m){df+=parseInt(m[1]);bonuses.push(['🏮 '+(l.ru||l.n),'+'+m[1]+' защита'])}}
// Прорывы
if(S.bt.indexOf('surv_res')>-1){hp+=40;bonuses.push(['💎 Живучесть Выжившего','+40 HP'])}
if(S.bt.indexOf('steadfast')>-1){st+=40;bonuses.push(['💎 Непоколебимый Аскет','+40 выносливости'])}
if(S.bt.indexOf('sb_aw')>-1){hp+=15;st+=15;mp+=15;bonuses.push(['💎 Пробуждение Заклинателя','+15 ко всем статам'])}
if(S.bt.indexOf('swift_foot')>-1){sp+=10;bonuses.push(['💎 Быстрая Нога','+10% скорость'])}
if(S.bt.indexOf('specialist_aw')>-1){hp+=10;st+=10;mp+=10;bonuses.push(['💎 Пробуждение Специалиста','+10% ко всем статам'])}
// Квесты
if(S.qb.indexOf('peace')>-1){hp+=20;st+=20;mp+=20;bonuses.push(['📜 Эликсир Миротворца','+20 ко всем статам'])}
if(S.qb.indexOf('blood_g')>-1){hp+=40;bonuses.push(['📜 Кровь Великанов','+40 HP'])}
if(S.qb.indexOf('anc_mem')>-1){mp+=25;bonuses.push(['📜 Память Предков','+25 маны'])}
if(S.qb.indexOf('alchem')>-1){pd+=15;ed+=15;bonuses.push(['📜 Алхимический Эксперимент','+15% урон'])}
if(S.qb.indexOf('logist')>-1){sp+=5;bonuses.push(['📜 Эксперт по Логистике','+5% скорость, -10% кулдауны'])}
if(S.qb.indexOf('accept')>-1){cr+=8;hr+=8;bonuses.push(['📜 Принятие','+8 холод/жара'])}
if(S.qb.indexOf('sanct')>-1){df+=2;bonuses.push(['📜 Священная Защита','+2 защита'])}
if(S.qb.indexOf('painful')>-1){st-=15;bonuses.push(['📜 Болезненная Жертва','-15 выносливости'])}
if(S.qb.indexOf('sacrifice')>-1){st-=7;bonuses.push(['📜 Жертва','-7 выносливости'])}
// Выбранные навыки
S.pool.forEach(x=>{
if(x.src==='skill'){
const s=fS(x.id);
if(s){
const type=s.active?'🔴 АКТИВ':'🟢 ПАССИВ';
bonuses.push(['✨ '+(s.ru||s.n)+' ('+type+')',s.d.substring(0,50)+(s.d.length>50?'...':'')]);
}
}
});
// Активные бонусы
if(S.qb.indexOf('exalted')>-1){pd+=25;ed+=25;bonuses.push(['🔴 Возвышенный (АКТИВ)','x2 урон, -30% стоимость'])}
if(S.qb.indexOf('defensive_stance')>-1){df+=5;bonuses.push(['🔴 Оборонительная Стойка (АКТИВ)','+20% защиты при блоке'])}
if(S.qb.indexOf('aggressive_stance')>-1){pd+=10;df-=3;bonuses.push(['🔴 Атакующая Стойка (АКТИВ)','+15% урон, -10% защита'])}
if(S.qb.indexOf('spirit_bond')>-1){mp+=10;bonuses.push(['🔴 Духовная Связь (АКТИВ)','+5 маны/сек у тотема'])}
if(S.qb.indexOf('blood_pact')>-1){pd+=8;bonuses.push(['🔴 Кровавый Пакт (АКТИВ)','+10% урон, -5 HP/мин'])}
// Фракции
if(S.fc.indexOf('levant')>-1){pd+=15;ed+=15;bonuses.push(['🏰 Левант','+15% урон'])}
if(S.fc.indexOf('blue')>-1){hp+=40;mp+=25;bonuses.push(['🏰 Синяя Палата','+40 HP, +25 маны'])}
if(S.fc.indexOf('holy')>-1){bonuses.push(['🏰 Святая Миссия','Защита и экономия'])}
if(S.fc.indexOf('sorobor')>-1){bonuses.push(['🏰 Соробор','Кулдауны и экономика'])}
document.getElementById('sHP').textContent=hp;
document.getElementById('sST').textContent=st;
document.getElementById('sMP').textContent=mp;
document.getElementById('sPD').textContent=pd+'%';
document.getElementById('sED').textContent=ed+'%';
document.getElementById('sSP').textContent=sp+'%';
document.getElementById('sDEF').textContent=df;
document.getElementById('sCR').textContent=cr;
document.getElementById('sHR').textContent=hr;
// Полный перечень бонусов
let bonusHtml='<div style="margin-top:12px;padding-top:10px;border-top:2px solid #3d3d40"><h3 style="color:#c9a227;font-size:.85em;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">🎁 Все бонусы</h3>';
if(bonuses.length===0){bonusHtml+='<div style="color:#8b7355;font-size:.85em"><i>Нет активных бонусов</i></div>'}
else{bonuses.forEach(b=>{bonusHtml+='<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.85em"><span style="color:#8b7355">'+esc(b[0])+'</span><span style="color:#c9a227;font-weight:bold">'+esc(b[1])+'</span></div>'})}
bonusHtml+='</div>';
document.getElementById('allBonuses').innerHTML=bonusHtml;
// Сводка
let sum='';
if(S.sl.helmet)sum+='<div>🪖 '+esc(S.sl.helmet.ru||S.sl.helmet.n)+'</div>';
if(S.sl.armor)sum+='<div>🛡 '+esc(S.sl.armor.ru||S.sl.armor.n)+'</div>';
if(S.sl.boots)sum+='<div>🥾 '+esc(S.sl.boots.ru||S.sl.boots.n)+'</div>';
if(S.sl.backpack)sum+='<div>🎒 '+esc(S.sl.backpack.ru||S.sl.backpack.n)+'</div>';
if(S.sl.lantern)sum+='<div>🏮 '+esc(S.sl.lantern.ru||S.sl.lantern.n)+'</div>';
if(S.sl.wmain)sum+='<div style="color:#c9a227">⚔ '+esc(S.sl.wmain.ru||S.sl.wmain.n)+'</div>';
if(S.sl.woff)sum+='<div style="color:#c9a227">🛡 '+esc(S.sl.woff.ru||S.sl.woff.n)+'</div>';
const qCount=Object.keys(S.sl).filter(k=>k.charAt(0)==='q'&&S.sl[k]).length;
if(qCount>0)sum+='<div>✨ '+qCount+'/8 в слотах</div>';
if(S.bt.length)sum+='<div>💎 '+S.bt.length+'/3 прорыва</div>';
if(S.fc.length>0)sum+='<div>🏰 '+S.fc.map(id=>FCDD.find(f=>f.id===id).ru||FCDD.find(f=>f.id===id).n).join(', ')+'</div>';
if(S.qb.length)sum+='<div>📜 '+S.qb.length+' квест. бонусов</div>';
document.getElementById('sSum').innerHTML=sum||'<i>Ничего не выбрано</i>'}

function copyB(){
let t='OUTWARD BUILD\n================\n';
t+='HP:'+document.getElementById('sHP').textContent+' ST:'+document.getElementById('sST').textContent+' MP:'+document.getElementById('sMP').textContent+'\n';
if(S.sl.helmet)t+='Helmet: '+(S.sl.helmet.ru||S.sl.helmet.n)+'\n';
if(S.sl.armor)t+='Armor: '+(S.sl.armor.ru||S.sl.armor.n)+'\n';
if(S.sl.boots)t+='Boots: '+(S.sl.boots.ru||S.sl.boots.n)+'\n';
if(S.sl.backpack)t+='Backpack: '+(S.sl.backpack.ru||S.sl.backpack.n)+'\n';
if(S.sl.lantern)t+='Lantern: '+(S.sl.lantern.ru||S.sl.lantern.n)+'\n';
if(S.sl.wmain)t+='Main: '+(S.sl.wmain.ru||S.sl.wmain.n)+'\n';
if(S.sl.woff)t+='Off: '+(S.sl.woff.ru||S.sl.woff.n)+'\n';
for(let i=1;i<=8;i++){if(S.sl['q'+i])t+='Slot'+i+': '+(S.sl['q'+i].ru||S.sl['q'+i].n)+'\n'}
if(S.bt.length)t+='Breakthroughs: '+S.bt.map(id=>{const b=BTDD.find(x=>x.id===id);return b?(b.ru||b.n):null}).filter(Boolean).join(', ')+'\n';
if(S.fc.length)t+='Factions: '+S.fc.map(id=>{const f=FCDD.find(x=>x.id===id);return f?(f.ru||f.n):null}).filter(Boolean).join(', ')+'\n';
if(S.qb.length)t+='Quest: '+S.qb.map(id=>{const q=QBDD.find(x=>x.id===id);return q?(q.ru||q.n):null}).filter(Boolean).join(', ')+'\n';
navigator.clipboard.writeText(t).then(()=>alert('Скопировано!'))}

function resetB(){
S={sl:{q1:null,q2:null,q3:null,q4:null,q5:null,q6:null,q7:null,q8:null,wmain:null,woff:null,helmet:null,armor:null,boots:null,backpack:null,lantern:null},pool:[],bt:[],fc:[],qb:[],skillPairs:{}};
for(const k in S.sl)uSUI(k);

rArmor();rArmor();rW();rS();rC();rBT();rF();rQ();uQB();uStats()}

function randB(){
resetB();
const h=HELMETS[Math.floor(Math.random()*HELMETS.length)];
const a=ARMORS[Math.floor(Math.random()*ARMORS.length)];
const b=BOOTS[Math.floor(Math.random()*BOOTS.length)];
const bp=BACKPACKS[Math.floor(Math.random()*BACKPACKS.length)];
const l=LANTERNS[Math.floor(Math.random()*LANTERNS.length)];
setS('helmet',{id:h.id,n:h.n,ru:h.ru,ic:'🪖',d:h.d});
setS('armor',{id:a.id,n:a.n,ru:a.ru,ic:'🛡',d:a.d});
setS('boots',{id:b.id,n:b.n,ru:b.ru,ic:'🥾',d:b.d});
setS('backpack',{id:bp.id,n:bp.n,ru:bp.ru,ic:'🎒',d:bp.st});
setS('lantern',{id:l.id,n:l.n,ru:l.ru,ic:'🏮',d:l.st});
const cats=Object.keys(WD);const c1=cats[Math.floor(Math.random()*cats.length)];
S.sl.wmain=fW(WD[c1][Math.floor(Math.random()*WD[c1].length)].id);
if(Math.random()>0.4){const c2=cats[Math.floor(Math.random()*cats.length)];S.sl.woff=fW(WD[c2][Math.floor(Math.random()*WD[c2].length)].id)}
const allSkills=[];Object.values(SDD).forEach(t=>t.sk.forEach(s=>allSkills.push(s)));
const shuffled=allSkills.sort(()=>0.5-Math.random());
for(const s of shuffled){
if(S.pool.length>=8)break;
if(s.pair){if(S.skillPairs[s.pair])continue;S.skillPairs[s.pair]=s.id}
S.pool.push({id:s.id,n:s.n,ru:s.ru,ic:s.i||'✨',d:s.d,src:'skill'});
}
// Размещаем на панели
for(let i=0;i<Math.min(S.pool.length,8);i++){
S.sl['q'+(i+1)]=S.pool[i];
}
S.pool=S.pool.slice(8);
S.bt=BTDD.map(b=>b.id).sort(()=>0.5-Math.random()).slice(0,3);
// Случайные совместимые фракции
const facs=[...FCDD].sort(()=>0.5-Math.random());
for(const f of facs){if(checkFactionCompatible(f.id)){S.fc.push(f.id);if(S.fc.length>=2)break}}
S.qb=QBDD.filter(q=>q.t==='positive'&&checkQuestAvailable(q)).map(q=>q.id).sort(()=>0.5-Math.random()).slice(0,3);
for(const k in S.sl)uSUI(k);
rArmor();rW();rS();rC();rBT();rF();rQ();uQB();uStats()}

document.querySelectorAll('.ow-tab').forEach(btn=>{
btn.addEventListener('click',()=>{
document.querySelectorAll('.ow-panel').forEach(p=>p.classList.remove('on'));
document.querySelectorAll('.ow-tab').forEach(t=>t.classList.remove('on'));
document.getElementById('pan-'+btn.dataset.pan).classList.add('on');
btn.classList.add('on');
window.scrollTo({top:0,behavior:'smooth'});
});
});



document.querySelectorAll('.ow-slot').forEach(el=>{
el.addEventListener('click',()=>{
const slot=el.dataset.slot;
if(slot==='wmain'||slot==='woff'){
// Для оружия — открываем вкладку оружия
document.querySelector('[data-pan=weapons]').click();
}else if(['helmet','armor','boots','backpack','lantern'].indexOf(slot)>-1){
// Для экипировки — открываем вкладку брони
document.querySelector('[data-pan=armor]').click();
}else{
// Для слотов q1-q8 — очищаем
clS(slot);
}
});
});

document.getElementById('wCat').addEventListener('change',rW);
document.getElementById('sTr').addEventListener('change',rS);

document.querySelectorAll('#wFilters .ow-fb').forEach(btn=>{
btn.addEventListener('click',()=>{
wF=btn.dataset.f;
document.querySelectorAll('#wFilters .ow-fb').forEach(b=>b.classList.remove('on'));
btn.classList.add('on');
rW();
});
});

document.querySelectorAll('#qFilters .ow-fb').forEach(btn=>{
btn.addEventListener('click',()=>{
qF=btn.dataset.f;
document.querySelectorAll('#qFilters .ow-fb').forEach(b=>b.classList.remove('on'));
btn.classList.add('on');
rQ();
});
});

document.getElementById('btnCopy').addEventListener('click',copyB);
document.getElementById('btnReset').addEventListener('click',resetB);
document.getElementById('btnRand').addEventListener('click',randB);

rArmor();rW();rS();rC();rBT();rF();rQ();rPool();uQB();uStats();