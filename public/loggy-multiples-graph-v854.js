/* Multiples template and numbered-day Graph, shared with normal custom tab/KB runtimes. */
(()=>{'use strict';if(window.__loggyMultiplesGraphV854)return;window.__loggyMultiplesGraphV854=true;
const uid=p=>{try{return customId(p)}catch{return `${p}-${Math.random().toString(36).slice(2)}-${Date.now()}`}};
const data=()=>typeof db!=='undefined'?db:window.db;
const tabs=()=>typeof getCustomTabs==='function'?getCustomTabs():[];
const component=(type,title)=>{let c;try{c=defaultCustomComponent(type)}catch{};c=c&&typeof c==='object'?JSON.parse(JSON.stringify(c)):{type};c.id=uid('component');c.type=type;c.title=title;return c};
const skills=[{"title":"Calisthenics","icon":"ph-barbell","nodes":["Basics","Push-ups","Core Control","Pull-ups","Balance","Handstand"],"sections":[{"title":"Warm-up awareness","items":["Joint mobility","Gentle warm-up"]},{"title":"Support positions","items":["Straight-arm support","Stable wrist position"]},{"title":"Push-up foundations","items":["Push-up alignment","Incline push-up"]},{"title":"Pushing control","items":["Controlled lowering","Push-up range of motion"]},{"title":"Core basics","items":["Core bracing","Neutral spine"]},{"title":"Hollow body","items":["Hollow hold position","Bent-knee hollow hold"]},{"title":"Hanging basics","items":["Dead hang","Active hang"]},{"title":"Pulling foundations","items":["Shoulder blade engagement","Assisted pulling"]},{"title":"Balance basics","items":["Base of support","Weight shifting"]},{"title":"Shoulder stability","items":["Shoulder stacking","Wall-supported balance"]},{"title":"Handstand readiness","items":["Wrist preparation","Inverted alignment"]},{"title":"Handstand practice","items":["Wall-supported handstand","Controlled exit"]}]},{"title":"Skateboarding","icon":"ph-skateboard","nodes":["Stance","Pushing","Turning","Stopping","Board Control","Ollie"],"sections":[{"title":"Equipment awareness","items":["Helmet fit","Skateboard deck"]},{"title":"Riding position","items":["Regular stance","Goofy stance"]},{"title":"Pushing basics","items":["Pushing foot","Standing foot"]},{"title":"Rolling control","items":["Coasting position","Smooth rolling"]},{"title":"Turning foundations","items":["Leaning to turn","Carving"]},{"title":"Board direction","items":["Kickturn terminology","Turning radius"]},{"title":"Stopping awareness","items":["Foot braking concept","Speed awareness"]},{"title":"Safe riding habits","items":["Clear riding area","Surface inspection"]},{"title":"Board balance","items":["Centered weight","Stable foot placement"]},{"title":"Control foundations","items":["Gentle weight shift","Board response"]},{"title":"Ollie concepts","items":["Pop and slide terminology","Ollie sequence overview"]},{"title":"Foundational review","items":["Stance review","Board control review"]}]},{"title":"Swimming","icon":"ph-waves","nodes":["Water Comfort","Floating","Breathing","Kicking","Freestyle","Endurance"],"sections":[{"title":"Water awareness","items":["Pool safety rules","Swimming supervision"]},{"title":"Buoyancy concepts","items":["Floating principle","Body position in water"]},{"title":"Floating fundamentals","items":["Front float concept","Back float concept"]},{"title":"Balance in water","items":["Horizontal body position","Relaxed floating posture"]},{"title":"Breathing awareness","items":["Breathing coordination","Air exchange"]},{"title":"Rhythm concepts","items":["Breathing timing","Breathing rhythm"]},{"title":"Kick fundamentals","items":["Flutter kick concept","Leg movement coordination"]},{"title":"Streamline position","items":["Streamline alignment","Body extension"]},{"title":"Front crawl basics","items":["Alternating arms","Front crawl terminology"]},{"title":"Stroke rhythm","items":["Arm and kick coordination","Stroke timing"]},{"title":"Sustained swimming","items":["Pacing concept","Rest intervals"]},{"title":"Progress awareness","items":["Technique consistency","Swimming goals"]}]},{"title":"Gymnastics","icon":"ph-person-simple-run","nodes":["Foundations","Mobility","Balance","Core Control","Floor Basics","Sequences"],"sections":[{"title":"Body position basics","items":["Straight body shape","Tuck body shape"]},{"title":"Safe practice foundations","items":["Soft landing surface","Qualified supervision"]},{"title":"Mobility awareness","items":["Shoulder mobility","Hip mobility"]},{"title":"Warm-up planning","items":["Gentle warm-up","Movement preparation"]},{"title":"Balance fundamentals","items":["Stable base","Center of mass"]},{"title":"Balance positions","items":["One-leg balance","Low beam awareness"]},{"title":"Core positions","items":["Hollow shape","Arch shape"]},{"title":"Body control","items":["Controlled transitions","Stable posture"]},{"title":"Floor foundations","items":["Forward roll terminology","Mat safety"]},{"title":"Movement sequences","items":["Beginning position","Ending position"]},{"title":"Sequence planning","items":["Movement order","Skill transitions"]},{"title":"Practice reflection","items":["Progress notes","Technique feedback"]}]}];
const skillSlug=name=>String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-');
const subsectionTag=(skill,index,sub)=>`multiples-${skillSlug(skill.title)}-${index+1}-${sub+1}`;
const demoKeys=new Set();
function seedSkillExamplesV856(store,skill){
  store.phrases||=[];store.phrase_meta||={};store.settings||={};
  store.settings.categories||=[];store.settings.categorySettings||={};
  if(!store.settings.categories.includes(skill.title))store.settings.categories.push(skill.title);
  store.settings.categorySettings[skill.title]||={fields:[{id:uid('kb-field'),name:'Description',kind:'text',options:[]}]};
  const result=[];
  for(let i=0;i<skill.nodes.length;i++){
    const subs=[];
    for(let j=0;j<2;j++){
      const cfg=skill.sections[i*2+j],label=`${i+1}.${j+1}`,tag=subsectionTag(skill,i,j);
      const keys=[];
      for(const name of cfg.items){
        let key=`${skill.title}: ${name}`;
        // Never modify or auto-log a user's own KB item with a matching name.
        if(store.phrases.includes(key)&&!store.phrase_meta[key]?.multiplesStarterV854)
          key=`${skill.title}: ${name} (Multiples example)`;
        keys.push(key);
        const meta=store.phrase_meta[key];
        if(!store.phrases.includes(key)){
          store.phrases.push(key);
          store.phrase_meta[key]={type:skill.title,tags:[skillSlug(skill.title),tag],custom_fields:{Description:`A learning reference for ${name.toLowerCase()} within ${cfg.title.toLowerCase()}.`},parts:[],multiplesStarterV854:true,multiplesExampleV856:true};
        }else if(meta?.multiplesStarterV854){
          meta.tags=[...new Set([...(meta.tags||[]),skillSlug(skill.title),tag])];
        }
      }
      // First subsection is 2/2; second is 1/2, on each skill's first node.
      if(i===0){if(j===0)keys.forEach(key=>demoKeys.add(key));else demoKeys.add(keys[0]);}
      subs.push({id:uid('road-sub'),label,title:cfg.title,rawTitle:`${label} ${cfg.title}`,description:`Learn the ${cfg.title.toLowerCase()} concepts and record what you learn in a Day Log.`,kbTagV753:tag,kbTagsV753:[tag],done:false,manualItemKeysV785:[],autoCompleteRuleV788:{mode:'distinct',tags:[tag],target:2},multiplesExampleV856:true});
    }
    result.push(subs);
  }
  return result;
}
function createExampleDayV856(store){
  if(!demoKeys.size)return;
  store.days||={};
  if(Object.values(store.days).some(day=>day?.multiplesExampleV856))return;
  const all=Object.keys(store.days).map(Number).filter(x=>Number.isInteger(x)&&x>0);
  let dayNumber=1;
  const isBlank=d=>!d||(!String(d.notes||'').trim()&&!(d.phrases||[]).length&&!(d.tools||[]).length&&!String(d.video||'').trim()&&!String(d.video2||'').trim());
  if(all.length&& !isBlank(store.days[1]))dayNumber=Math.max(...all)+1;
  const previous=store.days[dayNumber]||{};
  // These are intentionally labeled demonstration entries, not claimed user progress.
  store.days[dayNumber]={...previous,notes:'Multiples example learning activity: these starter Items Learned demonstrate how roadmap rules count 2/2 and 1/2. Replace or remove the examples when creating your own plan.',phrases:[...demoKeys],tools:[],video:'',checkedParts:previous.checkedParts||{},multiplesExampleV856:true};
}
function populateMultiplesV856(root,{existing=false}={}){
  if(!root||root.templateIdV53!=='learning-roadmap-2-v813')return false;
  const store=data();if(!store)return false;
  let changed=false;
  const children=tabs().filter(t=>t.nestedParentV753?.tabId===root.id&&t.multiplesSkillV854);
  if(!children.length)return false;
  demoKeys.clear();
  for(const skill of skills){
    const page=children.find(t=>t.name===skill.title);
    if(!page)continue;
    const roadmap=(page.components||[]).find(c=>c.type==='skillRoadmapV749'&&c.multiplesStarterV854);
    if(!roadmap||!Array.isArray(roadmap.nodes))continue;
    // Only replace empty subsections on starter nodes; keep any user edits.
    if(roadmap.multiplesExamplesV856)continue;
    const examples=seedSkillExamplesV856(store,skill);
    roadmap.nodes.forEach((node,i)=>{
      if(i<examples.length && String(node.title||'')===skill.nodes[i] && (!Array.isArray(node.subsections)||!node.subsections.length)){
        node.subsections=examples[i];changed=true;
      }
    });
    roadmap.autoCompleteSubsectionsV749=true;
    roadmap.sequentialV749=false;
    roadmap.sectionContentModeV785='tagged';
    roadmap.multiplesExamplesV856=true;
    changed=true;
  }
  if(changed){createExampleDayV856(store);root.multiplesExamplesV856=true;}
  return changed;
}
function createMultiples(tab){
  if(!tab||tab.templateIdV53!=='learning-roadmap-2-v813')return;
  if(tab.multiplesReadyV854){if(populateMultiplesV856(tab))try{saveDb()}catch{};return;}
  tab.name=tab.name==='Learning Roadmap 2.0'?'Multiples':tab.name;
  tab.multiplesReadyV854=true;tab.templateResettableV854=true;
  const intro=component('text','How to use Multiples');intro.text='A single Log can cover several related skills. For example, a Fitness Log might include calisthenics, skateboarding, swimming, and gymnastics. Open each page to follow that skill’s roadmap and view matching items from the Log’s real Knowledge Base. Log everything you learn in your usual Day Logs; there is no second Knowledge Base.';intro.multiplesStarterV854=true;
  const navigator=component('pageNavigatorV753','Skills');navigator.pagesV753=[];navigator.multiplesStarterV854=true;tab.components=[intro,navigator];
  for(const skill of skills){
    const filter=component('kbDynamicCollectionV162',`${skill.title} Knowledge`);Object.assign(filter,{categories:[skill.title],tags:[],display:'cards',learnedState:'any',partsState:'any',multiplesStarterV854:true});
    const roadmap=component('skillRoadmapV749',`${skill.title} Roadmap`);Object.assign(roadmap,{structureModeV753:'linear',roadmapKbSourceModeV750:'global',roadmapKbSourceComponentIdV750:'',sectionContentModeV785:'tagged',autoCompleteSubsectionsV749:true,sequentialV749:false,nodes:skill.nodes.map((label,i)=>({id:uid('road-node'),label:String(i+1),title:label,kbTag:skillSlug(skill.title),kbTagsV752:[skillSlug(skill.title)],description:'',subsections:[],linkedDays:[],completed:false,completedAt:'',autoCompleteRuleV788:{mode:'manual',tags:[],target:1}})),multiplesStarterV854:true});
    const pageId=uid('tab');tabs().push({id:pageId,name:skill.title,icon:skill.icon,components:[roadmap,filter],pageWidthV724:'wide',nestedParentV753:{tabId:tab.id,componentId:navigator.id},multiplesSkillV854:true,templateResettableV854:true});navigator.pagesV753.push({id:uid('page'),tabId:pageId,title:skill.title,icon:skill.icon});
  }
  populateMultiplesV856(tab);
  try{saveDb()}catch{}
}
window.__loggyExpandMultiplesV854=createMultiples;
window.__loggyUpgradeMultiplesExamplesV856=()=>{
  let changed=false;
  for(const tab of tabs())if(tab?.templateIdV53==='learning-roadmap-2-v813'&&tab.multiplesReadyV854&&!tab.multiplesExamplesV856){
    if(populateMultiplesV856(tab))changed=true;
  }
  if(changed)try{saveDb()}catch{}
  return changed;
};
// Modal right-click Reset removes only starter settings, not actual saved knowledge or user-created components.
function reset(tab){if(!tab)return;const resetComp=c=>{if(!c)return;if(c.type==='kbDynamicCollectionV162'){c.categories=[];c.tags=[];c.learnedState='any';c.partsState='any';c.placeholderType='';c.metadataJson=''}if(c.type==='skillRoadmapV749'){c.nodes=[];c.rewardsV749=[];c.roadmapKbSourceModeV750='global'}if(c.type==='text'&&c.multiplesStarterV854)c.text='';if(c.type==='checklist'&&c.multiplesStarterV854)c.items=[];if(c.type==='cards'&&c.multiplesStarterV854)c.items=[];if(c.type==='kanbanV239')for(const column of c.columns||[])column.cards=[];if(c.type==='progressMeter'){c.value=0;c.target=0}};
 for(const c of tab.components||[])resetComp(c);
 const children=tabs().filter(x=>x.nestedParentV753?.tabId===tab.id);for(const child of children){for(const c of child.components||[])resetComp(c)}
 try{saveDb();renderCustomTabView(tab.id)}catch{} }
async function resetTemplateDefaultsV855(tabId){
 const found=tabs().find(t=>String(t.id)===String(tabId));
 const root=found?.nestedParentV753?tabs().find(t=>t.id===found.nestedParentV753.tabId):found;
 if(!root?.templateIdV53||['whiteboard-v197','notepad-v249'].includes(root.templateIdV53))return;
 const message='Clear the starter labels, roadmap nodes, completion rules and KB filters from this template and its pages? This will not delete items in the real Knowledge Base or Day Logs. Your edits to those template components will also be reset.';
 const ok=typeof showAppConfirm==='function'?await showAppConfirm({title:'Reset template defaults?',message,confirmLabel:'Reset'}):window.confirm(message);
 if(!ok)return;
 reset(root);
 try{renderCustomTabView?.(found.id)}catch{}
}
window.__loggyResetTemplateDefaultsV855=resetTemplateDefaultsV855;

function enhanceKb(){document.addEventListener('click',e=>{const card=e.target.closest?.('.dynamic-kb-card-v162');if(!card)return;const id=card.dataset.knowledgeItem;if(!id)return;e.stopImmediatePropagation();try{openItemModal(id,true)}catch{}},true);
 document.addEventListener('contextmenu',e=>{const card=e.target.closest?.('.dynamic-kb-card-v162');if(!card)return;const id=card.dataset.knowledgeItem;if(!id)return;e.preventDefault();e.stopImmediatePropagation();document.getElementById('multiples-kb-menu-v854')?.remove();const menu=document.createElement('div');menu.id='multiples-kb-menu-v854';menu.style.cssText='position:fixed;z-index:2147483600;background:var(--white,#fff);color:var(--black,#111);border:1px solid currentColor;padding:7px;border-radius:9px;display:grid;gap:5px';for(const [label,fn] of [['Edit item',()=>{try{openItemModal(id,false)}catch{}}],['Delete item',async()=>{const ok=typeof showAppConfirm==='function'?await showAppConfirm({title:'Delete KB item?',message:'Remove this item from the real Knowledge Base?',confirmLabel:'Delete'}):confirm('Delete this item?');if(!ok)return;const d=data();d.phrases=d.phrases.filter(x=>x!==id);delete d.phrase_meta[id];try{saveDb();renderCustomTabView(activeCustomTabId)}catch{}}]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='padding:8px 14px;border:none;background:transparent;color:inherit;text-align:left;cursor:pointer';b.onclick=()=>{menu.remove();fn()};menu.appendChild(b)}menu.style.left=Math.min(e.clientX,innerWidth-165)+'px';menu.style.top=Math.min(e.clientY,innerHeight-90)+'px';document.body.appendChild(menu);document.addEventListener('pointerdown',evt=>{if(!menu.contains(evt.target))menu.remove()},{once:true,capture:true});},true)}
// Layout selector + small undirected day graph; deterministic scattered placement, fit-to-view.
function buildGraph(){const d=data();if(!d||String(d.settings?.dailyDayLayoutV228)!=='graph'||String(d.settings?.dailyViewType||'default')!=='default')return;const grid=document.getElementById('days-grid');if(!grid)return;const buttons=[...grid.querySelectorAll('[data-day]')].map(el=>({day:Number(el.dataset.day),open:el.querySelector('.day-box')||el})).filter(x=>x.day>0);if(!buttons.length)return;const N=buttons.length;const links=[];for(const item of buttons){const note=String(d.days?.[item.day]?.notes||'');const pattern=/(?:@\s*Day\s*#?\s*|data-day\s*=\s*["'])(\d+)/gi;let m;while((m=pattern.exec(note))){const target=Number(m[1]);if(target!==item.day&&buttons.some(x=>x.day===target))links.push([item.day,target])}}
 const w=grid.clientWidth||840,h=Math.max(360,Math.min(780,innerHeight*.67));const cols=Math.ceil(Math.sqrt(N*w/h)),rows=Math.ceil(N/cols);const radius=Math.max(9,Math.min(22,(w/cols)*.23,(h/rows)*.23));const pts=new Map();buttons.forEach((entry,i)=>{const col=i%cols,row=Math.floor(i/cols);const seed=(n)=>{const x=Math.sin(n*127.1+8.3)*43758.5453;return x-Math.floor(x)};pts.set(entry.day,{x:(col+.27+seed(i+1)*.46)*w/cols,y:(row+.27+seed(i+43)*.46)*h/rows})});
 grid.className='daily-graph-layout-v854';grid.innerHTML='';grid.style.height=h+'px';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');svg.classList.add('daily-graph-lines-v854');const edges=new Set();for(const [a,b] of links){edges.add([Math.min(a,b),Math.max(a,b)].join('|'))}
 // V1915: keep each row internally connected, but connect ROW STARTS vertically.
 // Example with 29 columns: 1→30→59 instead of 29→30, which avoids a long
 // diagonal connector cutting across the nodes between rows.
 for(let i=1;i<buttons.length;i++){
   const prevIndex=i-1,prevRow=Math.floor(prevIndex/cols),row=Math.floor(i/cols);
   if(row===prevRow){
     const a=buttons[prevIndex].day,b=buttons[i].day;
     edges.add([Math.min(a,b),Math.max(a,b)].join('|'));
   }
 }
 for(let row=1;row<rows;row++){
   const prevStart=(row-1)*cols,nextStart=row*cols;
   if(nextStart>=buttons.length)break;
   const a=buttons[prevStart].day,b=buttons[nextStart].day;
   edges.add([Math.min(a,b),Math.max(a,b)].join('|'));
 }
 for(const key of edges){
   const [a,b]=key.split('|').map(Number),p=pts.get(a),q=pts.get(b);if(!p||!q)continue;
   const dx=q.x-p.x,dy=q.y-p.y,dist=Math.hypot(dx,dy)||1;
   const inset=Math.max(1,radius+1);
   const x1=p.x+(dx/dist)*inset,y1=p.y+(dy/dist)*inset;
   const x2=q.x-(dx/dist)*inset,y2=q.y-(dy/dist)*inset;
   if(Math.hypot(x2-x1,y2-y1)<=1)continue;
   const line=document.createElementNS('http://www.w3.org/2000/svg','line');
   for(const [k,v] of Object.entries({x1,y1,x2,y2}))line.setAttribute(k,v);
   svg.appendChild(line)
 }grid.appendChild(svg);
 for(const item of buttons){const p=pts.get(item.day),btn=document.createElement('button');btn.type='button';btn.className='daily-graph-node-v854';btn.textContent=String(item.day);btn.title=`Day ${item.day}`;btn.style.cssText=`left:${p.x/w*100}%;top:${p.y/h*100}%;width:${radius*2}px;height:${radius*2}px;font-size:${Math.max(8,Math.min(13,radius*.68))}px`;btn.onclick=()=>openDayLog(item.day);grid.appendChild(btn)}
 const plus=document.createElement('button');plus.type='button';plus.className='daily-graph-add-v854';plus.title='Add Day';plus.textContent='+';plus.onclick=()=>openDayLog(Math.max(0,...buttons.map(x=>x.day))+1);grid.appendChild(plus);
}
window.__loggyBuildDailyGraphV854=buildGraph;
function choices(){const modal=document.getElementById('daily-logs-local-settings-modal');const picker=modal?.querySelector('.daily-day-layout-picker-v228');if(!picker||picker.querySelector('[data-daily-layout-v228="graph"]'))return;const button=document.createElement('button');button.type='button';button.className='filter-tab';button.dataset.dailyLayoutV228='graph';button.textContent='Graph';button.onclick=()=>{const d=data();d.settings.dailyDayLayoutV228='graph';try{saveDb();initGrid()}catch{};picker.querySelectorAll('[data-daily-layout-v228]').forEach(x=>x.classList.toggle('active',x===button))};picker.appendChild(button)}
const style=document.createElement('style');style.textContent=`#days-grid.daily-graph-layout-v854{position:relative!important;display:block!important;overflow:hidden!important;max-width:100%!important;width:100%!important;min-height:360px!important;padding:0!important}#days-grid .daily-graph-lines-v854{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}#days-grid .daily-graph-lines-v854 line{stroke:currentColor;stroke-opacity:.45;stroke-width:1.2;vector-effect:non-scaling-stroke}#days-grid .daily-graph-node-v854{position:absolute;transform:translate(-50%,-50%);display:grid;place-items:center;border:1px solid currentColor;border-radius:50%;background:transparent;color:inherit;padding:0;cursor:pointer;box-shadow:none;font-weight:600}#days-grid .daily-graph-node-v854:hover{outline:1px solid currentColor;outline-offset:3px}#days-grid .daily-graph-add-v854{position:absolute;right:7px;bottom:7px;width:28px;height:28px;border:1px solid currentColor;background:transparent;color:inherit;border-radius:50%;cursor:pointer}`;document.head.appendChild(style);
function boot(){enhanceKb();choices();new MutationObserver(()=>choices()).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
