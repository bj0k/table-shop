<script lang="ts">
  import { capitalCase } from "change-case";
  import nunjucks from "nunjucks";
  import type { TemplateBody } from "$lib/template";
  import { templates } from "$lib/store/template";
  import { randomTables } from "$lib/store/random_table";

  let selectedTemplate: TemplateBody;
  let renderResult = "";
  let templateIndex = "";
  let showTemplateSource = false;

  $: definedTemplateKeys = Object.keys($templates).toSorted();

  function getRandomText(nextIndex: string): string {
    selectedTemplate = $templates[nextIndex];
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
    return generatedText;
  }

  function setAndGenerate(newIndex: string) {
    templateIndex = newIndex;
    renderResult = getRandomText(newIndex);
  }
</script>

<div class="content">
  <h4>Generate Texts!</h4>

  {#if selectedTemplate}
    <p>{renderResult}</p>

    {#if showTemplateSource}
      <pre>{selectedTemplate.template}</pre>
    {/if}
  {/if}

  <p class="control">
    <label for="check__showTemplateSource" class="checkbox">
      <input type="checkbox" id="check__showTemplateSource" bind:checked={showTemplateSource}>
      Show template's source text?
    </label>
  </p>
</div>

<hr>

<div class="buttons">
  {#each definedTemplateKeys as k}
    <button class="button is-light" on:click={() => setAndGenerate(k)}>
      {capitalCase(k)}
    </button>
  {/each}
</div>
