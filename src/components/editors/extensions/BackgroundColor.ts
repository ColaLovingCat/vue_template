// extensions/BackgroundColor.ts
import { Mark, mergeAttributes } from "@tiptap/core";

export const BackgroundColor = Mark.create({
  name: "backgroundColor",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        parseHTML: (element: any) => element.style.backgroundColor || null,
        renderHTML: (attributes: any) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        style: "background-color",
      },
    ];
  },

  renderHTML({ HTMLAttributes }: any) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  //@ts-ignore
  addCommands() {
    return {
      setBackgroundColor:
        (color: any) =>
        ({ commands }: any) => {
          return commands.setMark(this.name, { backgroundColor: color });
        },
      unsetBackgroundColor:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
