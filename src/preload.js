const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("remove_sidebar",{
    getSettings: () => ipcRenderer.invoke(
        "LiteLoader.remove_sidebar.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "LiteLoader.remove_sidebar.setSettings",
        content
    )
/** 修改为监听配置文件方式
    reloadmainWindow: () => ipcRenderer.invoke(
        "LiteLoader.remove_sidebar.reloadmainWindow"
    )
*/
});