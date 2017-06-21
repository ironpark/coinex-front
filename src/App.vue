<template>
  <div id="app">
    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <router-link to="home" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>Home</router-link>
          <router-link to="dashboard" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>DashBoard</router-link>
          <router-link to="trader" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>Trader</router-link>
          <router-link to="bucket" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>Bucket</router-link>
          <router-link to="backtest" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>Backtest</router-link>
          <router-link to="donation" class="nav-item is-tab is-hidden-mobile" active-class="is-active" exact>Donation</router-link>
        </div>
      </div>
    </nav>
    <router-view></router-view>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="http://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
          </p>
          <p>
            <a class="icon" href="https://github.com/jgthms/bulma">
              <i class="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
