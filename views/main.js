onload = function () {
    // Header section
    const header_p = document.getElementById("wasted");

    // Body section
    const h1_div = document.getElementById("h1-div");
    const lightning_fx_div = document.getElementById("lightning");
    const play_btn = document.getElementById("play-btn");
    const clock_div = document.getElementById("clock-div");
    const clock_out = document.getElementById("out");
    const time_var = document.getElementById("time-var");
    const time_var_default = time_var.innerHTML;

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

    // Time between updates - time updates
    const interval = 1000;
    // Updates between fetch requests
    const intervals = 10;
    // Time between updates - text transition updates
    const updateInterval = interval / 25;
    // Updates during a text transition
    const maxUpdates = intervals * 25;
    // Counter of time updates
    let time_counter = -1;
    // Counter of text transitions
    let transition_counter = 0;
    // Check if text transition is active
    let tt_active = false;

    // Utilities
    const utilString = "abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/? ";
    const mostUsedClasses = ["text-success", "text-warning"];
    const randomPickClasses = ["text-danger", "text-primary", "text-secondary"];
    let lastUNIXtime = 0;
    let timeString = "";
    const part1 = "<code>{\"</code>there<code>\":\"</code>be ";
    const part2 = "!<code>\"}</code>";
    const theStringLength = 24;


    // Compose custom text transition
    function getTextTransition() {

        let theString = [];
        let theAuxString = [];
        let updates = 0;
        if (!tt_active) {
            console.log(`Text transition #${transition_counter} - Transition interval: ${intervals * 2 + 1} s - Transition duration: ${(maxUpdates * updateInterval) / 1000} s`);
            transition_counter++;
            const handler = setInterval(() => {
                tt_active = true;
                if (updates > maxUpdates) {
                    time_var.innerHTML = time_var_default;
                    tt_active = false;
                    clearInterval(handler);
                } else {
                    updates++;
                    if ((updates >= 0 && updates < maxUpdates / 3) ||
                        (updates > 2 * maxUpdates / 3 && updates <= maxUpdates)) {
                        for (let i = 0; i < theStringLength; i++) {
                            theString.push(utilString.at(Math.floor(Math.random() * (utilString.length - 1))));
                        }
                        if (updates >= maxUpdates / 6 && updates < maxUpdates / 5) {
                            let aux = theString.join("").substring(8, theString.length - 2);
                            for (let i = 0; i < aux.length; i++) {
                                theAuxString.push(`<span class=\"${randomPickClasses.at(Math.floor((Math.random() * (200) + 50) / 100))}\">`.concat(aux.at(i).concat(`</span>`)));
                            }
                            time_var.innerHTML = "<code>{\"</code>there<code>\":</code>".concat(theAuxString.join("").concat("<code>}</code>"));
                        } else if (updates >= maxUpdates / 5 && updates < maxUpdates / 3) {
                            let aux = theString.join("").substring(12, theString.length - 4);
                            for (let i = 0; i < aux.length; i++) {
                                theAuxString.push(`<span class=\"${randomPickClasses.at(Math.floor((Math.random() * (200) + 50)) / 100)}\">`.concat(aux.at(i).concat(`</span>`)));
                            }
                            time_var.innerHTML = "<code>{\"</code>there<code>\":\"</code>be ".concat(theAuxString.join("").concat("!<code>\"}</code>"));
                        } else if (updates >= 9 * maxUpdates / 10) {
                            let aux = theString.join("").substring(13, theString.length - 2);
                            for (let i = 0; i < aux.length; i++) {
                                theAuxString.push(`<span class=\"${randomPickClasses.at(Math.floor((Math.random() * (200) + 50)) / 100)}\">`.concat(aux.at(i).concat(`</span>`)));
                            }
                            time_var.innerHTML = "<code>let</code> there <code>=`</code>".concat(theAuxString.join("").concat("<code>`</code>"));
                        } else {
                            let aux = theString.join("");
                            for (let i = 0; i < aux.length; i++) {
                                theAuxString.push(`<span class=\"${randomPickClasses.at(Math.floor((Math.random() * (200) + 50) / 100))}\">`.concat(aux.at(i).concat(`</span>`)));
                            }
                            time_var.innerHTML = theAuxString.join("");
                        }
                        theString = [];
                        theAuxString = [];
                    } else {
                        time_var.innerHTML = part1.concat(timeString.concat(part2));
                    }
                }
            }, updateInterval);
        }
    }

    // Convert UNIX time value into readable time and update time displaying elements
    function updateAnConvertUNIXTime(unixtime) {
        if (unixtime != -1) {
            lastUNIXtime = unixtime;
            timeString = Date(unixtime).toString().slice(16, 24);
        } else {
            lastUNIXtime += interval;
            timeString = Date(lastUNIXtime).toString().slice(16, 24);
        }
        clock_out.innerHTML = timeString;
        if (time_counter % (intervals * 2 + 1) == 0) {
            getTextTransition();
        }
    }

    // Handler for fetch request
    const fetchHandler = setInterval(() => {
        try {
            if (time_counter != -1) {
                if (time_counter % intervals == 0) {
                    fetch(`https://worldtimeapi.org/api/timezone/Europe/Copenhagen`)
                        .then(res => res.json())
                        .then(res => updateAnConvertUNIXTime(Number(res.unixtime)));
                    console.log(`Fetch #${time_counter / 10}: GET Time - Fetch interval: ${(interval * 10) / 1000} s`);
                } else updateAnConvertUNIXTime(-1);
                time_counter++;
            }
        } catch (error) {
            console.log("Problem when fetching time from https://worldtimeapi.org/api/timezone/Europe/Copenhagen\n", error);
            clock_out.innerHTML = "<strong class=`text-danger`>Error - Check console for more details...</strong>";
            time_var.innerHTML = time_var_default;
            clearInterval(fetchHandler);
        }
    }, interval);

    // Toggle class(es) for element(s)
    function toggleClass(theElements, theClasses) {
        for (let elem of theElements)
            for (let cls of theClasses)
                elem.classList.toggle(cls);
    }

    // Main event
    play_btn.onclick = function () {
        toggleClass([play_btn, h1_div, lightning_fx_div, clock_div], ["d-none"]);
        // start fetching time
        time_counter = 0;
        // play video
        video.play();
    };

    // Reset event
    h1_div.onclick = function () {
        toggleClass([play_btn, h1_div, lightning_fx_div, clock_div], ["d-none"]);
        // show for how long the time was displayed
        header_p.innerHTML = `You let <code>${time_counter}</code> seconds pass by last time...`;
        // stope fetching time
        time_counter = -1;
        // reset utilities
        lastUNIXtime = 0;
        timeString = "";
        clock_out.innerHTML = "00:00:00";
    };

    // Video playing detection event
    video.onended = () => toggleClass([ppr_video], mostUsedClasses);

    // Click-able elements
    header_p.onclick = function () {
        header_p.innerHTML = null;
    };
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
        else {
            video.loop = true;
            video.play();
        }
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
