const fs = require("fs");
const path = require("path");
const { ipcMain, Menu, BrowserWindow  } = require("electron");

function onLoad(plugin, liteloader) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");

    //设置文件判断
    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify({
            "remove": "",
            "badgered": false
        }));
    }

    // 监听渲染进程的watchSettingsChange事件
    ipcMain.on(
        "LiteLoader.remove_sidebar.watchSettingsChange",
        (event, settingsPath) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            watchSettingsChange(settingsPath);
    });

    //获取设置
    ipcMain.handle(
        "LiteLoader.remove_sidebar.getSettings",
        (event, message) => {
            try {
                const data = fs.readFileSync(settingsPath, "utf-8");
                const config = JSON.parse(data);
                return config;
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    );

    //保存设置
    ipcMain.handle(
        "LiteLoader.remove_sidebar.setSettings",
        (event, content) => {
            try {
                const new_config = JSON.stringify(content);
                fs.writeFileSync(settingsPath, new_config, "utf-8");
            } catch (error) {
                alert(error);
            }
        }
    )

/** 修改为监听配置文件方式
    ipcMain.handle(
        "LiteLoader.remove_sidebar.reloadmainWindow", 
        (event, content) => {
            reloadmainWindow()
      });
*/

}

// 防抖函数
function debounce(fn, time) {
    let timer = null;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
}

// 监听配置文件修改
function watchSettingsChange(settingsPath) {
    fs.watch(settingsPath, "utf-8", debounce(() => {
        reloadmainWindow()
    }, 100));
}

//刷新主页面
function reloadmainWindow(){
            // 获取主窗口
            const Windows = BrowserWindow.getAllWindows();
            for (let i = 0; i < BrowserWindow.getAllWindows().length; i++){
                const url = Windows[i].webContents.getURL();
                if (url.includes("/index.html") && url.includes("#/main")) {
                    Windows[i].webContents.reload();;
                }
            }
}

function onBrowserWindowCreated(window, plugin) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");

/** 功能分离至JustF5插件
    var menuTemplate=[{
        label: "刷新",
        role: "reload",
        accelerator: "F5",
    }]

    var menuBuilder = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menuBuilder);
*/
    window.on("ready-to-show", () => {
        const url = window.webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            watchSettingsChange(settingsPath);
        }
    });
}

module.exports = {
    onLoad,
    onBrowserWindowCreated
}
