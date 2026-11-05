(() => {
  'use strict';
  const $=s=>document.querySelector(s), all=s=>document.querySelectorAll(s);
  const ART='./assets/lotus-paper.webp';
  const guestView=new URLSearchParams(location.search).get('view')==='invite';
  if(guestView)document.body.classList.add('guest-view');
  const field=(name,label,type='text',wide=false,hint='')=>({name,label,type,wide,hint});
  const typefaces={
    original:{label:'Theo mẫu hiện tại'},
    'great-vibes':{label:'Great Vibes · Thư pháp',family:"'Great Vibes',cursive"},
    'dancing-script':{label:'Dancing Script · Mềm mại',family:"'Dancing Script',cursive",query:'Dancing+Script:wght@400;600'},
    cormorant:{label:'Cormorant Garamond · Thanh lịch',family:"'Cormorant Garamond',Georgia,serif"},
    lora:{label:'Lora · Cổ điển',family:"'Lora',Georgia,serif",query:'Lora:wght@400;500;600'},
    'noto-serif':{label:'Noto Serif · Trang nhã',family:"'Noto Serif',Georgia,serif",query:'Noto+Serif:wght@400;500;600'},
    'be-vietnam':{label:'Be Vietnam Pro · Gọn gàng',family:"'Be Vietnam Pro',Arial,sans-serif",query:'Be+Vietnam+Pro:wght@400;500;600'},
    'dm-sans':{label:'DM Sans · Hiện đại',family:"'DM Sans',Arial,sans-serif"},
  };
  const typeGroups=[['name','Tên cô dâu & chú rể',70],['heading','Tiêu đề',70],['body','Nội dung',90]];
  const typographyFields=typeGroups.flatMap(([key,label,min])=>[
    {...field(key+'Font','Kiểu chữ · '+label,'select'),choices:typefaces,defaultValue:'original'},
    {...field(key+'Size','Cỡ chữ · '+label,'range'),min,max:140,step:5,defaultValue:'100'},
  ]);
  const groups=[
    {title:'Kiểu chữ & cỡ chữ',typography:true,fields:typographyFields},
    {title:'01 / Hai chúng mình',fields:[field('groom','Họ tên chú rể'),field('bride','Họ tên cô dâu'),field('groomShort','Tên gọi chú rể','text',false,'Để trống để tự lấy tên cuối.'),field('brideShort','Tên gọi cô dâu','text',false,'Để trống để tự lấy tên cuối.'),field('guest','Tên khách được mời','text',true,'Ví dụ: Anh Tuấn và gia đình. Để trống sẽ là Quý khách.'),field('date','Ngày cưới chính','date'),field('time','Giờ bắt đầu chung','time',false,'Giờ Việt Nam. Có thể điền riêng ở hai nhà.'),field('lunarDate','Ngày âm lịch','text',true,'Tự điền nếu muốn hiển thị, ví dụ: 08/10 âm lịch.'),field('message','Lời mời trên ảnh bìa','textarea',true),field('messageEn','Lời mời tiếng Anh','textarea',true,'Có thể để trống để dùng lời mời tiếng Anh có sẵn.')]},
    ...['groom','bride'].map((side,i)=>({title:`0${i+2} / ${side==='groom'?'Nhà trai · Lễ Thành Hôn':'Nhà gái · Lễ Vu Quy'}`,fields:[field(side+'Date','Ngày tổ chức lễ','date'),field(side+'Time','Giờ tổ chức lễ','time'),field(side+'Venue','Tên địa điểm','text',true),field(side+'Address','Địa chỉ cụ thể','text',true),field(side+'Map','Link Google Maps','url',true,'Có thể để trống; nút chỉ đường sẽ tìm theo địa chỉ.'),field(side+'Father','Họ tên bố'),field(side+'Mother','Họ tên mẹ'),field(side+'Parents','Ghi chú gia đình','textarea',true),field(side+'PartyDate','Ngày đãi tiệc','date',false,'Nếu đãi tiệc khác ngày làm lễ.'),field(side+'PartyTime','Giờ đãi tiệc','time')]})),
    {title:'04 / Ảnh bìa & chân dung',fields:[field('heroPhoto','Ảnh bìa','url',true,'Dán link HTTPS hoặc đường dẫn ./assets/photos/anh-bia.jpg sau khi đưa ảnh lên GitHub.'),field('bridePhoto','Chân dung cô dâu','url',true),field('groomPhoto','Chân dung chú rể','url',true)]},
    {title:'05 / Album ảnh cưới',fields:Array.from({length:6},(_,i)=>field('photo'+i,'Ảnh cưới thứ '+(i+1),'url',true))},
    {title:'06 / Câu chuyện tình yêu',fields:Array.from({length:3},(_,i)=>[field(`story${i}Date`,`Mốc ${i+1} · ngày / nhãn`),field(`story${i}Title`,`Mốc ${i+1} · tiêu đề`),field(`story${i}Text`,`Mốc ${i+1} · câu chuyện`,'textarea',true),field(`story${i}TextEn`,`Mốc ${i+1} · tiếng Anh`,'textarea',true)]).flat()},
    {title:'07 / Phong bì yêu thương',fields:['bride','groom'].flatMap(side=>[field(side+'QR',`Ảnh QR ${side==='bride'?'cô dâu':'chú rể'}`,'url',true,'Để trống để hiện nút gửi lời chúc.'),field(side+'Bank','Ngân hàng'),field(side+'Account','Số tài khoản'),field(side+'AccountName','Tên chủ tài khoản','text',true)])},
  ];
  const fields=groups.flatMap(g=>g.fields), defaults=Object.fromEntries(fields.map(f=>[f.name,f.defaultValue||'']));
  const limits=name=>name==='message'||name==='messageEn'||/Text(?:En)?$|Parents$/.test(name)?1200:/Photo$|^photo\d$|QR$|Map$/.test(name)?2000:/Address$/.test(name)?300:120;
  const normalDate=value=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
    const [y,m,d]=value.split('-').map(Number),check=new Date(Date.UTC(y,m-1,d));
    return y>=1900&&y<=2199&&check.getUTCFullYear()===y&&check.getUTCMonth()===m-1&&check.getUTCDate()===d?value:'';
  };
  function validFieldUrl(f,value){
    try{
      if(!f.name.endsWith('Map')&&/^(?:\.\/)?assets\//.test(value)){
        const base=new URL('./assets/',location.href),candidate=new URL(value,location.href);
        return candidate.origin===base.origin&&candidate.pathname.startsWith(base.pathname);
      }
      return new URL(value).protocol==='https:';
    }catch{return false;}
  }
  function normalize(raw){
    const clean={...defaults};if(!raw||typeof raw!=='object'||Array.isArray(raw))return clean;
    for(const f of fields){if(typeof raw[f.name]!=='string')continue;let value=raw[f.name].trim().slice(0,limits(f.name));
      if(f.type==='select'&&!Object.hasOwn(f.choices,value))value=f.defaultValue;
      if(f.type==='range')value=value!==''&&Number.isFinite(Number(value))?String(Math.max(f.min,Math.min(f.max,Math.round(Number(value)/f.step)*f.step))):f.defaultValue;
      if(f.type==='url'&&value&&!validFieldUrl(f,value))value='';
      if(f.type==='date'&&value)value=normalDate(value);
      if(f.type==='time'&&value&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))value='';
      clean[f.name]=value;
    }return clean;
  }
  const siteDefaults=normalize(window.WEDDING_CONFIG);
  const revision=Array.from(JSON.stringify(siteDefaults)).reduce((hash,char)=>Math.imul(hash^char.codePointAt(0),16777619)>>>0,2166136261).toString(16);
  const STORAGE='la-thu-github-v1:'+location.pathname.replace(/index\.html$/,'')+':'+revision;
  const wishesApi=window.WEDDING_RSVP;
  let data={...siteDefaults},toastTimer,opened=false,busy=false,guestId='',pendingSubmission=null;
  function toast(message){
    const element=$('#toast'),parent=document.querySelector('dialog[open]')||document.body;
    if(element.parentElement!==parent)parent.appendChild(element);
    element.textContent=message;element.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('visible'),4300);
  }
  function readShared(){
    const value=new URLSearchParams(location.hash.slice(1)).get('i');if(!value)return null;
    try{if(value.length>65000)throw Error();const b64=value.replace(/-/g,'+').replace(/_/g,'/');const bytes=Uint8Array.from(atob(b64+'='.repeat((4-b64.length%4)%4)),c=>c.charCodeAt(0));return normalize(JSON.parse(new TextDecoder().decode(bytes)));}
    catch{toast('Đường dẫn chưa hợp lệ. Đang hiển thị bản mẫu để bạn xem.');return {...siteDefaults};}
  }
  const shared=readShared();
  if(shared)data=shared;
  else if(!guestView){try{
    const current=localStorage.getItem(STORAGE);
    if(current)data=normalize(JSON.parse(current));
  }catch{}}
  function textAll(selector,value){all(selector).forEach(el=>el.textContent=value);}
  const lastName=name=>name.trim().split(/\s+/).filter(Boolean).slice(-1)[0]||'';
  const groomShort=()=>data.groomShort||lastName(data.groom)||'Chú rể';
  const brideShort=()=>data.brideShort||lastName(data.bride)||'Cô dâu';
  const couple=()=>data.groom&&data.bride?`${data.groom} & ${data.bride}`:'Hai chúng mình';
  const mainDate=()=>data.date||data.groomDate||data.brideDate;
  const localDate=date=>date?new Date(`${date}T12:00:00+07:00`):null;
  const formatDate=(date,full=false)=>date?new Intl.DateTimeFormat('vi-VN',full?{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}:{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(localDate(date)):'';
  function eventOf(side,party=false){return {date:party?data[side+'PartyDate']:data[side+'Date']||mainDate(),time:party?data[side+'PartyTime']:data[side+'Time']||data.time,venue:data[side+'Venue'],address:data[side+'Address'],map:data[side+'Map']};}
  function startOf(event){return event.date&&event.time?new Date(`${event.date}T${event.time}:00+07:00`):null;}
  function calendarUrl(side,party=false){
    const event=eventOf(side,party),start=startOf(event);if(!start)return '';
    const stamp=start.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const url=new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action','TEMPLATE');url.searchParams.set('text',`${party?'Tiệc cưới':side==='groom'?'Lễ Thành Hôn':'Lễ Vu Quy'} · ${couple()}`);url.searchParams.set('dates',`${stamp}/${stamp}`);
    url.searchParams.set('location',[event.venue,event.address].filter(Boolean).join(', '));
    url.searchParams.set('details',`Trân trọng kính mời bạn cùng chung vui. Giờ bắt đầu theo giờ Việt Nam (UTC+7).${event.map?'\nChỉ đường: '+event.map:''}`);return url.href;
  }
  function mapUrl(side){const event=eventOf(side);if(event.map)return event.map;if(!event.address)return '';return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([event.venue,event.address].filter(Boolean).join(', '));}
  function imageSlot(slot,url){
    const img=slot.querySelector(':scope > img');
    if(!url){img.hidden=true;img.removeAttribute('src');slot.classList.remove('has-image');return;}
    if(img.getAttribute('src')===url)return;
    // Keep a layout box so native lazy loading can start as the photo approaches.
    img.hidden=false;img.style.opacity='0';slot.classList.remove('has-image');
    img.onload=()=>{img.style.removeProperty('opacity');slot.classList.add('has-image');};img.onerror=()=>{img.hidden=true;img.style.removeProperty('opacity');slot.classList.remove('has-image');img.removeAttribute('src');};img.src=url;
  }
  function render(){
    applyTypography(data);
    textAll('[data-groom]',data.groom||'Tên chú rể');textAll('[data-bride]',data.bride||'Tên cô dâu');textAll('[data-groom-short]',groomShort());textAll('[data-bride-short]',brideShort());textAll('[data-couple]',couple());textAll('[data-guest]',data.guest||'Quý khách');
    const monogram=data.groom&&data.bride?groomShort().slice(0,1).toUpperCase()+'&'+brideShort().slice(0,1).toUpperCase():'♡';textAll('[data-monogram]',monogram);
    document.title=data.groom&&data.bride?`${couple()} · Thiệp cưới`:'Ngày chung đôi · Thiệp cưới';
    const date=mainDate(),parts=date?date.split('-'):null;
    textAll('[data-date-compact]',parts?`${parts[2]} · ${parts[1]} · ${parts[0]}`:'TOGETHER, FOREVER');
    textAll('[data-date-long]',date?`${formatDate(date)}${data.lunarDate?' · '+data.lunarDate:''}`:'NGÀY CHÚNG MÌNH CHUNG ĐÔI');
    textAll('[data-date-readable]',date?formatDate(date):'Ngày sẽ được cập nhật');
    $('#hero-year').textContent=parts?' · '+parts[0]:'';
    $('#hero-quote').textContent=data.message||'Mời bạn cùng hiện diện, cùng sẻ chia niềm vui\ntrong ngày chúng mình viết tiếp một câu chuyện chung.';
    $('#hero-quote-en').textContent=data.messageEn||'We would love to have you with us\nas we begin this beautiful new chapter.';
    const hero=$('#hero-photo');hero.onload=()=>{};hero.onerror=()=>{if(hero.getAttribute('src')!==ART){hero.src=ART;hero.alt='Nền giấy kem với hoa sen và họa tiết vàng';$('#hero-demo').hidden=false;}};
    hero.src=data.heroPhoto||ART;hero.alt=data.heroPhoto?'Ảnh bìa cưới của hai chúng mình':'Nền giấy kem với hoa sen và họa tiết vàng';$('#hero-demo').hidden=!!data.heroPhoto;
    const closing=$('#closing-photo');closing.onerror=()=>{if(closing.getAttribute('src')!==ART)closing.src=ART;};closing.src=data.photo5||data.heroPhoto||ART;closing.alt=data.photo5||data.heroPhoto?'Khoảnh khắc của hai chúng mình':'Nền hoa sen và họa tiết vàng';
    $('#ticket-code').textContent=parts?`INV-${parts[2]}${parts[1]}${parts[0].slice(2)} · OUR WEDDING`:'INVITATION · OUR WEDDING';
    const times=[eventOf('bride').time,eventOf('groom').time].filter(Boolean);$('#ticket-time').textContent=[...new Set(times)].join(' & ')||'Hẹn bạn trong ngày vui';
    $('#main-date-description').textContent=date?`${formatDate(date,true)}${data.lunarDate?' · '+data.lunarDate:''}`:'Ngày cưới của hai chúng mình sẽ được cập nhật tại đây.';
    $('#main-date-en').textContent=date?new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(localDate(date)):'We can’t wait to share this day with you.';
    for(const side of ['groom','bride']){
      const event=eventOf(side),party=eventOf(side,true),isGroom=side==='groom',type=isGroom?'Lễ Thành Hôn':'Lễ Vu Quy';
      $(`#${side}-date-description`).textContent=event.date||event.time?`${type}${event.time?' lúc '+event.time:''}${event.date?' · '+formatDate(event.date):''}.`:`${type} · hẹn bạn tại ${isGroom?'nhà trai':'nhà gái'}.`;
      $(`#${side}-event-date`).textContent=event.date?`${event.time?event.time+' · ':''}${formatDate(event.date,true)}${data.lunarDate&&event.date===date?'\n'+data.lunarDate:''}`:event.time?`${event.time} · Ngày tổ chức sẽ được cập nhật`:'Ngày giờ sẽ được cập nhật';
      $(`#${side}-venue`).textContent=event.venue||`Tại ${isGroom?'nhà trai':'nhà gái'}`;$(`#${side}-address`).textContent=event.address||'Địa chỉ sẽ được cập nhật.';
      const parents=[data[side+'Father']?'Bố: '+data[side+'Father']:'',data[side+'Mother']?'Mẹ: '+data[side+'Mother']:'',data[side+'Parents']].filter(Boolean).join('\n');
      $(`#${side}-family-block`).hidden=!parents;$(`#${side}-parents`).textContent=parents;
      const map=$(`#${side}-map`),mapLink=mapUrl(side);if(mapLink){map.href=mapLink;map.target='_blank';map.rel='noopener noreferrer';map.setAttribute('aria-disabled','false');}else{map.removeAttribute('href');map.setAttribute('aria-disabled','true');}
      $(`[data-calendar="${side}"]`).disabled=!startOf(event);
      $(`#${side}-party`).hidden=!party.date&&!party.time;$(`#${side}-party`).textContent=`Tiệc ${isGroom?'nhà trai':'nhà gái'}${party.time?' lúc '+party.time:''}${party.date?' · '+formatDate(party.date,true):''}`;
      const partyLink=$(`#${side}-party-calendar`),partyUrl=calendarUrl(side,true);partyLink.hidden=!partyUrl;if(partyUrl){partyLink.href=partyUrl;partyLink.target='_blank';partyLink.rel='noopener noreferrer';}
      $(`[data-gift="${side}"]`).textContent=data[side+'QR']?'Xem mã QR':'Gửi lời chúc';
    }
    const storyDefaults=[['THE BEGINNING','Một lần gặp gỡ','Có những cuộc gặp rất nhẹ, lại trở thành khởi đầu cho một điều thật đẹp.'],['LITTLE THINGS','Những ngày có nhau','Từ những quan tâm bình dị, mình dần trở thành một phần trong cuộc sống của nhau.'],['THE PROMISE','Lời hẹn chung đôi','Chọn nắm tay nhau, cùng viết tiếp câu chuyện bằng yêu thương và sự đồng hành.']];
    for(let i=0;i<3;i++)for(const [key,index] of [['Date',0],['Title',1],['Text',2]])$(`#story${i}-${key.toLowerCase()}`).textContent=data[`story${i}${key}`]||storyDefaults[i][index];
    const storyEnglish=['A simple hello. The beginning of something beautiful.','Love grew in the little things we shared.','One promise, and a lifetime to keep choosing each other.'];
    for(let i=0;i<3;i++)$('#story'+i+'-en').textContent=data[`story${i}TextEn`]||storyEnglish[i];
    all('.photo-slot').forEach(slot=>imageSlot(slot,data[slot.dataset.image]));
    renderCalendar();updateCountdown();
    if(!$('#rsvp-name').value&&data.guest)$('#rsvp-name').value=data.guest;
    updateQuickName();
  }
  function renderCalendar(){
    let date=mainDate(),parts;
    if(date)parts=date.split('-').map(Number);
    else{const current=Object.fromEntries(new Intl.DateTimeFormat('en',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));parts=[+current.year,+current.month,+current.day];}
    const [year,month,day]=parts,first=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7,days=new Date(Date.UTC(year,month,0)).getUTCDate();
    $('#calendar-month-number').textContent=String(month).padStart(2,'0');$('#calendar-month-name').textContent=new Intl.DateTimeFormat('en',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1))).toUpperCase();$('#calendar-year').textContent=year;
    const body=$('#calendar-days');body.replaceChildren();
    for(let n=0;n<Math.ceil((first+days)/7)*7;n+=7){const row=document.createElement('tr');for(let k=0;k<7;k++){const cell=document.createElement('td'),number=n+k-first+1;if(k>=5)cell.classList.add('weekend');if(number>=1&&number<=days){const span=document.createElement('span');span.className='day-number';span.textContent=number;cell.append(span);if(date&&number===day){cell.classList.add('wedding-day');cell.setAttribute('aria-label',`Ngày cưới, ${formatDate(date)}`);const heart=document.createElement('span');heart.textContent='♡';heart.className='day-heart';heart.setAttribute('aria-hidden','true');cell.append(heart);}}row.append(cell);}body.append(row);}
    $('#calendar-note').textContent=date?`♡ ${formatDate(date)}${data.lunarDate?' · '+data.lunarDate:''} — ngày chúng mình chung đôi`:'Lịch tháng hiện tại · thêm ngày cưới để đánh dấu trên lịch.';
  }
  function updateCountdown(){
    const date=mainDate(),time=data.time||data.brideTime||data.groomTime||'00:00',start=date?new Date(`${date}T${time}:00+07:00`).getTime():null;
    const seconds=start!==null?Math.max(0,Math.floor((start-Date.now())/1000)):null;
    const values=seconds===null?['—','—','—','—']:[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0'));
    ['days','hours','minutes','seconds'].forEach((key,i)=>{$('#count-'+key).textContent=values[i];});$('#countdown-label').textContent=seconds===0?'NGÀY HẠNH PHÚC ĐÃ ĐẾN':'CHỜ ĐẾN NGÀY CHUNG ĐÔI';
  }
  const editor=$('#editor'),editorForm=$('#editor-form');
  for(let i=0;i<groups.length;i++){
    const group=groups[i],details=document.createElement('details');details.className='editor-group'+(group.typography?' editor-group--typography':'');details.open=i===0;
    const summary=document.createElement('summary');summary.textContent=group.title;details.append(summary);const grid=document.createElement('div');grid.className='fields-grid';
    if(group.typography){const hint=document.createElement('p');hint.className='typography-hint';hint.textContent='Chọn phông và kéo thanh cỡ chữ cho từng phần. Mẫu bên dưới thay đổi ngay để bạn xem trước.';details.append(hint);}
    for(const f of group.fields){const label=document.createElement('label');label.className='editor-field'+(f.wide?' wide':'');label.append(document.createTextNode(f.label));
      const input=document.createElement(f.type==='textarea'?'textarea':f.type==='select'?'select':'input');input.name=f.name;input.id='edit-'+f.name;
      label.htmlFor=input.id;
      if(f.type==='select'){for(const [value,choice] of Object.entries(f.choices)){const option=document.createElement('option');option.value=value;option.textContent=choice.label;input.append(option);}}
      else if(f.type==='range'){input.type='range';input.min=f.min;input.max=f.max;input.step=f.step;input.value=f.defaultValue;const output=document.createElement('output');output.htmlFor=input.id;output.id=input.id+'-value';output.className='type-size-value';output.value=f.defaultValue+'%';label.append(output);input.setAttribute('aria-describedby',output.id);}
      else if(f.type!=='textarea')input.type=f.type;else input.rows=3;
      if(f.type==='url'&&!f.name.endsWith('Map')){input.type='text';input.inputMode='url';input.spellcheck=false;}
      if(f.type!=='select'&&f.type!=='range')input.maxLength=limits(f.name);if(f.type==='url')input.placeholder=f.name.endsWith('Map')?'https://…':'./assets/photos/ten-anh.jpg hoặc https://…';else if(f.type==='date'){input.min='1900-01-01';input.max='2199-12-31';}
      if(f.type==='text')input.autocomplete='off';label.append(input);if(f.hint){const small=document.createElement('small');small.textContent=f.hint;label.append(small);}grid.append(label);
    }details.append(grid);$('#editor-fields').append(details);
    if(group.typography){const preview=document.createElement('div');preview.className='typography-preview';preview.setAttribute('aria-label','Xem trước kiểu chữ trên thiệp');preview.innerHTML='<span class="typography-preview-label">XEM TRƯỚC TRÊN THIỆP</span><p class="typography-preview-names" id="type-preview-names"></p><p class="typography-preview-heading">Trân trọng kính mời</p><p class="typography-preview-body">Cùng chúng mình viết tiếp câu chuyện yêu thương.<br>Hẹn gặp bạn trong ngày chung đôi.</p>';details.append(preview);const reset=document.createElement('button');reset.type='button';reset.className='typography-reset';reset.id='reset-typography';reset.textContent='Đặt lại kiểu chữ theo mẫu';details.append(reset);}
  }
  function applyTypography(values){
    const root=document.documentElement;
    for(const [key] of typeGroups){const face=typefaces[values[key+'Font']]||typefaces.original;
      if(face.family)root.style.setProperty('--type-'+key+'-font',face.family);else root.style.removeProperty('--type-'+key+'-font');
      root.style.setProperty('--type-'+key+'-scale',String(Number(values[key+'Size']||100)/100));
      if(face.query&&!document.getElementById('typeface-'+values[key+'Font'])){const link=document.createElement('link');link.id='typeface-'+values[key+'Font'];link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+face.query+'&display=swap';document.head.append(link);}
    }
    document.body.classList.toggle('typography-custom',typographyFields.some(f=>values[f.name]!==defaults[f.name]));
  }
  function previewTypography(){
    const values=normalize(Object.fromEntries(new FormData(editorForm)));applyTypography(values);
    $('#invitation-link-field').hidden=true;
    for(const [key] of typeGroups){const input=editorForm.elements[key+'Size'];$('#edit-'+key+'Size-value').value=input.value+'%';input.setAttribute('aria-valuetext',input.value+' phần trăm');}
    const names=['groom','bride'].map((side,i)=>values[side+'Short']||lastName(values[side])||(i?'Cô dâu':'Chú rể'));$('#type-preview-names').textContent=names.join(' & ');
  }
  editorForm.addEventListener('input',previewTypography);
  editorForm.addEventListener('change',previewTypography);
  editor.addEventListener('close',()=>applyTypography(data));
  $('#reset-typography').addEventListener('click',()=>{for(const f of typographyFields)editorForm.elements[f.name].value=defaults[f.name];previewTypography();});
  function openEditor(focusName){for(const f of fields)editorForm.elements[f.name].value=data[f.name];previewTypography();$('#editor-error').hidden=true;editor.showModal();
    if(focusName&&editorForm.elements[focusName]){const input=editorForm.elements[focusName];input.closest('details').open=true;input.scrollIntoView({block:'center'});input.focus({preventScroll:true});}}
  all('[data-edit]').forEach(button=>button.addEventListener('click',()=>openEditor()));
  all('[data-close]').forEach(button=>button.addEventListener('click',()=>$('#'+button.dataset.close).close()));
  all('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
  function saveEditor(){
    if(!editorForm.reportValidity())return false;const values=Object.fromEntries(new FormData(editorForm));
    for(const f of fields.filter(f=>f.type==='url')){const value=values[f.name].trim();if(value){if(!validFieldUrl(f,value)){$('#editor-error').textContent='Ảnh cần link HTTPS hoặc đường dẫn ./assets/photos/ten-anh.jpg; bản đồ cần link HTTPS.';$('#editor-error').hidden=false;const input=editorForm.elements[f.name];input.closest('details').open=true;input.focus();return false;}}}
    data=normalize(values);try{localStorage.setItem(STORAGE,JSON.stringify(data));}catch{toast('Trình duyệt chưa lưu được. Bạn sao chép đường dẫn để giữ lại thông tin nhé.');}
    if(new URLSearchParams(location.hash.slice(1)).has('i'))history.replaceState(null,'',location.pathname+location.search);
    $('#editor-error').hidden=true;render();return true;
  }
  editorForm.addEventListener('submit',event=>{event.preventDefault();if(saveEditor()){editor.close();toast('Đã cập nhật thiệp của hai bạn ♡');}});
  $('#copy-invitation').addEventListener('click',async()=>{
    if(!saveEditor())return;const bytes=new TextEncoder().encode(JSON.stringify(data));let raw='';for(const b of bytes)raw+=String.fromCharCode(b);const encoded=btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    const url=new URL(location.href);url.search='?view=invite';url.hash='i='+encoded;
    $('#invitation-link').value=url.href;$('#invitation-link-field').hidden=false;
    try{await navigator.clipboard.writeText(url.href);toast('Đã sao chép đường dẫn chứa thông tin thiệp.');}
    catch{const area=document.createElement('textarea');area.value=url.href;area.style.cssText='position:fixed;top:0;left:0;opacity:0';editor.append(area);area.select();let copied=false;try{copied=document.execCommand('copy');}catch{}area.remove();toast(copied?'Đã sao chép đường dẫn chứa thông tin thiệp.':'Chưa sao chép được. Bạn thử cho phép quyền bộ nhớ tạm nhé.');}
  });
  $('#export-config').addEventListener('click',()=>{
    if(!saveEditor())return;
    const content='// Cấu hình hiển thị chung — tải tệp này lên thư mục gốc của GitHub.\nwindow.WEDDING_CONFIG = '+JSON.stringify(data,null,2)+';\n';
    const url=URL.createObjectURL(new Blob([content],{type:'application/javascript;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='cau-hinh-thiep.js';editor.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Đã tải cấu hình. Đưa tệp cau-hinh-thiep.js lên GitHub để cập nhật cho mọi khách nhé.');
  });
  let restoreArmed=false,restoreTimer;
  $('#restore-template').addEventListener('click',()=>{
    const button=$('#restore-template');
    if(!restoreArmed){restoreArmed=true;button.textContent='Bấm lần nữa để bỏ chỉnh sửa trên trình duyệt';clearTimeout(restoreTimer);restoreTimer=setTimeout(()=>{restoreArmed=false;button.textContent='Khôi phục cấu hình từ GitHub';},5000);return;}
    clearTimeout(restoreTimer);restoreArmed=false;button.textContent='Khôi phục cấu hình từ GitHub';data={...siteDefaults};try{localStorage.removeItem(STORAGE);}catch{}history.replaceState(null,'',location.pathname+location.search);render();for(const f of fields)editorForm.elements[f.name].value=siteDefaults[f.name];previewTypography();toast('Đã khôi phục nội dung đang lưu trên GitHub. Sổ lời chúc vẫn được giữ nguyên.');
  });
  const music=$('#wedding-audio'),musicStatus=$('#music-status');
  let musicPlaying=false,musicRequested=false,musicUnavailable=false,musicPausedByGuest=false,musicAttempt=0;
  music.volume=.3;
  function updateAudio(){
    const playing=musicPlaying&&!musicUnavailable;
    $('#record').classList.toggle('is-playing',playing);$('.equalizer').classList.toggle('is-playing',playing);
    all('.audio-toggle').forEach(button=>{button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-busy',String(musicRequested&&!playing));});
    textAll('[data-audio-icon]',playing?'Ⅱ':'▶');
    textAll('[data-audio-label]',musicUnavailable?'Thử lại':playing?'Tạm dừng':musicRequested?'Đang mở…':'Bật nhạc');
    $('#floating-audio').setAttribute('aria-label',playing?'Tắt nhạc nền':musicRequested?'Hủy bật nhạc':'Bật nhạc nền');
  }
  function failedAudio(error,attempt){
    if(attempt!==musicAttempt||musicPausedByGuest)return;
    musicPlaying=false;musicRequested=false;
    if(error.name==='NotAllowedError')musicStatus.textContent=opened?'Chạm vào thiệp để bản nhạc bắt đầu nhé.':'Nhạc sẽ tự phát khi bạn chạm mở thiệp.';
    else if(error.name==='AbortError')musicStatus.textContent='Chạm Bật nhạc để nghe cùng chúng mình.';
    else{musicUnavailable=true;musicStatus.textContent='Chưa tải được nhạc. Chạm Thử lại để nghe cùng chúng mình.';}
    updateAudio();
  }
  function playAudio(){
    if(musicPlaying)return;
    const attempt=++musicAttempt;musicPausedByGuest=false;
    if(musicUnavailable){musicUnavailable=false;music.load();}
    musicRequested=true;musicStatus.textContent='Đang mở Ngày về anh cưới em…';updateAudio();
    // Keep play() in the opening click so mobile browsers receive the user gesture.
    try{const playback=music.play();if(playback)playback.catch(error=>failedAudio(error,attempt));}
    catch(error){failedAudio(error,attempt);}
  }
  all('.audio-toggle').forEach(button=>button.addEventListener('click',()=>{
    if(musicPlaying||musicRequested||!music.paused){
      musicPausedByGuest=true;musicAttempt++;musicRequested=false;musicPlaying=false;music.pause();
      musicStatus.textContent='Đã tạm dừng. Bật nhạc khi bạn muốn nghe cùng chúng mình.';updateAudio();
    }else playAudio();
  }));
  music.addEventListener('playing',()=>{
    if(musicPausedByGuest){music.pause();return;}
    musicPlaying=true;musicRequested=false;musicUnavailable=false;
    musicStatus.textContent='Đang nghe Ngày về anh cưới em ♡';updateAudio();
  });
  music.addEventListener('pause',()=>{
    musicPlaying=false;musicRequested=false;
    if(!musicUnavailable)musicStatus.textContent='Đã tạm dừng. Bật nhạc khi bạn muốn nghe cùng chúng mình.';
    updateAudio();
  });
  music.addEventListener('waiting',()=>{
    if(music.paused||musicPausedByGuest)return;
    musicPlaying=false;musicRequested=true;musicStatus.textContent='Đang tải bản nhạc…';updateAudio();
  });
  music.addEventListener('error',()=>{
    musicPlaying=false;musicRequested=false;musicUnavailable=true;
    musicStatus.textContent='Chưa tải được nhạc. Chạm Thử lại để nghe cùng chúng mình.';updateAudio();
  });
  document.addEventListener('click',event=>{
    if(opened&&!musicPausedByGuest&&!musicPlaying&&!musicRequested&&!event.target.closest('.audio-toggle,#open-invitation,dialog,[data-edit]'))playAudio();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'&&opened&&!musicPausedByGuest&&music.paused)playAudio();
  });
  updateAudio();playAudio();
  function scrollToSection(id){const target=document.getElementById(id);if(target)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  function burstHearts(){if(matchMedia('(prefers-reduced-motion: reduce)').matches){toast('Gửi đến hai bạn một trái tim yêu thương ♡');return;}for(let i=0;i<9;i++){const heart=document.createElement('span');heart.textContent=i%2?'♡':'♥';heart.style.setProperty('--heart-x',`${Math.round((Math.random()-.5)*380)}px`);heart.style.setProperty('--heart-rotation',`${Math.round((Math.random()-.5)*80)}deg`);heart.style.animationDelay=`${i*.07}s`;heart.style.fontSize=`${19+Math.round(Math.random()*15)}px`;$('#heart-bursts').append(heart);setTimeout(()=>heart.remove(),3300);}}
  $('#heart-button').addEventListener('click',burstHearts);$('#more-hearts').addEventListener('click',burstHearts);
  $('#open-invitation').addEventListener('click',()=>{
    if(opened)return;opened=true;$('#open-invitation').disabled=true;$('#museum').inert=false;document.body.classList.remove('is-closed');$('#entrance').classList.add('opening');window.scrollTo({top:0,behavior:'instant'});
    if(!musicPausedByGuest)playAudio();
    const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1650;
    setTimeout(()=>{$('#entrance').hidden=true;$('#quick-bar').hidden=false;$('#museum').focus({preventScroll:true});},delay);
    updateJourney();
  });
  all('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const id=link.getAttribute('href').slice(1);if(document.getElementById(id)){event.preventDefault();scrollToSection(id);}
  }));
  all('[data-calendar]').forEach(button=>button.addEventListener('click',()=>{const url=calendarUrl(button.dataset.calendar);if(url)window.open(url,'_blank','noopener,noreferrer');}));
  all('.photo-slot').forEach(slot=>slot.addEventListener('click',()=>{const img=slot.querySelector(':scope > img');
    if(slot.classList.contains('has-image')&&!img.hidden&&img.getAttribute('src')){$('#lightbox-image').src=img.src;$('#lightbox-image').alt=img.alt;$('#lightbox').showModal();}
    else if(!guestView)openEditor(slot.dataset.image);else toast('Ảnh cưới của hai bạn sẽ được bổ sung tại đây.');
  }));
  let activeGift='';
  all('[data-gift]').forEach(button=>button.addEventListener('click',()=>{const side=button.dataset.gift;
    if(!data[side+'QR']){scrollToSection('rsvp');setTimeout(()=>$('#rsvp-wish').focus({preventScroll:true}),350);return;}
    activeGift=side;$('#qr-title').textContent=side==='bride'?brideShort():groomShort();const image=$('#qr-image');image.hidden=false;image.src=data[side+'QR'];image.alt=`Mã QR mừng cưới ${side==='bride'?'cô dâu':'chú rể'}`;
    $('#qr-caption').textContent=[data[side+'Bank'],data[side+'AccountName'],data[side+'Account']].filter(Boolean).join('\n');$('#copy-account').hidden=!data[side+'Account'];image.onerror=()=>{image.hidden=true;$('#qr-caption').textContent='Chưa tải được ảnh QR. Bạn thử lại sau nhé.';};$('#qr-dialog').showModal();
  }));
  $('#copy-account').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(data[activeGift+'Account']);toast('Đã sao chép số tài khoản.');}catch{toast('Bạn có thể chọn và sao chép số tài khoản hiển thị bên trên.');}});
  let journeyTick=false;
  function updateJourney(){journeyTick=false;if(!opened)return;const line=$('#journey-line'),box=line.getBoundingClientRect(),progress=Math.min(1,Math.max(0,(innerHeight*.72-box.top)/Math.max(1,box.height)));$('#journey-progress').style.transform=`scaleY(${progress})`;all('.journey-stop').forEach(stop=>stop.classList.toggle('in-view',stop.getBoundingClientRect().top<innerHeight*.78));}
  window.addEventListener('scroll',()=>{if(!journeyTick){journeyTick=true;requestAnimationFrame(updateJourney);}},{passive:true});window.addEventListener('resize',updateJourney);
  function randomId(){if(crypto.randomUUID)return crypto.randomUUID();return [...crypto.getRandomValues(new Uint8Array(16))].map(n=>n.toString(16).padStart(2,'0')).join('');}
  try{guestId=localStorage.getItem('wedding-guest-id')||randomId();localStorage.setItem('wedding-guest-id',guestId);$('#rsvp-name').value=localStorage.getItem('wedding-guest-name')||'';}catch{guestId=randomId();}
  function updateQuickName(){const name=$('#rsvp-name').value.trim();$('#quick-name').textContent=name||'Tên của bạn';$('#quick-name').title=name||'Điền tên của bạn để gửi lời chúc';}
  $('#rsvp-name').addEventListener('input',updateQuickName);$('#quick-name').addEventListener('click',()=>{scrollToSection('rsvp');setTimeout(()=>$('#rsvp-name').focus({preventScroll:true}),350);});
  function renderWish(item){
    const card=document.createElement('article');card.className='wish-card';const header=document.createElement('div');header.className='wish-card-header';
    const name=document.createElement('h3');name.textContent=item.name;const time=document.createElement('time');const timestamp=new Date(item.createdAt);time.dateTime=timestamp.toISOString();time.textContent=new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh'}).format(timestamp);header.append(name,time);card.append(header);
    if(item.message){const message=document.createElement('p');message.textContent=item.message;card.append(message);}
    const badge=document.createElement('small');badge.textContent=item.attendance==='yes'?'♡ SẼ THAM DỰ':item.attendance==='no'?'HẸN DỊP KHÁC':'GỬI LỜI CHÚC';card.append(badge);return card;
  }
  let wishLoadToken=0;
  async function loadWishes(){
    const token=++wishLoadToken;$('#refresh-wishes').disabled=true;
    if(!wishesApi?.configured){
      $('#rsvp-send').disabled=true;$('#quick-send').disabled=true;$('#refresh-wishes').disabled=true;
      $('#rsvp-status').textContent='Thiệp chưa mở nhận phản hồi trực tuyến. Bạn vui lòng liên hệ cô dâu/chú rể để xác nhận.';
      const empty=document.createElement('p');empty.className='guestbook-empty';empty.textContent='Sổ lời chúc sẽ mở khi thiệp bắt đầu nhận phản hồi.';$('#guestbook').replaceChildren(empty);return;
    }
    try{const body=await wishesApi.list();if(!Array.isArray(body.items))throw Error();if(token!==wishLoadToken)return;
      const book=$('#guestbook');book.replaceChildren();$('#guestbook-count').textContent=`SỔ LỜI CHÚC${body.total?' · '+body.total:''}`;
      if(!body.items.length){const empty=document.createElement('p');empty.className='guestbook-empty';empty.textContent='Tấm thiệp đang chờ lời chúc đầu tiên.\nViết cho chúng mình đôi dòng nhé ♡';book.append(empty);}
      else body.items.forEach(item=>book.append(renderWish(item)));
    }catch{if(token!==wishLoadToken)return;$('#guestbook').replaceChildren();const empty=document.createElement('p');empty.className='guestbook-empty';empty.textContent='Chưa mở được sổ lời chúc.\nBạn bấm ↻ để thử tải lại nhé.';$('#guestbook').append(empty);}
    finally{if(token===wishLoadToken)$('#refresh-wishes').disabled=false;}
  }
  async function sendWish(name,message,attendance,quick=false){
    if(busy)return;if(!wishesApi?.configured){toast('Thiệp chưa mở nhận phản hồi trực tuyến.');return;}busy=true;$('#rsvp-send').disabled=true;$('#quick-send').disabled=true;$('#rsvp-status').textContent='Đang gửi lời chúc…';$('#rsvp-status').classList.remove('error');
    const fingerprint=JSON.stringify([name,message,attendance]);if(!pendingSubmission||pendingSubmission.fingerprint!==fingerprint)pendingSubmission={fingerprint,id:randomId()};
    try{
      const body=await wishesApi.submit({name,message,attendance,guestId,submissionId:pendingSubmission.id});
      if(!body.saved)throw Error('Chưa xác nhận được lời chúc đã lưu. Bạn thử lại nhé.');
      pendingSubmission=null;$('#rsvp-status').textContent='Đã lưu lời chúc và xác nhận của bạn. Cảm ơn bạn thật nhiều ♡';$('#rsvp-wish').value='';if(quick)$('#quick-wish').value='';
      try{localStorage.setItem('wedding-guest-name',name);}catch{}updateQuickName();await loadWishes();toast('Đã gửi và lưu lời chúc. Cảm ơn bạn ♡');burstHearts();
    }catch(error){const message=error instanceof Error&&error.message!=='Failed to fetch'?error.message:'Chưa kết nối được. Lời chúc vẫn được giữ để bạn gửi lại.';$('#rsvp-status').textContent=message;$('#rsvp-status').classList.add('error');toast(message);}
    finally{busy=false;$('#rsvp-send').disabled=false;$('#quick-send').disabled=false;}
  }
  $('#rsvp-form').addEventListener('submit',event=>{event.preventDefault();const name=$('#rsvp-name').value.trim(),message=$('#rsvp-wish').value.trim(),attendance=$('#rsvp-form input[name="attendance"]:checked').value;
    if(!name){$('#rsvp-name').focus();return;}if(attendance==='wish'&&!message){$('#rsvp-wish').focus();toast('Bạn viết thêm một lời chúc nhỏ nhé.');return;}sendWish(name,message,attendance);
  });
  $('#quick-form').addEventListener('submit',event=>{event.preventDefault();const message=$('#quick-wish').value.trim(),name=$('#rsvp-name').value.trim();if(!message)return;
    if(!name){$('#rsvp-wish').value=message;scrollToSection('rsvp');setTimeout(()=>$('#rsvp-name').focus({preventScroll:true}),350);toast('Cho chúng mình biết tên của bạn trước nhé.');return;}sendWish(name,message,'wish',true);
  });
  $('#refresh-wishes').addEventListener('click',loadWishes);
  render();updateAudio();setInterval(updateCountdown,1000);loadWishes();
})();
