<script>
  import Papa from "papaparse";

  let csvString = "";

  /** @type import("$lib/random_table").RandomTableInit["items"] */
  let tableDef = [];

  let errorMessage = "";

  $: hasParseError = errorMessage !== "";

  function onSave() {
    /** @type Papa.ParseResult<import("$lib/random_table").RandomTableInit["items"][number]> */
    const parsed = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    });
    const hasInvalidData = !(parsed.data.every(checkEntry));

    if (parsed.errors.length || hasInvalidData) {
      errorMessage = parsed.errors.join("\n");
    } else {
      errorMessage = "";
      tableDef = parsed.data;
    }
  }

  /**
   *
   * @param {Partial<import("$lib/random_table").RandomTableInit["items"][number]>} entry
   */
  function checkEntry(entry) {
    try {
      const value = entry?.value;
      return (
        typeof entry["start"] === "number" &&
        typeof entry["end"] === "number" &&
        (typeof value === "string" || typeof value === "object")
      );
    } catch (_) {
      return false;
    }
  }
</script>

<div>
  <div class="field">
    <div class="control">
      <textarea name="" id="" class="textarea is-family-code" bind:value={csvString}></textarea>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <button class="button is-primary" on:click={onSave}>Save</button>
    </div>
  </div>
  {#if hasParseError}
    <p class="notification is-danger">{errorMessage}</p>
  {:else}
    {#if tableDef.length}
    <div class="columns">
      <div class="column is-half">
        <table class="table is-narrow is-hoverable">
          <tbody>
            {#each tableDef as row}
              <tr>
                <td>{row.start}</td>
                <td>{row.end}</td>
                <td>{row.value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    {/if}
  {/if}
</div>