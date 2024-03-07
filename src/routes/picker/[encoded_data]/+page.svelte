<script lang="ts">
  import { savedPickerPageData, updatePageData } from "$lib/store/path_encoded_picker_data";
  import * as Yaml from "js-yaml";
  import nunjucks from "nunjucks";
  import type { PageData } from "./$types";
  import type { GeneratorDataType, GeneratorInit, GeneratorValueType } from "$lib/picker";
  import { makeRandomPicker } from "$lib/picker";

  export let data: PageData;

  let generatorSource = _restoreGeneratorSource(data);
  let templateText = data.t ?? "";
  let resultText = "";

  let currentOptions = _loadGeneratorInit(data, generatorSource);
  let randomPicker = makeRandomPicker(currentOptions);

  function _restoreGeneratorSource(initialData: PageData): string {
    if (initialData?.d != null) {
      return Yaml.dump(initialData.d);
    }
    return ["spell:", "  - Fireball", "  - Sleep", "  - Cure Light Wounds"].join("\n");
  }

  function _loadGeneratorInit(initialData: PageData, fallbackString: string): GeneratorInit {
    if (initialData.d) {
      return {
        data: initialData.d,
      } as GeneratorInit;
    } else {
      return _updateOptions(fallbackString);
    }
  }

  function _updateOptions(str: string) {
    const newData = Yaml.load(str);

    return {
      data: newData,
    } as GeneratorInit;
  }

  function _getInitParam(name: string, init: GeneratorInit): string {
    return JSON.stringify((init.data as any)[name]) as string;
  }

  function onGeneratorSourceChange() {
    try {
      const newOptions = _updateOptions(generatorSource);

      updatePageData(templateText, newOptions.data);

      currentOptions = newOptions;
      randomPicker = makeRandomPicker(newOptions);
    } catch (err) {
      console.error(err);
    }
  }

  function onClickGenerate() {
    if (templateText === "") {
      return;
    }
    let tmpl = templateText;
    const ctx: Record<string, GeneratorValueType> = {};

    randomPicker.keys.forEach((paramName) => {
      let localCount = 0;
      const pat = "{{" + paramName + "}}";
      while (tmpl.indexOf(pat) > -1) {
        const refKey = paramName + "_p" + localCount;
        tmpl = tmpl.replace(pat, `{{${refKey}}}`);
        ctx[refKey] = randomPicker.source.lookup(paramName);
        localCount++;
      }
    });

    try {
      const output = nunjucks.renderString(tmpl, ctx);
      resultText = output;
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div>
  <h3 class="title is-3">Simple Text Generator</h3>

  <hr>

  <p class="subtitle">Define your data as YAML:</p>
  <div class="field">
    <div class="control">
      <textarea
        name=""
        id=""
        class="textarea is-small is-family-code is-fullwidth"
        bind:value={generatorSource}
        on:change={onGeneratorSourceChange}
      ></textarea>
    </div>
  </div>

  <div class="box content">
    {#if currentOptions != null}
      <details>
        <summary>You have data so far:</summary>

        <table class="table is-narrow is-fullwidth">
          <tbody>
            {#each Object.keys(currentOptions.data) as name}
              <tr>
                <th>
                  <p class="control">{name}</p>
                </th>
                <td>
                  <p class="control">
                    <input type="text" class="input" readonly value={_getInitParam(name, currentOptions)}>
                  </p>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </details>
    {/if}
  </div>
</div>

<div class="block mt-4">
  <p class="subtitle">Write template using data above:</p>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="control">
          <textarea
            name=""
            id=""
            class="textarea is-family-code"
            placeholder="Template"
            bind:value={templateText}
            on:change={() => updatePageData(templateText, currentOptions.data)}
          ></textarea>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <input
            type="button"
            class="button is-primary"
            value="Generate"
            on:click={onClickGenerate}
            disabled={templateText === ""}
          />
        </div>
      </div>
    </div>
    <div class="column">
      <pre>{resultText}</pre>
    </div>
  </div>
</div>
