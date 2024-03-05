<script lang="ts">
  import nunjucks from "nunjucks";
  import type { TemplateBody } from "$lib/template";
  import { templates } from "$lib/store/template";
  import { randomTables } from "$lib/store/random_table";

  let renderResult = "";
  let selectedTemplate = emptyTemplate();
  $: definedTemplateKeys = Object.keys($templates).toSorted();

  function emptyTemplate(): TemplateBody {
    return {
      template: "Hello, {{item1.term2}}!",
      params: [{ name: "item1", table: "itemRelic" }],
    };
  }

  function setTemplate(key: string) {
    const maybeTemplate = $templates[key];
    if (maybeTemplate) {
      selectedTemplate = maybeTemplate;
    } else {
      selectedTemplate = emptyTemplate();
    }
  }

  function randomize() {
    const context = selectedTemplate.params.reduce(
      (bag, param) => {
        const table = $randomTables[param.table];
        if (table) {
          const value = table.nextValue()!;
          bag[param.name] = value;
        }
        return bag;
      },
      {} as Record<string, string | object>
    );

    const generatedText = nunjucks.renderString(selectedTemplate.template, context);
    renderResult = generatedText;
  }
</script>

<div class="content">
  <h4>Template Render Test</h4>
  <ul>
    {#each definedTemplateKeys as k}
      <li>
        <p class="control">
          <label for="" class="checkbox">
            <input type="checkbox" on:change={() => setTemplate(k)} />
            {k}
          </label>
        </p>
      </li>
    {/each}
  </ul>
  <pre>{selectedTemplate.template}</pre>
  <p>{renderResult}</p>
  <div>
    <p class="control">
      <button class="button" on:click={randomize}>Randomize</button>
    </p>
  </div>
</div>
