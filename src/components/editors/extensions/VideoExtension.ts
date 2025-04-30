// VideoExtension.ts
import { Node, mergeAttributes } from '@tiptap/core'

export const Video = Node.create({
  name: 'video',

  group: 'block',
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '300',
      },
      controls: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes), 0]
  },

  //@ts-ignore
  addCommands() {
    return {
      insertVideo:
        (attrs: { src: string; width?: string; height?: string }) =>
        ({ chain }:any) => {
          return chain().insertContent({
            type: this.name,
            attrs,
          }).run()
        },
    }
  },
})
