<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'

import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'

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
    // TextStyle.configure({ types: [ListItem.name] }),
    //
    Highlight,
    Typography,
    //
    Document,
    Paragraph,
    Text,
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
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
    },
  },
})

const toggleLink = () => {
  const url = window.prompt('Enter URL')
  if (url) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}
const addImage = () => {
  const url = window.prompt('Enter URL')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const pageInfos = reactive({
  paragraph: ''
})

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

      <button @click="editor.value.chain().focus().clearNodes().run()">
        <i class="fa-solid fa-eraser"></i>
      </button>

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
      <button @click="editor.chain().focus().toggleCode().run()">
        <i class="fa-solid fa-code"></i>
      </button>

      <!-- Paragraph -->
      <button @click="editor.chain().focus().setParagraph().run()">
        P
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        H1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        H2
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        H3
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">
        H4
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()">
        H5
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()">
        H6
      </button>

      <!-- List -->
      <button @click="editor.chain().focus().toggleBulletList().run()">
        <i class="fa-solid fa-list-ul"></i>
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()">
        <i class="fa-solid fa-list-ol"></i>
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" disabled>
        <i class="fa-solid fa-list-check"></i>
      </button>

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

      <button @click="editor.chain().focus().setParagraph().run()" disabled>
        <i class="fa-solid fa-outdent"></i>
      </button>
      <button @click="editor.chain().focus().setParagraph().run()" disabled>
        <i class="fa-solid fa-indent"></i>
      </button>

      <button @click="toggleLink"><i class="fa-solid fa-link"></i></button>
      <button @click="addImage"><i class="fa-solid fa-image"></i></button>

      <!-- Table -->
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="editor.chain().focus().insertTable(defaultTableConfig).run()">
              <span>Add Table</span>
            </a-menu-item>
            <a-menu-item key="2" @click="editor.chain().focus().deleteTable().run()">
              <span>Delete Table</span>
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
          </a-menu>
        </template>
        <button type="button" class="btn-drop">
          <i class="fa-solid fa-table"></i>
          <i class="fa-solid fa-angle-down"></i>
        </button>
      </a-dropdown>


    </div>
    <div class="editors">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbars {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  button {
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
}

.editors {
  border-radius: 5px;
  padding: 10px;
  border: 1px solid #c4cecf8d;
}
</style>
