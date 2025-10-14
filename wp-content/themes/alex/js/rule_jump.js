var url_data = window.location.href;
var url_data_s = location.search;
var url_data_p = window.location.pathname;
var step = "";

function bodyScroll(event) {
    event.preventDefault();
}

function fuzzyQuery(str1,str2){
    var result = str2.indexOf(str1);
    if(result<0){
        return false;
    }else{
        return true;
    }
}
if(url_data.indexOf("www."+main_domain+"/") > -1){
    url_data=url_data.substring(url_data.indexOf("www."+main_domain+"/") , url_data.length);
}else{
    url_data ="";
}

var str_lan = url_data_p.split("/")[1];
var str_num = str_lan.length + 2;


// 多域名
function getHreflangDomain($region){
	switch($region){
		case "id":
			return "www.vantagemarketsea.com";
            break;
		case "it":
        	return "www.vantagemarkets.co";
            break;
		case "jp":
        	return "www.vantagetradings.com";
            break;
		case "my":
        	return "www.vantagemarkets.io";
            break;
		case "vn":
        	return "www.vantage-markets-apac.com";
            break;
		case "kk":
        	return "www.vantagemarkets.io";
            break;
		case "ru":
        	return "www.vantage-mkts.com";
            break;
		default:
			return "www.vantagemarkets.com";
            break;
	}
}
// 当前网站所在站点
var site_area = '';
// 当前ip所在站点
var ip_area = '';
// 白 验证
var whiteList = 'false';
// 获取当前页面的 user agent
var userAgent = navigator.userAgent;
var targetString = ['Googlebot', 'Google-InspectionTool', 'Googlebot smartphone','Googlebot Desktop', 'SemrushBot','inlinks', 'SiteAuditBot','AhrefsSiteAudit','AhrefsBot','Bingbot','Baiduspider','YandexBot','DuckDuckBot','Sogou Spider','Exabot','facebot','ia_archiver','Applebot'];

const apac_site = ['hans','hant','th','ms','id','kk','ru','mn','vi','ko','en','en-za','tl','hi','uz'];
const row_site = ['fr','de','es','it','nl','pl','ar','pt','sv','et'];

const rowCountry = ['gb','fr','de','it','es','ua','pl','ro','nl','be','cz','gr','pt','se','hu','by','at','rs','ch','bg','dk','fi','sk','no','ie','hr','md','ba','al','lt','mk','si','lv','ee','me','lu','mt','is','ad','mc','li','sm','va','im','gi','cy','br','mx','co','ar','pe','cl','ve','gt','ec','bo','ht','cu','do','hn','py','ni','sv','cr','pa','uy','jm','tt','gy','sr','bz','bs','bb','lc','gd','vc','ag','dm','kn','pr','gp','mq','gf','cw','aw','vi','ky','sx','tc','vg','ai','ms','fk','dz','bh','eg','ir','iq','il','jo','kw','lb','ly','ma','om','ps','qa','sa','sy','tn','ae','ye','af','am','az','td','km','dj','er','et','ge','ml','mr','ne','so','sd','tr','au','nz','ck','nu','tk','fj','vu','pf','wf','nc','ws','ki','to','mh','pw','tv','nr','pg','sb','fm','gu','mp','as'];
const apacCountry = ['cn','in','id','pk','bd','jp','ph','th','mm','kr','uz','my','np','kp','lk','kz','kh','tj','kg','tm','sg','mn','tl','bt','mv','bm','tw','hk','mo','ru','la'];
const africaCountry  = ['ng','tz','za','ke','ug','ao','mz','gh','mw','zm','zw','ss','sl','lr','na','gm','bw','ls','gw','gq','mu','sz','cv','st','re','eh','yt','sh','bj','bf','cm','bi','cf','cd','cg','ci','ga','gn','mg','rw','sn','sc','tg'];

const lamatCountrysen = ['JM','TT','GY','SR','BZ','BS','BB','LC','GD','VC','AG','DM','KN','CW','AW','KY','SX','TC','VG','BQ','AI','MS','FK'];
const lamatCountryses = ['CO','MX','CL','PE','AR','PY','GT','EC','BO','DO','HN','SV','CR','PA','UY'];
const lamatCountryspt = ['BR'];
const lamatCountrysfr = ['GP','MQ','GF'];

