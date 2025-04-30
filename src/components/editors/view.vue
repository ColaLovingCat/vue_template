<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { ParagraphIndent } from './extensions/ParagraphIndent'
import { BackgroundColor } from './extensions/BackgroundColor'

import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import { Video } from './extensions/VideoExtension'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

// name
defineOptions({
  name: 'custom-name'
})

// props
const props = defineProps({
  datas: {
    type: Object,
    default: () => ({})
  },
  changeMark: {
    type: Boolean,
    require: false
  }
})

// emits
const emit = defineEmits<{
  (event: 'update', values: any): void
}>()

onMounted(() => { })

watch(
  () => props.changeMark,
  (newValue, oldValue) => { }
)

const demo = `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
  <p>
          Here is an example:
        </p>

        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
            <tr>
              <td>Marie Curie</td>
              <td>Scientist</td>
              <td>Chemist</td>
              <td>Physicist</td>
            </tr>
            <tr>
              <td>Indira Gandhi</td>
              <td>Prime minister</td>
              <td colspan="2">Politician</td>
            </tr>
          </tbody>
        </table>

         <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">flour</li>
          <li data-type="taskItem" data-checked="true">baking powder</li>
          <li data-type="taskItem" data-checked="true">salt</li>
          <li data-type="taskItem" data-checked="false">sugar</li>
          <li data-type="taskItem" data-checked="false">milk</li>
          <li data-type="taskItem" data-checked="false">eggs</li>
          <li data-type="taskItem" data-checked="false">butter</li>
        </ul>

         <p>
          Markdown shortcuts make it easy to format the text while typing.
        </p>
        <p>
          To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
        </p>
        <p>
          Those conventions are called input rules in Tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
        </p>
        <p>
          You can overwrite existing input rules or add your own to nodes, marks and extensions.
        </p>
        <p>
          For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
        </p>

        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `
const editor: any = useEditor({
  content: demo,
  extensions: [
    StarterKit,
    //
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    //@ts-ignore
    TextStyle.configure({ types: [ListItem.name] }),
    TextAlign.configure({
      types: ['heading', 'paragraph'], // 可以添加更多支持的节点类型
    }),
    //@ts-ignore
    BackgroundColor,
    //@ts-ignore
    ParagraphIndent,
    //
    Highlight,
    Typography,
    //
    Document,
    Paragraph,
    Text,
    Underline,
    //
    Table.configure({
      resizable: true,
    }),
    TableCell,
    TableRow,
    TableHeader,
    //
    TaskList,
    TaskItem,
    //
    Dropcursor,
    Image,
    //@ts-ignore
    Video,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
    },
  },
})

// Config
const colors = [
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#ffffff' },
  { name: 'Gray', color: '#71767c' },
  { name: 'Red', color: '#ed0007' },
  { name: 'Purple', color: '#9e2896' },
  { name: 'Blue', color: '#007bc0' },
  { name: 'Turquoise', color: '#18837e' },
  { name: 'Green', color: '#00884a' },
]
const setTextColor = (color: string) => {
  editor.value.chain().focus().setColor(color).run()
}
const clearTextColor = () => {
  editor.value.chain().focus().unsetColor().run()
}
const setBackColor = (color: string) => {
  editor.value.chain().focus().setBackgroundColor(color).run()
}
const clearBackColor = () => {
  editor.value.chain().focus().unsetBackgroundColor().run()
}

const emojiModal = ref(false)
const emojis = ['😀', '😂', '🥲', '😍', '😎', '🥳', '😭', '👍', '🎉', '🔥']
const insertEmoji = (emoji: string) => {
  editor?.value.chain().focus().insertContent(emoji).run()
  emojiModal.value = false
}

const characterModal = ref(false)
const characters = ['Ω']
const insertCharacter = (character: string) => {
  editor?.value.chain().focus().insertContent(character).run()
  characterModal.value = false
}

const insertLink = () => {
  const url = window.prompt('Enter URL')
  if (!url) return
  editor.value.chain().focus().setLink({ href: url }).run()
}

