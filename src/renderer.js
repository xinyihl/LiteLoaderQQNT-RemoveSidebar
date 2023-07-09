async function onLoad() {
    const settings = await remove_sidebar.getSettings();
    const arr = settings.remove。split(',');
    const interval = setInterval(() => {
    if (LiteLoader.os.platform == "win32") {
        var buttons = document.querySelectorAll(".sidebar-nav .nav-item");
    }
    if (LiteLoader.os.platform == "linux") {
        var buttons = document.querySelectorAll(".sidebar .nav-item");
    }
    if (buttons.length > 2) {
        for(let item of arr) {
            console.log(item);
            const lastButton = buttons[item-1];
            lastButton.parentNode。removeChild(lastButton);
        }
        clearInterval(interval);
    }
  }， 100);
}

async function onConfigView(view) {
    const plugin_path = betterQQNT.plugins。remove_sidebar。path。plugin;
    const css_file_path = `file:///${plugin_path}/src/settings.css`;
    const html_file_path = `file:///${plugin_path}/src/settings.html`;

    const css_text = await (await fetch(css_file_path))。text();
    const style = document.createElement("style");
    style.textContent = css_text;
    view.appendChild(style);

    const html_text = await (await fetch(html_file_path))。text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_text, "text/html");
    doc.querySelectorAll("section")。forEach(node => view.appendChild(node));

    const settings = await remove_sidebar.getSettings();

    const p = view.querySelector(".remove-input");
    p.value = settings.remove;

    const s = view.querySelector(".apply");
    s.addEventListener("click"， event => {
        //console.log("test",p.value);
        settings.remove = p.value;
        remove_sidebar.setSettings(settings);
    });
}

export {
    onLoad,
    onConfigView
}
