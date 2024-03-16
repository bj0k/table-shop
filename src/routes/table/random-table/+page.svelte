<script>
  import { capitalCase } from "change-case";
  import Csv2Table from "$lib/_components/Csv2Table.svelte";
  import EditRandomTable from "$lib/_components/EditRandomTable.svelte";
  import { randomTables } from "$lib/store/random_table";

  /** @type {string[]} */
  let tableKeys = [];
  let exampleText = "";

  randomTables.subscribe((newTableDef) => {
    tableKeys = Object.keys(newTableDef);
  });

  /**
   *
   * @param {string} tblName
   */
  function setExampleText(tblName) {
    const table = $randomTables[tblName];
    if (table) {
      const res = table.nextElement();
      if (res != null) {
        exampleText = `${table.expr} ${res.start}-${res.end} ${JSON.stringify(res.value)}`;
      } else {
        exampleText = "";
      }
    }
  }
</script>

<div>
  <h3 class="title is-3">Configure Random Tables</h3>

  <EditRandomTable />

  <hr />

  <Csv2Table />

  {#if tableKeys.length}
    <hr />
    <h4 class="subtitle">Defined tables:</h4>

    <p class="buttons">
      {#each tableKeys as tableName}
        <button class="button is-text" on:click={() => setExampleText(tableName)}>{capitalCase(tableName)}</button>
      {/each}
    </p>

    {#if exampleText}
      <p>{exampleText}</p>
    {/if}
  {/if}
</div>
