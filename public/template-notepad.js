/* Loggy Notepad V249 — lazy full-screen notebook runtime */
(() => {
  'use strict';
  if (window.LoggyNotepadV249) return;

  const PAPER_OPTIONS = [
    ['blank','Blank'],
    ['dot','Bullet Journal'],
    ['graph','Graph']
  ];
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const $$=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
  const uid=(p='id')=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stripHtml=html=>{const d=document.createElement('div');d.innerHTML=String(html||'');return (d.textContent||'').replace(/\s+/g,' ').trim()};

  function normalizeState(state){
    state = state && typeof state==='object' ? state : {};
    state.version = 250;
    state.categories = Array.isArray(state.categories) ? state.categories.filter(Boolean) : [];
    if (!state.categories.length) state.categories=[{id:'notes',name:'Notebook 1'}];
    state.categories = state.categories.map((c,i)=>({id:String(c.id||uid('cat')),name:String((state.categories.length===1&&String(c.name||'').trim()==='Notes')?`Notebook ${i+1}`:(c.name||`Notebook ${i+1}`)).slice(0,80)}));
    const catIds=new Set(state.categories.map(c=>c.id));
    state.pages = Array.isArray(state.pages) ? state.pages.filter(Boolean) : [];
    if (!state.pages.length) state.pages=[{id:uid('page'),title:'Page 1',categoryId:state.categories[0].id,paper:'blank',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()}];
    state.pages = state.pages.map((p,i)=>({
      ...(p && typeof p==='object' ? p : {}),
      id:String(p.id||uid('page')),
      title:String(p.title||`Page ${i+1}`).slice(0,180),
      categoryId:catIds.has(String(p.categoryId||''))?String(p.categoryId):state.categories[0].id,
      paper:PAPER_OPTIONS.some(([id])=>id===p.paper)?p.paper:'blank',
      html:String(p.html||''),
      images:Array.isArray(p.images)?p.images.map(img=>normalizeImage(img)).filter(Boolean):[],
      createdAt:Number(p.createdAt)||Date.now(),updatedAt:Number(p.updatedAt)||Date.now()
    }));
    if(!state.pages.some(p=>p.id===state.activePageId)) state.activePageId=state.pages[0]?.id||'';
    if(state.activeCategoryId!=='all' && !catIds.has(String(state.activeCategoryId||''))) state.activeCategoryId=state.pages.find(p=>p.id===state.activePageId)?.categoryId||state.categories[0].id;
    state.activeCategoryId=state.activeCategoryId||state.categories[0].id;
    return state;
  }

  function normalizeImage(img){
    if(!img) return null;
    if(typeof img==='string') img={src:img};
    if(typeof img!=='object') return null;
    const src=String(img.src||img.url||'').trim();
    if(!src) return null;
    return {
      id:String(img.id||uid('image')),src,projectPath:String(img.projectPath||img.path||''),name:String(img.name||''),mime:String(img.mime||''),
      x:clamp(img.x??90,0,5000),y:clamp(img.y??130,0,100000),w:clamp(img.w??300,90,780),h:clamp(img.h??220,70,650),caption:String(img.caption||''),createdAt:Number(img.createdAt)||Date.now()
    };
  }

  function createModal(root){
    const overlay=document.createElement('div');overlay.className='np-modal-v249';overlay.hidden=true;
    overlay.innerHTML='<div class="np-modal-box-v249" role="dialog" aria-modal="true"></div>';
    root.appendChild(overlay);
    let resolver=null;
    const box=$('.np-modal-box-v249',overlay);
    const close=value=>{overlay.hidden=true;box.innerHTML='';const r=resolver;resolver=null;r?.(value)};
    overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)close(null)});
    return {
      form({title,fields=[],submit='Save',danger=false,secondary=null}){
        if(resolver) close(null);
        box.innerHTML=`<div class="np-modal-head-v249"><h2>${esc(title)}</h2><button type="button" class="np-icon-v249" data-close><i class="ph ph-x"></i></button></div><form data-form>${fields.map(f=>`<div class="np-field-v249"><label>${esc(f.label||f.name)}</label>${f.type==='select'?`<select name="${esc(f.name)}">${(f.options||[]).map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(f.value??'')?'selected':''}>${esc(o.label)}</option>`).join('')}</select>`:`<input name="${esc(f.name)}" type="${esc(f.type||'text')}" value="${esc(f.value??'')}" ${f.placeholder?`placeholder="${esc(f.placeholder)}"`:''} ${f.maxlength?`maxlength="${Number(f.maxlength)}"`:''}>`}</div>`).join('')}<div class="np-modal-actions-v249">${secondary?`<button type="button" data-secondary class="${secondary.danger?'danger':''}">${esc(secondary.label)}</button>`:''}<button type="button" data-cancel>Cancel</button><button type="submit" class="${danger?'danger':'primary'}">${esc(submit)}</button></div></form>`;
        overlay.hidden=false;
        requestAnimationFrame(()=>box.querySelector('input,select')?.focus());
        return new Promise(resolve=>{
          resolver=resolve;
          $('[data-close]',box).onclick=()=>close(null);$('[data-cancel]',box).onclick=()=>close(null);
          $('[data-secondary]',box)?.addEventListener('click',()=>close({__secondary:true}));
          $('[data-form]',box).onsubmit=e=>{e.preventDefault();const data={};new FormData(e.currentTarget).forEach((v,k)=>data[k]=String(v));close(data)};
        });
      },
      confirm({title,message,confirm='Delete',danger=true}){
        if(resolver) close(null);
        box.innerHTML=`<div class="np-modal-head-v249"><h2>${esc(title)}</h2><button type="button" class="np-icon-v249" data-close><i class="ph ph-x"></i></button></div><p style="font-size:13px;line-height:1.55;color:#555;margin:0">${esc(message)}</p><div class="np-modal-actions-v249"><button type="button" data-cancel>Cancel</button><button type="button" data-confirm class="${danger?'danger':'primary'}">${esc(confirm)}</button></div>`;
        overlay.hidden=false;
        return new Promise(resolve=>{resolver=resolve;$('[data-close]',box).onclick=()=>close(false);$('[data-cancel]',box).onclick=()=>close(false);$('[data-confirm]',box).onclick=()=>close(true)});
      }
    };
  }

  function mount(host,config){
    if(!host||!config) return null;
    if(host.__loggyNotepadV249?.destroy) host.__loggyNotepadV249.destroy();
    let state=normalizeState(config.getState?.());
    let activePage=state.pages.find(p=>p.id===state.activePageId)||state.pages[0];
    let selectedCategory=(state.activeCategoryId&&state.activeCategoryId!=='all')?state.activeCategoryId:(activePage?.categoryId||state.categories[0]?.id||'');
    let saveTimer=0,mentionRange=null,mentionItems=[],mentionIndex=0,mentionCatalog=null,lastPointer={x:260,y:220},selectedImageId='',hasRenderedPage=false;

    host.innerHTML=`<div class="loggy-notepad-v249">
      <header class="np-top-v249">
        <button type="button" class="np-icon-v249" data-exit title="Exit Notebook"><i class="ph ph-arrow-left"></i></button>
        <button type="button" class="np-icon-v249" data-sidebar title="Hide or show notebook sidebar" aria-label="Hide or show notebook sidebar"><i class="ph ph-sidebar-simple"></i></button>
        <span class="np-notebook-name-v249"></span><span class="np-top-spacer-v249"></span>
        <button type="button" class="np-icon-v249 np-new-page-top-v251" data-new-page-top title="Add page to this notebook" aria-label="Add page to this notebook"><i class="ph ph-file-plus"></i></button>
        <span class="np-save-state-v249" data-save-state></span>
        <label class="np-paper-label-v249" style="font-size:11px;color:#777">Paper</label>
        <select class="np-paper-select-v249" data-paper>${PAPER_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>
        <input type="file" hidden data-file accept="image/*" multiple>
      </header>
      <aside class="np-sidebar-v249">
        <div class="np-sidebar-head-v249"><strong>Notebooks</strong><div class="np-sidebar-actions-v249"><button type="button" class="np-icon-v249" data-new-category title="Add notebook" aria-label="Add notebook"><i class="ph ph-plus"></i></button></div></div>
        <div class="np-search-v249"><i class="ph ph-magnifying-glass"></i><input type="search" data-search placeholder="Search pages in this notebook…" autocomplete="off"></div>
        <div class="np-side-scroll-v249"><div class="np-side-label-v249">Notebooks</div><div data-categories></div><div class="np-side-label-v249"><span>Pages</span></div><div data-pages></div></div>
      </aside>
      <main class="np-workspace-v249" data-workspace>
        <div class="np-notebook-stack-v254" data-notebook-stack>
          <article class="np-notebook-page-v254 active" data-stack-page>
            <div class="np-page-shell-v249"><input class="np-page-title-v249" data-title maxlength="180" placeholder="Page title"><section class="np-paper-v249" data-paper-stage><div class="np-editor-v249" data-editor contenteditable="true" spellcheck="true"></div><div class="np-images-v249" data-images></div></section></div>
          </article>
        </div>
      </main>
      <div class="np-mention-v249" data-mention hidden></div><div class="np-context-v249" data-context hidden></div><div class="np-toast-v249" data-toast></div>
    </div>`;
    const root=host.firstElementChild, modal=createModal(root), editor=$('[data-editor]',root), stage=$('[data-paper-stage]',root), imagesHost=$('[data-images]',root), workspace=$('[data-workspace]',root), stackHost=$('[data-notebook-stack]',root), pageShell=$('.np-page-shell-v249',root), mention=$('[data-mention]',root), context=$('[data-context]',root);

    // V503: make the real active notebook page a guaranteed text surface.
    // This owns focus/caret placement locally and does not change tab creation or mounting.
    const ensureEditorInteractiveV503=()=>{
      if(!editor||!stage)return;
      editor.contentEditable='true';
      editor.setAttribute('contenteditable','true');
      editor.setAttribute('spellcheck','true');
      editor.setAttribute('tabindex','0');
      try{editor.inert=false;editor.removeAttribute('inert');editor.removeAttribute('aria-hidden')}catch{}
      stage.style.pointerEvents='auto';
      if(!root.classList.contains('np-drawing-v250')){
        editor.style.setProperty('pointer-events','auto','important');
        editor.style.setProperty('user-select','text','important');
        editor.style.setProperty('-webkit-user-select','text','important');
      }
    };
    const focusEditorV503=(event)=>{
      if(root.classList.contains('np-drawing-v250'))return;
      if(event?.target?.closest?.('button,input,textarea,select,audio,video,iframe,a,.np-image-card-v249,.np-drag-handle-v256,.np-sticky-v250'))return;
      ensureEditorInteractiveV503();
      try{editor.focus({preventScroll:true})}catch(_){try{editor.focus()}catch(__){}}
      try{
        const sel=window.getSelection();
        if(!sel)return;
        let range=null;
        if(event && document.caretPositionFromPoint){
          const pos=document.caretPositionFromPoint(event.clientX,event.clientY);
          if(pos&&editor.contains(pos.offsetNode)){range=document.createRange();range.setStart(pos.offsetNode,pos.offset);range.collapse(true)}
        }else if(event && document.caretRangeFromPoint){
          const r=document.caretRangeFromPoint(event.clientX,event.clientY);
          if(r&&editor.contains(r.startContainer))range=r;
        }
        if(!range){range=document.createRange();range.selectNodeContents(editor);range.collapse(false)}
        sel.removeAllRanges();sel.addRange(range);
      }catch{}
    };
    ensureEditorInteractiveV503();
    stage.addEventListener('pointerdown',event=>{
      if(root.classList.contains('np-drawing-v250'))return;
      if(event.target===stage||event.target===editor||event.target.closest?.('.np-editor-v249'))ensureEditorInteractiveV503();
    },true);
    stage.addEventListener('click',event=>{
      if(event.target===stage||event.target===editor||event.target.closest?.('.np-editor-v249'))focusEditorV503(event);
    });
    editor.addEventListener('beforeinput',ensureEditorInteractiveV503,true);
    editor.addEventListener('focus',ensureEditorInteractiveV503,true);


    $('.np-notebook-name-v249',root).textContent=(['Notepad','Untitled Note',''].includes(String(config.name||''))?'Untitled Notebook':String(config.name));
    const saveState=$('[data-save-state]',root);

    function toast(message){const el=$('[data-toast]',root);el.textContent=message;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1600)}
    function scheduleSave(delay=420){clearTimeout(saveTimer);saveState.textContent='Saving…';saveTimer=setTimeout(async()=>{saveTimer=0;try{state.version=249;await config.saveState?.(state);saveState.textContent='Saved';setTimeout(()=>{if(saveState.textContent==='Saved')saveState.textContent=''},900)}catch{saveState.textContent='Save failed'}},delay)}
    function persistPageFromDom(){if(!activePage)return;activePage.html=editor.innerHTML;activePage.title=$('[data-title]',root).value.trim()||`Page ${Math.max(1,state.pages.findIndex(p=>p.id===activePage.id)+1)}`;activePage.paper=$('[data-paper]',root).value||'blank';activePage.updatedAt=Date.now();state.activePageId=activePage.id;state.activeCategoryId=selectedCategory;scheduleSave()}
    function pageText(page){return `${page.title||''} ${stripHtml(page.html||'')}`.toLowerCase()}

    function notebookPages(categoryId){return state.pages.filter(page=>page.categoryId===categoryId)}
    function notebookName(categoryId){return state.categories.find(cat=>cat.id===categoryId)?.name||'Notebook'}
    function renderSidebar(){
      const cats=$('[data-categories]',root),pages=$('[data-pages]',root),query=$('[data-search]',root).value.trim().toLowerCase();cats.innerHTML='';pages.innerHTML='';
      state.categories.forEach((cat,index)=>{const count=notebookPages(cat.id).length,b=document.createElement('button');b.type='button';b.className=`np-category-v249${selectedCategory===cat.id?' active':''}`;b.dataset.categoryId=cat.id;b.innerHTML=`<i class="ph ph-notebook"></i><span></span><small>${count}</small>`;b.querySelector('span').textContent=cat.name||`Notebook ${index+1}`;b.onclick=()=>{selectedCategory=cat.id;state.activeCategoryId=cat.id;const target=activePage?.categoryId===cat.id?activePage:notebookPages(cat.id)[0];if(target)openPage(target.id,{scrollToPage:true});else renderSidebar();scheduleSave(100)};b.oncontextmenu=e=>{e.preventDefault();showCategoryMenu(cat,e.clientX,e.clientY)};cats.appendChild(b)});
      let list=notebookPages(selectedCategory);if(query)list=list.filter(p=>pageText(p).includes(query));
      if(!list.length){pages.innerHTML='<div class="np-empty-v249">No pages in this notebook match your search.</div>';return}
      list.forEach((page,index)=>{const b=document.createElement('button');b.type='button';b.className=`np-page-row-v249${activePage?.id===page.id?' active':''}`;b.dataset.pageId=page.id;b.innerHTML='<i class="ph ph-note"></i><span></span>';b.querySelector('span').textContent=page.title||`Page ${index+1}`;b.onclick=()=>openPage(page.id,{scrollToPage:true});b.oncontextmenu=e=>{e.preventDefault();showPageMenu(page,e.clientX,e.clientY)};pages.appendChild(b)});
    }

    function previewPageElement(page,index){
      const article=document.createElement('article');article.className='np-notebook-page-v254 np-notebook-page-preview-v254';article.dataset.stackPage=page.id;article.dataset.pageId=page.id;
      const shell=document.createElement('div');shell.className='np-page-shell-v249 np-page-preview-shell-v254';
      const title=document.createElement('div');title.className='np-page-title-v249 np-page-preview-title-v254';title.textContent=page.title||`Page ${index+1}`;
      const paper=document.createElement('section');paper.className='np-paper-v249 np-page-preview-paper-v254';paper.dataset.paper=page.paper||'blank';if(page.paperColorV250)paper.style.setProperty('--np-paper-custom',page.paperColorV250);
      const body=document.createElement('div');body.className='np-editor-v249 np-page-preview-editor-v254';body.innerHTML=page.html||'';body.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));body.querySelectorAll('a,button,input,textarea,select,audio,video,iframe').forEach(el=>{el.setAttribute('tabindex','-1');el.style.pointerEvents='none'});paper.appendChild(body);
      (page.images||[]).slice(0,8).forEach(img=>{if(!img?.src)return;const im=document.createElement('img');im.className='np-page-preview-image-v254';im.src=img.src;im.alt=img.caption||img.name||'Notebook image';paper.appendChild(im)});
      const hint=document.createElement('div');hint.className='np-page-preview-hint-v254';hint.innerHTML='<i class="ph ph-pencil-simple"></i><span>Click to edit this page</span>';
      shell.append(title,paper,hint);article.appendChild(shell);article.addEventListener('click',()=>openPage(page.id,{scrollToPage:true}));return article;
    }
    function renderNotebookStack(){
      if(!stackHost||!pageShell||!activePage)return;pageShell.remove();stackHost.innerHTML='';const pages=notebookPages(activePage.categoryId);pages.forEach((page,index)=>{if(page.id===activePage.id){const article=document.createElement('article');article.className='np-notebook-page-v254 active';article.dataset.stackPage=page.id;article.dataset.pageId=page.id;article.appendChild(pageShell);stackHost.appendChild(article)}else stackHost.appendChild(previewPageElement(page,index))});
    }

    function ensureStageHeight(){
      const maxImg=(activePage?.images||[]).reduce((m,i)=>Math.max(m,(Number(i.y)||0)+(Number(i.h)||0)+80),0);
      const h=Math.max(1120,editor.scrollHeight+120,maxImg);stage.style.minHeight=`${Math.ceil(h)}px`;editor.style.minHeight=`${Math.max(1080,Math.ceil(h)-40)}px`;
    }

    async function removeNotebookImage(img){
      if(!img||!activePage)return;
      if(!(await modal.confirm({title:'Delete Image',message:'Remove this image from the notebook page and project media folder?',confirm:'Delete'})))return;
      try{await config.deleteImage?.(img)}catch{}
      activePage.images=activePage.images.filter(x=>x.id!==img.id);selectedImageId='';renderImages();scheduleSave(40);
    }

    function renderImages(){
      imagesHost.innerHTML='';if(!activePage)return;
      activePage.images=Array.isArray(activePage.images)?activePage.images.map(normalizeImage).filter(Boolean):[];
      activePage.images.forEach(img=>{
        const fig=document.createElement('figure');fig.className=`np-image-card-v249${selectedImageId===img.id?' selected':''}`;fig.dataset.imageId=img.id;fig.style.left=`${img.x}px`;fig.style.top=`${img.y}px`;fig.style.width=`${img.w}px`;fig.style.height=`${img.h+30}px`;
        fig.innerHTML=`<img alt=""><figcaption class="np-image-caption-v249" contenteditable="true" spellcheck="true"></figcaption><span class="np-image-resize-v249"></span>`;
        const image=$('img',fig),cap=$('figcaption',fig);image.src=img.src;image.alt=img.caption||img.name||'Notebook image';cap.textContent=img.caption||'';
        image.onerror=()=>{image.style.opacity='.15';image.alt='Image file missing'};
        cap.addEventListener('input',()=>{img.caption=cap.textContent||'';scheduleSave()});cap.addEventListener('pointerdown',e=>e.stopPropagation());
        fig.addEventListener('pointerdown',e=>{
          if(e.button!==0||e.target.closest('figcaption,.np-image-resize-v249'))return;selectedImageId=img.id;$$('.np-image-card-v249',imagesHost).forEach(x=>x.classList.toggle('selected',x===fig));
          const start={x:e.clientX,y:e.clientY,left:img.x,top:img.y};fig.setPointerCapture?.(e.pointerId);const move=ev=>{const rect=stage.getBoundingClientRect();img.x=clamp(start.left+(ev.clientX-start.x),0,Math.max(0,rect.width-img.w-14));img.y=Math.max(0,start.top+(ev.clientY-start.y));fig.style.left=`${img.x}px`;fig.style.top=`${img.y}px`;ensureStageHeight()};const up=()=>{window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);activePage.updatedAt=Date.now();scheduleSave()};window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);e.preventDefault();
        });
        $('.np-image-resize-v249',fig).addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();const start={x:e.clientX,y:e.clientY,w:img.w,h:img.h};const ratio=Math.max(.15,start.h/start.w);const move=ev=>{const nw=clamp(start.w+(ev.clientX-start.x),90,Math.max(100,stage.clientWidth-img.x-12));img.w=nw;img.h=clamp(nw*ratio,70,650);fig.style.width=`${img.w}px`;fig.style.height=`${img.h+30}px`;ensureStageHeight()};const up=()=>{window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);scheduleSave()};window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true)});
        fig.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showContext(e.clientX,e.clientY,[{label:'Edit caption',icon:'ph-text-t',action:()=>cap.focus()},{label:'Delete image',icon:'ph-trash',danger:true,action:()=>removeNotebookImage(img)}])};
        imagesHost.appendChild(fig);
      });ensureStageHeight();
    }

    function openPage(id,opts={}){
      if(hasRenderedPage)persistPageFromDom();const page=state.pages.find(p=>p.id===id);if(!page)return;activePage=page;state.activePageId=page.id;selectedCategory=page.categoryId;state.activeCategoryId=page.categoryId;selectedImageId='';$('[data-title]',root).value=page.title||`Page ${notebookPages(page.categoryId).findIndex(p=>p.id===page.id)+1}`;$('[data-paper]',root).value=page.paper||'blank';stage.dataset.paper=page.paper||'blank';editor.innerHTML=page.html||'';renderImages();renderSidebar();renderNotebookStack();hasRenderedPage=true;config.routeChanged?.(page.id);scheduleSave(80);if(opts.scrollToPage)requestAnimationFrame(()=>stackHost?.querySelector(`[data-stack-page="${CSS.escape(page.id)}"]`)?.scrollIntoView({block:'start',behavior:'smooth'}));else workspace.scrollTop=0;if(opts.focusTitle)requestAnimationFrame(()=>$('[data-title]',root).select())}

    async function createCategory(){
      const suggested=`Notebook ${state.categories.length+1}`;const data=await modal.form({title:'New Notebook',fields:[{name:'name',label:'Notebook name',value:suggested,placeholder:suggested,maxlength:80}],submit:'Add Notebook'});const name=data?.name?.trim();if(!name)return;const cat={id:uid('cat'),name};state.categories.push(cat);selectedCategory=cat.id;state.activeCategoryId=cat.id;const page={id:uid('page'),title:'Page 1',categoryId:cat.id,paper:activePage?.paper||'blank',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()};state.pages.push(page);openPage(page.id,{focusTitle:true,scrollToPage:true})}
    async function createPage(){const categoryId=activePage?.categoryId||selectedCategory||state.categories[0].id;selectedCategory=categoryId;state.activeCategoryId=categoryId;const count=notebookPages(categoryId).length;const page={id:uid('page'),title:`Page ${count+1}`,categoryId,paper:activePage?.paper||'blank',paperColorV250:activePage?.paperColorV250||'',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()};const currentIndex=state.pages.findIndex(p=>p.id===activePage?.id);if(currentIndex>=0){let insert=currentIndex+1;while(insert<state.pages.length&&state.pages[insert].categoryId===categoryId)insert++;state.pages.splice(insert,0,page)}else state.pages.push(page);openPage(page.id,{focusTitle:true,scrollToPage:true})}
    async function showCategoryMenu(cat,x,y){showContext(x,y,[{label:'Rename notebook',icon:'ph-pencil-simple',action:async()=>{const d=await modal.form({title:'Rename Notebook',fields:[{name:'name',label:'Notebook name',value:cat.name,maxlength:80}],submit:'Save'});if(d?.name?.trim()){cat.name=d.name.trim();renderSidebar();scheduleSave(40)}}},{label:'Delete notebook',icon:'ph-trash',danger:true,action:async()=>{if(state.categories.length<=1){toast('Keep at least one notebook.');return}if(!(await modal.confirm({title:'Delete Notebook',message:'Delete this notebook and all of its pages?',confirm:'Delete Notebook'})))return;const doomed=notebookPages(cat.id);for(const page of doomed)for(const img of page.images||[]){try{await config.deleteImage?.(img)}catch{}}state.pages=state.pages.filter(p=>p.categoryId!==cat.id);state.categories=state.categories.filter(c=>c.id!==cat.id);const dest=state.categories[0];selectedCategory=dest.id;state.activeCategoryId=dest.id;if(!notebookPages(dest.id).length)state.pages.push({id:uid('page'),title:'Page 1',categoryId:dest.id,paper:'blank',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()});openPage(notebookPages(dest.id)[0].id,{scrollToPage:true})}}])}
    async function showPageMenu(page,x,y){showContext(x,y,[{label:'Rename page',icon:'ph-pencil-simple',action:async()=>{const d=await modal.form({title:'Rename Page',fields:[{name:'title',label:'Page title',value:page.title,maxlength:180}],submit:'Save'});if(d?.title?.trim()){page.title=d.title.trim();if(activePage?.id===page.id)$('[data-title]',root).value=page.title;renderSidebar();renderNotebookStack();scheduleSave(40)}}},{label:'Move to notebook',icon:'ph-notebook',action:async()=>{const d=await modal.form({title:'Move Page',fields:[{name:'categoryId',label:'Notebook',type:'select',value:page.categoryId,options:state.categories.map(c=>({value:c.id,label:c.name}))}],submit:'Move'});if(d?.categoryId){page.categoryId=d.categoryId;if(activePage?.id===page.id){selectedCategory=d.categoryId;state.activeCategoryId=d.categoryId}renderSidebar();renderNotebookStack();scheduleSave(40)}}},{label:'Delete page',icon:'ph-trash',danger:true,action:async()=>{if(!(await modal.confirm({title:'Delete Page',message:`Delete “${page.title||'this page'}” and its notebook images?`,confirm:'Delete Page'})))return;for(const img of page.images||[]){try{await config.deleteImage?.(img)}catch{}}const catId=page.categoryId;state.pages=state.pages.filter(p=>p.id!==page.id);if(!notebookPages(catId).length){state.pages.push({id:uid('page'),title:'Page 1',categoryId:catId,paper:'blank',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()})}const next=notebookPages(catId)[0]||state.pages[0];openPage(next.id,{scrollToPage:true})}}])}

    function showContext(x,y,items){context.innerHTML='';items.forEach(item=>{const b=document.createElement('button');b.type='button';b.className=item.danger?'danger':'';b.innerHTML=`<i class="ph ${esc(item.icon||'ph-dot')}"></i><span>${esc(item.label)}</span>`;b.onclick=()=>{hideContext();item.action?.()};context.appendChild(b)});context.hidden=false;const w=190,h=Math.min(320,items.length*42+10);context.style.left=`${Math.max(8,Math.min(window.innerWidth-w-8,x))}px`;context.style.top=`${Math.max(8,Math.min(window.innerHeight-h-8,y))}px`}
    function hideContext(){context.hidden=true;context.innerHTML=''}

    async function uploadFiles(files,position=null){
      files=Array.from(files||[]).filter(f=>String(f.type||'').startsWith('image/'));if(!files.length)return;
      if(!activePage)return;let offset=0;
      for(const file of files){
        try{
          saveState.textContent='Uploading…';const saved=await config.uploadImage?.(file,activePage.id);if(!saved)throw new Error('Upload failed');
          const rect=stage.getBoundingClientRect(),x=position?position.x:Math.max(30,(rect.width-300)/2),y=position?position.y:Math.max(40,workspace.scrollTop+130);
          activePage.images.push(normalizeImage({...saved,id:uid('image'),x:clamp(x+offset,10,Math.max(10,rect.width-330)),y:Math.max(20,y+offset),w:300,h:220,caption:'',createdAt:Date.now()}));offset+=24;renderImages();scheduleSave(40);
        }catch(error){console.error('Notepad image upload failed',error);toast('Could not save that image.')}
      }
    }

    function getMentionContext(){
      const sel=window.getSelection();if(!sel||!sel.rangeCount)return null;const r=sel.getRangeAt(0);if(!r.collapsed||!editor.contains(r.startContainer)||r.startContainer.nodeType!==Node.TEXT_NODE)return null;const node=r.startContainer,before=node.data.slice(0,r.startOffset),m=before.match(/@([^@\n]{0,70})$/);if(!m)return null;const range=document.createRange();range.setStart(node,r.startOffset-m[0].length);range.setEnd(node,r.startOffset);return {range,query:m[1].trim()}
    }
    function renderMention(){
      const ctx=getMentionContext();if(!ctx){hideMention();return}mentionRange=ctx.range.cloneRange();if(!mentionCatalog)mentionCatalog=Array.isArray(config.getLinkTargets?.())?config.getLinkTargets():[];const q=ctx.query.toLowerCase();mentionItems=mentionCatalog.filter(t=>!q||`${t.label||''} ${t.subtitle||''} ${t.kind||''}`.toLowerCase().includes(q)).slice(0,18);mentionIndex=Math.min(mentionIndex,Math.max(0,mentionItems.length-1));mention.innerHTML='';if(!mentionItems.length)mention.innerHTML='<div class="np-mention-empty-v249">No matching links.</div>';else mentionItems.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.className=`np-mention-item-v249${i===mentionIndex?' active':''}`;b.innerHTML=`<span class="np-mention-icon-v249"><i class="ph ${esc(t.icon||'ph-link')}"></i></span><span class="np-mention-copy-v249"><strong>${esc(t.label||'Link')}</strong><small>${esc(t.subtitle||t.kind||'')}</small></span>`;b.onpointerdown=e=>e.preventDefault();b.onclick=()=>insertMention(t);mention.appendChild(b)});
      const rect=ctx.range.getBoundingClientRect();const x=rect.left||stage.getBoundingClientRect().left+70,y=(rect.bottom||stage.getBoundingClientRect().top+80)+8;mention.hidden=false;const mw=Math.min(410,window.innerWidth-24),mh=Math.min(340,mention.scrollHeight||220);mention.style.left=`${Math.max(8,Math.min(window.innerWidth-mw-8,x))}px`;mention.style.top=`${Math.max(8,Math.min(window.innerHeight-mh-8,y))}px`;
    }
    function hideMention(){mention.hidden=true;mention.innerHTML='';mentionItems=[];mentionRange=null;mentionIndex=0;mentionCatalog=null}
    function insertMention(target){if(!mentionRange)return;const a=document.createElement('a');a.href='#';a.className='np-ref-v249';a.contentEditable='false';a.textContent=`@${target.label||'Link'}`;Object.entries(target).forEach(([k,v])=>{if(v==null||typeof v==='object')return;const key=k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());a.dataset[k]=String(v)});mentionRange.deleteContents();mentionRange.insertNode(a);const spacer=document.createTextNode(' ');a.after(spacer);const sel=window.getSelection(),r=document.createRange();r.setStartAfter(spacer);r.collapse(true);sel.removeAllRanges();sel.addRange(r);hideMention();persistPageFromDom()}

    editor.addEventListener('input',()=>{activePage.html=editor.innerHTML;activePage.updatedAt=Date.now();ensureStageHeight();scheduleSave();requestAnimationFrame(renderMention)});
    editor.addEventListener('keydown',e=>{
      // Match Daily Logs' familiar @Day N + Space behavior while also keeping
      // the richer @ picker for tabs/components/items/notebook pages.
      if(e.key===' '&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
        const ctx=getMentionContext(),match=ctx?.query?.match(/^Day\s+(\d+)$/i);
        if(match&&Number(match[1])>=1){e.preventDefault();mentionRange=ctx.range.cloneRange();insertMention({kind:'day',label:`Day ${Number(match[1])}`,subtitle:'Daily Logs',icon:'ph-calendar-blank',day:String(Number(match[1]))});return}
      }
      if(!mention.hidden){if(e.key==='ArrowDown'){e.preventDefault();mentionIndex=(mentionIndex+1)%Math.max(1,mentionItems.length);renderMention();return}if(e.key==='ArrowUp'){e.preventDefault();mentionIndex=(mentionIndex-1+Math.max(1,mentionItems.length))%Math.max(1,mentionItems.length);renderMention();return}if(e.key==='Enter'&&mentionItems.length){e.preventDefault();insertMention(mentionItems[mentionIndex]);return}if(e.key==='Escape'){e.preventDefault();hideMention();return}}
      if(e.key==='@')requestAnimationFrame(renderMention);
    });
    editor.addEventListener('click',e=>{const a=e.target.closest('.np-ref-v249');if(!a)return;e.preventDefault();const target={};Object.entries(a.dataset).forEach(([k,v])=>target[k]=v);config.navigate?.(target)});
    editor.addEventListener('paste',e=>{const files=Array.from(e.clipboardData?.files||[]).filter(f=>String(f.type||'').startsWith('image/'));if(!files.length)return;e.preventDefault();const rect=stage.getBoundingClientRect();uploadFiles(files,{x:clamp(lastPointer.x-rect.left,20,Math.max(20,rect.width-320)),y:Math.max(30,lastPointer.y-rect.top)})});
    stage.addEventListener('pointermove',e=>{lastPointer={x:e.clientX,y:e.clientY}});stage.addEventListener('pointerdown',e=>{if(!e.target.closest('.np-image-card-v249')){selectedImageId='';$$('.np-image-card-v249',imagesHost).forEach(x=>x.classList.remove('selected'))}});
    stage.addEventListener('dragover',e=>{if(Array.from(e.dataTransfer?.types||[]).includes('Files'))e.preventDefault()});stage.addEventListener('drop',e=>{const files=Array.from(e.dataTransfer?.files||[]).filter(f=>String(f.type||'').startsWith('image/'));if(!files.length)return;e.preventDefault();const rect=stage.getBoundingClientRect();uploadFiles(files,{x:clamp(e.clientX-rect.left,20,Math.max(20,rect.width-320)),y:Math.max(30,e.clientY-rect.top)})});

    $('[data-title]',root).addEventListener('input',()=>{activePage.title=$('[data-title]',root).value||`Page ${Math.max(1,state.pages.findIndex(p=>p.id===activePage.id)+1)}`;activePage.updatedAt=Date.now();renderSidebar();scheduleSave()});
    $('[data-paper]',root).addEventListener('change',e=>{activePage.paper=e.target.value;stage.dataset.paper=activePage.paper;scheduleSave(40)});
    $('[data-search]',root).addEventListener('input',renderSidebar);
    $('[data-new-category]',root).onclick=createCategory;$('[data-new-page-top]',root).onclick=createPage;
    const legacyUploadButton=$('[data-upload]',root);if(legacyUploadButton)legacyUploadButton.onclick=()=>$('[data-file]',root).click();$('[data-file]',root).onchange=e=>{uploadFiles(e.target.files);e.target.value=''};
    $('[data-sidebar]',root).onclick=()=>{root.classList.toggle('np-sidebar-hidden-v254');root.classList.remove('sidebar-open')};
    $('[data-exit]',root).onclick=()=>{persistPageFromDom();config.exit?.()};
    root.addEventListener('pointerdown',e=>{if(!e.target.closest('[data-context]'))hideContext();if(!e.target.closest('[data-mention],.np-editor-v249'))hideMention()});
    window.addEventListener('resize',hideMention);

    openPage(activePage.id);
    const api={
      openPage(id){openPage(id)},
      getActivePageId(){return activePage?.id||''},
      destroy(){clearTimeout(saveTimer);if(hasRenderedPage){try{persistPageFromDom()}catch{}}window.removeEventListener('resize',hideMention);host.innerHTML='';host.__loggyNotepadV249=null}
    };
    host.__loggyNotepadV249=api;return api;
  }

  function openPage(host,pageId){return host?.__loggyNotepadV249?.openPage?.(pageId)}
  window.LoggyNotepadV249={mount,openPage,normalizeState,PAPER_OPTIONS};
})();
