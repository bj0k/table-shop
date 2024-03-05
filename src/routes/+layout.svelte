<script>
  import "$lib/bulma.min.css";
</script>

<section class="hero is-small is-primary">
  <div class="hero-body">
    <h1 class="title">Tableshop</h1>
  </div>
</section>

<div class="container pt-4 px-4">
  <nav class="tabs is-toggle">
    <ul>
      <li>
        <a href="/table">#</a>
      </li>
      <li>
        <a href="/table/random-table">Table</a>
      </li>
      <li>
        <a href="/table/template">Template</a>
      </li>
    </ul>
  </nav>
</div>

<main class="section">
  <div class="container">
    <slot></slot>
  </div>
</main>