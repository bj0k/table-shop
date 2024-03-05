<script>
  import { addTable } from "../store/random_table";

  let tableKey = "";
  let tableBody = "";
  let isError = false;

  function saveTableDef() {
    try {
      const tableDef = JSON.parse(tableBody);
      if (typeof tableDef === "object" && tableKey !== "") {
        addTable(tableKey, tableDef);
      }
    } catch (e) {
      isError = true;
    }
  }
</script>

<div class="block">
  <div class="field">
    <p class="control">
      <input class="input" type="text" bind:value={tableKey} placeholder="tableKey" />
    </p>
  </div>

  <div class="field">
    <div class="control">
      <textarea class="textarea is-family-code" name="" id="" bind:value={tableBody} placeholder={`{ ... }`}></textarea>
    </div>
    {#if isError}
      <p class="help is-danger">Invalid JSON!</p>
    {/if}
  </div>

  <div class="buttons">
    <button class="button" on:click={saveTableDef}>Save</button>
  </div>
</div>
