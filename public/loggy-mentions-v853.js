/* Loggy @ references. Scope is the active tab and, for nested pages, its ancestor tabs.
   References are stored as raw tokens in the original form inputs; users see links. */
(()=>{
'use strict';
const REF=/@\[([^\]\n]{1,180})\]\(loggy-ref:([^:\s)]+):([^:\s)]+):([^\s)]*)\)/g;
const PICKER_ID='loggy-mention-picker-v853';
const editors=new WeakMap();
let active=null,scheduled=false;
const allTabs=()=>{try{return window.getCustomTabs?.()||[]}catch{return []}};
const byId=(all,id)=>all.find(t=>String(t.id)===String(id));
const safeDecode=x=>{try{return decodeURIComponent(x||'')}catch{return String(x||'')}};
const encode=x=>encodeURIComponent(String(x||''));
const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const token=(entry)=>`@[${entry.name.replace(/[\[\]\n]/g,'')}](loggy-ref:${[entry.tabId,entry.componentId,entry.itemId].map(encode).join(':')})`;
const refParts=(m)=>[m[2],m[3],m[4]].map(safeDecode);
function activeTab(){
 const all=allTabs();
 const views=[...document.querySelectorAll('.custom-tab-view.active[data-custom-tab-id]')];
 const view=views.filter(v=>v.offsetWidth||v.offsetHeight).at(-1)||views.at(-1);
 return byId(all,view?.dataset.customTabId);
}
function tabFor(el){
 const own=el?.closest?.('.custom-tab-view[data-custom-tab-id]');
 if(own)return byId(allTabs(),own.dataset.customTabId);
 for(let node=el?.closest?.('.modal-overlay,.modal-box,[role="dialog"]');node;node=node.parentElement?.closest?.('.modal-overlay,.modal-box,[role="dialog"]')){
  const id=node.dataset?.customTabId||node.dataset?.roadmapTabV794||node.dataset?.tabId;
  if(id){const t=byId(allTabs(),id);if(t)return t}
 }
 return activeTab();
}
function scope(origin){
 if(!origin)return[];
 const all=allTabs(),allowed=[],seen=new Set();let current=origin;
 // Ancestors, not siblings and not unrelated top-level tabs.
 while(current&&!seen.has(String(current.id))){
  seen.add(String(current.id));allowed.push(current);
  current=current.nestedParentV753?.tabId?byId(all,current.nestedParentV753.tabId):null;
 }
 return allowed;
}
const canLink=(origin,tabId)=>scope(origin).some(t=>String(t.id)===String(tabId));
function itemLabel(x,component){
 if(!x||typeof x!=='object')return'';
 for(const name of ['title','name','term','question','text','label','caption','prompt','heading','focus','word','phrase','summary','filename']){
  if(typeof x[name]==='string'&&x[name].trim())return x[name].trim();
 }
 const fields=component?.recordFieldsV340||[];
 const vals=x.valuesV340;
 if(vals&&typeof vals==='object'){
  const title=fields.find(f=>/^title$|^name$/i.test(f.name||''));
  if(title&&String(vals[title.id]||'').trim())return String(vals[title.id]).trim();
  for(const v of Object.values(vals))if(typeof v==='string'&&v.trim()&&!/^https?:\/\//.test(v))return v.trim();
 }
 return'';
}
function entries(origin){
 const rows=[],seen=new Set(),ignore=new Set(['pagesV753','fields','recordFieldsV340','options','tags','layout','colors','selectedIds','sourceIds','linkedDays','manualItemKeysV785']);
 const add=(entry)=>{const k=[entry.tabId,entry.componentId,entry.itemId].join('|');if(!seen.has(k)){seen.add(k);rows.push(entry)}};
 const walkItems=(value,tab,c,depth=0,known=new WeakSet())=>{
  if(!value||typeof value!=='object'||known.has(value)||depth>7)return;
  known.add(value);
  if(Array.isArray(value)){for(const x of value)walkItems(x,tab,c,depth+1,known);return}
  const id=value.id??value.itemId??value.key;
  const name=itemLabel(value,c);
  if(id!=null&&name)add({name,tabId:String(tab.id),componentId:String(c.id),itemId:String(id),componentName:c.title||c.type||'Component',tabName:tab.name||'Tab'});
  for(const [key,v] of Object.entries(value)){
   if(ignore.has(key)||key.startsWith('_')||!v||typeof v!=='object')continue;
   if(key==='valuesV340'||key==='style'||key==='metadata'||key==='settings')continue;
   walkItems(v,tab,c,depth+1,known);
  }
 };
 for(const t of scope(origin))for(const c of t.components||[]){
  if(!c?.id)continue;
  const name=String(c.title||c.type||'Component');
  add({name,tabId:String(t.id),componentId:String(c.id),itemId:'',componentName:name,tabName:t.name||'Tab'});
  for(const [key,items] of Object.entries(c)){
   if(ignore.has(key)||!Array.isArray(items)||key==='components')continue;
   walkItems(items,t,c);
  }
  // Nested components within a layout belong to this tab; they are not separate tabs.
  for(const child of c.childrenV788||[]){if(!child?.id)continue;
   const childName=String(child.title||child.type||'Component');
   add({name:childName,tabId:String(t.id),componentId:String(child.id),itemId:'',componentName:childName,tabName:t.name||'Tab'});
   for(const [key,items] of Object.entries(child))if(Array.isArray(items)&&!ignore.has(key))walkItems(items,t,child);
  }
 }
 return rows.slice(0,6000);
}
function makeMention(name,ids,origin){
 const [tabId,componentId,itemId]=ids;
 const permitted=canLink(origin,tabId);
 const node=document.createElement(permitted?'a':'span');
 node.className='loggy-mention-v853'+(permitted?'':' is-unavailable');
 node.textContent='@'+name;node.contentEditable='false';
 node.dataset.loggyMentionV853=JSON.stringify(ids);
 if(permitted){node.setAttribute('href','#');node.title='Open '+name}
 else node.title='Reference from another tab';
 return node;
}
function renderRaw(editor,raw){
 const origin=editor.__mentionOrigin;
 editor.replaceChildren();REF.lastIndex=0;let pos=0,m;
 while((m=REF.exec(String(raw||'')))){
  editor.append(document.createTextNode(String(raw).slice(pos,m.index)));
  editor.append(makeMention(m[1],refParts(m),origin));pos=REF.lastIndex;
 }
 editor.append(document.createTextNode(String(raw||'').slice(pos)));
}
function serialize(root){
 let str='';
 for(const node of root.childNodes){
  if(node.nodeType===Node.TEXT_NODE){str+=node.nodeValue||'';continue}
  if(node.nodeType!==Node.ELEMENT_NODE)continue;
  if(node.matches('[data-loggy-mention-v853]')){
   let ids=[];try{ids=JSON.parse(node.dataset.loggyMentionV853)}catch{}
   str+=token({name:(node.textContent||'').replace(/^@/,''),tabId:ids[0],componentId:ids[1],itemId:ids[2]});
  }else if(node.tagName==='BR')str+='\n';
  else{if(node.tagName==='DIV'&&str&&!str.endsWith('\n'))str+='\n';str+=serialize(node)}
 }
 return str;
}
function sync(editor){const backing=editor.__mentionBacking;if(!backing)return;
 const updated=serialize(editor);if(updated===backing.value)return;
 backing.value=updated;
 backing.dispatchEvent(new Event('input',{bubbles:true}));
 backing.dispatchEvent(new Event('change',{bubbles:true}));
}
function eligible(el){
 if(!el||!el.matches?.('textarea,input[type="text"],input:not([type])')||el.disabled||el.readOnly)return false;
 if(el.matches('[type="search"],.custom-component-search,[data-v340-input]')||/search|filter|password|url/i.test(el.placeholder||''))return false;
 if(el.closest('[contenteditable="true"],#loggy-mention-picker-v853'))return false;
 if(el.closest('.custom-tab-view[data-custom-tab-id]'))return true;
 return !!el.closest('.modal-overlay:not(.hidden),.roadmap-editor-modal-v749:not(.hidden)')&&!!activeTab();
}
function enhance(el){
 if(editors.has(el)||!eligible(el))return;
 const origin=tabFor(el);if(!origin)return;
 const editor=document.createElement('div');
 editor.className='loggy-mention-editor-v853';editor.contentEditable='true';editor.setAttribute('role','textbox');
 editor.setAttribute('aria-multiline',String(el.tagName==='TEXTAREA'));
 editor.dataset.multiline=String(el.tagName==='TEXTAREA');
 editor.__mentionBacking=el;editor.__mentionOrigin=origin;
 if(el.placeholder)editor.dataset.placeholder=el.placeholder;
 editors.set(el,editor);
 el.classList.add('loggy-mention-backing-v853');el.insertAdjacentElement('afterend',editor);
 renderRaw(editor,el.value||'');
 editor.addEventListener('input',()=>{sync(editor);showPicker(editor)});
 editor.addEventListener('focus',()=>{if(editor.__mentionOrigin?.id!==tabFor(editor)?.id)editor.__mentionOrigin=tabFor(editor);showPicker(editor)});
 editor.addEventListener('keydown',keyHandler,true);
 editor.addEventListener('click',e=>{
  const mention=e.target.closest('[data-loggy-mention-v853]');if(!mention)return;
  e.preventDefault();e.stopPropagation();if(mention.tagName!=='A')return;
  let ids=[];try{ids=JSON.parse(mention.dataset.loggyMentionV853)}catch{}
  openRef(ids,editor.__mentionOrigin);
 });
 el.addEventListener('input',()=>{if(document.activeElement!==editor&&serialize(editor)!==el.value)renderRaw(editor,el.value)});
}
function trigger(editor){
 const sel=window.getSelection();if(!sel?.rangeCount||!editor.contains(sel.anchorNode)||sel.anchorNode?.nodeType!==Node.TEXT_NODE)return null;
 const node=sel.anchorNode,end=sel.anchorOffset,before=node.textContent.slice(0,end);
 const m=before.match(/(^|[\s(])@([^@\n\r]{0,80})$/);
 if(!m)return null;
 return {node,start:end-m[2].length-1,end,term:m[2].toLowerCase()};
}
function hidePicker(){document.getElementById(PICKER_ID)?.remove();active=null}
function showPicker(editor){
 const tr=trigger(editor);if(!tr){hidePicker();return}
 const list=entries(editor.__mentionOrigin).filter(x=>`${x.name} ${x.componentName}`.toLowerCase().includes(tr.term)).slice(0,35);
 if(!list.length){hidePicker();return}
 const index=active?.editor===editor?Math.min(active.index,list.length-1):0;
 active={editor,tr,list,index};
 let picker=document.getElementById(PICKER_ID);
 if(!picker){picker=document.createElement('div');picker.id=PICKER_ID;picker.setAttribute('role','listbox');document.body.append(picker)}
 picker.innerHTML=`<div class="loggy-mention-picker-title-v853">Current tab${editor.__mentionOrigin?.nestedParentV753?' and parent':' '} · ↑↓ Enter</div>${list.map((entry,i)=>`<button type="button" data-mention-option="${i}" class="${i===index?'selected':''}"><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.componentName)} · ${escapeHtml(entry.tabName)}</small></button>`).join('')}`;
 picker.querySelectorAll('[data-mention-option]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();choose(Number(b.dataset.mentionOption))}));
 const pos=editor.getBoundingClientRect();
 picker.style.left=Math.max(8,Math.min(pos.left,window.innerWidth-picker.offsetWidth-8))+'px';
 picker.style.top=Math.max(8,Math.min(pos.bottom+5,window.innerHeight-picker.offsetHeight-8))+'px';
}
function choose(index){
 if(!active)return;const {editor,tr,list}=active,hit=list[index];if(!hit||!tr.node.isConnected){hidePicker();return}
 const range=document.createRange();range.setStart(tr.node,tr.start);range.setEnd(tr.node,tr.end);range.deleteContents();
 const link=makeMention(hit.name,[hit.tabId,hit.componentId,hit.itemId],editor.__mentionOrigin),space=document.createTextNode(' ');
 range.insertNode(link);link.after(space);
 const selection=window.getSelection(),caret=document.createRange();caret.setStartAfter(space);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);
 sync(editor);hidePicker();editor.focus();
}
function keyHandler(e){
 if(active?.editor!==e.currentTarget){if(e.key==='Enter'&&e.currentTarget.dataset.multiline!=='true'){e.preventDefault();e.currentTarget.blur()}return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  e.preventDefault();active.index=(active.index+(e.key==='ArrowDown'?1:-1)+active.list.length)%active.list.length;showPicker(active.editor);
 }else if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();choose(active.index)}
 else if(e.key==='Escape'){e.preventDefault();hidePicker()}
}
function openRef(ids,origin){
 const [tabId,componentId,itemId]=ids.map(String);
 if(!canLink(origin,tabId))return;
 const tab=byId(allTabs(),tabId);if(!tab)return;
 try{window.openCustomTab?.(tab.id)}catch{return}
 let remaining=12;
 const scroll=()=>{
  const view=document.querySelector(`.custom-tab-view[data-custom-tab-id="${CSS.escape(tabId)}"]`);
  const component=view?.querySelector(`[data-component-id="${CSS.escape(componentId)}"]`);
  if(!component&&remaining-->0){requestAnimationFrame(scroll);return}
  let target=itemId?component?.querySelector(`[data-custom-item-id="${CSS.escape(itemId)}"],[data-item-id="${CSS.escape(itemId)}"],[data-card-id="${CSS.escape(itemId)}"]`):component;
  if(!target&&component&&itemId){const meta=(tab.components||[]).find(x=>String(x.id)===componentId);const entry=entries(origin).find(x=>x.tabId===tabId&&x.componentId===componentId&&x.itemId===itemId);const name=entry?.name;
   target=[...component.querySelectorAll('article,button,[role="button"]')].find(x=>name&&x.textContent?.includes(name))||component;}
  target?.scrollIntoView({behavior:'smooth',block:'center'});target?.classList.add('loggy-mention-target-v853');
  if(target)setTimeout(()=>target.classList.remove('loggy-mention-target-v853'),1400);
 };
 requestAnimationFrame(scroll);
}
function displayLinks(container){
 if(!container?.isConnected)return;
 const origin=tabFor(container);if(!origin)return;
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT,{acceptNode(node){
  if(!node.nodeValue?.includes('](loggy-ref:'))return NodeFilter.FILTER_REJECT;
  if(node.parentElement?.closest('input,textarea,[contenteditable],script,style,a,option,#loggy-mention-picker-v853'))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){const raw=node.nodeValue;REF.lastIndex=0;let m,from=0,found=false;const frag=document.createDocumentFragment();
  while((m=REF.exec(raw))){found=true;frag.append(document.createTextNode(raw.slice(from,m.index)));frag.append(makeMention(m[1],refParts(m),origin));from=REF.lastIndex}
  if(found){frag.append(document.createTextNode(raw.slice(from)));node.replaceWith(frag)}
 }
}
function scan(){
 // Only live tab views and open custom modals are enhanced; don't touch unrelated core inputs.
 document.querySelectorAll('.custom-tab-view.active textarea,.custom-tab-view.active input[type="text"],.custom-tab-view.active input:not([type]),.modal-overlay:not(.hidden) textarea,.modal-overlay:not(.hidden) input[type="text"]').forEach(enhance);
 document.querySelectorAll('.custom-tab-view.active[data-custom-tab-id]').forEach(displayLinks);
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;scan()})}
let pending=new Set();
const observer=new MutationObserver(records=>{
  for(const record of records){
    const target=record.target?.nodeType===1?record.target:record.target?.parentElement;
    if(record.type==='attributes'){
      if(target?.matches?.('.custom-tab-view.active'))pending.add(target);
      continue;
    }
    const view=target?.closest?.('.custom-tab-view.active[data-custom-tab-id]');
    const modal=target?.closest?.('.modal-overlay:not(.hidden)');
    if(view)pending.add(view);
    else if(modal)pending.add(modal);
    for(const added of record.addedNodes){
      if(added.nodeType!==1)continue;
      if(added.matches?.('.custom-tab-view.active,.modal-overlay:not(.hidden)'))pending.add(added);
    }
  }
  if(!pending.size||scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
    scheduled=false;const roots=[...pending];pending.clear();
    for(const root of roots){
      if(!root.isConnected)continue;
      root.querySelectorAll('textarea,input[type="text"],input:not([type])').forEach(enhance);
      if(root.matches('.custom-tab-view.active'))displayLinks(root);
    }
  });
});
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
document.addEventListener('focusin',e=>{if(eligible(e.target))enhance(e.target)},true);
document.addEventListener('click',e=>{
 const link=e.target.closest('a.loggy-mention-v853[data-loggy-mention-v853]');
 if(link&&!link.closest('.loggy-mention-editor-v853')){
  e.preventDefault();let ids=[];try{ids=JSON.parse(link.dataset.loggyMentionV853)}catch{}
  openRef(ids,tabFor(link));
 }
 if(active&&!e.target.closest('#'+PICKER_ID+', .loggy-mention-editor-v853'))hidePicker();
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else schedule();
})();
