function getDomain() {
    const local_url = document.location.href;
    let domain = local_url.split("/");
    if (domain[2]) {
        domain = domain[2];
    }
    else {
        domain = "";
    }
    let domains = domain.split(".");
    let domain_str = "";
    if (domains.length > 2) {
        for (i = domains.length; i > 1; i--) {
            if (i == domains.length) {
                domain_str = domains[i - 1];
            }
            else {
                domain_str = domains[i - 1] + "." + domain_str;
            }
        }
    }
    else {
        domain_str = domain;
    }

    return domain_str;
}

function getPar(par) {
    // Get current URL
    const local_url = document.location.href;
    // Get the get parameter position to be obtained
    let get = local_url.indexOf(par + "=");
    if (get == -1) {
        return false;
    }
    // intercept string
    let get_par = local_url.slice(par.length + get + 1);
    // Determine whether the intercepted string has other get parameters
    let nextPar = get_par.indexOf("&");
    if (nextPar != -1) {
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}

function getParNew(par) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(par) || "";
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }else {
        expires = ""
    };
    document.cookie = name + "=" + value + expires + "; path=/; domain=" + getDomain();
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return "";
}

function GetUrl(sProp) {
    let re = new RegExp("[&,?]" + sProp + "=([^\\&]*)", "i");
    let a = re.exec(document.location.search);
    if (a == null)
        return "";
    return a[1];
}

function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

// Timestamp random number (for ip jump)
function Data() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let newRandom = "";
    for (let i = 0; i < 5; i++) {
        newRandom += Math.floor(Math.random() * 9 + 1).toString();
    }
    let currentdate = year + month + strDate + newRandom;
    return currentdate;
}

