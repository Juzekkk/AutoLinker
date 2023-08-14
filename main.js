const { Plugin, Notice } = require("obsidian");

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
  default: () => AutoLinker,
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

class AutoLinker extends Plugin {
  async onload() {
    this.registerCommands();
  }

  registerCommands() {
    this.addCommand({
      id: "link-all-titles-in-vault",
      name: "Link all titles within the entire vault",
      callback: () => {
        const allTitles = this.getAllFileTitles();
        this.linkTitlesAcrossAllFiles(allTitles);
        new Notice("All titles in the vault have been linked!");
      },
    });

    this.addCommand({
      id: "link-titles-in-current-file",
      name: "Link titles within the current file and to the current file from other files",
      callback: () => {
        const currentFile = this.app.workspace.getActiveFile();
        if (!currentFile) {
          new Notice("No active file found!");
          return;
        }

        const otherTitles = this.getAllFileTitles().filter(
          (title) => title !== currentFile.basename
        );
        this.linkTitlesWithinFile(currentFile, otherTitles);
        this.linkCurrentFileTitleAcrossAllFiles(currentFile.basename);

        new Notice("Titles in the current file have been linked!");
      },
    });

    this.addCommand({
      id: "link-titles-within-current-file",
      name: "Link titles only within the current file",
      callback: () => {
        const currentFile = this.app.workspace.getActiveFile();
        if (!currentFile) {
          new Notice("No active file found!");
          return;
        }

        const titlesInCurrentFile = this.getAllFileTitles().filter(
          (title) => title !== currentFile.basename
        );
        this.linkTitlesWithinFile(currentFile, titlesInCurrentFile);

        new Notice("Titles within the current file have been linked!");
      },
    });

    this.addCommand({
      id: "link-current-title-in-vault",
      name: "Link the current file's title across the entire vault",
      callback: () => {
        const currentFile = this.app.workspace.getActiveFile();
        if (!currentFile) {
          new Notice("No active file found!");
          return;
        }

        this.linkCurrentFileTitleAcrossAllFiles(currentFile.basename);
        new Notice("Current file's title has been linked in the vault!");
      },
    });
  }

  getAllFileTitles() {
    return this.app.vault.getMarkdownFiles().map((file) => file.basename);
  }

  linkTitlesAcrossAllFiles(titles) {
    const allFiles = this.app.vault.getMarkdownFiles();
    allFiles.forEach((file) => this.linkTitlesWithinFile(file, titles));
  }

  linkCurrentFileTitleAcrossAllFiles(title) {
    this.linkTitlesAcrossAllFiles([title]);
  }

  linkTitlesWithinFile(file, titles) {
    this.app.vault.read(file).then((content) => {
      titles.forEach((title) => {
        const obsidianLink = `[[${title}]]`;
        const titleRegex = new RegExp(
          `(?<!\\[\\[)${this.escapeRegExp(title)}(?!\\]\\])`,
          "gi"
        );
        content = content.replace(titleRegex, obsidianLink);
      });
      this.app.vault.modify(file, content);
    });
  }

  // Helper function to escape special characters for regex
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
}

module.exports = AutoLinker;