const insertImage = () => {
  const url = window.prompt('Enter URL')
  if (!url) return
  editor.value.chain().focus().setImage({ src: url }).run()
}

const insertVideo = () => {
  const url = window.prompt('Enter URL')
  if (!url) return
  editor.value.chain().focus().insertVideo({ src: url }).run()
}

const defaultTableConfig = { rows: 3, cols: 3, withHeaderRow: true }
</script>

<template>
  <div class="box-editor">
    <div class="toolbars">
      <!-- Undo -->
      <button @click="editor.chain().focus().undo().run()">
        <i class="fa-solid fa-rotate-left"></i>
      </button>
      <button @click="editor.chain().focus().redo().run()">
        <i class="fa-solid fa-rotate-right"></i>
      </button>

      <!-- Clear -->
      <button @click="editor.chain().focus().clearContent().run()">
        <i class="fa-solid fa-trash-can"></i>
      </button>

      <div class="list-btns">
        <!-- Text -->
        <button @click="editor.chain().focus().toggleBold().run()">
          <i class="fa-solid fa-bold"></i>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()">
          <i class="fa-solid fa-italic"></i>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()">
          <i class="fa-solid fa-strikethrough"></i>
        </button>
        <button @click="editor.chain().focus().toggleUnderline().run()">
          <i class="fa-solid fa-underline"></i>
        </button>

        <a-popover title="">
          <template #content>
            <div class="list-color">
              <template v-for="color in colors">
                <div class="color-item" :style="`background:${color.color}`" @click="setTextColor(color.color)"></div>
              </template>
            </div>
            <button @click="clearTextColor"><i class="fa-solid fa-eraser"></i></button>
          </template>
          <button><i class="fa-solid fa-font"></i></button>
        </a-popover>

        <a-popover title="">
          <template #content>
            <div class="list-color">
              <template v-for="color in colors">
                <div class="color-item" :style="`background:${color.color}`" @click="setBackColor(color.color)"></div>
              </template>
            </div>
            <button @click="clearBackColor"><i class="fa-solid fa-eraser"></i></button>
          </template>
          <button><i class="fa-solid fa-highlighter"></i></button>
        </a-popover>

        <button @click="editor.chain().focus().toggleCode().run()">
          <i class="fa-solid fa-code"></i>
        </button>

        <!-- List -->
        <button @click="editor.chain().focus().toggleBulletList().run()">
          <i class="fa-solid fa-list-ul"></i>
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()">
          <i class="fa-solid fa-list-ol"></i>
        </button>
        <button @click="editor.chain().focus().toggleTaskList().run()">
          <i class="fa-solid fa-list-check"></i>
        </button>
      </div>

      <div class="list-btns">
        <!-- Paragraph -->
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="p1" @click="editor.chain().focus().setParagraph().run()">
                <span>Paragraph</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="h1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
                <span>Heading1</span>
              </a-menu-item>
              <a-menu-item key="h2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
                <span>Heading2</span>
              </a-menu-item>
              <a-menu-item key="h3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
                <span>Heading3</span>
              </a-menu-item>
              <a-menu-item key="h4" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">
                <span>Heading4</span>
              </a-menu-item>
              <a-menu-item key="h5" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()">
                <span>Heading5</span>
              </a-menu-item>
              <a-menu-item key="h6" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()">
                <span>Heading6</span>
              </a-menu-item>
            </a-menu>
          </template>
          <button type="button" class="btn-drop">
            <i class="fa-solid fa-paragraph"></i>
            <i class="fa-solid fa-angle-down"></i>
          </button>
        </a-dropdown>

        <!-- Algin -->
        <button @click="editor.chain().focus().setTextAlign('left').run()">
          <i class="fa-solid fa-align-left"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()">
          <i class="fa-solid fa-align-center"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()">
          <i class="fa-solid fa-align-right"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('justify').run()">
          <i class="fa-solid fa-align-justify"></i>
        </button>

        <button @click="editor.chain().focus().decreaseIndent().run()">
          <i class="fa-solid fa-outdent"></i>
        </button>
        <button @click="editor.chain().focus().increaseIndent().run()">
          <i class="fa-solid fa-indent"></i>
        </button>
      </div>

      <!-- Insert -->
      <div class="list-btns">
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          <i class="fa-solid fa-grip-lines"></i>
        </button>

        <!-- Table -->
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="editor.chain().focus().insertTable(defaultTableConfig).run()">
                <span>Add Table</span>
              </a-menu-item>
              <a-menu-divider />
              <a-sub-menu key="sub1" title="Cells">
                <a-menu-item @click="editor.chain().focus().mergeCells().run()">merge</a-menu-item>
                <a-menu-item @click="editor.chain().focus().splitCell().run()">split</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub2" title="Rows">
                <a-menu-item @click="editor.chain().focus().addRowBefore().run()">add row before</a-menu-item>
                <a-menu-item @click="editor.chain().focus().addRowAfter().run()">add row after</a-menu-item>
                <a-menu-item @click="editor.chain().focus().deleteRow().run()">delete row</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub3" title="Columns">
                <a-menu-item @click="editor.chain().focus().addColumnBefore().run()">add column left</a-menu-item>
                <a-menu-item @click="editor.chain().focus().addColumnAfter().run()">add column right</a-menu-item>
                <a-menu-item @click="editor.chain().focus().deleteColumn().run()">delete column</a-menu-item>
              </a-sub-menu>
              <a-menu-divider />
              <a-menu-item key="2" @click="editor.chain().focus().deleteTable().run()">
                <span>Delete Table</span>
              </a-menu-item>
            </a-menu>
          </template>
          <button type="button" class="btn-drop">
            <i class="fa-solid fa-table"></i>
            <i class="fa-solid fa-angle-down"></i>
          </button>
        </a-dropdown>

        <button @click="insertLink"><i class="fa-solid fa-link"></i></button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()">
          <i class="fa-solid fa-terminal"></i>
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()">
          <i class="fa-solid fa-pen-nib"></i>
        </button>

        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="emojiModal = !emojiModal">
                <span>Emojis</span>
              </a-menu-item>
              <a-menu-item key="2" @click="characterModal = !characterModal">
                <span>Characters</span>
              </a-menu-item>
              <a-menu-divider />
            </a-menu>
          </template>
          <button type="button" class="btn-drop">
            <i class="fa-solid fa-icons"></i>
            <i class="fa-solid fa-angle-down"></i>
          </button>
        </a-dropdown>

        <button @click="insertImage"><i class="fa-solid fa-image"></i></button>
        <button @click="insertVideo"><i class="fa-solid fa-film"></i></button>

      </div>
    </div>
    <div class="editors">
      <editor-content :editor="editor" />
    </div>
  </div>

  <a-modal v-model:open="emojiModal" title="Emojis" :footer="[]">
    <div class="list-emoji">
      <template v-for="emoji in emojis" :key="emoji">
        <span class="emoji" @click="insertEmoji(emoji)">
          {{ emoji }}
        </span>
      </template>
    </div>
  </a-modal>

  <a-modal v-model:open="characterModal" title="Special Characters" :footer="[]">
    <div class="list-character">
      <template v-for="character in characters" :key="character">
        <span class="character" @click="insertCharacter(character)">
          {{ character }}
        </span>
      </template>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.toolbars {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  button {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background: unset;
    border: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    &.btn-drop {
      width: 45px;
    }

    &:hover {
      background-color: #f0f0f0;
    }

    &.active {
      background: #008ecf;
    }
  }

  .list-btns {
    padding-left: 3px;
    position: relative;
    display: flex;
    gap: 5px;

    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 80%;
      width: 3px;
      background: #c4cecf7d;
    }
  }
}

.list-color {
  width: 86px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;

  .color-item {
    cursor: pointer;
    width: 20px;
    height: 20px;
    border: 1px solid #c4cecf4d;
  }
}

.list-emoji {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .emoji {
    cursor: pointer;
    font-size: 27px;
  }
}

.editors {
  border-radius: 5px;
  padding: 10px;
  border: 1px solid #c4cecf8d;
}
</style>