// console.log(str_lan,str_num);
if(str_lan == 'hans' || str_lan == 'hant' || str_lan == 'th' || 
    str_lan == 'ms' || str_lan == 'id' || str_lan == 'kk' || 
    str_lan == 'ru' || str_lan == 'mn' || str_lan == 'vi' || 
    str_lan == 'ko' || str_lan == 'fr' || str_lan == 'de' || 
    str_lan == 'es' || str_lan == 'it' || str_lan == 'nl' || 
    str_lan == 'pl' || str_lan == 'ar' || str_lan == 'pt' || 
    str_lan == 'sv' || str_lan == 'et' || str_lan == 'tl'){
    step = "1";
    url_data=url_data.substring(url_data.indexOf("/")+str_num , url_data.length);
    url_data_p=url_data_p.substring(url_data_p.indexOf("/")+str_num, url_data_p.length);
}else if (str_lan == 'en' || str_lan == 'en-za') {
    step = "2";
    url_data = url_data.substring(url_data.indexOf("/")+str_num, url_data.length);
    url_data_p = url_data_p.substring(url_data_p.indexOf("/")+str_num, url_data_p.length);
} else{
    step = "3";
    url_data = url_data.substring(url_data.indexOf("/")+1 , url_data.length);
    url_data_p = url_data_p.substring(url_data_p.indexOf("/")+1, url_data_p.length);
}

// revamp url data
function replaceQueryString (url, name, value) {
    const re = new RegExp(name + '=[^&]*', 'gi')
    return url.replace(re, name + '=' + value)
}

// affid skip
var affid_new = "";
if (getCookie("affid") && getCookie("affid") != "" && getCookie("affid") != null && getCookie("affid") != "null") {
    affid_new = getCookie("affid");
}
if (GetUrl("affid") != "") {
    affid_new = GetUrl("affid");
}

var isGetgeoip = 1;
// geoip2
if (getCookie('ip_code') == '' || getCookie('ip_aging') == '' || getCookie('ip_continent_code') == '') {
    var dxt_geo = {
        onSuccess: function (geoipResponse) {
            var dxt_this = this;
            if (geoipResponse.country.iso_code) {
                var ip_code = geoipResponse.country.iso_code.toLowerCase();
                var ip_continent_code = geoipResponse.continent.code.toLowerCase();
                var ip_address = geoipResponse.traits.ip_address;
                isGetgeoip = 2;
                setCookie('ip_code', ip_code);
                setCookie('ip_continent_code', ip_continent_code);
                setCookie('ip_aging', true, 1);
                ipJump(ip_code, ip_address);
            }
        },
        onError: function (error) {
            console.log('err')
            var dxt_this = this;
        },
        init: function () {
            var dxt_this = this;
            if (typeof (geoip2) != "undefined") {
                geoip2.country(dxt_this.onSuccess, dxt_this.onError);
            }
        },
    }
    dxt_geo.init();
} else {
    var code = getCookie('ip_code');
    var ip_address = getCookie('real_ip');
    ipJump(code, ip_address);
    // console.log(code);
}


function ipJumpURL($language,$hreflang) {
    return `https://${getHreflangDomain($hreflang)}${$language}${url_data}`;
}


// step: 2:en英文站, 3:row英文站, 1:其他站点

