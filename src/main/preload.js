var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function (x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

var require_electron = __commonJS({
  "node_modules/electron/index.js"(exports, module) {
    var fs = __require("fs");
    var path = __require("path");
    var pathFile = path.join(__dirname, "path.txt");
    function getElectronPath() {
      let executablePath;
      if (fs.existsSync(pathFile)) {
        executablePath = fs.readFileSync(pathFile, "utf-8");
      }
      if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
        return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
      }
      if (executablePath) {
        return path.join(__dirname, "dist", executablePath);
      } else {
        throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again");
      }
    }
    module.exports = getElectronPath();
  }
});

var import_electron = __toESM(require_electron());
var api = {
  /**
   * Invoca um handler IPC definido no main process
   * @param channel - nome do handler
   * @param args - argumentos a passar
   */
  invoke: (channel, ...args) => {
    const allowedChannels = ["get-app-info", "open-file-dialog", "save-file-dialog"];
    if (allowedChannels.includes(channel)) {
      return import_electron.ipcRenderer.invoke(channel, ...args);
    }
    throw new Error(`Channel "${channel}" not allowed`);
  },
  /**
   * Envia uma mensagem um-para-um para o main
   * @param channel - nome do canal
   * @param data - dados a enviar
   */
  send: (channel, data) => {
    const allowedChannels = ["message-to-main"];
    if (allowedChannels.includes(channel)) {
      import_electron.ipcRenderer.send(channel, data);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },
  /**
   * Registra listener para eventos do main
   * @param channel - nome do canal
   * @param callback - função a executar
   */
  on: (channel, callback) => {
    const allowedChannels = ["event-from-main"];
    if (allowedChannels.includes(channel)) {
      import_electron.ipcRenderer.on(channel, callback);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },
  /**
   * Remove listener de evento
   * @param channel - nome do canal
   * @param callback - função previamente registrada
   */
  off: (channel, callback) => {
    const allowedChannels = ["event-from-main"];
    if (allowedChannels.includes(channel)) {
      import_electron.ipcRenderer.off(channel, callback);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  }
};
try {
  import_electron.contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error("Error exposing API:", error);
}
