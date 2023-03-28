export default {
//General_script version:1.1
//常用变量：
    ServerNetworkAddress:location.origin,
//函数运行日志
    GS_log:{
        'alert_tips':{'work_num':0,'error_num':0,'error_log':null,default_config:{positionX:0,positionY:62,height:32,border:5,zh_font_width:16,en_font_width:9,font_size:16,life_time:5000}},
        'addNewStyle':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
        'copy_p':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
        'setMenuRAnimation':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    },
//常用函数：
//消息弹窗，无需任何CSS,HTML
//参数详解：text->要发送的文本信息，字符串；样式配置，对象数据类型，参数详解：{positionX:(int),positionY:(int),height:(int),border:(int),zh_font_width:(int),en_font_width:(int),font-size:(int)}
    alert_tips(text,conf,life_time){
        try{
            let tips_box=undefined;
            if(document.querySelector('#tips_box')){
                tips_box=document.querySelector('#tips_box');
            }else {
                let new_div=document.createElement('div');
                new_div.id='tips_box';
                document.body.appendChild(new_div);
                tips_box=document.querySelector('#tips_box');
            }
            let new_div=document.createElement('div');
            let key_leng=text.length;
            new_div.className='tips';
            let ptt=/[0-9a-zA-Z_]/g;
            let en_word_leng=0;
            if(text.match(ptt)!==null){
                en_word_leng=text.match(ptt).length;
            }
            if(conf!==undefined){this.GS_log.alert_tips.work_num=0;}else {}
            let config={positionX:null,positionY:null,height:null,border:null,zh_font_width:16,en_font_width:9,font_size:16,life_time:5000};
            config=conf || this.GS_log.alert_tips.default_config;
            let time=life_time || this.GS_log.alert_tips.default_config.life_time;
            let styles=['#tips_box{width:auto;height:auto;position:fixed;top:'+config.positionY+'px;left:'+config.positionX+';border-bottom-right-radius:'+config.border+'px;border-top-right-radius:'+config.border+'px;z-index:999}','.tips{width:calc(var(--words_number) * '+config.zh_font_width+'px + var(--en_words_number) * '+config.en_font_width+'px);height:'+config.height+'px;background:rgba(255,255,255,0.9);float:none;border-top-right-radius:'+config.border+'px;border-bottom-right-radius:'+config.border+'px;padding:0 16px 0 8px;font-size:'+this.GS_log.alert_tips.default_config.font_size +'px;line-height:'+config.height+'px;box-shadow:2px 2px 10px rgba(35,35,35,0.32);text-shadow:2px 2px 10px rgba(75,75,75,0.29);margin:10px 0}'];
            this.addNewStyle(styles,'alert_tips');
            new_div.setAttribute('style','--words_number:'+(key_leng - en_word_leng) +';--en_words_number:'+en_word_leng);
            new_div.innerText=text;
            tips_box.appendChild(new_div);
            setTimeout(()=>tips_box.removeChild(new_div),time);
            this.GS_log.alert_tips.work_num++;
        }catch (e){
            this.GS_log.alert_tips.error_num++;
            this.GS_log.alert_tips.error_log=e;
        }
    },
//CSS样式添加器
//参数详解：style_array->要添加的样式，数组，必要；caller->调用CSS样式添加器的函数，必要
    addNewStyle(style_array,caller) {
        try{
            if(this.GS_log[caller].work_num>0){return false}
            let styleElement=document.getElementById('styles_js');
            if (!styleElement) {
                styleElement=document.createElement('style');
                styleElement.type='text/css';
                styleElement.id='styles_js';
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            for(let i=0;i<style_array.length;i++){
                styleElement.appendChild(document.createTextNode(style_array[i]));
            }
            this.GS_log.addNewStyle.work_num++;
        }catch (e) {
            this.GS_log.addNewStyle.error_num++;
            this.GS_log.addNewStyle.error_log=e;
        }
    },
    /*拷贝信息*/
//参数详解：el->需要拷贝的dom元素节点
    copy_p(el) {
        try{
            let command=undefined;
            if(document.querySelector('#command')){
                command=document.querySelector('#command');
                if(command.tagName!=='INPUT'){
                    let log='拷贝失败，ID[command]被其他元素占用';
                    this.alert_tips(log);
                    this.GS_log.copy_p.error_num++;
                    this.GS_log.copy_p.error_log=log;
                    return false;
                }
            }else {
                let new_element=document.createElement('input');
                new_element.id='command';
                document.body.appendChild(new_element);
                command=document.querySelector('#command');
            }
            command.type='text';
            command.style='opacity:0;width:1px;height:1px;outline:none;border:none;margin:0;padding:0;position:fixed;top:0;left:0;';
            command.value=el.innerText;
            command.select();
            document.execCommand('copy');
            this.alert_tips('复制成功');
            this.GS_log.copy_p.work_num++
        }catch (e) {
            this.GS_log.copy_p.error_num++;
            this.GS_log.copy_p.error_log=e;
        }
    },
}
