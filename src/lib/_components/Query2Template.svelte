<script>
  import queryString from "query-string";
  import { addTemplate } from "$lib/store/template";

  let templateKey = "";
  let templateContent = "";
  let queryInput = "";

  const tmplBodyPlaceholder = `Hello, {{result1}}. I am {{using.nunjucks.template}}!`;

  function saveTemplate() {
    const queryObj = queryString.parse(queryInput);
    const params = Object.keys(queryObj).map((name) => {
      return {
        name,
        table: String(queryObj[name]),
      };
    });
    const newTemplate = {
      template: templateContent,
      params,
    };
    addTemplate(templateKey, newTemplate);
  }

  function reset() {
    templateKey = "";
    templateContent = "";
    queryInput = "";
  }
</script>

<div class="block">
  <div class="content">
    <div class="field">
      <p class="control">
        <input type="text" class="input" bind:value={templateKey} placeholder="templateName" />
      </p>
    </div>

    <div class="field">
      <p class="control">
        <textarea class="textarea" bind:value={templateContent} placeholder={tmplBodyPlaceholder} />
      </p>
    </div>

    <div class="field">
      <div class="control">
        <input
          type="text"
          class="input"
          bind:value={queryInput}
          placeholder="foo=table1&bar=table2&that=goodOldTable"
        />
      </div>
    </div>

    <div class="field">
      <p class="control">
        <button class="button is-info" on:click={saveTemplate}>Save</button>
        <button class="button" on:click={reset}>Reset</button>
      </p>
    </div>
  </div>
</div>
