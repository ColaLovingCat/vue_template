<script lang="ts" setup>
import { reactive, ref } from "vue";
import editorView from "./view.vue";

// name
defineOptions({
  name: "custom-name",
});

const pageInfos = reactive({
  editable: true,
  contents: `
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
})
</script>

<template>
  <div class="sections">
    <div class="box-show">
      <editorView v-model:contents="pageInfos.contents" :editable="pageInfos.editable"></editorView>
    </div>
    <div class="box-configs">
      <a-switch v-model:checked="pageInfos.editable" /> 可编辑
      <a-textarea :rows="30" v-model:value="pageInfos.contents"></a-textarea>
    </div>

  </div>
</template>

<style scoped lang="scss">
.box-show {
  margin: 0 auto;
  padding: 20px;
  width: 1200px;
}

.box-configs {
  position: fixed;
  top: 100px;
  left: 10px;
  background: #fff;
}
</style>
