/* https://www.hideyt.com/ */
(function () {
    "use strict";
    
    window.HIDEYT_VERSION = "2.2.19 Legacy Mode";
    let DEBUG = false;
    
    function uuidv4() {
      // Math.random is okay to use for html ids
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    // Disable HideYT if Thrive Architect editor is open
    if (new URL(window.location.href).searchParams.get("tve") === "true") return;
    
    // Import options
    let HIDING_OPTION = window.hideyt_options.hideyt_field_appearance || "full";
    let EXPIRED = window.hideyt_options.expired ? true : false;
    let ALWAYS_ON_TOP = !(window.hideyt_options.hideyt_field_ontop === "false"); // true both when the option is unset, and also when it is set to "true"
    let PAUSE_OPTION = window.hideyt_options.hideyt_field_pausehiding || "partial";
    let FORCE_FULLSCREEN = window.hideyt_options.hideyt_field_forcefullscreen || "default";
    
    if (HIDING_OPTION === "none") return; // No hiding
    
    // Load YouTube JS API
    if (document.querySelectorAll("script[src=\"https://www.youtube.com/iframe_api\"]").length === 0) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Returns an array all elements from array "a" that are also in array "b"
    function arrayDiff(a, b) {
        return a.filter(function(i) {return b.indexOf(i) < 0;});
    };
    
    // Deduplicate an array
    function arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }

    let iframeList = [];
    
    function updatePlayers() {
        if (!window.YT || !window.YT.loaded) {
            // Unfortunately we cannot rely on onYouTubeIframeAPIReadyCallbacks
            // Because it may be overwritten by other code later in the page lifecycle
            return;
        }
        
        let ytiframes = Array.from(document.querySelectorAll("iframe[src^=\"https://www.youtube.com/embed/\"], iframe[src^=\"http://www.youtube.com/embed/\"], iframe[src^=\"https://www.youtube-nocookie.com/embed/\"], iframe[src^=\"http://www.youtube-nocookie.com/embed/\"]"));
        let newFrames = arrayDiff(ytiframes, iframeList); // Now ytiframes has only the NEW iframes.
        iframeList = arrayUnique(iframeList.concat(newFrames));
        
        // Init all new YouTube players
        for (let ytiframe of newFrames) {
            // Add enablejsapi on YouTube Embed
            let url = new URL(ytiframe.src);
            if (url.searchParams.get('enablejsapi') !== "1") {
                url.searchParams.set('enablejsapi', "1");
                url.searchParams.set('rel', "0"); // Since the iframe needs to reload anyway...
                if (FORCE_FULLSCREEN === "forceon") {
                    url.searchParams.set('fs', "1");
                } else if (FORCE_FULLSCREEN === "forceoff") {
                    url.searchParams.set('fs', "0");
                }
                ytiframe.src = url;
            }
            
            // Generate uuid for frame and overlay
            let hytclass = "hideyt-" + uuidv4();
            ytiframe.classList.add(hytclass);
            
            // If the src attribute is changed by something else on the page, we need to remove HideYT from the YouTube player so that it gets set up again by the updatePlayers() function.
            {
                // Select the node that will be observed for mutations
                let targetNode = ytiframe;

                // Options for the observer (which mutations to observe)
                let config = { attributes: true };

                // Callback function to execute when mutations are observed
                let callback = function(mutationsList, observer) {
                    for(let mutation of mutationsList) {
                        if (DEBUG) console.log("mutation observed:", mutation.attributeName);
                        if (mutation.attributeName === "src") {
                            // Remove iframe from processed frames list, so HideYT attaches to it again on the next updatePlayers tick
                            iframeList = iframeList.filter(el => el !== mutation.target);
                            document.querySelector("." + hytclass + ".hytWPOverlay").outerHTML = "";
                            observer.disconnect();
                        }
                    }
                };

                // Create an observer instance linked to the callback function
                let observer = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                observer.observe(targetNode, config);
            }
            
            if (window.getComputedStyle(ytiframe.parentNode).position === "static") {
                ytiframe.parentNode.style.position = "relative";
            }
            
            // Add overlay
            let overlay = document.createElement("div");
            overlay.className = "hytWPOverlay";
            if (ALWAYS_ON_TOP) overlay.style["z-index"] = "9999";
            if (PAUSE_OPTION === "full") overlay.classList.add("fullHiding");
            overlay.classList.add(hytclass);
            ytiframe.parentNode.appendChild(overlay);
            
            function resizeScroll() {
                let rect = ytiframe.getBoundingClientRect();
                let left = ytiframe.offsetLeft;
                let top = ytiframe.offsetTop;
                let style = window.getComputedStyle(ytiframe);
                overlay.style.left = (left + parseInt(style.borderLeftWidth, 10) + parseInt(style.paddingLeft)) + "px";
                overlay.style.top = (top + parseInt(style.borderTopWidth, 10) + parseInt(style.paddingTop)) + "px";
                overlay.style.width = (rect.width - parseInt(style.borderRightWidth, 10) - parseInt(style.borderLeftWidth, 10) - parseInt(style.paddingLeft) - parseInt(style.paddingRight)) + "px";
                overlay.style.height = (rect.height - parseInt(style.borderBottomWidth, 10) - parseInt(style.borderTopWidth, 10) - parseInt(style.paddingTop) - parseInt(style.paddingBottom)) + "px";
            }
            resizeScroll();
            window.addEventListener('resize', resizeScroll);
            //window.addEventListener('scroll', resizeScroll);
            setInterval(resizeScroll, 500);
            
            // Init player
            
            let pauseTimeout;
            let onPlayerStateChange = function(event) {
                if (DEBUG) console.log("player state change: ", player);
                if (EXPIRED) return;
                if (event.data == YT.PlayerState.ENDED) {
                    if (DEBUG) console.log("player state ended: ", player);
                    overlay.classList.add("ended");
                    window.clearTimeout(pauseTimeout);
                } else if (event.data == YT.PlayerState.PAUSED) {
                    if (DEBUG) console.log("player state paused: ", player);
                    if (HIDING_OPTION === "full") {
                        if (PAUSE_OPTION === "partial") {
                            overlay.classList.add("paused");
                        } else {
                            // PAUSE_OPTION === "full"
                            pauseTimeout = window.setTimeout(function() {
                                // We need this timeout, otherwise the click event will get stuck in the overlay and not make it to the YouTube player.
                                overlay.classList.add("paused");
                            }, 100);
                        }
                    }
                } else if (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.BUFFERING) {
                    overlay.classList.remove("ended");
                    overlay.classList.remove("paused");
                    window.clearTimeout(pauseTimeout);
                }
            };
            
            let onPlayerApiChange = function(ch) {
                console.log("playerapichange:", ch);
            }
            let onPlayerError = function(error) {
                console.log("playererror:", error);
            }
            let onPlayerReady = function(event) {
                if (DEBUG) console.log("player ready: ", player);
                // Register YouTube Player change
                player.addEventListener('onStateChange', onPlayerStateChange);
                if (DEBUG) player.addEventListener('onError', onPlayerError);
                if (DEBUG) player.addEventListener('onApiChange', onPlayerApiChange);
                // Register overlay click
                overlay.addEventListener("click", function() {
                    let playerState = player.getPlayerState();
                    if (playerState == YT.PlayerState.ENDED) {
                        player.seekTo(0);
                    } else if (playerState == YT.PlayerState.PAUSED) {
                        player.playVideo();
                    }
                });
                // Inject overlay background image (the video thumbnail) into CSS
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
                let sheet = style.sheet;
                let videoid = player.getVideoData()['video_id'];
                let thumbnailURL = "https://img.youtube.com/vi/" + videoid + "/0.jpg"
                sheet.insertRule(".hytWPOverlay." + hytclass + ".ended::after { background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 510 510'%3E%3Cg transform='translate(1.62 -7.023)'%3E%3Ccircle r='244.735' cy='262.023' cx='253.379'/%3E%3Cpath d='M255.22 103.607v-57.74L152.648 124.12l102.57 77.15v-56.636c67.697 0 123.085 55.388 123.085 123.085 0 67.696-55.388 123.084-123.085 123.084-67.696 0-123.084-55.388-123.084-123.084H91.107c0 90.262 73.85 164.112 164.112 164.112s164.113-73.85 164.113-164.112-73.85-164.113-164.113-164.113z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E\"), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wYUFTkW7IKvlAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAANSURBVAjXY2BgYNgMAAC4ALRMJsHGAAAAAElFTkSuQmCC), url(\"" + thumbnailURL + "\"); }", 0);
            };
            
            let player = new YT.Player(ytiframe, {
                events: {
                    'onReady': onPlayerReady
                }
            });

            if (DEBUG) console.log("player created: ", player);
            
            if (EXPIRED && window.hideyt_options.has_plugin_privileges) {
                let message = document.createElement("div");
                message.classList.add("hytWPPlayerWrapExpired");
                message.innerHTML = "<p><b>HideYT Plugin License Expired</b></p><p>To continue hiding YouTube related videos, please <a href='/wp-admin/options-general.php?page=hideyt'>renew your license</a>! (This message is shown only to WordPress admins, not users).";
                overlay.appendChild(message);
            }
            
        }
    }
    if( document.readyState === 'complete' ) {
        if (DEBUG) console.log("document already loaded, initializing players");
        updatePlayers();
        setInterval(updatePlayers, 200);
    } else {
        if (DEBUG) console.log("document not yet loaded, waiting");
        let fired = false;
        function fire() {
            if (fired) return;
            fired = true;
            if (DEBUG) console.log("initializing players");
            updatePlayers();
            setInterval(updatePlayers, 200);
        }
        window.addEventListener('load', function () {
            if (DEBUG) console.log("document load fired");
            fire();
        });
        let oldready = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() {
            if (DEBUG) console.log("onYouTubeIframeAPIReady fired");
            fire();
            if (oldready) oldready();
        };
        
    }
})();
