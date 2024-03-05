<script>
  import CreateTable from "$lib/_components/CreateTable.svelte";
  import EditTemplate from "$lib/_components/EditTemplate.svelte";
  import TemplateRenderer from "$lib/_components/TemplateRenderer.svelte";
  import { templates } from "$lib/store/template";

  /** @type {import("./$types").PageData} */
  let data;

  templates.subscribe((tmplStore) => {
    console.log("/table +page.svelte", tmplStore);
  });
</script>

<section>
  <h3 class="title is-3">Define Random Table</h3>
  <details>
    <CreateTable />
  </details>

  <h3 class="title is-3">Define Template</h3>
  <details open>
    <EditTemplate />
  </details>

  <hr>

  <TemplateRenderer />
</section>