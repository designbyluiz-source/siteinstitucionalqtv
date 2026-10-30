const solutions={
  payments:{kicker:'PAYMENT INFRASTRUCTURE',title:'Valor em movimento.\nComplexidade sob controle.',copy:'Infraestrutura de pagamentos que conecta a experiência financeira à operação. Uma base tecnológica para integrar fluxos e reduzir a fragmentação.',left:'Origem',right:'Destino',subject:'Pagamentos'},
  crossborder:{kicker:'CROSS-BORDER OPERATIONS',title:'Sua operação,\nalém das fronteiras.',copy:'Tecnologia e infraestrutura operacional para conectar mercados. Uma visão integrada de pagamentos e liquidação para apoiar a expansão internacional.',left:'Mercado A',right:'Mercado B',subject:'Operações cross-border'},
  digital:{kicker:'DIGITAL ASSET INFRASTRUCTURE',title:'Novos ativos.\nUma base consistente.',copy:'Ativos digitais e stablecoins dentro de uma arquitetura financeira conectada. A aproximação entre novas formas de valor e operações do mundo real.',left:'Digital',right:'Financeiro',subject:'Ativos digitais'},
  software:{kicker:'FINANCIAL SOFTWARE',title:'Tecnologia na base.\nEficiência na operação.',copy:'Desenvolvimento de software financeiro e produtos próprios para conectar fluxos, reduzir a complexidade e dar consistência à operação.',left:'Software',right:'Operação',subject:'Software financeiro'},
  prediction:{kicker:'PREDICTION MARKETS',title:'Novas perspectivas.\nNovos mercados.',copy:'Tecnologia para mercados de predição como parte de um ecossistema financeiro em evolução. Infraestrutura para conectar informação, participação e mercados digitais.',left:'Informação',right:'Mercados',subject:'Mercados de predição'},
  transactions:{kicker:'TRANSACTIONAL OPERATIONS',title:'Cada etapa conectada.\nUma operação mais fluida.',copy:'Infraestrutura tecnológica e operacional para unir as etapas do fluxo transacional. Menos fragmentação entre movimentação, processamento e liquidação.',left:'Transação',right:'Liquidação',subject:'Operações transacionais'}
};
const tabs=[...document.querySelectorAll('.solution-tab')];
function selectSolution(tab,focus=false){
  const data=solutions[tab.dataset.solution];
  tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});
  document.getElementById('solution-panel').setAttribute('aria-labelledby',tab.id);
  document.getElementById('panel-kicker').textContent=data.kicker;
  const title=document.getElementById('panel-title');title.replaceChildren();
  data.title.split('\n').forEach((line,i)=>{if(i)title.append(document.createElement('br'));title.append(document.createTextNode(line));});
  document.getElementById('panel-copy').textContent=data.copy;
  document.getElementById('node-left').textContent=data.left;
  document.getElementById('node-right').textContent=data.right;
  document.getElementById('panel-cta').href=`mailto:contato@qtvholding.com?subject=${encodeURIComponent(data.subject+' | Quantum')}`;
  if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectSolution(tab));
  tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;
    else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();selectSolution(tabs[next],true);
  });
});
const menuToggle=document.querySelector('.menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menu');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileNav.hidden){closeMenu();menuToggle.focus();}});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('[data-select]').forEach(link=>link.addEventListener('click',()=>{const tab=tabs.find(tab=>tab.dataset.solution===link.dataset.select);if(tab)selectSolution(tab);}));
document.querySelector('a[href="#corporativo"]').addEventListener('click',()=>{document.getElementById('corporativo').open=true;});
const cases={mesaotc:{name:'MesaOTC',category:'LIQUIDEZ',description:'Mesa de operações OTC para negociações de alto volume com agilidade.'},rawgates:{name:'Rawgates',category:'INFRATECH',description:'Infraestrutura tecnológica robusta para operações financeiras.'},gates2b:{name:'Gates2b',category:'PAGAMENTOS',description:'Infraestrutura de pagamentos com alta disponibilidade. Processamento seguro e rápido para operações de qualquer escala.'},globaldex:{name:'GlobalDex',category:'BANKING & CRYPTO',description:'Plataforma para gerenciamento de ativos digitais e tradicionais, com controle sobre investimentos e fluxos financeiros.'},vertico:{name:'VerticoSys',category:'ERP',description:'Gestão empresarial integrada para operações financeiras e administrativas.'}};
const caseTabs=[...document.querySelectorAll('.case-tabs [role="tab"]')];
function selectCase(key,focus=false){const data=cases[key];if(!data)return;caseTabs.forEach(tab=>{const selected=tab.dataset.case===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();});document.getElementById('case-panel').setAttribute('aria-labelledby','case-'+key);document.getElementById('case-name').textContent=data.name;document.getElementById('case-category').textContent=data.category;document.getElementById('case-description').textContent=data.description;}
document.querySelectorAll('[data-case]').forEach(link=>link.addEventListener('click',()=>selectCase(link.dataset.case)));
caseTabs.forEach((tab,index)=>tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%caseTabs.length;else if(event.key==='ArrowLeft')next=(index-1+caseTabs.length)%caseTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=caseTabs.length-1;else return;event.preventDefault();selectCase(caseTabs[next].dataset.case,true);}));

