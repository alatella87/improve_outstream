// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

// To do: multiple Ads
// 1 

// Load IMA SDK within the Outstream solution


var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var playButton;
// var pauseButton;
var htmlContent;
var mainContainer;
var reloadButton;
var body;
var mdiv;




// -- 1 Intersection Observer API constructor

function createObserver() {

    var observer;

    var options = {
        root: null,
        rootMargin: "0px",
        threshold: 1
    };

    observer = new IntersectionObserver(handleIntersect, options);


    observer.observe(mainContainer);


}

function createObserverOut() {

    var observer;

    var options = {
        root: null,
        rootMargin: "0px",
        threshold: 1
    };

    observer = new IntersectionObserver(handleIntersectOut, options)
    observer.observe(mainContainer);

}

// -- 2 Loading mainContainer in the Intersection Observer API as a variable to intercept target in viewport and instantiate the observer.

window.addEventListener("load", function(event) {

    mainContainer = document.querySelector("#mainContainer");

    createObserver();

}, false);

// -- 3 Trigger play button in order to trigger playAds function

function handleIntersect(entries, observer) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting === true) {
            document.getElementById('playButton').click();

        }
    });
};

// function handleIntersectOut(entries, observer) {
//     entries.forEach(function(entry) {
//         if (entry.isIntersecting === true) {

//             document.getElementById('pauseButton').click();

//         }
//     });
// };


//  ---- The following command is apparently not needed to trigger user behavior on Mobile.
// window.onscroll = playAds;

function init() {

    mainContainer = document.getElementById('mainContainer');
    htmlContent = document.getElementById('contentElement');
    playButton = document.getElementById('playButton');
    // pauseButton = document.getElementById('pauseButton');
    body = document.getElementsByTagName('body');
    playButton.addEventListener('click', playAds);
    // pauseButton.addEventListener('click', pauseAds);
    playButton.style.display = 'none';

    setUpIMA();

}

function setUpIMA() {

    // Create the ad display container.
    createAdDisplayContainer();

    // Create ads loader.
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    // Listen and respond to ads loaded and error events.
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);

    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);


    // An event listener to tell the SDK that additional requests can be made

    if (htmlContent != undefined) {
        contentEndedListener = function() {
            adsLoader.contentComplete();
        };
    }

    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();

    // --- Input the adTagUrl : In this case a 360yield Tag

    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=[timestamp]';

    var autoplayAllowed = true;
    var autoplayRequiresMuted = true;

    adsRequest.setAdWillAutoPlay(autoplayAllowed);
    adsRequest.setAdWillPlayMuted(autoplayRequiresMuted);

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 180;

    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    adsLoader.requestAds(adsRequest);
}

function createAdDisplayContainer() {

    // We assume the adContainer is the DOM id of the element that will house
    // the ads.

    adDisplayContainer = new google.ima.AdDisplayContainer(

        document.getElementById('contentElement')

    );
}

var width = document.getElementById('contentElement').offsetWidth;

var height = document.getElementById('contentElement').offsetHeight;


function playAds() {

    console.log('PlayAds Triggered');

    // Initialize the container. Must be done via a user action on mobile devices.
    // videoContent.load();

    adDisplayContainer.initialize();

    try {

        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);

        console.log('adsManager initialized');

        // Call play to start showing the ad. Single video and overlay ads will

        // start at this time; the call will be ignored for ad rules.

        adsManager.start();

        console.log("Starting");

    } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        // videoContent.play();
        console.log(adError);
    }
}

function pauseAds() {

    adDisplayContainer.initialize();

    adsManager.pause();
}

function playMobileAds() {

    // Initialize the container. Must be done via a user action on mobile devices.
    // videoContent.load();

    adDisplayContainer.initialize();

    try {

        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(width, 360, google.ima.ViewMode.NORMAL);

        // Call play to start showing the ad. Single video and overlay ads will

        // start at this time; the call will be ignored for ad rules.

        adsManager.start();

    } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        // videoContent.play();
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    console.log("Loaded");
    // Get the ads manager.

    var adsRenderingSettings = new google.ima.AdsRenderingSettings();

    // videoContent should be set to the content video element.

    adsManager = adsManagerLoadedEvent.getAdsManager(htmlContent, adsRenderingSettings);

    // Add listeners to the required events.

    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    // Listen to any additional events, if necessary.

    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
}

function onAdEvent(adEvent) {

    // don't have ad object associated.

    console.log("AdEvent");

    var ad = adEvent.getAd();

    switch (adEvent.type) {

        case google.ima.AdEvent.Type.LOADED:
            console.log("AdEvent LOADED");
            // This is the first event sent for an ad - it is possible to
            // determine whether the ad is a video ad or an overlay.

            if (!ad.isLinear()) {

                // Position AdDisplayContainer correctly for overlay.
                // Use ad.width and ad.height.

                // We prevent the video content to be loaded in the onAdEvent
                // videoContent.play();
            }
            break;

        case google.ima.AdEvent.Type.STARTED:
            console.log("AdEvent STARTED --");
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.

            if (ad.isLinear()) {


                // We disable unnecessary polling of remaining time of video
                // For a linear ad, a timer can be started to poll for
                // the remaining time.
                // intervalTimer = setInterval(
                //     function() {
                //       var remainingTime = adsManager.getRemainingTime();
                //     },
                //     300); // every 300ms
            }
            break;

        case google.ima.AdEvent.Type.COMPLETE:
            console.log("AdEvent COMPLETE //s");

            // We use the AdEvent.Type.COMPLETE to erase mainContainer from UI.

            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            // Edit: or trigger the UI slideToggle closing the Ad.

            if (ad.isLinear()) {

                // We trigger div collapse by automatizing click on button related to slideToggle

                setTimeout(function() {

                    document.getElementById('mbtn').click();

                }, 500);

                adsManager.destroy();

                clearInterval(intervalTimer);

            }
            break;
    }
}



function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    adsManager.destroy();

    setTimeout(function() {

        document.getElementById('mbtn').click();

    }, 2000);

}

function onContentPauseRequested() {
    // videoContent.pause();
    // This function is where you should setup UI for showing ads (e.g.
    // display ad timer countdown, disable seeking etc.)
    // setupUIForAds();
}

function onContentResumeRequested() {
    // videoContent.play();
    // This function is where you should ensure that your UI is ready
    // to play content. It is the responsibility of the Publisher to
    // implement this function when necessary.
    // setupUIForContent();

}

init();

// - - - - - - Beginning of Closing Ad by sliding Logic with UI References (mdiv = mainContainer) - - - - - -// 

var open = true;
var heightChecked = false;
var initHeight = 0;
var mdiv = mainContainer;

function slideToggle() {

    var mdiv = document.getElementById('contentElement');

    if (!heightChecked) {
        initHeight = mdiv.offsetHeight;
        heightChecked = true;
    }

    if (open) {
        open = false;
        mdiv.style.height = '0px';

    } else {
        open = true;
        mdiv.style.height = initHeight + 'px';
    }
};

// - - - - - -End of Closing Ad by sliding Logic - - - - - -//