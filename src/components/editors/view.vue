<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

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
    Table.configure({
      resizable: true,
    }),
    TableCell,
    TableRow,
    TableHeader,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
    },
  },
})

const toggleLink = () => {
  const url = prompt('Enter URL') // You can customize this as needed
  if (url) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}
const clearEditor = () => {
  editor.value.chain().focus().clearNodes().run()
}
const pageInfos = reactive({
  paragraph: ''
})
</script>

<template>
  <div class="box-editor">
    <div class="toolbars">
      <button @click="clearEditor"><i class="fa-solid fa-eraser"></i></button>


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

      <button @click="toggleLink"><i class="fa-solid fa-link"></i></button>

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

      <!-- Algin -->
      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-align-left"></i>
      </button>
      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-align-center"></i>
      </button>
      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-align-right"></i>
      </button>
      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-align-justify"></i>
      </button>

      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-outdent"></i>
      </button>
      <button @click="editor.chain().focus().setParagraph().run()">
        <i class="fa-solid fa-indent"></i>
      </button>

      <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
        <i class="fa-solid fa-table"></i>
      </button>
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
