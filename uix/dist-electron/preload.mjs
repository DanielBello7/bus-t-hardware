"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("myApi", {
  desktop: true,
  title: (params) => electron.ipcRenderer.send("title", params),
  close: () => electron.ipcRenderer.send("close"),
  start: () => electron.ipcRenderer.send("start"),
  widen: () => electron.ipcRenderer.send("widen"),
  exits: () => electron.ipcRenderer.send("exits")
});
