/* Loggy V831: instant, authoritative Create Tab catalogue.
   Metadata is light; heavy feature bundles remain deferred. */
(()=>{
 'use strict';
 const CATALOG=[{"id":"whiteboard-v197","name":"Whiteboard","icon":"ph-selection-background","description":"Draw and organize ideas on a visual canvas."},{"id":"notepad-v249","name":"Notebook","icon":"ph-notebook","description":"Write and organize notes across multiple pages."},{"id":"writers-room-v804","name":"Writer's Room","icon":"ph-pen-nib","description":"Plan and write your story."},{"id":"curriculum-v813","name":"Curriculum","icon":"ph-books","description":"Build a chapter-and-section curriculum connected to your Knowledge Base."},{"id":"learning-roadmap-2-v813","name":"Multiples","icon":"ph-path","description":"Explore several skills within one Log."},{"id":"research-lab-v822","name":"Research Lab","icon":"ph-flask","description":"Organize research questions, evidence, experiments, and findings."},{"id":"youtube-studio-v822","name":"YouTube Studio","icon":"ph-youtube-logo","description":"Organize your YouTube channel videos."},{"id":"business-dashboard-v822","name":"Business Dashboard","icon":"ph-storefront","description":"Keep your business plans, operations, finances, and resources together."},{"id":"logs-review-v536","name":"Logs Review","icon":"ph-chart-bar","description":"Review your activity across weeks, months, and years."}];
 window.__loggyTemplateCatalogV831=CATALOG;
 window.__loggySyncTemplateRegistryV855=()=>{
   try { if(typeof CUSTOM_TAB_TEMPLATES_V53==='undefined'||!Array.isArray(CUSTOM_TAB_TEMPLATES_V53))return;
     const ids=CATALOG.map(x=>x.id);
     const actual=CUSTOM_TAB_TEMPLATES_V53.map(x=>x.id);
     const different=ids.length!==actual.length||ids.some((id,i)=>id!==actual[i]);
     if(different)CUSTOM_TAB_TEMPLATES_V53.splice(0,CUSTOM_TAB_TEMPLATES_V53.length,...CATALOG.map(x=>({...x})));
     else CATALOG.forEach((x,i)=>Object.assign(CUSTOM_TAB_TEMPLATES_V53[i],x));
   }catch(e){console.warn('Template registry sync',e)}
 };
 const safe=text=>String(text||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function draw(){
  window.__loggySyncTemplateRegistryV855?.();
  const modal=document.getElementById('custom-tab-create-modal');if(!modal)return;
  let section=modal.querySelector('.custom-tab-template-section-v53');
  if(!section){section=document.createElement('section');section.className='modal-section custom-tab-template-section-v53';
   section.innerHTML='<span class="field-label">Tab Templates</span><p class="custom-tab-create-hint">Choose a ready-to-use workspace. Every layout can be customized.</p><div class="custom-tab-template-grid-v53"></div>';
   const icon=modal.querySelector('#custom-tab-icon-picker')?.closest('.modal-section');if(icon)icon.insertAdjacentElement('afterend',section);else modal.querySelector('.modal-box')?.appendChild(section);
  }
  const grid=section.querySelector('.custom-tab-template-grid-v53');if(!grid)return;
  const prior=String(modal.dataset.selectedTemplateV53||'');
  // Re-render only if the actual catalogue differs: avoids expensive icon/grid flashes.
  const existing=[...grid.querySelectorAll('[data-custom-tab-template-v53]')].map(x=>x.dataset.customTabTemplateV53);
  if(existing.length!==CATALOG.length||existing.some((id,i)=>id!==CATALOG[i].id)||CATALOG.some((t,i)=>{const el=grid.children[i];return el?.querySelector('strong')?.textContent!==t.name||el?.querySelector('small')?.textContent!==t.description;})){
   grid.innerHTML=CATALOG.map(t=>`<button type="button" class="custom-tab-template-card-v53" data-custom-tab-template-v53="${safe(t.id)}" data-template-name-v330="${safe(t.name)}" data-template-icon-v330="${safe(t.icon)}"><span class="custom-tab-template-icon-v53"><i class="ph ${safe(t.icon)}"></i></span><span class="custom-tab-template-copy-v53"><strong>${safe(t.name)}</strong><small>${safe(t.description)}</small></span><i class="ph ph-check-circle custom-tab-template-check-v53"></i></button>`).join('');
  }
  grid.querySelectorAll('[data-custom-tab-template-v53]').forEach(b=>{const chosen=!!prior&&b.dataset.customTabTemplateV53===prior;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen))});
  section.hidden=false;section.classList.remove('hidden');section.style.display='flex';section.style.flexDirection='column';
 }
 window.__loggyRenderTemplateCatalogV831=draw;
 // Template.js already exists here. Wrap the fast core modal opener and prepare cards synchronously.
 try{const previous=openCustomTabCreateModal;openCustomTabCreateModal=function(){try{ensureCustomTabCreateModal()}catch{};draw();const result=previous.apply(this,arguments);draw();return result}}catch{}
 // Older bundle listeners do not exist until the features are ready.
 window.addEventListener('click',event=>{
  if(document.documentElement.dataset.loggyFeaturesReady==='1')return;
  const card=event.target?.closest?.('#custom-tab-create-modal [data-custom-tab-template-v53]');if(!card)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  const modal=card.closest('#custom-tab-create-modal'),id=card.dataset.customTabTemplateV53;
  modal.dataset.selectedTemplateV53=id;
  modal.querySelectorAll('[data-custom-tab-template-v53]').forEach(x=>x.classList.toggle('selected',x===card));
  const t=CATALOG.find(x=>x.id===id),input=modal.querySelector('#custom-tab-name-input');
  if(t&&input){const before=String(modal.dataset.lastTemplateNameV53||'');if(!input.value.trim()||input.value===before)input.value=t.name;modal.dataset.lastTemplateNameV53=t.name}
  const choices=[...modal.querySelectorAll('#custom-tab-icon-picker [data-icon]')];choices.forEach(x=>x.classList.toggle('selected',x.dataset.icon===t?.icon));
 },true);
 // Prevent creating an empty tab while its selected template builder is still loading.
 window.addEventListener('click',event=>{
  if(document.documentElement.dataset.loggyFeaturesReady==='1')return;
  const button=event.target?.closest?.('#custom-tab-create-modal #custom-tab-create-confirm');if(!button)return;
  const modal=button.closest('#custom-tab-create-modal');if(!modal.dataset.selectedTemplateV53)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  if(button.dataset.waitingTemplateV831==='1')return;
  button.dataset.waitingTemplateV831='1';button.disabled=true;
  const previous=button.innerHTML;button.innerHTML='<i class="ph ph-spinner-gap"></i> Loading template…';
  window.ensureLoggyExtras?.({urgent:true}).then(()=>{button.disabled=false;delete button.dataset.waitingTemplateV831;button.innerHTML=previous;if(!modal.classList.contains('hidden'))button.click()}).catch(e=>{button.disabled=false;delete button.dataset.waitingTemplateV831;button.innerHTML=previous;console.error('Template bundle unavailable',e)});
 },true);
 // Eagerly build only the core modal, without executing large custom component files.
 const prepare=()=>{try{ensureCustomTabCreateModal();draw()}catch(e){console.warn('Create Tab prewarm',e)}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if('requestIdleCallback'in window)requestIdleCallback(prepare,{timeout:700});else setTimeout(prepare,100)},{once:true});
 else if('requestIdleCallback'in window)requestIdleCallback(prepare,{timeout:700});else setTimeout(prepare,100);
 window.addEventListener('loggy-features-ready',draw);
})();