const isRetailleadsource = getPar("retailleadsource") || getPar("rt") || '';
const isLs = getPar("ls") || '';
// ls抓取相关的
var g_utm_source,g_utm_medium,g_utm_campaign,g_utm_content,g_utm_term,rt,ls,saveLsm,currentDate,currentLsm;
function utmParam(){
    g_utm_source = getParNew('utm_source') || 'NA';
    g_utm_medium = getParNew('utm_medium') || 'NA';
    g_utm_campaign = getParNew('utm_campaign') || 'NA';
    g_utm_content = getParNew('utm_content') || 'NA';
    g_utm_term = getParNew('utm_term') || 'NA';
    rt = getParNew("retailleadsource") || getParNew("rt") || 'NA';
    ls = getParNew('ls') || 'NA';
    var lsmArr = [g_utm_source,g_utm_medium,g_utm_campaign,g_utm_content,g_utm_term,rt,ls];
    var lsm_flag = false;
    lsmArr.forEach(function(item ,index) {
        item = item.replace(/['"“”‘’;`]/g,'');
        if(!item){
            item = 'NA';
        }
        if (item != 'NA') {
            lsm_flag = true;
        }
        lsmArr[index] = item;
    });
    currentLsm = `${lsmArr[0]}|${lsmArr[1]}|${lsmArr[2]}|${lsmArr[3]}|${lsmArr[4]}|rt=${lsmArr[5]}|ls=${lsmArr[6]}`;

    currentDate = Date.now();
    if (lsm_flag) {
        if(getCookie("lsm")){
                saveLsm = JSON.parse(getCookie("lsm")) ;
            // 看之前是否存过
            const haveRecord = saveLsm.some(item => item.ls == currentLsm);
            // 如果该条链接之前存在过，刷新下对应的时间戳
            if(haveRecord){
                saveLsm.forEach(item => {
                    if(item.ls === currentLsm){
                        item.date = currentDate;
                        return;
                    }
                });
                // 重新排下序，让最新的保持在最下面
                saveLsm.sort((a, b) => a.date - b.date);
                // 刷新下存的值
                setCookie("lsm",JSON.stringify(saveLsm),90);
            }else{
                // 之前没存过，存到数组中
                saveLsm.push({
                    ls: currentLsm,
                    date: currentDate
                });
                setCookie("lsm",JSON.stringify(saveLsm),90);
            }
        }else{
            // 没存过lsm
            var cookieLs = decodeURIComponent(getCookie("ls")).replace(/['"“”‘’;`]/g,"")
            if (cookieLs) {
                if (cookieLs == lsmArr[6]) {
                    saveLsm = [
                        {
                            ls: currentLsm,
                            date: currentDate
                        }
                    ];
                }else {
                    if(!getParNew("utm_source")&&!getParNew("utm_medium")&&!getParNew("utm_campaign")&&!getParNew("utm_content")&&!getParNew("utm_term") && (!getParNew("retailleadsource") && !getParNew("rt")) &&!getParNew("ls")){
                        saveLsm = [
                            {
                                ls: `NA|NA|NA|NA|NA|rt=NA|ls=${getCookie('ls')}`,
                                date: currentDate - 1
                            }
                        ];
                    }else{
                        saveLsm = [
                            {
                                ls: `NA|NA|NA|NA|NA|rt=NA|ls=${getCookie('ls')}`,
                                date: currentDate - 1
                            },{
                                ls: currentLsm,
                                date: currentDate
                            }
                        ];
                    }
                }
            } else {
                saveLsm = [
                    {
                        ls: currentLsm,
                        date: currentDate
                    }
                ];
            }
            setCookie("lsm",JSON.stringify(saveLsm),90);
        }

        g_lsm = getCookie("lsm");
        g_ls = getParNew("ls");
    }
}

// 上级来源 referrer
if(getParNew("ls") == ""&&getCookie("ls") == ""){
    referrerHandling();
}

function referrerHandling() {
    var urlData = window.location.href;
    var urlDataP = window.location.pathname;
    var urlDataMain = '';
    var currentDate = Date.now();

    var strLan = urlDataP.split("/")[1];
    var strNum = strLan.length + 2;

    if(strLan == 'hans' || strLan == 'hant' || strLan == 'th' || 
        strLan == 'ms' || strLan == 'id' || strLan == 'kk' || 
        strLan == 'ru' || strLan == 'mn' || strLan == 'vi' || 
        strLan == 'ko' || strLan == 'fr' || strLan == 'de' || 
        strLan == 'es' || strLan == 'it' || strLan == 'nl' || 
        strLan == 'pl' || strLan == 'ar' || strLan == 'pt' || 
        strLan == 'sv' || strLan == 'et' || strLan == 'tl' ||
        strLan == 'en' || strLan == 'en-za'){
        urlData=urlData.substring(urlData.indexOf("/")+strNum , urlData.length);
        urlDataP=urlDataP.substring(urlDataP.indexOf("/")+strNum, urlDataP.length);
        urlDataMain=urlDataP.split('/')[0];
    }else{
        urlData=urlData.substring(urlData.indexOf("/")+1 , urlData.length);
        urlDataP=urlDataP.substring(urlDataP.indexOf("/")+1, urlDataP.length);
        urlDataMain=urlDataP.split('/')[0];
    }

    // referrer
    var referrerData = [
        {
            'name':'google',
            'domain':'google.com',
            'data':'tmbtseo01'
        },
        {
            'name':'yahoo',
            'domain':'yahoo.com',
            'data':'tmbtseo02'
        },
        {
            'name':'bing',
            'domain':'bing.com',
            'data':'tmbtseo03'
        }
    ]
    
    var referrerURL = '';
    var referrerDomain = '';
    referrerURL = document.referrer;
    // referrerURL = 'https://www.goole.com/123/';   //test
    if(referrerURL != ''){
        referrerURL = new URL(referrerURL);
        referrerDomain = referrerURL.hostname;
        // console.log(referrerDomain);
    }
    if(referrerDomain != ''){
        referrerData.forEach( item => {
            if(referrerDomain.includes(item.domain)){
                // console.log('Referral:'+item.name+'; LS recorded:'+item.data+urlDataMain);
                setCookie("ls", item.data+urlDataMain, 15);
                saveLsm = [{ls: `NA|NA|NA|NA|NA|rt=NA|ls=${item.data+urlDataMain}`,date: currentDate}];
                setCookie("lsm",JSON.stringify(saveLsm),90);
            }
        });
    }else{
        // console.log('No referral');
    }
}

// 该函数用于判断 url 中是否出现 lsm相关参数
function hasUrlUtm() {
  let urlUtmArr = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'retailleadsource', 'rt', 'ls']
  let flag = false;
  urlUtmArr.forEach((item) => {
    if (getParNew(item).replace(/['"‘’“”;`]/g, "") !== '') {
      flag = true;
    }
  })
  return flag;
}

jQuery(document).ready(function ($) {
    let nowpageurl = window.location.pathname;
    let urllanguage = nowpageurl.split("/")[1];
    var g_affid = "", g_campaignsource = "", g_cpaid = "", g_ls = "", g_lsm = "", g_cid = "", g_wid = "", g_cxd = "", g_clickid = "", g_language = "",lsm_retailleadsource = "";
    lsm_retailleadsource = getParNew("retailleadsource") || getParNew("rt");
    // 先看当前链接是否有相关参数，有则更新，无则跳过
    if(hasUrlUtm()){
        utmParam();
    }else if(getCookie("lsm")){//当前链接没有相关参数，看一下之前有没有存过对应cookie
		// 之前存在过，刷新当前存储的cookie周期
		g_lsm = getCookie("lsm");
		setCookie("ls",getCookie("ls"),15);
        setCookie("lsm",getCookie("lsm"),90);
	}else if (decodeURIComponent(getCookie("ls")).replace(/['"“”‘’;`]/g,"") && !(getCookie("lsm"))) {
        utmParam();
    }else{//之前没有打开过对应链接
        g_lsm = "";
	}
    //end ls save

    switch (urllanguage){
        case 'fr':
            g_wid = "VFX_FR",
            g_language = "fr_FR";
            break;
        case 'de':
            g_wid = "VFX_DE",
            g_language = "de";
            break;
        case 'es':
            g_wid = "VFX_ES",
            g_language = "es";
            break;
        case 'it':
            g_wid = "VFX_IT",
            g_language = "it";
            break;
        case 'nl':
            g_wid = "VFX_NL",
            g_language = "nl";
            break;
        case 'pl':
            g_wid = "VFX_PO",
            g_language = "pl";
            break;
        case 'ar':
            g_wid = "VFX_AR",
            g_language = "ar";
            break;
        case 'pt':
            g_wid = "VFX_PT",
            g_language = "pt";
            break;
        case 'sv':
            g_wid = "VFX",
            g_language = "en_US";
            break;
        case 'et':
            g_wid = "VFX_ET",
            g_language = "en_US";
            break;
        case 'hans':
            g_wid = "VFX_CN",
            g_language = "zh_CN";
            break;
        case 'hant':
            g_wid = "VFX_TW",
            g_language = "zh_TW";
            break;
        case 'th':
            g_wid = "VFX_TH",
            g_language = "th";
            break;
        case 'ms':
            g_wid = "VFX_MY",
            g_language = "ms";
            break;
        case 'id':
            g_wid = "VFX_ID",
            g_language = "id";
            break;
        case 'kk':
            g_wid = "VFX_KZ",
            g_language = "ru";
            break;
        case 'ru':
            g_wid = "VFX_RU",
            g_language = "ru";
            break;
        case 'mn':
            g_wid = "VFX_MN",
            g_language = "mn";
            break;
        case 'vi':
            g_wid = "VFX_VN",
            g_language = "vi";
            break;
        case 'ko':
            g_wid = "VFX_KR",
            g_language = "ko";
            break;
        case 'tl':
            g_wid = "VFX",
            g_language = "en_US";
            break;
        default:
            g_wid = "VFX",
            g_language = "en_US";
            break;
    }

    // console.log({g_wid,g_language});

    $("#phoneCode").val("");
    $("#phoneCode").attr("placeholder", "Code");

    if (hasParams("ls")) {
        var g_ls = getParNew("ls");
        setCookie("ls", getParNew("ls"), 15);
    }

    if (hasParams("cpaid")) {
        var g_cpaid = getParNew("cpaid");
        setCookie("cpaid", getParNew("cpaid"), 15);
    }

    if (hasParams("cs")) {
        var myCampaignsource = getParNew("cs");
        var g_campaignsource = getParNew("cs");
        setCookie("campaignsource", myCampaignsource, 15);
        setCookie("affid", null, 0);
    }else if(hasParams("affid")){
        var myaffid = getParNew("affid");
        var g_affid = getParNew("affid");
        setCookie("affid", myaffid, 15);
        setCookie("campaignsource", null, 0);
    }

    if (hasParams("cxd")) {
        setCookie("cxd", getParNew("cxd"), 15);
        var cpaids = getParNew("cxd");
        var cpaids1 = cpaids.split("_");
        var g_cxd = getParNew("cxd");
        setCookie("cpaid", cpaids1[0], 15)
    }

    if (hasParams("clickid")) {
        var g_clickid = getParNew("clickid");
        setCookie("clickid", getParNew("clickid"),15);
        setCookie("cxd", "43600_500217", 15);
        var cpaids = "43600_500217";
        var cpaids1 = cpaids.split("_");
        setCookie("cpaid", cpaids1[0], 15);
    }

    if (hasParams("cid")) {
        var g_cid = getParNew("cid");
        setCookie("cid", getParNew("cid"), 15);
    }

    const par_has_val_list = [
        { paramsName: 'track', cookieName: 'track', cookieTime: 15 },
    ]
    setCookieParHasVal(par_has_val_list);

    function setCookieParHasVal(objList) {
        for (let i = 0; i < objList.length; i++) {
            const { paramsName, cookieName, cookieTime } = objList[i];
            if (hasParams(paramsName)) {
                setCookie(cookieName, getParNew(paramsName), cookieTime)
            }
        }
    }
    function hasCookie(cookieName) {
        if (getCookie(cookieName) && getCookie(cookieName) != '' && getCookie(cookieName) != null && getCookie(cookieName) != 'null' && getCookie(cookieName) != undefined && getCookie(cookieName) != 'undefined') {
            return true;
        }
        return false;
    }
    function hasParams(paramsName) {
        if (getParNew(paramsName) && getParNew(paramsName) != '' && getParNew(paramsName) != null && getParNew(paramsName) != 'null' && getParNew(paramsName) != undefined && getParNew(paramsName) != 'undefined') {
            return true;
        }
        return false;
    }

    if (hasCookie("cpaid")) {
        var g_cpaid = getCookie("cpaid");
    }


    if (hasCookie("affid")) {
        var g_affid = getCookie("affid");
    }

    if (hasCookie("campaignsource")) {
        var g_campaignsource = getCookie("campaignsource");
    }

    if (hasCookie("cxd")) {
        var g_cxd = getCookie("cxd");
    }

    if (hasCookie("ls")) {
        var g_ls = getCookie("ls");
    }

    if (hasCookie("clickid")) {
        var g_clickid = getCookie("clickid");
    }

    if (hasCookie("cid")) {
        var g_cid = getCookie("cid");
    }

    if(g_lsm){
        g_lsm = JSON.parse(g_lsm).filter(item => Date.now() - item.date < 90*24*60*60*1000);
    }

    if (hasParams("platform")) {
        var platform = getParNew("platform");
        setCookie("platform", platform);
    }

    if (hasParams("autoCertification")) {
        var autoCertification = getParNew("autoCertification");
        setCookie("autoCertification", autoCertification);
    }

    if (hasParams("sub1")) {
        var sub1 = getParNew("sub1");
        setCookie("sub1", sub1);
    }

    const params = ['platform', 'autoCertification', 'sub1']
        .map(param => getCookie(param) ? `${param}=${getCookie(param)}` : "")
        .filter(Boolean);

    if (params.length && $(".site_login_link").length > 0) {
        $(".site_login_link").each(function() {
            const href = $(this).attr("href");
            if (href) {
                $(this).attr("href", href + (href.includes('?') ? '&' : '?') + params.join('&'));
            }
        });
    }
    
    $("#affid").val(g_affid);
    $("#campaignsource").val(g_campaignsource);
    $("#cpaid").val(g_cpaid);
    $("#wid").val(g_wid);
    $("#cxd").val(g_cxd);
    $("#ls").val(g_ls);
    $("#cid").val(g_cid);
    $("#clickid").val(g_clickid);

    $("input.affid").val(g_affid);
    $("input.campaignsource").val(g_campaignsource);
    $("input.cpaid").val(g_cpaid);
    $("input.wid").val(g_wid);
    $("input.cxd").val(g_cxd);
    $("input.ls").val(g_ls);
    $("input#language").val(g_language);
    $("input.cid").val(g_cid);
    $("input.clickid").val(g_clickid);

    $(".affid input").val(g_affid.trim());
    $(".campaignsource input").val(g_campaignsource.trim());
    $(".cpaid input").val(g_cpaid);
    $(".wid input").val(g_wid);
    $(".cxd input").val(g_cxd);
    $(".ls input").val(g_ls);
    $(".cid input").val(g_cid);
    $(".clickid input").val(g_clickid);



})


