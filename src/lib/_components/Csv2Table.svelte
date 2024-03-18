<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";
  import { capitalCase } from "change-case";
  import Papa from "papaparse";

  import { parseDice, type DicePool, type DieFace } from "$lib/dice_bot";
  import { RandomTable, type RandomTableInit } from "$lib/random_table";
  import { addTable } from "$lib/store/random_table";

  let csvString = "";
  let tableKey = "";
  let diceExpr = "1d6";

  let tableDef: RandomTableInit["items"] = [];

  let errorMessage = "";

  $: hasParseError = errorMessage !== "";

  let pool: DicePool = parseDice(diceExpr);

  const onExpressionChange2: ChangeEventHandler<HTMLInputElement> = (evt) => {
    try {
      /** @type string */
      const newExpr = evt.currentTarget.value;
      const newPool = parseDice(newExpr);

      pool = newPool;
      diceExpr = newExpr;
    } catch (_err) {
      return;
    }
  };

  function onSave() {
    if (pool == null || tableKey === "") {
      return;
    }

    const parsed = Papa.parse<(typeof tableDef)[number]>(csvString, {
      header: true,
      dynamicTyping: true,
    });
    const data = (parsed.data ?? ([] as typeof parsed.data)).map((item) => {
      if ("value" in item) {
        return item;
      } else {
        const item0 = (item as (typeof parsed.data)[number]);
        return {
          start: item0.start,
          end: item0.end,
          value: item0,
        };
      }
    });
    const hasInvalidData = !data.every(checkEntry);

    if (parsed.errors.length || hasInvalidData) {
      errorMessage = parsed.errors.join("\n");
    } else {
      errorMessage = "";
      tableDef = data;

      const randomTable: RandomTableInit = {
        tableName: capitalCase(tableKey),
        dice: {
          count: pool.count,
          face: `d${pool.face}` as DieFace,
        },
        items: tableDef,
      };
      // console.log(randomTable);

      addTable(tableKey, randomTable);
    }
  }

  function checkEntry(entry: (typeof tableDef)[number]) {
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
  <p class="subtitle">Import TSV</p>
  <div class="field is-grouped">
    <p class="control">
      <input type="text" class="input" placeholder="tableKey" bind:value={tableKey} />
    </p>
    <div class="control">
      <input
        type="text"
        class="input"
        placeholder="1d6"
        bind:value={diceExpr}
        on:change={onExpressionChange2}
      />
    </div>
  </div>
  <div class="field">
    <div class="control">
      <textarea name="" id="" class="textarea is-family-code" bind:value={csvString}></textarea>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <input
        type="button"
        class="button is-primary"
        value="Save"
        disabled={pool == null || tableKey === ""}
        on:click={onSave}
      />
    </div>
  </div>
  {#if hasParseError}
    <p class="notification is-danger">{errorMessage}</p>
  {:else if tableDef.length}
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
</div>
