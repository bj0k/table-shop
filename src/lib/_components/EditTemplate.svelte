<script>
  import { addTemplate } from "$lib/store/template";
  import { nanoid } from "nanoid";

  const localNanoIdLength = 14;

  let templateKey = "";
  let templateContent = "";
  let templateParams = [{ _key: getId(), name: "", table: "" }];

  function getId() {
    return nanoid(localNanoIdLength);
  }

  function addParam() {
    templateParams = templateParams.concat({
      _key: getId(),
      name: "",
      table: "",
    });
  }

  /**
   *
   * @param {string} key
   */
  function removeParam(key) {
    templateParams = templateParams.filter((param) => param._key !== key);
  }

  function saveTemplate() {
    if (
      templateKey &&
      templateContent != null &&
      templateContent !== "" &&
      templateParams.length > 0
    ) {
      const newTemplate = {
        template: templateContent,
        params: templateParams.map(({ name, table }) => ({ name, table })),
      };

      addTemplate(templateKey, newTemplate);

      reset();
    }
  }

  function reset() {
    templateKey = "";
    templateContent = "";
    templateParams = [{ _key: getId(), name: "", table: "" }];
  }
</script>

<div class="box">
  <div class="field">
    <label for="" class="label">Key</label>
    <p class="control">
      <input type="text" class="input is-family-code" bind:value={templateKey} />
    </p>
  </div>
  <div class="field">
    <label for="" class="label">Template</label>
    <p class="control">
      <input type="text" class="input is-family-code" bind:value={templateContent} />
    </p>
  </div>
  {#if templateParams.length}
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Key</th>
          <th>Table ID</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each templateParams as param, i}
          <tr>
            <td>
              <div class="control">
                <input type="text" class="input" bind:value={param.name} placeholder={"key_" + i} />
              </div>
            </td>
            <td>
              <div class="control">
                <input type="text" class="input" bind:value={param.table} />
              </div>
            </td>
            <td>
              <div class="control">
                <!-- <button class="button">Button</button> -->
                <button class="button is-danger" on:click={() => removeParam(param._key)}>X</button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  <div class="buttons">
    <button class="button is-light" on:click={addParam}>Add Parameter</button>
    <button class="button is-light" on:click={reset}>Reset</button>
    <button class="button is-primary" on:click={saveTemplate}>Save</button>
  </div>
</div>