// geoip2 jump
function ipJump(code, ip_address) {
    if(apac_site.indexOf(str_lan) != -1){
        site_area = 'apac';
    }else{
        site_area = 'row';
    }
    if(africaCountry.indexOf(code) != -1){
        ip_area = 'africa';
    }else if(apacCountry.indexOf(code) != -1){
        ip_area = 'apac';
    }else{
        ip_area = 'row';
    }
    // console.log(current_user_state)
    // 白名单设置
    function iswhiteList() {
        var ajax = new XMLHttpRequest();
        ajax.open("POST", '/data/allow.php?ip=' + ip_address + '&v=' + Data(), false);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                whiteList = ajax.responseText
            }
        }
        ajax.send();
    }
    // iswhiteList();

    eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('u=[\'b.v.b.w\',\'t.q.r.c\',\'9.10.s.x\',\'1.3.5.C\',\'1.3.5.6\',\'1.3.5.D\',\'E.B.6.y\',\'z.A.g.h\',\'16.e.j.n\',\'0.p.i.k\',\'l.m.o.d\',\'18.9.c.f\',\'8.F.14.13\',\'17.15.Z.Y\',\'7.12.11.19\',\'1f.1e.2.1d\',\'2.1b.1c.2\',\'7.1a.X.L\',\'K.N.4.M\',\'0.H.G.J\',\'0.I.O.U\',\'T.W.V.8\',\'0.a.Q.a\',\'P.S.R.d\']',62,78,'103|220|211|244||162|30|175|118|210|197|117|114|82|163|81|56|230|231|116|53|52|221|20|100|108|87|127|193|203|ipAllowArray|160|128|166|190|47|91|174|140|142|110|201|172|151|139|28|202|173|98|186|80|27|69|105|32|64|29|223|59|45|185|48||241|136|222|188|92||219||189|143|24|62|169|122|121'.split('|'),0,{}))

    if(ipAllowArray.indexOf(ip_address) != -1){
        whiteList = 'true';
    }
    console.log({site_area,ip_area,str_lan,code,whiteList})
    
    if (step != "") {
        var cookie = getCookie("NAT_jump");
        var trigger = 0;
        var current_user_state = getCookie("current_user_state");
        
        let pagepartUrl = '';
        if(step != '3'){
            pagepartUrl =  '/' + str_lan + '/' + url_data_p;
        }else{
            pagepartUrl =  '/' + url_data_p;
        }

        targetString.forEach(element => {
            if (userAgent.includes(element)){
                trigger++;
                // console.log('userAgent='+element);
            }
        });
        
        // 是否是th站lp下的live开户链接
        if(pagepartUrl === '/th/lp/open-live-account/'||pagepartUrl === '/open-live-account-crm/'||pagepartUrl === '/open-demo-account-crm/'||pagepartUrl === '/open-live-account-gold-test/'||pagepartUrl === '/open-demo-account-gold-test/'){
            trigger++;
        }

        // 特殊活动去除跳转
        if(pagepartUrl === '/ifx-dubai-form/'){
            trigger++;
        }

        // lp以及landing及其子页面下不触发跳转
        if(pagepartUrl.includes('/lp/') || pagepartUrl.includes('/landing/')){
            trigger++;
        }

        // app-web及其子页面下不触发跳转
        if(pagepartUrl.includes('/app-web/')){
            trigger++;
        }

        // current_user_state 检查是否登录后台
        if (current_user_state) {
            trigger++;
        }
        // 是否在白名单
        if (whiteList == 'true') {
            trigger++;
        }
        if (code == "au"||code == "jp"){
            trigger++;
        }
        if(GetUrl('isjump')){
            trigger++;
        }
        // 检查row站或en站情况下url是否包含exclusion_list里的字段  (暂时没有)
        // if (step == "2") {
        //     let exclusion_list = ["placeholder/"]
        //     let intercept = false;
        //     exclusion_list.forEach(item => { if (fuzzyQuery(item, url_data_p)) { intercept = true } });
        //     if (intercept) {
        //         trigger++;
        //     }
        // } else {
        //     let exclusion_list = ["placeholder/"]
        //     let intercept = false;
        //     exclusion_list.forEach(item => { if (fuzzyQuery(item, url_data_p)) { intercept = true } });
        //     if (intercept) {
        //         trigger++;
        //     }
        // }
        // var au_special_affid = 0;
        // if(pagepartUrl != '/open-live-account-gold-test/'&&pagepartUrl != '/open-demo-account-gold-test/'){
        // if ("au" == code && whiteList != 'true') {
        //     // console.log(whiteList);
        //     if (current_user_state != null) {
        //         if(affid_new == "60778"||affid_new == "NjA3Nzg="||affid_new == "NjA3Nzg%3D"){
        //             au_special_affid++;
        //             setCookie("affid", "60780", 15);
        //             if (url_data_s != "") {
        //                 if (url_data_s.indexOf("affid") != -1) {
        //                     url_data_s = replaceQueryString(url_data_s, 'affid', '60780');
        //                 } else {
        //                     url_data_s = url_data_s + '&affid=60780';
        //                 }
        //             } else {
        //                 url_data_s = '?affid=60780';
        //             }
        //         }
        //         if (affid_new == "58535") {
        //             au_special_affid++;
        //             setCookie("affid", "60630", 15);
        //             if (url_data_s != "") {
        //                 if (url_data_s.indexOf("affid") != -1) {
        //                     url_data_s = replaceQueryString(url_data_s, 'affid', '60630');
        //                 } else {
        //                     url_data_s = url_data_s + '&affid=60630';
        //                 }
        //             } else {
        //                 url_data_s = '?affid=60630';
        //             }
        //         } 
        //         if(au_special_affid  == 0){
        //             window.location.replace('https://www.' + au_domain + '/'+ url_data );
        //         }else{
        //             if (url_data_p == "/open-demo-account/" || url_data_p == "/open-live-account/") {
        //                 window.location.replace("https://www." + au_domain + "/" + url_data_p + url_data_s);
        //             } else {
        //                 window.location.replace("https://www." + au_domain + "/" + url_data_s);
        //             }
        //         }
        //     }
        // }
        // }

        if (trigger == 0) {
            if (!cookie) {
                setCookie("NAT_jump", true);
                switch (code) {
                    case 'br':
                        if(str_lan !='pt'){window.location.replace(ipJumpURL('/pt/','en'))};
                        break;
                    case 'th':
                        if(str_lan !='th'){window.location.replace(ipJumpURL('/th/','en'))};
                        break;
                    case 'in': case 'ph':
                        if(str_lan !='en'){window.location.replace(ipJumpURL('/en/','en'))};
                        break;
                    case 'my':
                        if(str_lan !='en'){window.location.replace(ipJumpURL('/en/','my'))};
                        break;
                    case 'tw': case 'hk':
                        if(str_lan !='hant'){window.location.replace(ipJumpURL('/hant/','en'))};
                        break;
                    case 'id':
                        if(str_lan !='id'){window.location.replace(ipJumpURL('/id/','id'))};
                        break;
                    case 'kr':
                        if(str_lan !='ko'){window.location.replace(ipJumpURL('/ko/','en'))};
                        break;
                    case 'kz':
                        if(str_lan !='kk'){window.location.replace(ipJumpURL('/kk/','kk'))};
                        break;
                    case 'mn':
                        if(str_lan !='mn'){window.location.replace(ipJumpURL('/mn/','en'))};
                        break;
                    case 'vn':
                        if(str_lan !='vi'){window.location.replace(ipJumpURL('/vi/','en'))};
                        break;
                    case 'za': case 'ng': case 'ke': case 'bw':
                        if(str_lan !='en-za'){window.location.replace(ipJumpURL('/en-za/','en'))};
                        break;
                    case 'ru':
                        if(str_lan !='ru'){window.location.replace(ipJumpURL('/ru/','ru'))};
                        break;
                    // case 'mx': case 'co': case 'ar': case 'pe': case 'cl': case 've': case 'gt': case 'ec': case 'bo': case 'ht': case 'cu': 
                    // case 'do': case 'hn': case 'py': case 'ni': case 'sv': case 'cr': case 'pa': case 'uy': case 'jm': case 'tt': case 'gy': 
                    // case 'sr': case 'bz': case 'bs': case 'bb': case 'lc': case 'gd': case 'vc': case 'ag': case 'dm': case 'kn': case 'pr': 
                    // case 'gp': case 'mq': case 'gf': case 'cw': case 'aw': case 'vi': case 'ky': case 'sx': case 'tc': case 'vg': case 'ai': 
                    // case 'ms': case 'fk': 
                    //     if(str_lan !='es'){window.location.replace(ipJumpURL('/es/'))};
                    //     break;
                    default:
                        if(site_area=='apac'){
                            if(ip_area=='africa'||ip_area=='row'){
                                window.location.replace(ipJumpURL('/','en')); return;
                            }
                        }else{
                            if(ip_area=='apac'){
                                window.location.replace(ipJumpURL('/en/','en')); return;
                            }
                            if(ip_area=='africa'){
                                window.location.replace(ipJumpURL('/en-za/','en')); return;
                            }
                        }
                    break;
                }
            }
        }
    }
}