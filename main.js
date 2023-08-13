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
    // Register the command
    this.addCommand({
      id: "convert-titles-to-links",
      name: "Convert Titles to Obsidian Links",
      callback: () => this.convertTitlesToLinks(),
    });
  }

  convertTitlesToLinks() {
    const vaultPath = this.app.vault.adapter.basePath;

    const titles = this.getTitlesFromFilenames(vaultPath);
    this.replaceTitlesWithLinks(vaultPath, titles);

    new Notice("Titles have been converted to Obsidian links!");
  }

  getTitlesFromFilenames(folderPath) {
    let titles = [];
    const files = this.app.vault.getMarkdownFiles();

    for (const file of files) {
      const title = file.basename; // Gets the filename without extension
      titles.push(title);
    }

    return titles;
  }

  replaceTitlesWithLinks(folderPath, titles) {
    const files = this.app.vault.getMarkdownFiles();

    for (const file of files) {
      this.app.vault.read(file).then((content) => {
        titles.forEach((title) => {
          let obsidianLink = `[[${title}]]`;

          // Create a regular expression with the 'i' flag for case-insensitive matching
          let titleRegex = new RegExp(
            `(?<!\\[\\[)${this.escapeRegExp(title)}(?!\\]\\])`,
            "gi"
          );

          content = content.replace(titleRegex, obsidianLink);

          this.app.vault.modify(file, content);
        });
      });
    }
  }

  // Helper function to escape special characters in the title for regex
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
}
