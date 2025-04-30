import { Extension } from "@tiptap/core";

export const ParagraphIndent = Extension.create({
  name: "paragraphIndent",

  //@ts-ignore
  addCommands() {
    return {
      increaseIndent:
        () =>
        ({ commands, view }: any) => {
          const { state } = view
          const { tr } = state
          const { selection } = tr;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node: any, pos: any) => {
            if (node.type.name === "paragraph") {
              const currentIndent = node.attrs.indent || 0;
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: currentIndent + 2,
              });
            }
          });

          if (view) {
            view.dispatch(tr);
            return true;
          }

          return false;
        },

      decreaseIndent:
        () =>
        ({ commands, view }: any) => {
          const { state } = view
          const { tr } = state
          const { selection } = tr;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node: any, pos: any) => {
            if (node.type.name === "paragraph") {
              const currentIndent = node.attrs.indent || 0;
              const newIndent = Math.max(currentIndent - 2, 0);
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: newIndent,
              });
            }
          });

          if (view) {
            view.dispatch(tr);
            return true;
          }

          return false;
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) =>
              parseInt(element.style.marginLeft || "0", 10),
            renderHTML: (attributes) => {
              if (attributes.indent && attributes.indent > 0) {
                return {
                  style: `margin-left: ${attributes.indent}em;`,
                };
              }
              return {};
            },
          },
        },
      },
    ];
  },
});
