async function onLoad() {
    const settings = await remove_sidebar.getSettings();
    const arr = settings.remove.split(',');

    //移除侧栏
    const interval = setInterval(() => {
    if (LiteLoader.os.platform == "win32") {
        var buttons = document.querySelectorAll(".sidebar-nav .nav-item");
    }
    if (LiteLoader.os.platform == "linux" || LiteLoader.os.platform == "darwin") {
        var buttons = document.querySelectorAll(".sidebar .nav-item");
    }
    if (buttons.length > 2) {
        for(let item of arr) {
            if(!item) return;
            const lastButton = buttons[item-1];
            lastButton.parentNode.removeChild(lastButton);
        }
        clearInterval(interval);
    }
  }, 100);

  //移除红点
  const red = setInterval(() => {
    var badgereds = document.querySelectorAll(".nav-item .q-badge-sub");
    if (settings.badgered) {
        for(var i=0,len=badgereds.length; i<len; i++){
            badgereds[i].remove();
        }
    }
  }, 100);

  //10s后关闭定时器
  const removeinterval = setTimeout(() => {
    clearInterval(red);
    clearInterval(interval);
  }, 10000);
}

async function onConfigView(view) {
    const plugin_path = LiteLoader.plugins.remove_sidebar.path.plugin;
    const css_file_path = `file:///${plugin_path}/src/settings.css`;
    const html_file_path = `file:///${plugin_path}/src/settings.html`;

    //css
    const css_text = await (await fetch(css_file_path)).text();
    const style = document.createElement("style");
    style.textContent = css_text;
    view.appendChild(style);

    //html
    const html_text = await (await fetch(html_file_path)).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_text, "text/html");
    doc.querySelectorAll("section").forEach(node => view.appendChild(node));

    //侧栏移除
    const settings = await remove_sidebar.getSettings();

    const p = view.querySelector(".remove-input");
    p.value = settings.remove;

    const s = view.querySelector(".apply");
    s.addEventListener("click", event => {
        settings.remove = p.value;
        remove_sidebar.setSettings(settings);
    });

    //红点移除
    const q_switch = view.querySelector(".q-switch");
    if (settings.badgered) {
        q_switch.classList.toggle("is-active");
    }
    else {
        q_switch.classList.remove("is-active");
    }
    q_switch.addEventListener("click", async () => {
        console.log(settings.badgered);
        if (settings.badgered) {
            q_switch.classList.remove("is-active");
            settings.badgered = false;
        }
        else {
            q_switch.classList.toggle("is-active");
            settings.badgered = true;
        }
        remove_sidebar.setSettings(settings);
    });
}

export {
    onLoad,
    onConfigView
}
