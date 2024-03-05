<script>
  import TemplateRenderer from "$lib/_components/TemplateRenderer.svelte";
  import { templates } from "$lib/store/template";

  /** @type {import("./$types").PageData} */
  let data;

  templates.subscribe((tmplStore) => {
    console.log("/table +page.svelte templates", tmplStore);
  });
</script>

<section>
  <TemplateRenderer />
</section>