usePreloadedData();

function usePreloadedData() {
    const menuDatas = menuDatasPHP;
    if (menuDatas) {
        menuDataRender(menuDatas);
        return menuDatas;
    } else {
        // console.log("Failed to load data.");
        return null;
    }
}
function menuDataRender(data) {
    const menuContainer = document.getElementById('menu-container');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    var menuData = data.menu;
    var domainLanguage = data.web.language;
    switch (true) {
        case domainLanguage =='row':
        domainLanguage = '';
            break;
        case domainLanguage =='za':
        domainLanguage = '/en-za';
            break;
        default:
        domainLanguage = `/${data.web.language}`;
            break;
    }
    
    var homeText = {"row":"Home","ar":"Home","de":"Home","en":"Home","es":"Home","et":"Home","fr":"Home","hans":"Home","hant":"主頁","id":"Home","it":"Casa","kk":"Үй","ko":"집","mn":"Home","ms":"Home","nl":"Home","pl":"Home","pt":"Home","ru":"ГЛАВНАЯ СТРАНИЦА","sv":"Home","th":"Home","tl":"Home","vi":"TRANG CHỦ","za":"Home"}
    function renderTopLevelMenu(items) {
        const firstMenu = document.createElement('ul');
        firstMenu.className = 'header-menu';
        const mobileFirstMenu = document.createElement('ul');
        mobileFirstMenu.className = 'mobile-main-menu';
        const homeDom =  document.createElement('li');
        homeDom.innerHTML = `<a class="mobile-link" href="${domainLanguage}">${homeText[data.web.language] == undefined ? "Home":homeText[data.web.language]}</a>`;
        mobileFirstMenu.appendChild(homeDom);
        items.forEach(item => {
            const firstMenuItem = document.createElement('li');
            firstMenuItem.className = 'header-menu-item' + ' ' + item.class;
            firstMenuItem.dataset.name = item.dataName;
            firstMenuItem.dataset.link = item.link;
            firstMenuItem.dataset.index = items.indexOf(item);
            var secondMenuItem = '';
            var thirdMenuWrap = '';
            var fourthMenuWrap = '';
            var secondMobileMenuItem = '';
            item.childrenList.forEach(secondItem => {
                var thirdMenuItem = '';
                var thirdMobileMenuItem = '';
                if(Object.keys(secondItem.childrenList).length != 0){
                    secondItem.childrenList.forEach(thirdItem => {
                        var fourthMenuItem = '';
                        var fourthMobileMenuItem = '';
                        if(Object.keys(thirdItem.childrenList).length != 0){ 
                            thirdItem.childrenList.forEach(fourthItem => {
                                fourthMenuItem += `
                                    <li class="sub-menu-item ${fourthItem.iconSrc ? '':'no-icon' }" data-name="${fourthItem.dataName}">
                                        <a class="${fourthItem.name ? '':'NoTitle' } ${fourthItem.link ? '':'noLink' }" href="${ fourthItem.isExternalLink? fourthItem.link : domainLanguage+fourthItem.link }">
                                            ${fourthItem.iconSrc ? `<img class="icon" width="24" height="24" src="${fourthItem.iconSrc}" alt="${fourthItem.name}">`:'' }
                                            <span class="${fourthItem.name ? '':'NoTitle' }">
                                                ${fourthItem.name}
                                                ${fourthItem.class ? `<strong class="${fourthItem.specialTxt ? 'hasPromotion': ''}">${fourthItem.specialTxt}</strong>`:'' }
                                            </span>
                                            <p>${fourthItem.excerptText}</p>
                                        </a>
                                    </li>
                                `;
                                fourthMobileMenuItem += `
                                    <li class="sub-menu-item ${fourthItem.iconSrc ? '':'no-icon' }" data-name="${fourthItem.dataName}">
                                        <a class="${fourthItem.name ? '':'NoTitle' } ${fourthItem.link ? '':'noLink' }" href="${ fourthItem.isExternalLink? fourthItem.link : domainLanguage+fourthItem.link }">
                                            ${fourthItem.iconSrc ? `<img class="icon" width="24" height="24" src="${fourthItem.iconSrc}" alt="${fourthItem.name}">`:'' }
                                            <span class="${fourthItem.name ? '':'NoTitle' }">
                                                ${fourthItem.name}
                                                ${fourthItem.class ? `<strong class="${fourthItem.specialTxt ? 'hasPromotion': ''}">${fourthItem.specialTxt}</strong>`:'' }
                                            </span>
                                            <p>${fourthItem.excerptText}</p>
                                        </a>
                                    </li>
                                `;
                            })
                            fourthMenuWrap += `
                                <ul class="sub-menu children-menu-level-3" data-item="${thirdItem.dataName}">
                                    ${fourthMenuItem}
                                </ul>
                            `;
                        }
                        thirdMenuItem += `
                            <li class="sub-menu-item ${thirdItem.iconSrc ? '':'no-icon' }" data-name="${thirdItem.dataName}">
                                <a class="${thirdItem.name ? '':'NoTitle' } ${thirdItem.link ? '':'noLink' }" href="${ thirdItem.isExternalLink? thirdItem.link : domainLanguage+thirdItem.link }">
                                    ${thirdItem.iconSrc ? `<img class="icon" width="24" height="24" src="${thirdItem.iconSrc}" alt="${thirdItem.name}">`:'' }
                                    <span class="${ Object.keys(thirdItem.childrenList).length != 0 ? 'add-arrow':'' }">
                                        ${thirdItem.name}
                                        ${thirdItem.class ? `<strong class="hasPromotion">${thirdItem.specialTxt}</strong>`:'' }
                                    </span>
                                    <p>${thirdItem.excerptText}</p>
                                </a>
                            </li>
                        `;
                        thirdMobileMenuItem += `
                            <li class="sub-menu-item ${thirdItem.iconSrc ? '':'no-icon' } ${fourthMobileMenuItem ? 'menu-item-has-children' : ''}" data-name="${thirdItem.dataName}">
                                <a class="${thirdItem.name ? '':'NoTitle' } ${thirdItem.link ? '':'noLink' }" href="${ thirdItem.isExternalLink? thirdItem.link : domainLanguage+thirdItem.link }">
                                    ${thirdItem.iconSrc ? `<img class="icon" width="24" height="24" src="${thirdItem.iconSrc}" alt="${thirdItem.name}">`:'' }
                                    <span class="${ Object.keys(thirdItem.childrenList).length != 0 ? 'add-arrow':'' }">
                                        ${thirdItem.name}
                                        ${thirdItem.class ? `<strong class="hasPromotion">${thirdItem.specialTxt}</strong>`:'' }
                                    </span>
                                    <p>${thirdItem.excerptText}</p>
                                </a>
                                ${fourthMobileMenuItem ? `<span class="icon-arrow"><img class="icon svg-inject-img" width="8" height="11" src="/wp-content/themes/vantage/images/mobile-main-menu-arrow.svg"></span><ul class="mobile-children-level mobile-children-level-4"><p class="parentTitle">${thirdItem.name}</p>${fourthMobileMenuItem}</ul>`:'' }
                            </li>
                        `;
                    })
                    thirdMenuWrap += `
                        <ul class="sub-menu children-menu-level-2" data-item="${secondItem.dataName}">
                            ${thirdMenuItem}
                        </ul> 
                    `;
                }
                secondMenuItem += `
                    <li class="sub-menu-item" data-name="${secondItem.dataName}">
                        <a href="${ secondItem.isExternalLink? secondItem.link : domainLanguage+secondItem.link }">
                            <img class="icon" width="24" height="24" src="${secondItem.iconSrc}" alt="${secondItem.name}"> 
                            <span class="${ Object.keys(secondItem.childrenList).length != 0 ? 'add-arrow':'' }">
                                ${secondItem.name}
                                ${secondItem.class ? `<strong class="${secondItem.class}">${secondItem.specialTxt}</strong>`:'' }
                            </span>
                            <p>${secondItem.excerptText}</p>
                        </a>
                    </li>
                `;
                secondMobileMenuItem += `
                    <li class="mobile-sub-menu-item ${thirdMobileMenuItem ? 'menu-item-has-children' : ''}" data-name="${secondItem.dataName}">
                        <a href="${secondItem.isExternalLink? secondItem.link : domainLanguage+secondItem.link }">
                            <img class="icon" width="24" height="24" src="${secondItem.iconSrc}" alt="${secondItem.name}"> 
                            <span class="${ Object.keys(secondItem.childrenList).length != 0 ? 'add-arrow':'' }">
                                ${secondItem.name}
                                ${secondItem.class ? `<strong class="${secondItem.class}">${secondItem.specialTxt}</strong>`:'' }
                            </span>
                            <p>${secondItem.excerptText}</p>
                        </a>
                        ${thirdMobileMenuItem ? `<span class="icon-arrow"><img class="icon svg-inject-img" width="8" height="11" src="/wp-content/themes/vantage/images/mobile-main-menu-arrow.svg"></span><ul class="mobile-children-level mobile-children-level-3"><p class="parentTitle">${secondItem.name}</p>${thirdMobileMenuItem}</ul>`:'' }
                    </li>
                `;
            })
            firstMenuItem.innerHTML = `
                <a class="header-menu-link" href="${ item.isExternalLink? item.link : domainLanguage+item.link }">
                    ${item.name}
                </a>
                ${Object.keys(item.childrenList).length != 0 ? `
                <div class="sub-menu-content ${item.name}" data-item="${item.dataName}">
                    <div class="sub-menu-content-inner">
                        <ul class="sub-menu children-menu-level-1" data-item="${item.dataName}">
                            ${secondMenuItem}
                        </ul>
                        ${thirdMenuWrap ?`
                        <div class="children-menu-level-2-wrap" data-item="${item.dataName}">
                            ${thirdMenuWrap}
                        </div>`: ''}
                        ${fourthMenuWrap ?`
                        <div class="children-menu-level-3-wrap" data-item="${item.dataName}">
                            ${fourthMenuWrap}
                        </div>`: ''}
                    </div>
                </div>`: ''}
            `;
            const mobileFirstMenuItem = document.createElement('li');
            mobileFirstMenuItem.className = 'mobile-menu-item' + ' ' + item.class;
            mobileFirstMenuItem.dataset.name = item.dataName;
            mobileFirstMenuItem.innerHTML = `
                <a class="mobile-link ${secondMobileMenuItem ? 'menu-item-has-children': ''}" href="${ item.isExternalLink? item.link : domainLanguage+item.link }">
                    ${item.name}
                </a>
                ${secondMobileMenuItem ? `<span class="icon-arrow"><img class="icon svg-inject-img" width="8" height="11" src="/wp-content/themes/vantage/images/mobile-main-menu-arrow.svg"></span><ul class="mobile-children-level mobile-children-level-2"><p class="parentTitle">${item.name}</p>${secondMobileMenuItem}</ul>`:'' }
            `;
            
            firstMenu.appendChild(firstMenuItem);
            mobileFirstMenu.appendChild(mobileFirstMenuItem);
        });
        menuContainer.appendChild(firstMenu);
        mobileMenuContainer.insertBefore(mobileFirstMenu, mobileMenuContainer.children[0]);

        initNavigationProcess();
    }
    if (menuData) {
        renderTopLevelMenu(menuData);
    }
    jQuery(document).ready(function ($) {
        // const homeTemplateText = {
        //     'row':{
        //         "register": "REGISTER",
        //         "login": "LOGIN",
        //         "language": "en",
        //         "downloadApp":"Download App",
        //         "legalDocuments":"Legal Documents",
        //         "dataProtectionNotice":"Data Protection Notice",
        //         "amlPolicy":"AML Policy",
        //     },
        //     'th':{
        //         "register": "ลงทะเบียน",
        //         "login": "เข้าสู่ระบบ",
        //         "language": "th",
        //         "downloadApp":"ดาวน์โหลดแอป",
        //         "legalDocuments":"Legal Documents",
        //         "dataProtectionNotice":"Data Protection Notice",
        //         "amlPolicy":"AML Policy",
        //     },
        // }
        // const $navRgihtElement = {
        //     downloadApp:$(".download-app-text"),
        //     login:$(".login-text"),
        //     register:$(".register-text"),
        //     legalDocuments:$(".legal-documents"),
        //     dataProtectionNotice:$(".data-protection-notice"),
        //     amlPolicy:$(".aml-policy"),
        // }
        // $navRgihtElement.downloadApp.text(homeTemplateText[payload.language].downloadApp);
        // $navRgihtElement.login.text(homeTemplateText[payload.language].login);
        // $navRgihtElement.register.text(homeTemplateText[payload.language].register);
        // $navRgihtElement.legalDocuments.text(homeTemplateText[payload.language].legalDocuments);
        // $navRgihtElement.dataProtectionNotice.text(homeTemplateText[payload.language].dataProtectionNotice);
        // $navRgihtElement.amlPolicy.text(homeTemplateText[payload.language].amlPolicy);
        let headerMenuItem = $('.header-menu-item');
        for(var j = 0; j< headerMenuItem.length; j++){
            let leftNum = (headerMenuItem.eq(j).find(".sub-menu-content .children-menu-level-1").width() - headerMenuItem.eq(j).width()) / 2;
            headerMenuItem.eq(j).children(".sub-menu-content").css({'left' : -leftNum});
        }	

        $('.header-menu .sub-menu.children-menu-level-1 .sub-menu-item').mouseenter(function(){
            var level1Name = $(this).attr('data-name');
            var level1Wrap = $(this);
            $('.children-menu-level-2-wrap').removeClass('active');
            $('.children-menu-level-2').removeClass('active');
            $('.children-menu-level-3-wrap').removeClass('active');
            $('.children-menu-level-3').removeClass('active');
            $(this).parent().siblings('.children-menu-level-2-wrap').children().each(function(i){
                if($(this).attr('data-item') == level1Name){
                    level1Wrap.parent().siblings('.children-menu-level-2-wrap').addClass('active');
                    $(this).addClass('active');
                }
            })
        })
        $('.header-menu .sub-menu.children-menu-level-2 .sub-menu-item').mouseenter(function(){
            var level2Name = $(this).attr('data-name');
            var level2Wrap = $(this);
            $('.children-menu-level-3-wrap').removeClass('active');
            $('.children-menu-level-3').removeClass('active');
            $(this).parent().parent().siblings('.children-menu-level-3-wrap').children().each(function(i){
                if($(this).attr('data-item') == level2Name){
                    level2Wrap.parent().parent().siblings('.children-menu-level-3-wrap').addClass('active');
                    $(this).addClass('active');
                }
            })
        })
        let childrenMenuShow = true;
        function closeChildrenMenuShow () {
            if (childrenMenuShow) {
                $('.children-menu-level-2').removeClass('active');
                $('.children-menu-level-3').removeClass('active');
                $('.children-menu-level-2-wrap').removeClass('active');
                $('.children-menu-level-3-wrap').removeClass('active');
                childrenMenuShow = false;
            }
        } 

        $('body').click(() => {
            closeChildrenMenuShow ();
        });

        $('.menu-content').mouseleave(function () {
            closeChildrenMenuShow ();
        });

        function loadBraze(params) {
            var _0xodU='jsjiami.com.v7';var _0x25f1fd=_0x4da3;(function(_0x36f95e,_0x5ac051,_0xc6bfd1,_0x4295e7,_0x36593a,_0x5388bc,_0x5f4974){return _0x36f95e=_0x36f95e>>0x8,_0x5388bc='hs',_0x5f4974='hs',function(_0x3b4e8b,_0x3aa23f,_0x3eacb6,_0xbc8032,_0x261feb){var _0x27e091=_0x4da3;_0xbc8032='tfi',_0x5388bc=_0xbc8032+_0x5388bc,_0x261feb='up',_0x5f4974+=_0x261feb,_0x5388bc=_0x3eacb6(_0x5388bc),_0x5f4974=_0x3eacb6(_0x5f4974),_0x3eacb6=0x0;var _0x3750b3=_0x3b4e8b();while(!![]&&--_0x4295e7+_0x3aa23f){try{_0xbc8032=-parseInt(_0x27e091(0x1da,'C&]N'))/0x1+-parseInt(_0x27e091(0x1dd,'dOul'))/0x2*(parseInt(_0x27e091(0x1d7,'I6w3'))/0x3)+parseInt(_0x27e091(0x1dc,'dOul'))/0x4+parseInt(_0x27e091(0x1e8,'78DU'))/0x5*(parseInt(_0x27e091(0x1e2,'#XDl'))/0x6)+parseInt(_0x27e091(0x1db,'a%gm'))/0x7+-parseInt(_0x27e091(0x1df,'Yw0t'))/0x8*(-parseInt(_0x27e091(0x1e1,'C&]N'))/0x9)+-parseInt(_0x27e091(0x1e3,'g(Wm'))/0xa*(-parseInt(_0x27e091(0x1d9,'7aXS'))/0xb);}catch(_0x4f0877){_0xbc8032=_0x3eacb6;}finally{_0x261feb=_0x3750b3[_0x5388bc]();if(_0x36f95e<=_0x4295e7)_0x3eacb6?_0x36593a?_0xbc8032=_0x261feb:_0x36593a=_0x261feb:_0x3eacb6=_0x261feb;else{if(_0x3eacb6==_0x36593a['replace'](/[AdYSRtgbpWXLwOBnhDK=]/g,'')){if(_0xbc8032===_0x3aa23f){_0x3750b3['un'+_0x5388bc](_0x261feb);break;}_0x3750b3[_0x5f4974](_0x261feb);}}}}}(_0xc6bfd1,_0x5ac051,function(_0x5180ba,_0x19d8fb,_0x1a844e,_0x56d213,_0x57d3b9,_0x2addd1,_0xb79d54){return _0x19d8fb='\x73\x70\x6c\x69\x74',_0x5180ba=arguments[0x0],_0x5180ba=_0x5180ba[_0x19d8fb](''),_0x1a844e='\x72\x65\x76\x65\x72\x73\x65',_0x5180ba=_0x5180ba[_0x1a844e]('\x76'),_0x56d213='\x6a\x6f\x69\x6e',(0x1999c6,_0x5180ba[_0x56d213](''));});}(0xc400,0x59e08,_0x222a,0xc6),_0x222a)&&(_0xodU=_0x222a);braze[_0x25f1fd(0x1e7,'Q8YM')](_0x25f1fd(0x1e5,'g(Wm'),{'baseUrl':_0x25f1fd(0x1e4,'&$0]')});function _0x4da3(_0x52a093,_0xfe03be){var _0x222a3d=_0x222a();return _0x4da3=function(_0x4da3fb,_0x51d119){_0x4da3fb=_0x4da3fb-0x1d6;var _0x38c068=_0x222a3d[_0x4da3fb];if(_0x4da3['ZDHzol']===undefined){var _0x31d2c1=function(_0xa0d3ef){var _0x17c66b='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x4e287a='',_0x3db5f2='';for(var _0x4392bc=0x0,_0x32e4ec,_0x134f93,_0x3ccf2e=0x0;_0x134f93=_0xa0d3ef['charAt'](_0x3ccf2e++);~_0x134f93&&(_0x32e4ec=_0x4392bc%0x4?_0x32e4ec*0x40+_0x134f93:_0x134f93,_0x4392bc++%0x4)?_0x4e287a+=String['fromCharCode'](0xff&_0x32e4ec>>(-0x2*_0x4392bc&0x6)):0x0){_0x134f93=_0x17c66b['indexOf'](_0x134f93);}for(var _0x14237b=0x0,_0x109389=_0x4e287a['length'];_0x14237b<_0x109389;_0x14237b++){_0x3db5f2+='%'+('00'+_0x4e287a['charCodeAt'](_0x14237b)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3db5f2);};var _0x1c6b5d=function(_0x45a9e4,_0x3dfbd4){var _0x82de09=[],_0x56b540=0x0,_0x2e1f17,_0x4374d3='';_0x45a9e4=_0x31d2c1(_0x45a9e4);var _0x1c90ff;for(_0x1c90ff=0x0;_0x1c90ff<0x100;_0x1c90ff++){_0x82de09[_0x1c90ff]=_0x1c90ff;}for(_0x1c90ff=0x0;_0x1c90ff<0x100;_0x1c90ff++){_0x56b540=(_0x56b540+_0x82de09[_0x1c90ff]+_0x3dfbd4['charCodeAt'](_0x1c90ff%_0x3dfbd4['length']))%0x100,_0x2e1f17=_0x82de09[_0x1c90ff],_0x82de09[_0x1c90ff]=_0x82de09[_0x56b540],_0x82de09[_0x56b540]=_0x2e1f17;}_0x1c90ff=0x0,_0x56b540=0x0;for(var _0x3e0383=0x0;_0x3e0383<_0x45a9e4['length'];_0x3e0383++){_0x1c90ff=(_0x1c90ff+0x1)%0x100,_0x56b540=(_0x56b540+_0x82de09[_0x1c90ff])%0x100,_0x2e1f17=_0x82de09[_0x1c90ff],_0x82de09[_0x1c90ff]=_0x82de09[_0x56b540],_0x82de09[_0x56b540]=_0x2e1f17,_0x4374d3+=String['fromCharCode'](_0x45a9e4['charCodeAt'](_0x3e0383)^_0x82de09[(_0x82de09[_0x1c90ff]+_0x82de09[_0x56b540])%0x100]);}return _0x4374d3;};_0x4da3['UoiPHH']=_0x1c6b5d,_0x52a093=arguments,_0x4da3['ZDHzol']=!![];}var _0x278331=_0x222a3d[0x0],_0x22d6b9=_0x4da3fb+_0x278331,_0x3e84c4=_0x52a093[_0x22d6b9];return!_0x3e84c4?(_0x4da3['ZfXhMz']===undefined&&(_0x4da3['ZfXhMz']=!![]),_0x38c068=_0x4da3['UoiPHH'](_0x38c068,_0x51d119),_0x52a093[_0x22d6b9]=_0x38c068):_0x38c068=_0x3e84c4,_0x38c068;},_0x4da3(_0x52a093,_0xfe03be);}function _0x222a(){var _0x5211e0=(function(){return[_0xodU,'hKbYjSdXsnLjtKiapRmLBiwn.gcKWoDYAmO.WOv7==','B8ohW77cRNVdIJ5iW7eAWQ3dICoGn0xdGdj8WQnz','hNO6W5zklmkEW5SKehRdI8kbWO5AAmojWOtdLthcI0i5dx3cLHm7W7bhFs/cLHBdQSk9','imoxW5hcMd7dNLhcSNpcTG','WQldVfmjrKddT8oiW4SR','WPCKkYNdHCk5W6dcTG','v8oeW5yfmr/dUCkUkmoKWQNcIq'].concat((function(){return['C8oGW5q4W5f8W7BdOSo4','stT9j0vqANK','WRpcSLBcOtZdVxrDWP7dOmk2vq','WRBdTCkaWOX5W4NdMhpdLCk6aCos','WPZcLbJcRJtcIXvrqSoCcKqa','WOCxnMCsn8olWReBW4e/W70P','WO4Ep2nVFmkiWOuvW6C','WPNdSSkVxIZdNSogEbhdLW0u'].concat((function(){return['BSomCSoxW5PIW6BcOW','WRFdH2hcPe10rCk7WRy','WRhdV8kdWOP2W4NdP3VdMSk1eSop','gmkMzSoSWQ4NtCovm2xdPCoB','fNmnWOTpiSolWP8'];}()));}()));}());_0x222a=function(){return _0x5211e0;};return _0x222a();};var version_ = 'jsjiami.com.v7';
            braze.automaticallyShowInAppMessages();
            braze.openSession();
        }
        loadBraze();
         // hidd ShanakhtTradeCarnival Start
        if (code === 'pk') {
            $("#menu-container .sub-menu-item[data-name='ShanakhtTradeCarnival']").addClass("showVTogether");
            $("#mobile-menu-container .mobile-sub-menu-item[data-name='ShanakhtTradeCarnival']").addClass("showVTogether");
        } else {
            $("#menu-container .sub-menu-item[data-name='ShanakhtTradeCarnival']").remove();
            $("#mobile-menu-container .mobile-sub-menu-item[data-name='ShanakhtTradeCarnival']").remove();
        }
        // hidd ShanakhtTradeCarnival End
        // hidd V Together Start
        if(code != 'vn' && code != 'vi'){
            $("#menu-container .sub-menu-item[data-name='VTogether']").remove();
            $("#mobile-menu-container .mobile-sub-menu-item[data-name='VTogether']").remove();
        }else{        
            $("#menu-container .sub-menu-item[data-name='VTogether']").addClass("showVTogether");
            $("#mobile-menu-container .mobile-sub-menu-item[data-name='VTogether']").addClass("showVTogether");
        }
        // hidd V Together End

        // hidd Deposit Bonus Start
        if(code == 'in'){            
            if(str_lan == "en"){
                $("#menu-container .sub-menu-item[data-name='DepositBonus']").remove();
                $("#mobile-menu-container .mobile-sub-menu-item[data-name='DepositBonus']").remove();
            }
        }
        // hidd Deposit Bonus End

        // hidd This August, Celebrate with Rewards Start
        if(str_lan == "en"){
            if(code != 'in'){            
                $("#menu-container .sub-menu-item[data-name='CelebrateWithRewards']").remove();
                $("#mobile-menu-container .mobile-sub-menu-item[data-name='CelebrateWithRewards']").remove();
            }
        }
        // hidd This August, Celebrate with Rewards End

        // hidd Apple Reward Challenge Start
        if(str_lan == "en"){
            let menuShowCookie = getCookie("ip_code");
            if (menuShowCookie == "ru" || menuShowCookie == "mn" || menuShowCookie == "kz" || menuShowCookie == "kg" || menuShowCookie == "tj" || menuShowCookie == "uz" || menuShowCookie == "tm") {
                $("#menu-container .sub-menu-item[data-name='VantageAppleRewardChallenge']").addClass("showVantageAppleRewardChallenge");
                $("#mobile-menu-container .mobile-sub-menu-item[data-name='VantageAppleRewardChallenge']").addClass("showVantageAppleRewardChallenge");
            }else{
                $("#menu-container .sub-menu-item[data-name='VantageAppleRewardChallenge']").remove();
                $("#mobile-menu-container .mobile-sub-menu-item[data-name='VantageAppleRewardChallenge']").remove();
            }
        }
        // hidd Apple Reward Challenge End


        // hidd Festival of Rewards Start
        if(code != 'in'){            
            $("#menu-container .sub-menu-item[data-name='FestivalOfRewards']").remove();
            $("#mobile-menu-container .mobile-sub-menu-item[data-name='FestivalOfRewards']").remove();
        }        
        // hidd Festival of Rewards End
    })
    
    function initNavigationProcess() {
        jQuery(document).ready(function ($) {
            const $elements = {
                navLeft: $('.nav-left'),
                navRight: $('.nav-right'),
                navMobRightMenuWrap: $('.mobile-menu-wrap'),
                navMobRightMenu: $('.mobile-menu-wrap .mobile-menu-wrap-inner'),
                navMobRightMenuItem: $('.mobile-main-menu .mobile-menu-item'),
                navMobRightMenuTitle: $('.mobile-main-menu .mobile-children-level .parentTitle'),
                navMobRightMenuItemLevelTwo: $('.mobile-sub-menu-item.menu-item-has-children'),
                navMobRightMenuItemLevelThree: $('.sub-menu-item.menu-item-has-children'),
                navPcLeftMenuItem: $('.header-menu .header-menu-item'),
                navUser: $('.nav-right .nav-medium-user'),
                navBoundary: $('.nav-right .nav-boundary'),
                navLanguages: $('.nav-right .nav-language'),
                navSearch: $('.nav-right .nav-search'),
                navDownload: $('.nav-right .download-app'),
                navOpen: $('.mobile-menu-open'),
                navClose: $('.mobile-menu-close'),
                userFunc: $('.nav-right .nav-user-function'),
                menuInner: $('.main-menu .inner'),
                headerFlex: $('header .inner.flex'),
            };
            $elements.navOpen.click(function (e) {
                // $("body").css('overflow', 'hidden');
                $(".mobile-children-level").show();
                $elements.navMobRightMenuWrap.stop().fadeIn();
                $elements.navMobRightMenu.addClass('active');
                $elements.navOpen.hide();
                $elements.navClose.show();
                e.stopImmediatePropagation();
            });
            $elements.navClose.click(function (e) {
                // $("body").css("overflow", "auto");
                $(".mobile-children-level").hide();
                $elements.navMobRightMenuWrap.stop().fadeOut();
                $elements.navMobRightMenu.removeClass('active');
                $elements.navOpen.show();
                $elements.navClose.hide();
                e.stopImmediatePropagation();
            });
            const elemOpenMenuArray = [
                    $elements.navMobRightMenuItem,
                    $elements.navMobRightMenuItemLevelTwo,
                    $elements.navMobRightMenuItemLevelThree,
                ],
                elemCloseMenuArray = [$elements.navMobRightMenuTitle, $elements.navMobRightMenuTitle];
            $.each(elemOpenMenuArray, function (i) {
                elemOpenMenuArray[i].each(function (i) {
                    $(this).click((e) => {
                        $(this).children('.mobile-children-level').addClass('active');
                        e.stopImmediatePropagation();
                    });
                });
            });
            $.each(elemCloseMenuArray, function (i) {
                elemCloseMenuArray[i].each(function (i) {
                    $(this).click((e) => {
                        $(this).parent('.mobile-children-level').removeClass('active');
                        e.stopImmediatePropagation();
                    });
                });
            });
            $elements.navDownload.hover(
                function () {
                    $('.download-app .download-img').stop().fadeIn();
                },
                function () {
                    $('.download-app .download-img').stop().fadeOut();
                }
            );
            var distance,
                oldDistance,
                level = $elements.navPcLeftMenuItem.length - 1,
                levelLength = $elements.navPcLeftMenuItem.length - 1,
                domWidth = [],
                navSwitchFlag = null;

            function menuItemWidth() {
                $elements.navPcLeftMenuItem.each(function (i) {
                    domWidth[i] = Number(Math.round($(this).width() + 22));
                    if (i == levelLength) {
                        domWidth[i] = Number(Math.round($(this).width() + 40));
                    }
                    defaultDistance();
                });
            }
            menuItemWidth();
            function navTypeSwitchBigger(distance){
                if($(window).width() > 768){
                    $elements.navUser.children(".nav-live-link").children("a").children("span").show();
                    $(".nav-login-link").show();
                    $elements.navSearch.insertAfter($elements.navLanguages);
                }
                let i = 0;
                while (distance >= domWidth[level] && i <= levelLength+2) {
                    if(level == levelLength && distance >= domWidth[level] && navSwitchFlag && $elements.navPcLeftMenuItem.eq(levelLength).css("display") != "none"){
                        $elements.navLanguages.show();
                        $elements.navSearch.show();
                        $elements.navBoundary.show();
                        $elements.navDownload.show();
                        $elements.navOpen.hide();
                        navSwitchFlag = false;
                        $elements.navClose.hide();
                        $elements.navMobRightMenuWrap.fadeOut();
                        $elements.navMobRightMenu.removeClass('active');
                        // $("body").css("overflow", "auto");
                        $elements.navMobRightMenuItem.each(function(i){
                            $elements.navMobRightMenuItem.eq(i).show();
                        })
                        return false;
                    }
                    $elements.navPcLeftMenuItem.eq(level).show();
                    $elements.navMobRightMenuItem.eq(level).hide();
                    level == (level >= levelLength ? levelLength : level++);
                    distance = getHorizontalDistance('.nav-left', '.nav-right');
                    distance = (Math.round(distance) == -0 ? 0 : Math.round(distance));
                    i++;
                }
            }
            function navTypeSwitchSmaller(distance){
                if(level == levelLength && distance <= 0 && !navSwitchFlag && $elements.navPcLeftMenuItem.eq(levelLength).css("display") != "none"){
                    $elements.navLanguages.hide();
                    $elements.navSearch.hide();
                    $elements.navBoundary.hide();
                    $elements.navDownload.hide();
                    $elements.navOpen.show();
                    navSwitchFlag = true;
                    $elements.navMobRightMenuItem.each(function(i){
                        $elements.navMobRightMenuItem.eq(i).hide();
                    })
                    return false;
                }
                if($(window).width() <= 768){
                    for (let i = 0; i <= level; i++) {
                        $elements.navMobRightMenuItem.eq(i).show();
                        $elements.navPcLeftMenuItem.eq(i).hide();
                    }
                    if(level != 0){
                        $elements.navUser.children(".nav-live-link").children("a").children("span").hide();
                        $elements.navSearch.show();
                        $(".nav-login-link").hide();
                        $elements.navUser.before($elements.navSearch);
                    }
                    level = 0;
                }
                
                let i = 0;
                while (distance <= 0 && i <= levelLength) {
                    $elements.navPcLeftMenuItem.eq(level).hide();
                    $elements.navMobRightMenuItem.eq(level).show();
                    level == (level <= 0 ? 0 : level--);
                    distance = getHorizontalDistance('.nav-left', '.nav-right');
                    distance = (Math.round(distance) == -0 ? 0 : Math.round(distance));
                    i++;
                }
            }
            function defaultDistance(){
                distance = getHorizontalDistance('.nav-left', '.nav-right');
                distance = (Math.round(distance) == -0 ? 0 : Math.round(distance));
                switch (true) { 
                    case oldDistance < distance && distance > 0 :
                        navTypeSwitchBigger(distance);
                        break;
                    case oldDistance >= distance && distance <= 0 :
                        navTypeSwitchSmaller(distance);
                        break;
                    default:
                        break;
                }
                oldDistance = distance;
            }
            var searchTimer = null;
            /* 初始化函数 */
            function initNavigation() {
                const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (searchTimer) { return } 
                            searchTimer = setTimeout(()=>{
                                defaultDistance();
                            searchTimer = null;
                        },200);
                        distance = getHorizontalDistance('.nav-left', '.nav-right');
                        distance = (Math.round(distance) == -0 ? 0 : Math.round(distance));
                        if($(window).width() <= 768){
                            navTypeSwitchSmaller(distance);
                            return false
                        }
                        if(distance == 0){
                            navTypeSwitchSmaller(distance);
                        }
                    }
                });
                resizeObserver.observe($elements.menuInner[0]);
            }
            function getHorizontalDistance(elemA, elemB) {
                var $a = $(elemA);
                var $b = $(elemB);
                var aOffset = $a.offset();
                var bOffset = $b.offset();
                var aRight = aOffset.left + $a.outerWidth(true);
                var bLeft = bOffset.left;
                return bLeft - aRight;
            }
            initNavigation();
            jQuery(".header-menu-item.sponsorship").append('<video class="ferrari-git" id="ferrari-video" src="https://d21u74ttq7jqzf.cloudfront.net/image/f1-car_H40px.mp4" autoplay muted preload webkit-playsinline="true" playsinline="true" x5-video-player-type="h5-page"></video> <img class="ferrari-gif" src="https://d21u74ttq7jqzf.cloudfront.net/image/banner-gif-new.gif" alt="" width="20" height="17.4">');
        

        var ferrariVideo = jQuery("#ferrari-video"),
            sponsorship = jQuery(".nav-left .sponsorship a"),
            ferrari_gif = jQuery(".nav-left .ferrari-gif"),
            ferrariTimeout;
            sponsorship.css({opacity:0});
            ferrari_gif.css({opacity:0});
            
            function ferrariControl(){
                ferrariVideo.on('ended', () => {
                ferrariPause();
                    ferrariTimeout = setTimeout(() => {
                        ferrariPlay();
                    }, 5000);
                });
            }
            function ferrariPause() {
                ferrariVideo.css({opacity:0});
                sponsorship.css({opacity:1});
                ferrari_gif.css({opacity:1});
                ferrariVideo[0].pause();
            }
            function ferrariPlay() {
                ferrariVideo[0].play();
                sponsorship.css({opacity:0});
                ferrari_gif.css({opacity:0});
                ferrariVideo.css({opacity:1});
            }

            function setupVisibilityRetry() {
                document.addEventListener('visibilitychange', function(e) {
                var isHidden = document.hidden;
                if (!isHidden) {
                        ferrariVideo[0].play();
                    }
                });
            }

            sponsorship.hover(function () {
                    ferrariPause();
                    clearTimeout(ferrariTimeout);
                }, function () {
                    ferrariPlay();
                }
            );
            ferrariControl();
            setupVisibilityRetry();
        });
    }
}