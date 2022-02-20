onload = function () {
    // Header section
    const header_p = document.getElementById("wasted");

    // Body section
    const h1_div = document.getElementById("h1-div");
    const lightning_fx_div = document.getElementById("lightning");
    const play_btn = document.getElementById("play-btn");
    const clock_div = document.getElementById("clock-div");
    const clock_out = document.getElementById("out");

    // Footer section and controls
    const footer_s = document.getElementById("footer-s");
    const hide_footer = document.getElementById("hide-footer");
    const show_footer = document.getElementById("show-footer");

    // Video and controls
    const video = document.getElementById("lightning-fx");
    const ppr_video = document.getElementById("ppr-video");
    const loop_video = document.getElementById("loop-video");
    const mute_video = document.getElementById("mute-video");
    const unmute_video = document.getElementById("unmute-video");
    const playback_rate = document.getElementById("playback-rate");

    // Handler for fetch request
    let fetchHandler = 0;

    // Utilities
    let firstUNIXtime = 0;
    let lastUNIXtime = 0;
    let counter = -1;
    const interval = 1000;
    const mostUsedClasses = ["text-success", "text-warning"];

    // Toggle class(es) for element(s)
    function toggleClass(theElements, theClasses) {
        for (let elem of theElements)
            for (let cls of theClasses)
                elem.classList.toggle(cls);
    }

    // Update time and convert UNIX time value into readable time
    function updateAnConvertUNIXTime(unixtime) {
        if (firstUNIXtime == 0)
            firstUNIXtime = Number(unixtime);
        if (lastUNIXtime == unixtime) lastUNIXtime += interval;
        else lastUNIXtime = unixtime;
        counter++;
        clock_out.innerHTML = Date(unixtime).toString().slice(16, 24);
    }

    // Fetch the time from the World Time Api (only once every 10 intervals)
    function fetchTime() {
        if (counter == -1) clearInterval(fetchHandler);
        else if (counter % 10 == 0) {
            fetch(`https://worldtimeapi.org/api/timezone/Europe/Copenhagen`)
                .then(res => res.json())
                .then(res => updateAnConvertUNIXTime(res.unixtime));
            console.log(`Fetch #${counter / 10}: GET Time - Fetch interval: ${(interval * 10) / 1000} s`);
        } else updateAnConvertUNIXTime(lastUNIXtime);
    }

    // Main event
    play_btn.onclick = function () {
        toggleClass([play_btn, h1_div, lightning_fx_div], ["d-none"]);
        toggleClass([clock_div], ["d-none"]);
        if (counter == -1) counter++;

        // start fetching time
        fetchHandler = setInterval(() => fetchTime(), interval);
        // play video
        video.play();
    };

    // Reset event
    h1_div.onclick = function () {
        header_p.innerHTML = `You let <code>${(lastUNIXtime - firstUNIXtime)/1000}</code> seconds pass by this time...`;
        counter = -1;
        firstUNIXtime = 0;

        toggleClass([play_btn, h1_div, lightning_fx_div, clock_div], ["d-none"]);
        toggleClass([], ["d-none"]);
    };

    // Video playing detection event
    video.onended = () => toggleClass([ppr_video], mostUsedClasses);

    // Click-able elements
    hide_footer.onclick = function () {
        toggleClass([footer_s, show_footer, hide_footer], ["d-none"]);
    };
    show_footer.onclick = function () {
        toggleClass([footer_s, show_footer, hide_footer], ["d-none"]);
    };
    ppr_video.onclick = function () {
        if (video.ended || video.paused) video.play();
        else video.pause();
        toggleClass([ppr_video], mostUsedClasses);
    };
    loop_video.onclick = function () {
        if (video.loop) video.loop = false;
        else video.loop = true;
        toggleClass([loop_video], mostUsedClasses);
    };
    mute_video.onclick = function () {
        if (!video.muted) video.muted = true;
        toggleClass([mute_video, unmute_video], ["d-none"]);
    };
    unmute_video.onclick = function () {
        if (video.muted) video.muted = false;
        toggleClass([mute_video, unmute_video], ["d-none"]);
    };
    playback_rate.onclick = function () {
        if (video.playbackRate == 1) video.playbackRate = 0.5;
        else video.playbackRate = 1;

        toggleClass([playback_rate], mostUsedClasses);
    };
}
