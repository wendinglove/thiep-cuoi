/* Static GitHub Pages client. A POST is successful only after a separate read
   confirms the submission ID exists in the Sheet; opaque responses prove nothing. */
(() => {
  'use strict';
  const endpoint=String(window.WEDDING_CONNECTION?.googleSheetsUrl||'').trim();
  const configured=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
  let sequence=0;
  const errors={
    invalid_request:'Thông tin chưa hợp lệ. Bạn kiểm tra tên và lời chúc nhé.',
    rate_limited:'Bạn vừa gửi một lời chúc. Chờ khoảng 15 giây rồi gửi tiếp nhé.',
    busy:'Sổ lời chúc đang bận. Bạn thử lại sau một chút nhé.',
    write_failed:'Chưa ghi được vào sổ lời chúc. Bạn thử lại nhé.',
    read_failed:'Chưa mở được sổ lời chúc. Bạn thử lại nhé.',
    capacity:'Sổ lời chúc tạm dừng nhận thêm. Bạn vui lòng liên hệ cô dâu/chú rể.',
  };
  const unavailable=()=>new Error('Thiệp chưa mở nhận phản hồi trực tuyến.');
  function read(params){
    if(!configured)return Promise.reject(unavailable());
    return new Promise((resolve,reject)=>{
      const name='__wedding_jsonp_'+Date.now()+'_'+(++sequence);
      const tag=document.createElement('script');
      const url=new URL(endpoint);url.searchParams.set('callback',name);
      url.searchParams.set('_',String(Date.now()));
      for(const [key,value] of Object.entries(params))url.searchParams.set(key,String(value));
      let settled=false;
      const cleanup=()=>{clearTimeout(timer);tag.remove();delete window[name];};
      const fail=()=>{if(settled)return;settled=true;cleanup();reject(new Error('Chưa kết nối được sổ lời chúc. Bạn thử lại nhé.'));};
      const timer=setTimeout(fail,10000);
      window[name]=result=>{
        if(settled)return;settled=true;cleanup();
        if(!result||result.ok!==true){reject(new Error(errors[result?.error]||'Chưa mở được sổ lời chúc. Bạn thử lại nhé.'));return;}
        resolve(result);
      };
      tag.onerror=fail;tag.src=url.href;document.head.append(tag);
    });
  }
  async function list(){
    const body=await read({action:'list'});
    if(!Array.isArray(body.items))throw Error('Sổ lời chúc trả về dữ liệu chưa hợp lệ.');
    const items=body.items.filter(item=>item&&typeof item.name==='string'&&typeof item.message==='string'&&['yes','no','wish'].includes(item.attendance)&&Number.isFinite(item.createdAt)&&item.createdAt>=946684800000&&item.createdAt<=4102444800000).slice(0,12);
    return {items,total:Number.isSafeInteger(body.total)&&body.total>=0?body.total:items.length};
  }
  async function submit(payload){
    if(!configured)throw unavailable();
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
    try{
      // text/plain is a simple cross-origin POST. Read confirmation below is
      // required because mode:no-cors intentionally hides the POST response.
      await fetch(endpoint,{method:'POST',mode:'no-cors',credentials:'omit',redirect:'follow',
        headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload),signal:controller.signal});
    }catch{/* An interrupted response may follow a completed Sheet write. */}
    finally{clearTimeout(timer);}
    for(const delay of [0,1000,2000,3000]){
      if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
      let result;
      try{result=await read({action:'status',id:payload.submissionId});}
      catch(error){if(delay===3000)throw error;continue;}
      if(result.saved===true)return {saved:true};
      if(result.error)throw Error(errors[result.error]||'Chưa lưu được lời chúc. Bạn thử lại nhé.');
    }
    throw Error('Chưa xác nhận được phản hồi đã lưu. Nội dung vẫn được giữ; bạn bấm gửi lại để kiểm tra, cùng mã phản hồi sẽ không tạo bản trùng.');
  }
  window.WEDDING_RSVP=Object.freeze({configured,list,submit});
})();
