/* Loggy Notepad V250 — slash blocks, paper tools, zen, drawing, highlighting, PDF */
(() => {
'use strict';
if(window.__loggyNotepadV250)return;window.__loggyNotepadV250=true;
const $=(s,r=document)=>r?.querySelector?.(s)||null,$$=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip=html=>{const d=document.createElement('div');d.innerHTML=String(html||'');return(d.textContent||'').replace(/\u00a0/g,' ').replace(/\n{3,}/g,'\n\n').trim()};
const uid=(p='id')=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
function modal(root){
  let ov=$('.np-v250-modal',root);
  if(!ov){ov=document.createElement('div');ov.className='np-v250-modal';ov.hidden=true;ov.innerHTML='<div class="np-v250-modal-box"></div>';root.appendChild(ov)}
  const box=ov.firstElementChild;let resolver=null;
  const close=value=>{ov.hidden=true;box.innerHTML='';const r=resolver;resolver=null;r?.(value)};
  ov.onpointerdown=e=>{if(e.target===ov)close(null)};
  const head=title=>`<div class="np-modal-head-v249"><h2>${esc(title)}</h2><button type="button" class="np-icon-v249" data-x aria-label="Close"><i class="ph ph-x"></i></button></div>`;
  return{
    close,
    form({title,fields=[],buttons=[]}){
      if(resolver)close(null);
      box.innerHTML=`${head(title)}<form data-f>${fields.map(f=>`<div class="np-field-v249"><label>${esc(f.label||f.name)}</label>${f.type==='textarea'?`<textarea name="${esc(f.name)}" rows="4" placeholder="${esc(f.placeholder||'')}">${esc(f.value||'')}</textarea>`:`<input name="${esc(f.name)}" type="${esc(f.type||'text')}" value="${esc(f.value||'')}" placeholder="${esc(f.placeholder||'')}">`}</div>`).join('')}<div class="np-modal-actions-v249"><button type="button" data-cancel>Cancel</button>${buttons.map((b,i)=>`<button type="submit" name="_action" value="${i}" class="${b.primary?'primary':''}">${esc(b.label)}</button>`).join('')}</div></form>`;
      ov.hidden=false;requestAnimationFrame(()=>box.querySelector('input,textarea')?.focus());
      return new Promise(resolve=>{resolver=resolve;box.querySelector('[data-x]').onclick=()=>close(null);box.querySelector('[data-cancel]').onclick=()=>close(null);box.querySelector('form').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const idx=Number(e.submitter?.value??data._action??0);delete data._action;close({data,action:idx})}})
    },
    choose({title,buttons=[]}){return this.form({title,fields:[],buttons})},
    pick({title,items=[],placeholder='Search…',empty='No matching results.'}){
      if(resolver)close(null);
      box.innerHTML=`${head(title)}<div class="np-v250-pick-search"><i class="ph ph-magnifying-glass"></i><input type="search" placeholder="${esc(placeholder)}" autocomplete="off"></div><div class="np-v250-pick-list"></div><div class="np-modal-actions-v249"><button type="button" data-cancel>Cancel</button></div>`;
      const input=$('input',box),list=$('.np-v250-pick-list',box);let filtered=[],index=0;
      const render=()=>{const q=String(input.value||'').trim().toLowerCase();filtered=items.filter(item=>!q||`${item.label||''} ${item.subtitle||''} ${item.search||''}`.toLowerCase().includes(q)).slice(0,250);index=Math.min(index,Math.max(0,filtered.length-1));list.innerHTML=filtered.length?filtered.map((item,i)=>`<button type="button" class="${i===index?'active':''}" data-i="${i}"><i class="ph ${esc(item.icon||'ph-link')}"></i><span><strong>${esc(item.label||'Item')}</strong><small>${esc(item.subtitle||'')}</small></span></button>`).join(''):`<div class="np-v250-pick-empty">${esc(empty)}</div>`;$$('button',list).forEach(b=>b.onclick=()=>close(filtered[Number(b.dataset.i)]||null))};
      input.oninput=()=>{index=0;render()};input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();index=(index+1)%Math.max(1,filtered.length);render()}else if(e.key==='ArrowUp'){e.preventDefault();index=(index-1+Math.max(1,filtered.length))%Math.max(1,filtered.length);render()}else if(e.key==='Enter'&&filtered.length){e.preventDefault();close(filtered[index])}else if(e.key==='Escape'){e.preventDefault();close(null)}};
      box.querySelector('[data-x]').onclick=()=>close(null);box.querySelector('[data-cancel]').onclick=()=>close(null);ov.hidden=false;render();requestAnimationFrame(()=>input.focus());return new Promise(resolve=>{resolver=resolve})
    }
  }
}
function caretRect(){const s=getSelection();if(!s?.rangeCount)return{left:100,top:100,bottom:120};const r=s.getRangeAt(0).cloneRange();r.collapse(true);return r.getBoundingClientRect()}
function putNode(editor,node){const s=getSelection();if(!s?.rangeCount||!editor.contains(s.anchorNode)){editor.append(node);return}const r=s.getRangeAt(0);r.deleteContents();r.insertNode(node);const br=document.createTextNode('\u00a0');node.after(br);r.setStartAfter(br);r.collapse(true);s.removeAllRanges();s.addRange(r);editor.dispatchEvent(new Event('input',{bubbles:true}))}
function execBlock(editor,tag){document.execCommand('formatBlock',false,tag);editor.dispatchEvent(new Event('input',{bubbles:true}))}
function renderLatex(raw){return window.renderLoggyLatexV250?window.renderLoggyLatexV250(raw):`<code>${esc(raw)}</code>`}
const LATEX_CHEATSHEET_V256=[
  ['Fraction','\\frac{a}{b}','a⁄b'],['Exponent','x^{2}','x²'],['Subscript','x_{i}','xᵢ'],
  ['Square root','\\sqrt{x}','√x'],['Nth root','\\sqrt[n]{x}','ⁿ√x'],
  ['Derivative','\\frac{d}{dx}f(x)','d⁄dx f(x)'],['Partial derivative','\\frac{\\partial f}{\\partial x}','∂f⁄∂x'],
  ['Integral','\\int_{a}^{b} f(x)\\,dx','∫ₐᵇ f(x) dx'],['Double integral','\\iint f(x,y)\\,dx\\,dy','∬ f(x,y) dx dy'],
  ['Summation','\\sum_{i=1}^{n} i','∑ᵢ₌₁ⁿ i'],['Product','\\prod_{i=1}^{n} i','∏ᵢ₌₁ⁿ i'],
  ['Limit','\\lim_{x \\to \\infty} f(x)','limₓ→∞ f(x)'],
  ['Greek letters','\\alpha \\beta \\gamma \\theta \\pi \\sigma','α β γ θ π σ'],
  ['Infinity','\\infty','∞'],['Plus/minus','\\pm','±'],['Not equal','\\neq','≠'],
  ['Less/greater equal','\\leq \\quad \\geq','≤   ≥'],['Multiply','\\times \\quad \\cdot','×   ·'],
  ['Matrix','\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}','⎡a  b⎤  ⎣c  d⎦'],
  ['Vector','\\vec{v}','v⃗'],['Absolute value','|x|','|x|'],
  ['Parentheses (auto-size)','\\left( \\frac{a}{b} \\right)','( a⁄b )']
];
async function promptLatexV256(M){
  let ov=$('.np-latex-modal-v256',document);
  if(!ov){
    ov=document.createElement('div');ov.className='np-v250-modal np-latex-modal-v256';ov.hidden=true;
    ov.innerHTML=`<div class="np-v250-modal-box np-latex-modal-box-v256">
      <div class="np-modal-head-v249"><h2>Inline LaTeX</h2><button type="button" class="np-icon-v249" data-x aria-label="Close"><i class="ph ph-x"></i></button></div>
      <div class="np-field-v249"><label>LaTeX</label><textarea data-latex-input rows="4" placeholder="\\frac{a}{b} + x^2"></textarea></div>
      <div class="np-latex-preview-v256" data-latex-preview></div>
      <button type="button" class="np-latex-cheatsheet-toggle-v256" data-cheatsheet-toggle><i class="ph ph-info"></i><span>Not sure what to type? Show symbol guide</span></button>
      <div class="np-latex-cheatsheet-v256" data-cheatsheet hidden>${LATEX_CHEATSHEET_V256.map((row,i)=>`<button type="button" class="np-latex-cheat-item-v256" data-cheat-i="${i}" title="${esc(row[0])}"><strong class="np-latex-cheat-symbol-v275">${esc(row[2]||row[0])}</strong><code>${esc(row[1])}</code></button>`).join('')}</div>
      <div class="np-modal-actions-v249"><button type="button" data-cancel>Cancel</button><button type="button" class="primary" data-insert>Insert Math</button></div>
    </div>`;
    document.body.appendChild(ov);
  }
  const root=ov.closest('.loggy-notepad-v249')||document.querySelector('.loggy-notepad-v249');
  if(root&&ov.parentElement!==root)root.appendChild(ov);
  const ta=$('[data-latex-input]',ov),preview=$('[data-latex-preview]',ov),sheet=$('[data-cheatsheet]',ov),toggle=$('[data-cheatsheet-toggle]',ov);
  ta.value='';preview.innerHTML='';sheet.hidden=true;
  toggle.onclick=()=>{sheet.hidden=!sheet.hidden;toggle.classList.toggle('open',!sheet.hidden)};
  $$('.np-latex-cheat-item-v256',sheet).forEach(b=>b.onclick=()=>{const snippet=LATEX_CHEATSHEET_V256[Number(b.dataset.cheatI)][1];const start=ta.selectionStart??ta.value.length,end=ta.selectionEnd??ta.value.length;ta.value=ta.value.slice(0,start)+snippet+ta.value.slice(end);ta.focus();ta.selectionStart=ta.selectionEnd=start+snippet.length;updatePreview()});
  const updatePreview=()=>{const v=ta.value.trim();preview.innerHTML=v?renderLatex(v):'<span class="np-latex-preview-empty-v256">Preview appears here</span>'};
  ta.oninput=updatePreview;
  ov.hidden=false;requestAnimationFrame(()=>ta.focus());
  return new Promise(resolve=>{
    const close=v=>{ov.hidden=true;resolve(v)};
    $('[data-x]',ov).onclick=()=>close(null);
    $('[data-cancel]',ov).onclick=()=>close(null);
    ov.onpointerdown=e=>{if(e.target===ov)close(null)};
    $('[data-insert]',ov).onclick=()=>close(ta.value.trim()||null);
    ta.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();close(ta.value.trim()||null)}else if(e.key==='Escape'){e.preventDefault();close(null)}};
  });
}
function pdfTextBlocks(html){
  const holder=document.createElement('div');holder.innerHTML=String(html||'');const blocks=[];
  const roman=n=>{const vals=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let out='';for(const [v,c] of vals)while(n>=v){out+=c;n-=v}return out};
  const add=(text,kind='body',prefix='')=>{text=String(text||'').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').trim();if(text)blocks.push({text,kind,prefix})};
  const walk=node=>{
    if(node.nodeType===Node.TEXT_NODE){add(node.textContent,'body');return}
    if(node.nodeType!==Node.ELEMENT_NODE)return;const tag=node.tagName.toLowerCase();
    if(/^h[1-6]$/.test(tag)){add(node.textContent,'heading');return}
    if(tag==='pre'||tag==='code'){add(node.textContent,'code');return}
    if(tag==='ul'||tag==='ol'){$(':scope',node);Array.from(node.children).filter(x=>x.tagName==='LI').forEach((li,i)=>add(li.textContent,'list',tag==='ul'?'• ':node.classList.contains('np-roman-v250')?`${roman(i+1)}. `:`${i+1}. `));return}
    if(node.classList.contains('np-sticky-v250')){add(node.textContent,'sticky');return}
    if(node.classList.contains('np-latex-v250')){add(node.dataset.latex||node.textContent,'math');return}
    if(node.classList.contains('np-audio-v250')){add(`Audio: ${node.querySelector('span')?.textContent||'Audio clip'}`,'body');return}
    if(node.classList.contains('np-video-v250')){add('Video embed','body');return}
    if(tag==='br'){blocks.push({text:'',kind:'spacer',prefix:''});return}
    if(['p','div','blockquote'].includes(tag)){const nested=Array.from(node.children).some(x=>[/^H[1-6]$/.test(x.tagName),['PRE','UL','OL'].includes(x.tagName)].some(Boolean)||x.classList.contains('np-sticky-v250'));if(!nested){add(node.textContent,tag==='blockquote'?'sticky':'body');return}}
    Array.from(node.childNodes).forEach(walk);
  };
  Array.from(holder.childNodes).forEach(walk);return blocks.length?blocks:[{text:strip(html),kind:'body',prefix:''}];
}
function canvasWords(ctx,text,maxWidth){
  const paras=String(text||'').split(/\n/),out=[];
  const segment=s=>{try{return Array.from(new Intl.Segmenter(undefined,{granularity:'word'}).segment(s),x=>x.segment)}catch{return s.split(/(\s+)/)}};
  for(const par of paras){if(!par){out.push('');continue}let line='';for(const seg of segment(par)){let next=line+seg;if(ctx.measureText(next).width<=maxWidth){line=next;continue}if(line.trim())out.push(line.trimEnd());line='';if(ctx.measureText(seg).width<=maxWidth){line=seg.trimStart();continue}let piece='';for(const ch of Array.from(seg)){if(ctx.measureText(piece+ch).width>maxWidth&&piece){out.push(piece);piece=ch}else piece+=ch}line=piece}if(line.trim()||!out.length)out.push(line.trimEnd())}return out;
}
function dataUrlBytes(url){const b64=String(url).split(',')[1]||'',bin=atob(b64),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a}
function bytesJoin(parts){let n=0;parts.forEach(p=>n+=p.length);const out=new Uint8Array(n);let at=0;parts.forEach(p=>{out.set(p,at);at+=p.length});return out}
function pdfAscii(s){return new TextEncoder().encode(String(s))}
async function loadPdfImage(src){return new Promise(resolve=>{if(!src)return resolve(null);let u;try{u=new URL(src,location.href)}catch{return resolve(null)};const same=u.protocol==='data:'||u.origin===location.origin;if(!same)return resolve(null);const im=new Image();if(u.protocol!=='data:')im.crossOrigin='anonymous';const timer=setTimeout(()=>resolve(null),6000);im.onload=()=>{clearTimeout(timer);resolve(im)};im.onerror=()=>{clearTimeout(timer);resolve(null)};im.src=u.href})}
async function renderNotebookCanvases(notebookPage,darkMode=false){
  const W=1224,H=1584,M=96,BOTTOM=94,contentW=W-M*2;let pages=[],canvas,ctx,y;
  const paper=notebookPage?.paper||'blank',paperColor=notebookPage?.paperColorV250||'#ffffff';
  const newPage=(continuation=false)=>{canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle=darkMode&&!notebookPage?.paperColorV250?'#17191d':paperColor;ctx.fillRect(0,0,W,H);const rule=darkMode?'rgba(255,255,255,.10)':'rgba(55,70,90,.11)';ctx.strokeStyle=rule;ctx.fillStyle=rule;ctx.lineWidth=1.4;if(paper==='lined'||paper==='cornell'){for(let yy=205;yy<H-55;yy+=48){ctx.beginPath();ctx.moveTo(M-18,yy);ctx.lineTo(W-M+18,yy);ctx.stroke()}}if(paper==='graph'){for(let xx=M-18;xx<W-M+18;xx+=42){ctx.beginPath();ctx.moveTo(xx,145);ctx.lineTo(xx,H-55);ctx.stroke()}for(let yy=145;yy<H-55;yy+=42){ctx.beginPath();ctx.moveTo(M-18,yy);ctx.lineTo(W-M+18,yy);ctx.stroke()}}if(paper==='dot'){for(let xx=M-10;xx<W-M+10;xx+=42)for(let yy=160;yy<H-55;yy+=42){ctx.beginPath();ctx.arc(xx,yy,1.7,0,Math.PI*2);ctx.fill()}}if(paper==='cornell'){ctx.beginPath();ctx.moveTo(M+220,145);ctx.lineTo(M+220,H-210);ctx.stroke();ctx.beginPath();ctx.moveTo(M-18,H-210);ctx.lineTo(W-M+18,H-210);ctx.stroke()}ctx.fillStyle=darkMode?'#f4f4f5':'#1f2023';ctx.font='700 42px Arial, "Noto Sans", "Noto Sans CJK KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';ctx.fillText((notebookPage?.title||'Page')+(continuation?' · continued':''),M,92,contentW);ctx.font='400 19px Arial, "Noto Sans", sans-serif';ctx.fillStyle=darkMode?'#b9bbc1':'#74777d';ctx.fillText('Loggy Notebook',M,124);y=166;pages.push(canvas)};
  const ensure=h=>{if(y+h>H-BOTTOM)newPage(true)};const textColor=()=>darkMode?'#f1f2f4':'#222328';
  newPage(false);
  const blocks=pdfTextBlocks(notebookPage?.html||'');
  for(const b of blocks){if(b.kind==='spacer'){y+=18;continue}let font='400 27px Arial, "Noto Sans", "Noto Sans CJK KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif',lh=40,color=textColor(),indent=0;if(b.kind==='heading'){font='700 39px Arial, "Noto Sans", "Noto Sans CJK KR", "Malgun Gothic", sans-serif';lh=52}else if(b.kind==='code'){font='400 23px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';lh=35;color=darkMode?'#d8dde8':'#30333a'}else if(b.kind==='math'){font='400 29px "Times New Roman", serif';lh=44}else if(b.kind==='sticky'){font='500 27px Arial, "Noto Sans", "Malgun Gothic", sans-serif';lh=40;indent=24}else if(b.kind==='list'){indent=26}ctx.font=font;const prefix=b.prefix||'',lines=canvasWords(ctx,prefix+b.text,contentW-indent);const blockH=Math.max(lh,lines.length*lh)+12;ensure(Math.min(blockH,H-BOTTOM-170));if(b.kind==='sticky'){const drawH=Math.min(lines.length*lh+28,H-y-BOTTOM);ctx.fillStyle=darkMode?'rgba(255,221,122,.16)':'rgba(255,235,159,.62)';ctx.fillRect(M-12,y-26,contentW+24,drawH+20);ctx.fillStyle=color}if(b.kind==='code'){const drawH=Math.min(lines.length*lh+24,H-y-BOTTOM);ctx.fillStyle=darkMode?'rgba(255,255,255,.07)':'rgba(30,35,45,.06)';ctx.fillRect(M-12,y-25,contentW+24,drawH+18);ctx.fillStyle=color}ctx.fillStyle=color;ctx.font=font;for(const line of lines){ensure(lh+8);ctx.fillText(line||' ',M+indent,y,contentW-indent);y+=lh}y+=14}
  const imgs=(notebookPage?.images||[]).slice().sort((a,b)=>(Number(a.y)||0)-(Number(b.y)||0));
  for(const item of imgs){const image=await loadPdfImage(item.src||item.url);const caption=String(item.caption||item.name||'').trim();if(!image){ctx.font='italic 24px Arial, "Noto Sans", sans-serif';ctx.fillStyle=darkMode?'#b9bbc1':'#70737a';ensure(46);ctx.fillText(`[Image${caption?': '+caption:''}]`,M,y,contentW);y+=48;continue}const maxW=Math.min(contentW,900),maxH=560,scale=Math.min(maxW/image.naturalWidth,maxH/image.naturalHeight,1.5),iw=Math.max(1,image.naturalWidth*scale),ih=Math.max(1,image.naturalHeight*scale);ensure(ih+(caption?52:22));const x=M+(contentW-iw)/2;try{ctx.drawImage(image,x,y,iw,ih)}catch{}y+=ih+16;if(caption){ctx.font='italic 23px Arial, "Noto Sans", "Malgun Gothic", sans-serif';ctx.fillStyle=darkMode?'#c8cad0':'#62656b';const cap=canvasWords(ctx,caption,contentW);for(const line of cap){ensure(34);ctx.fillText(line,M,y,contentW);y+=34}}y+=20}
  const strokes=notebookPage?.drawingV250?.strokes||[];if(strokes.length){let xs=[],ys=[];strokes.forEach(st=>(st.points||[]).forEach(p=>{xs.push(Number(p.x)||0);ys.push(Number(p.y)||0)}));if(xs.length){const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),bw=Math.max(1,maxX-minX),bh=Math.max(1,maxY-minY),boxH=Math.min(520,Math.max(180,contentW*bh/bw));ensure(boxH+64);ctx.font='700 25px Arial, "Noto Sans", sans-serif';ctx.fillStyle=textColor();ctx.fillText('Handwritten annotations',M,y);y+=34;const scale=Math.min(contentW/bw,boxH/bh);ctx.save();ctx.translate(M-minX*scale,y-minY*scale);ctx.lineCap='round';ctx.lineJoin='round';for(const st of strokes){ctx.strokeStyle=darkMode?'#f2f2f2':(st.color||'#252525');ctx.lineWidth=Math.max(1.5,(Number(st.width)||2.2)*scale);ctx.beginPath();(st.points||[]).forEach((p,i)=>i?ctx.lineTo(p.x*scale,p.y*scale):ctx.moveTo(p.x*scale,p.y*scale));ctx.stroke()}ctx.restore();y+=boxH+28}}
  return pages;
}
async function canvasPdf(notebookPages,name,darkMode=false){
  const canvases=[];for(const p of notebookPages||[])canvases.push(...await renderNotebookCanvases(p,darkMode));if(!canvases.length)return;
  const images=canvases.map(c=>({w:c.width,h:c.height,bytes:dataUrlBytes(c.toDataURL('image/jpeg',.86))}));const count=images.length,catalog=1,pagesObj=2,objCount=2+count*3;const objectParts=new Array(objCount+1);const kids=[];
  for(let i=0;i<count;i++){const imageNum=3+i*3,contentNum=4+i*3,pageNum=5+i*3,j=images[i];kids.push(`${pageNum} 0 R`);objectParts[imageNum]=bytesJoin([pdfAscii(`<< /Type /XObject /Subtype /Image /Width ${j.w} /Height ${j.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${j.bytes.length} >>\nstream\n`),j.bytes,pdfAscii('\nendstream')]);const stream=`q\n612 0 0 792 0 0 cm\n/Im0 Do\nQ\n`;objectParts[contentNum]=pdfAscii(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);objectParts[pageNum]=pdfAscii(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 ${imageNum} 0 R >> >> /Contents ${contentNum} 0 R >>`)}
  objectParts[catalog]=pdfAscii(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);objectParts[pagesObj]=pdfAscii(`<< /Type /Pages /Count ${count} /Kids [${kids.join(' ')}] >>`);let chunks=[pdfAscii('%PDF-1.4\n%Loggy Notepad\n')],offsets=new Array(objCount+1).fill(0),pos=chunks[0].length;
  for(let n=1;n<=objCount;n++){offsets[n]=pos;const part=bytesJoin([pdfAscii(`${n} 0 obj\n`),objectParts[n],pdfAscii('\nendobj\n')]);chunks.push(part);pos+=part.length}const xref=pos;let trailer=`xref\n0 ${objCount+1}\n0000000000 65535 f \n`;for(let n=1;n<=objCount;n++)trailer+=String(offsets[n]).padStart(10,'0')+' 00000 n \n';trailer+=`trailer\n<< /Size ${objCount+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;chunks.push(pdfAscii(trailer));const blob=new Blob(chunks,{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(name||'notepad').replace(/[^a-z0-9._-]+/gi,'-')+'.pdf';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2500)
}

function enhance(host,config,api){const root=$('.loggy-notepad-v249',host);if(!root||root.dataset.v250)return;root.dataset.v250='1';const editor=$('[data-editor]',root),stage=$('[data-paper-stage]',root),top=$('.np-top-v249',root),workspace=$('[data-workspace]',root),M=modal(root);if(!editor||!stage||!top)return;
// V255: make notebook undo/redo explicit and reliable for editable text controls.
root.addEventListener('keydown',event=>{const mod=event.ctrlKey||event.metaKey;if(!mod||event.altKey)return;const key=String(event.key||'').toLowerCase();if(key!=='z'&&key!=='y')return;const redo=key==='y'||(key==='z'&&event.shiftKey),editable=event.target?.closest?.('input,textarea,[contenteditable="true"]');if(editable){event.preventDefault();event.stopPropagation();try{document.execCommand(redo?'redo':'undo')}catch{}queueMicrotask(()=>{try{editable.dispatchEvent(new Event('input',{bubbles:true}))}catch{}});return}if(redo?redoDrawingV255():undoDrawingV255()){event.preventDefault();event.stopPropagation()}},true);
  try{document.execCommand('defaultParagraphSeparator',false,'p')}catch{}
  $('[data-upload]',root)?.remove(); // slash command owns image upload now
  const paper=$('[data-paper]',root);if(paper){paper.innerHTML='<option value="blank">Blank</option><option value="graph">Grid</option><option value="dot">Dotted</option>';paper.classList.add('np-paper-select-hidden-v251')}
  $('.np-paper-label-v249',root)?.classList.add('np-paper-select-hidden-v251');
  const tools=document.createElement('div');tools.className='np-v250-tools';tools.innerHTML=`<button class="np-icon-v249" data-paper-modal title="Paper style and color" aria-label="Paper style and color"><i class="ph ph-file-text"></i></button><button class="np-icon-v249" data-dark title="Notebook dark mode"><i class="ph ph-moon"></i></button><button class="np-icon-v249" data-draw title="Draw / pen"><i class="ph ph-pencil-line"></i></button><button class="np-icon-v249" data-erase title="Erase drawing"><i class="ph ph-eraser"></i></button><button class="np-icon-v249" data-zen title="Zen mode"><i class="ph ph-arrows-out"></i></button><button class="np-icon-v249" data-export title="Export pages from this notebook"><i class="ph ph-file-pdf"></i></button>`;const cluster=document.createElement('div');cluster.className='np-toolbar-cluster-v254';const addPage=$('[data-new-page-top]',root),saveBadge=$('[data-save-state]',root);if(addPage)cluster.appendChild(addPage);cluster.appendChild(tools);if(saveBadge)cluster.appendChild(saveBadge);top.appendChild(cluster);
  const getState=()=>config.getState?.()||{},getPage=()=>{const s=getState();return s.pages?.find(p=>p.id===s.activePageId)||s.pages?.[0]},saveState=()=>config.saveState?.(getState());
  function applyPaper(){const s=getState(),p=getPage();root.classList.toggle('np-dark-v250',!!s.darkModeV250);if(p?.paper)stage.dataset.paper=p.paper;stage.style.setProperty('--np-paper-custom',p?.paperColorV250||'');if(p?.paperColorV250)stage.style.backgroundColor=p.paperColorV250;else stage.style.removeProperty('background-color')}
  const paperModal=document.createElement('div');paperModal.className='np-paper-modal-v251';paperModal.hidden=true;paperModal.innerHTML=`<div class="np-paper-modal-box-v251" role="dialog" aria-modal="true" aria-label="Paper settings"><div class="np-modal-head-v249"><h2>Paper</h2><button type="button" class="np-icon-v249" data-paper-close aria-label="Close"><i class="ph ph-x"></i></button></div><div class="np-paper-preview-grid-v251"><button type="button" data-paper-choice="blank"><span class="np-paper-preview-v251" data-preview-paper="blank"></span><strong>Blank</strong></button><button type="button" data-paper-choice="dot"><span class="np-paper-preview-v251" data-preview-paper="dot"></span><strong>Dotted</strong></button><button type="button" data-paper-choice="graph"><span class="np-paper-preview-v251" data-preview-paper="graph"></span><strong>Graph</strong></button></div><div class="np-paper-color-section-v251"><strong>Paper color</strong><div class="np-paper-color-grid-v251"><button type="button" data-paper-color="#ffffff" style="--c:#ffffff" aria-label="White"></button><button type="button" data-paper-color="#fff2b8" style="--c:#fff2b8" aria-label="Soft yellow"></button><button type="button" data-paper-color="#ffd9e2" style="--c:#ffd9e2" aria-label="Soft pink"></button><button type="button" data-paper-color="#dbeeff" style="--c:#dbeeff" aria-label="Soft blue"></button><button type="button" data-paper-color="#dff3df" style="--c:#dff3df" aria-label="Soft green"></button><button type="button" data-paper-color="#eadfff" style="--c:#eadfff" aria-label="Lavender"></button><button type="button" data-paper-color="#ffe0c2" style="--c:#ffe0c2" aria-label="Peach"></button><label class="np-paper-custom-color-v251" title="Custom paper color"><i class="ph ph-eyedropper"></i><input type="color" data-paper-color-custom value="#ffffff"></label></div></div></div>`;root.appendChild(paperModal);
  const syncPaperModal=()=>{const p=getPage();paperModal.querySelectorAll('[data-paper-choice]').forEach(b=>b.classList.toggle('active',b.dataset.paperChoice===(p?.paper||'blank')));paperModal.querySelectorAll('[data-paper-color]').forEach(b=>b.classList.toggle('active',String(b.dataset.paperColor).toLowerCase()===String(p?.paperColorV250||'#ffffff').toLowerCase()));const custom=$('[data-paper-color-custom]',paperModal);if(custom&&/^#[0-9a-f]{6}$/i.test(String(p?.paperColorV250||'')))custom.value=p.paperColorV250};
  const closePaperModal=()=>paperModal.hidden=true;$('[data-paper-close]',paperModal).onclick=closePaperModal;paperModal.onpointerdown=e=>{if(e.target===paperModal)closePaperModal()};$('[data-paper-modal]',tools).onclick=()=>{syncPaperModal();paperModal.hidden=false};
  $$('[data-paper-choice]',paperModal).forEach(b=>b.onclick=()=>{const p=getPage();if(!p)return;p.paper=b.dataset.paperChoice;paper.value=p.paper;applyPaper();syncPaperModal();saveState()});$$('[data-paper-color]',paperModal).forEach(b=>b.onclick=()=>{const p=getPage();if(!p)return;p.paperColorV250=b.dataset.paperColor;applyPaper();syncPaperModal();saveState()});$('[data-paper-color-custom]',paperModal).oninput=e=>{const p=getPage();if(!p)return;p.paperColorV250=e.target.value;applyPaper();syncPaperModal();saveState()};
  $('[data-dark]',tools).onclick=()=>{const s=getState();s.darkModeV250=!s.darkModeV250;applyPaper();$('[data-dark]',tools).classList.toggle('active',!!s.darkModeV250);saveState()};
  const zenExit=document.createElement('button');zenExit.type='button';zenExit.className='np-v250-zen-exit np-icon-v249';zenExit.innerHTML='<i class="ph ph-arrows-in"></i>';zenExit.title='Exit Zen mode';root.appendChild(zenExit);const toggleZen=()=>{const on=root.classList.toggle('np-zen-v250');host.classList.toggle('notepad-zen-host-v250',on);document.body.classList.toggle('notepad-zen-body-v250',on);$('[data-zen]',tools).classList.toggle('active',on)};$('[data-zen]',tools).onclick=toggleZen;zenExit.onclick=toggleZen;

  // Drawing canvas, persisted as compact stroke coordinates. Pen and eraser share one lightweight overlay.
  const canvas=document.createElement('canvas');canvas.className='np-draw-v250';stage.appendChild(canvas);let drawMode='',stroke=null,eraseHistoryPushed=false,drawUndoV255=[],drawRedoV255=[],erasedGestureV255=[];
  const cloneStrokeV255=st=>JSON.parse(JSON.stringify(st));
  function recordDrawingActionV255(action){if(!action)return;drawUndoV255.push(action);if(drawUndoV255.length>100)drawUndoV255.shift();drawRedoV255=[]}
  function applyDrawingActionV255(action,redo){const p=getPage();if(!p||!action)return false;p.drawingV250||={strokes:[]};const strokes=p.drawingV250.strokes||=[];if(action.type==='add'){if(redo){if(!strokes.some(st=>st.id===action.stroke.id))strokes.push(cloneStrokeV255(action.stroke))}else p.drawingV250.strokes=strokes.filter(st=>st.id!==action.stroke.id)}else if(action.type==='erase'){const ids=new Set(action.items.map(item=>item.stroke.id));if(redo){p.drawingV250.strokes=strokes.filter(st=>!ids.has(st.id))}else{const restored=[...strokes];for(const item of [...action.items].sort((a,b)=>a.index-b.index))restored.splice(Math.min(item.index,restored.length),0,cloneStrokeV255(item.stroke));p.drawingV250.strokes=restored}}paint();saveState();return true}
  function undoDrawingV255(){const action=drawUndoV255.pop();if(!action)return false;if(!applyDrawingActionV255(action,false))return false;drawRedoV255.push(action);return true}
  function redoDrawingV255(){const action=drawRedoV255.pop();if(!action)return false;if(!applyDrawingActionV255(action,true))return false;drawUndoV255.push(action);return true}
  function fitCanvas(){const dpr=Math.min(2,devicePixelRatio||1),w=stage.clientWidth,h=stage.scrollHeight;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));canvas.style.width=w+'px';canvas.style.height=h+'px';const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);paint()}
  function paint(){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.lineCap='round';c.lineJoin='round';for(const st of getPage()?.drawingV250?.strokes||[]){c.strokeStyle=root.classList.contains('np-dark-v250')&&st.autoDark?'#f2f2f2':(st.color||'#222');c.lineWidth=st.width||2.2;c.beginPath();(st.points||[]).forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}}
  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function eraseAtPoint(pt){const p=getPage();if(!p?.drawingV250?.strokes?.length)return;const radius=18,kept=[];p.drawingV250.strokes.forEach((st,index)=>{const hit=(st.points||[]).some(q=>Math.hypot(q.x-pt.x,q.y-pt.y)<=radius);if(hit){if(!erasedGestureV255.some(item=>item.stroke.id===st.id))erasedGestureV255.push({index,stroke:cloneStrokeV255(st)})}else kept.push(st)});p.drawingV250.strokes=kept;paint()}
  const setDrawMode=mode=>{drawMode=drawMode===mode?'':mode;root.classList.toggle('np-drawing-v250',!!drawMode);$('[data-draw]',tools).classList.toggle('active',drawMode==='pen');$('[data-erase]',tools).classList.toggle('active',drawMode==='eraser');canvas.dataset.mode=drawMode;fitCanvas()};
  canvas.onpointerdown=e=>{if(!drawMode)return;const p=getPage();if(!p)return;p.drawingV250 ||= {strokes:[]};if(drawMode==='eraser'){eraseHistoryPushed=true;erasedGestureV255=[];eraseAtPoint(point(e));canvas.setPointerCapture?.(e.pointerId);e.preventDefault();return}stroke={id:uid('stroke'),color:root.classList.contains('np-dark-v250')?'#f3f3f3':'#252525',autoDark:true,width:2.2,points:[point(e)]};p.drawingV250.strokes.push(stroke);canvas.setPointerCapture?.(e.pointerId);e.preventDefault()};
  canvas.onpointermove=e=>{if(drawMode==='eraser'&&e.buttons){eraseAtPoint(point(e));return}if(!stroke)return;stroke.points.push(point(e));paint()};
  canvas.onpointerup=()=>{if(stroke)recordDrawingActionV255({type:'add',stroke:cloneStrokeV255(stroke)});else if(eraseHistoryPushed&&erasedGestureV255.length)recordDrawingActionV255({type:'erase',items:erasedGestureV255.map(item=>({index:item.index,stroke:cloneStrokeV255(item.stroke)}))});if(stroke||eraseHistoryPushed){stroke=null;eraseHistoryPushed=false;erasedGestureV255=[];saveState()}};
  $('[data-draw]',tools).onclick=()=>setDrawMode('pen');$('[data-erase]',tools).onclick=()=>setDrawMode('eraser');new ResizeObserver(()=>fitCanvas()).observe(stage);

  // Slash command menu.
  const menu=document.createElement('div');menu.className='np-slash-v250';menu.hidden=true;menu.innerHTML='<div class="np-slash-search-v250"><i class="ph ph-magnifying-glass"></i><input placeholder="Search blocks…"></div><div class="np-slash-list-v250"></div>';root.appendChild(menu);const search=$('input',menu),list=$('.np-slash-list-v250',menu);let slashRange=null,menuItems=[],idx=0;
  const commands=[
    ['paragraph','Paragraph','ph-text-t','Normal text'],['h1','H1 Heading','ph-text-h-one','Largest heading'],['h2','H2 Heading','ph-text-h-two','Heading level 2'],['h3','H3 Heading','ph-text-h-three','Heading level 3'],['h4','H4 Heading','ph-text-h-four','Heading level 4'],['h5','H5 Heading','ph-text-h-five','Heading level 5'],['h6','H6 Heading','ph-text-h-six','Heading level 6'],['code','Code Block','ph-code','Monospace code'],['bullet','Bullet List','ph-list-bullets','Bulleted list'],['numbered','Numbered List','ph-list-numbers','1, 2, 3 list'],['roman','Roman Numerals','ph-list-numbers','I, II, III list'],['link','Text-Masked Link','ph-link','Custom display text + URL'],['day','Daily Log Mention','ph-calendar-blank','Link a specific Day'],['sticky','Post-It / Sticky Note','ph-note','Inline pastel callout'],['audio','Audio Clip','ph-speaker-high','Playable audio URL'],['image','Image','ph-image','Upload/paste image'],['video','Video Embed','ph-video','Top-level video player'],['latex','Inline LaTeX','ph-function','Rendered math block']
  ];
  function drawMenu(q=''){menuItems=commands.filter(c=>!q||`${c[1]} ${c[3]}`.toLowerCase().includes(q.toLowerCase()));idx=Math.min(idx,Math.max(0,menuItems.length-1));list.innerHTML=menuItems.map((c,i)=>`<button type="button" class="${i===idx?'active':''}" data-i="${i}"><i class="ph ${c[2]}"></i><span><strong>${esc(c[1])}</strong><small>${esc(c[3])}</small></span></button>`).join('');$$('button',list).forEach(b=>b.onclick=()=>run(menuItems[Number(b.dataset.i)]?.[0]))}
  function restoreSlashRange(){if(!slashRange)return;editor.focus();const s=getSelection();s.removeAllRanges();s.addRange(slashRange)}
  function putAtSlash(node){restoreSlashRange();return putNode(editor,node)}
  function openMenu(){const s=getSelection();if(!s?.rangeCount)return;slashRange=s.getRangeAt(0).cloneRange();const r=caretRect();menu.style.left=Math.max(8,Math.min(innerWidth-330,r.left))+'px';menu.style.top=Math.max(8,Math.min(innerHeight-390,r.bottom+8))+'px';menu.hidden=false;search.value='';drawMenu();requestAnimationFrame(()=>search.focus())}function closeMenu(){menu.hidden=true;restoreSlashRange()}search.oninput=()=>drawMenu(search.value);search.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();idx=(idx+1)%Math.max(1,menuItems.length);drawMenu(search.value)}else if(e.key==='ArrowUp'){e.preventDefault();idx=(idx-1+Math.max(1,menuItems.length))%Math.max(1,menuItems.length);drawMenu(search.value)}else if(e.key==='Enter'){e.preventDefault();run(menuItems[idx]?.[0])}else if(e.key==='Escape'){e.preventDefault();closeMenu()}};
  async function run(id){closeMenu();if(id==='paragraph')return execBlock(editor,'p');if(/^h[1-6]$/.test(id))return execBlock(editor,id);if(id==='code'){const pre=document.createElement('pre');pre.className='np-code-v250';pre.contentEditable='true';pre.innerHTML='<code>Code…</code>';return putAtSlash(pre)}if(id==='bullet'){document.execCommand('insertUnorderedList');return editor.dispatchEvent(new Event('input',{bubbles:true}))}if(id==='numbered'){document.execCommand('insertOrderedList');return editor.dispatchEvent(new Event('input',{bubbles:true}))}if(id==='roman'){document.execCommand('insertOrderedList');const li=getSelection()?.anchorNode?.parentElement?.closest('ol');if(li)li.classList.add('np-roman-v250');return editor.dispatchEvent(new Event('input',{bubbles:true}))}if(id==='image'){return $('[data-file]',root)?.click()}
    if(id==='link'){const r=await M.form({title:'Text-Masked Link',fields:[{name:'text',label:'Display text',placeholder:'Open reference'},{name:'url',label:'URL',type:'url',placeholder:'https://…'}],buttons:[{label:'Insert Link',primary:true}]});if(!r?.data?.url)return;const a=document.createElement('a');a.href=r.data.url;a.textContent=r.data.text||r.data.url;a.target='_blank';a.rel='noopener';a.className='np-masked-link-v250';return putAtSlash(a)}
    if(id==='day'){const days=(config.getLinkTargets?.()||[]).filter(x=>x.kind==='day').map(x=>({...x,icon:x.icon||'ph-calendar-blank',subtitle:x.subtitle||'Daily Logs'}));const t=await M.pick({title:'Link a Daily Log',items:days,placeholder:'Search Day 1, Day 2…',empty:'No Daily Log matches that search.'});if(!t)return;const a=document.createElement('a');a.href='#';a.contentEditable='false';a.className='np-ref-v249';a.textContent='@'+t.label;Object.entries(t).forEach(([k,v])=>{if(v!=null&&typeof v!=='object')a.dataset[k]=String(v)});return putAtSlash(a)}
    if(id==='sticky'){const d=document.createElement('div');d.className='np-sticky-v250 np-draggable-v256 np-sticky-object-v277';d.contentEditable='false';d.style.setProperty('--np-sticky-color','#fff1a8');d.innerHTML='<div class="np-sticky-text-v277" contenteditable="true">Sticky note…</div><button type="button" class="np-sticky-move-v277 np-drag-handle-v256" title="Move sticky note" contenteditable="false"><i class="ph ph-arrows-out-cardinal"></i></button><span class="np-sticky-resize-v277" title="Resize sticky note" contenteditable="false"></span>';return putAtSlash(d)}
    if(id==='audio'){const r=await M.form({title:'Audio Clip',fields:[{name:'url',label:'Audio URL',type:'url',placeholder:'https://…/audio.mp3'},{name:'label',label:'Label',placeholder:'Pronunciation'}],buttons:[{label:'Insert Full Player',primary:true},{label:'Insert Compact Button'}]});if(!r?.data?.url)return;const compact=r.action===1;const d=document.createElement('span');d.className=`np-audio-v250 np-draggable-v256${compact?' np-audio-compact-v256':''}`;d.contentEditable='false';d.dataset.url=r.data.url;d.dataset.label=r.data.label||'Audio clip';if(compact){d.innerHTML=`<span class="np-drag-handle-v256" title="Drag to move" contenteditable="false"><i class="ph ph-dots-six-vertical"></i></span><button type="button" class="np-audio-compact-btn-v256" title="${esc(r.data.label||'Play audio')}"><i class="ph ph-play-fill"></i></button><audio preload="metadata" src="${esc(r.data.url)}"></audio>`}else{d.innerHTML=`<span class="np-drag-handle-v256" title="Drag to move" contenteditable="false"><i class="ph ph-dots-six-vertical"></i></span><i class="ph ph-speaker-high"></i><span>${esc(r.data.label||'Audio clip')}</span><audio controls preload="metadata" src="${esc(r.data.url)}"></audio>`}return putAtSlash(d)}
    if(id==='video'){const r=await M.form({title:'Video Embed',fields:[{name:'url',label:'Video URL',type:'url',placeholder:'YouTube or direct MP4 URL'}],buttons:[{label:'Embed Video',primary:true}]});if(!r?.data?.url)return;const u=String(r.data.url),yt=(u.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/)||[])[1];const d=document.createElement('div');d.className='np-video-v250 np-draggable-v256';d.contentEditable='false';d.innerHTML=`<span class="np-drag-handle-v256" title="Drag to move" contenteditable="false"><i class="ph ph-dots-six-vertical"></i></span>`+(yt?`<iframe src="https://www.youtube.com/embed/${esc(yt)}" allowfullscreen></iframe>`:`<video controls preload="metadata" src="${esc(u)}"></video>`);return putAtSlash(d)}
    if(id==='latex'){const latex=await promptLatexV256(M);if(!latex)return;const d=document.createElement('span');d.className='np-latex-v250 np-draggable-v256';d.contentEditable='false';d.dataset.latex=latex;d.title='Drag equation to move';d.innerHTML=`<span class="np-latex-render-v256">${renderLatex(latex)}</span>`;return putAtSlash(d)}
  }
  editor.addEventListener('keydown',e=>{if((e.key==='/'||e.key==='\\')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.shiftKey){e.preventDefault();openMenu()}},true);
  root.addEventListener('pointerdown',e=>{if(!menu.hidden&&!e.target.closest('.np-slash-v250')&&!e.target.closest('.np-editor-v249'))closeMenu()},true);

  // Right-click components to remove them; selected text still opens the highlight palette.
  const STICKY_COLORS_V277=['#fff1a8','#ffd9e8','#d9f2d0','#d9eaff','#eadcff','#ffd9c7','#ffffff'];const blockMenu=document.createElement('div');blockMenu.className='np-block-context-v251';blockMenu.hidden=true;blockMenu.innerHTML=`<div class="np-sticky-colors-v277" data-sticky-colors hidden>${STICKY_COLORS_V277.map(c=>`<button type="button" data-sticky-color="${c}" style="--c:${c}" aria-label="Sticky color ${c}"></button>`).join('')}</div><button type="button" data-delete-block><i class="ph ph-trash"></i><span>Delete</span></button>`;root.appendChild(blockMenu);let blockTarget=null;const deletableSelector='.np-sticky-v250,.np-audio-v250,.np-video-v250,.np-latex-v250,.np-code-v250,.np-masked-link-v250,.np-ref-v249';const stickyColorPanelV277=$('[data-sticky-colors]',blockMenu);$$('[data-sticky-color]',blockMenu).forEach(btn=>btn.onclick=()=>{if(!blockTarget?.classList.contains('np-sticky-v250'))return;blockTarget.style.setProperty('--np-sticky-color',btn.dataset.stickyColor);$$('[data-sticky-color]',blockMenu).forEach(b=>b.classList.toggle('active',b===btn));editor.dispatchEvent(new Event('input',{bubbles:true}));blockMenu.hidden=true});$('[data-delete-block]',blockMenu).onclick=()=>{if(blockTarget){blockTarget.remove();editor.dispatchEvent(new Event('input',{bubbles:true}))}blockTarget=null;blockMenu.hidden=true};
  const pal=document.createElement('div');pal.className='np-highlight-v250';pal.hidden=true;const colors=['#fff1a8','#ffd9e8','#d9f2d0','#d9eaff','#eadcff','#ffd9c7','transparent'];pal.innerHTML=colors.map(c=>`<button type="button" data-c="${c}" style="--c:${c==='transparent'?'#fff':c}" title="${c==='transparent'?'Remove highlight':'Highlight'}"></button>`).join('');root.appendChild(pal);let hlRange=null;editor.addEventListener('contextmenu',e=>{const component=e.target.closest(deletableSelector);const sel=getSelection();const hasSelection=!!sel?.rangeCount&&!sel.isCollapsed&&editor.contains(sel.anchorNode);if(component&&!hasSelection){e.preventDefault();blockTarget=component;pal.hidden=true;const isSticky=component.classList.contains('np-sticky-v250');stickyColorPanelV277.hidden=!isSticky;if(isSticky){const active=String(getComputedStyle(component).getPropertyValue('--np-sticky-color')||component.style.getPropertyValue('--np-sticky-color')||'#fff1a8').trim().toLowerCase();$$('[data-sticky-color]',blockMenu).forEach(b=>b.classList.toggle('active',b.dataset.stickyColor.toLowerCase()===active))}blockMenu.style.left=Math.max(8,Math.min(innerWidth-220,e.clientX))+'px';blockMenu.style.top=Math.max(8,Math.min(innerHeight-(isSticky?105:50),e.clientY))+'px';blockMenu.hidden=false;return}if(!hasSelection)return;e.preventDefault();blockMenu.hidden=true;hlRange=sel.getRangeAt(0).cloneRange();pal.style.left=Math.max(8,Math.min(innerWidth-250,e.clientX))+'px';pal.style.top=Math.max(8,Math.min(innerHeight-60,e.clientY))+'px';pal.hidden=false});$$('button',pal).forEach(b=>b.onclick=()=>{if(!hlRange)return;const s=getSelection();s.removeAllRanges();s.addRange(hlRange);document.execCommand('hiliteColor',false,b.dataset.c==='transparent'?'transparent':b.dataset.c);pal.hidden=true;editor.dispatchEvent(new Event('input',{bubbles:true}))});root.addEventListener('pointerdown',e=>{if(!e.target.closest('.np-highlight-v250'))pal.hidden=true;if(!e.target.closest('.np-block-context-v251')){blockMenu.hidden=true;blockTarget=null}});
  // V256: click-to-select + Backspace/Delete key removal for insertable blocks, plus drag-to-move.
  let selectedBlockV256=null;
  const selectBlockV256=el=>{if(selectedBlockV256&&selectedBlockV256!==el)selectedBlockV256.classList.remove('np-block-selected-v256');selectedBlockV256=el;el?.classList.add('np-block-selected-v256')};
  editor.addEventListener('click',e=>{
    const dragHandle=e.target.closest('.np-drag-handle-v256');
    if(dragHandle)return; // handled by drag logic
    const block=e.target.closest(deletableSelector);
    if(block&&block.contentEditable!=='true'){selectBlockV256(block)}
    else if(selectedBlockV256){selectBlockV256(null)}
  });
  root.addEventListener('pointerdown',e=>{if(!e.target.closest(deletableSelector))selectBlockV256(null)});
  editor.addEventListener('keydown',e=>{
    if((e.key!=='Backspace'&&e.key!=='Delete')||!selectedBlockV256)return;
    e.preventDefault();
    const el=selectedBlockV256;selectedBlockV256=null;
    el.remove();
    editor.dispatchEvent(new Event('input',{bubbles:true}));
  });
  // V275: LaTeX has no visible drag chrome. Grab the rendered equation itself to move it.
  // Other draggable notebook blocks still use their dedicated drag handle.
  const normalizeLatexBlocksV275=()=>{$$('.np-latex-v250',editor).forEach(block=>{block.querySelectorAll('.np-drag-handle-v256').forEach(handle=>handle.remove());block.title='Drag equation to move'})};
  const normalizeStickyBlocksV277=()=>{$$('.np-sticky-v250',editor).forEach(block=>{block.classList.add('np-draggable-v256','np-sticky-object-v277');block.contentEditable='false';let text=$('.np-sticky-text-v277',block);if(!text){text=document.createElement('div');text.className='np-sticky-text-v277';text.contentEditable='true';const nodes=Array.from(block.childNodes).filter(n=>!(n.nodeType===1&&n.matches?.('.np-drag-handle-v256,.np-sticky-resize-v277')));nodes.forEach(n=>text.appendChild(n));block.prepend(text)}if(!block.style.getPropertyValue('--np-sticky-color')){const inline=block.style.backgroundColor;block.style.setProperty('--np-sticky-color',inline||'#fff1a8');block.style.removeProperty('background-color')}if(!$('.np-sticky-move-v277',block)){const move=document.createElement('button');move.type='button';move.className='np-sticky-move-v277 np-drag-handle-v256';move.title='Move sticky note';move.contentEditable='false';move.innerHTML='<i class="ph ph-arrows-out-cardinal"></i>';block.appendChild(move)}if(!$('.np-sticky-resize-v277',block)){const grip=document.createElement('span');grip.className='np-sticky-resize-v277';grip.title='Resize sticky note';grip.contentEditable='false';block.appendChild(grip)}})};
  normalizeLatexBlocksV275();normalizeStickyBlocksV277();
  // Sticky resize grip. Size is stored inline with the notebook HTML, so it persists.
  editor.addEventListener('pointerdown',e=>{const grip=e.target.closest('.np-sticky-resize-v277');if(!grip||e.button!==0)return;const block=grip.closest('.np-sticky-v250');if(!block)return;e.preventDefault();e.stopPropagation();selectBlockV256(block);const rect=block.getBoundingClientRect(),startX=e.clientX,startY=e.clientY,startW=rect.width,startH=rect.height;const move=ev=>{block.style.width=Math.max(140,startW+(ev.clientX-startX))+'px';block.style.height=Math.max(100,startH+(ev.clientY-startY))+'px'};const up=()=>{window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);editor.dispatchEvent(new Event('input',{bubbles:true}))};window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true)},true);
  // Dragging: convert a draggable block to absolutely-positioned within the paper on first drag.
  editor.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const latexBlock=e.target.closest('.np-latex-v250');
    const handle=e.target.closest('.np-drag-handle-v256');
    const block=latexBlock||handle?.closest('.np-draggable-v256');
    if(!block)return;
    if(!latexBlock&&!handle)return;
    e.preventDefault();e.stopPropagation();
    selectBlockV256(block);
    const parent=block.offsetParent||editor;
    const parentRect=parent.getBoundingClientRect();
    const blockRect=block.getBoundingClientRect();
    if(!block.classList.contains('np-block-floating-v256')){
      block.classList.add('np-block-floating-v256');
      block.style.left=`${blockRect.left-parentRect.left+(parent.scrollLeft||0)}px`;
      block.style.top=`${blockRect.top-parentRect.top+(parent.scrollTop||0)}px`;
    }
    const startX=e.clientX,startY=e.clientY;
    const startLeft=parseFloat(block.style.left)||0,startTop=parseFloat(block.style.top)||0;
    const move=ev=>{
      const maxX=Math.max(0,(parent.clientWidth||stage.clientWidth)-Math.min(block.offsetWidth||40,120));
      const nx=clampNumV256(startLeft+(ev.clientX-startX),0,maxX);
      const ny=Math.max(0,startTop+(ev.clientY-startY));
      block.style.left=`${nx}px`;block.style.top=`${ny}px`;
    };
    const up=()=>{window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);editor.dispatchEvent(new Event('input',{bubbles:true}))};
    window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);
  });
  function clampNumV256(n,a,b){return Math.max(a,Math.min(b,Number(n)||0))}
  // V256: compact audio button play/pause toggle.
  editor.addEventListener('click',e=>{
    const btn=e.target.closest('.np-audio-compact-btn-v256');
    if(!btn)return;
    e.preventDefault();
    const wrap=btn.closest('.np-audio-compact-v256');
    const audioEl=wrap?.querySelector('audio');
    if(!audioEl)return;
    if(audioEl.paused){audioEl.play().catch(()=>{});btn.classList.add('playing');btn.querySelector('i').className='ph ph-pause-fill'}
    else{audioEl.pause();btn.classList.remove('playing');btn.querySelector('i').className='ph ph-play-fill'}
  });
  editor.addEventListener('ended',e=>{
    const wrap=e.target.closest?.('.np-audio-compact-v256');
    if(!wrap)return;
    const btn=wrap.querySelector('.np-audio-compact-btn-v256');
    if(btn){btn.classList.remove('playing');btn.querySelector('i').className='ph ph-play-fill'}
  },true);



  function parsePageSelection(spec,pages){const values=new Set(),max=pages.length;for(const token of String(spec||'').split(',').map(v=>v.trim()).filter(Boolean)){const m=token.match(/^(\d+)\s*-\s*(\d+)$/);if(m){let a=Number(m[1]),b=Number(m[2]);if(a>b)[a,b]=[b,a];for(let n=a;n<=b;n++)if(n>=1&&n<=max)values.add(n-1);continue}const n=Number(token);if(Number.isInteger(n)&&n>=1&&n<=max)values.add(n-1)}return [...values].sort((a,b)=>a-b).map(i=>pages[i]).filter(Boolean)}
  $('[data-export]',tools).onclick=async()=>{const s=getState(),p=getPage(),categoryId=p?.categoryId||s.activeCategoryId,notebook=s.categories?.find(c=>c.id===categoryId),pages=(s.pages||[]).filter(page=>page&&page.categoryId===categoryId),notebookName=notebook?.name||'Notebook';const r=await M.choose({title:`Export ${notebookName} PDF`,buttons:[{label:'Current Page',primary:true},{label:'Choose Pages',primary:false},{label:'Entire Notebook',primary:false}]});if(!r)return;let chosen=[],name=notebookName;if(r.action===0){chosen=[p].filter(Boolean);name=`${notebookName}-${p?.title||'page'}`}else if(r.action===2){chosen=pages}else{const current=Math.max(1,pages.findIndex(x=>x.id===p?.id)+1),select=await M.form({title:`Choose Pages · ${notebookName}`,fields:[{name:'pages',label:'Page numbers or ranges',value:String(current),placeholder:'1-5, 8, 10-12'}],buttons:[{label:'Export Selected',primary:true}]});if(!select)return;chosen=parsePageSelection(select.data?.pages,pages);if(!chosen.length){const toastEl=$('.np-toast-v249',root);if(toastEl){toastEl.textContent='Enter at least one valid page number from this notebook.';toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),1800)}return}name=`${notebookName}-selected-pages`}const button=$('[data-export]',tools);button?.classList.add('active');button?.setAttribute('aria-busy','true');try{await canvasPdf(chosen,name,!!s.darkModeV250)}finally{button?.classList.remove('active');button?.removeAttribute('aria-busy')}};
  // Always release workspace-only state when leaving or destroying the Notepad.
  const cleanupWorkspaceV250=()=>{root.classList.remove('np-zen-v250','np-drawing-v250');drawMode='';host.classList.remove('notepad-zen-host-v250');document.body.classList.remove('notepad-zen-body-v250')};
  $('[data-exit]',root)?.addEventListener('click',cleanupWorkspaceV250,true);
  if(api&&typeof api.destroy==='function'){const oldDestroy=api.destroy.bind(api);api.destroy=()=>{cleanupWorkspaceV250();return oldDestroy()}}
  // Reapply page-specific paper/drawing after every base page navigation without a whole-page observer.
  const refresh=()=>{drawUndoV255=[];drawRedoV255=[];setTimeout(()=>{normalizeLatexBlocksV275();normalizeStickyBlocksV277();applyPaper();fitCanvas()},0)};
  const previousRouteChanged=config.routeChanged;config.routeChanged=function(){try{previousRouteChanged?.apply(this,arguments)}finally{refresh()}};
  root.addEventListener('click',e=>{if(e.target.closest('.np-page-row-v249,.np-notebook-page-preview-v254,[data-new-page-top]'))refresh()});let fitTimerV250=0;editor.addEventListener('input',()=>{clearTimeout(fitTimerV250);fitTimerV250=setTimeout(fitCanvas,80)});applyPaper();$('[data-dark]',tools).classList.toggle('active',!!getState().darkModeV250);fitCanvas();
}
function patch(){const R=window.LoggyNotepadV249;if(!R||R.__v250Patched)return false;R.__v250Patched=true;const old=R.mount;R.mount=function(host,config){const api=old.apply(this,arguments);try{enhance(host,config,api)}catch(e){console.error('Notepad V250 enhancement failed',e)}return api};return true}
if(!patch())document.addEventListener('DOMContentLoaded',patch,{once:true})
})();
