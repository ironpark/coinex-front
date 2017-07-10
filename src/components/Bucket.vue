<template>
  <section class="section">
    <b-modal
      :active.sync="SaveModalActive"
      :props="formProps"
      :width="800">
      <div class="modal-card">
        <form action="">
          <header class="modal-card-head">
            <p class="modal-card-title">Login</p>
          </header>
          <section class="modal-card-body" style="height:220px;">
            <b-field label="Start Date (ISO)">
              <datepicker v-model="state.date"></datepicker>
              <!--<b-input-->
              <!--type="password"-->
              <!--v-model="password"-->
              <!--password-reveal-->
              <!--placeholder="Your password"-->
              <!--required>-->
              <!--</b-input>-->
            </b-field>
            <b-checkbox>Remember me</b-checkbox>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="$emit('close')">Close</button>
            <button class="button is-primary" @click="save()">Save Changes</button>
          </footer>
        </form>
      </div>
    </b-modal>
    <div class="container">
      <h1 class="title is-spaced is-2">Local Datas</h1>
      <hr>
      <b-table
        :data="localDataTable.data"
        :bordered="false"
        :striped="true"
        :mobile-cards="true"
        :per-page="perPage">
        <template scope="props">
          <b-table-column field="exchange" label="Exchange">
            {{ props.row.ex }}
          </b-table-column>

          <b-table-column field="coin" label="Coin">
            {{ props.row.coin }}
          </b-table-column>

          <b-table-column field="start" label="Start">
            {{ props.row.start }}
          </b-table-column>

          <b-table-column field="end" label="End">
            {{ props.row.end }}
          </b-table-column>

          <b-table-column field="status" label="Status">
            {{ props.row.status }}
          </b-table-column>

          <b-table-column field="export" label="Export">
            <div class="field has-addons">
              <p class="control">
                <a class="button">
                  <span>CVS</span>
                </a>
              </p>
              <p class="control">
                <a class="button">
                  <span>XML</span>
                </a>
              </p>
              <p class="control">
                <a class="button">
                  <span>JSON</span>
                </a>
              </p>
            </div>
          </b-table-column>

          <b-table-column field="running" label="Running" width="70">
            <b-switch v-model="props.row.running"></b-switch>
          </b-table-column>
        </template>
      </b-table>
      <h1 class="title is-spaced is-2">Assets</h1>
      <hr>
      <b-field grouped>
        <b-field label="Exchange">
          <b-select placeholder="Select..." v-model="assetTable.ex" >
            <option selected value="poloniex">Poloniex</option>
            <option value="bittrex">Bittrex</option>
          </b-select>
        </b-field>
        <b-field label="Currency">
          <b-select placeholder="Select..." v-model="currency">
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
          </b-select>
        </b-field>
        <b-field label="Search">
          <b-input placeholder="..." v-model="asset">
          </b-input>
        </b-field>
        <b-field label="Show Checked Only">
          <b-switch v-model="assetTable.showCheckedOnly"></b-switch>
        </b-field>
      </b-field>
      <b-table
        :data="filteredDataArray"
        :bordered="false"
        :striped="true"
        :narrowed="false"
        :checkable="true"
        :loading="assetTable.loading"
        :paginated="!assetTable.showCheckedOnly"
        :mobile-cards="true"
        :per-page="perPage"
        :default-sort="assetTable.data.volume"
        :checked-rows.sync="assetTable.checkedRows">

        <template scope="props">
          <b-table-column field="coin" label="Coin" width="60">
            {{ props.row.coin }}
          </b-table-column>

          <b-table-column field="price" label="Price" sortable>
            {{ props.row.price }}
          </b-table-column>

          <b-table-column field="volume" label="Volume" sortable>
            {{ props.row.volume }}
          </b-table-column>

          <b-table-column field="change" label="24h Change" sortable>
            {{ props.row.change+'%' }}
            <b-icon
              :type="props.row.change < 0 ? 'is-danger' : 'is-primary'"
              :icon="props.row.change < 0 ? 'arrow_drop_down' : 'arrow_drop_up'">
            </b-icon>
          </b-table-column>
        </template>
      </b-table>
      <div class="control row">
        <!--<a class="button is-medium is-primary" v-on:click="save()">-->
        <!--Save changes-->
        <!--</a>-->
        <button class="button is-primary is-medium" @click="SaveModalActive = true">Save Changes</button>
      </div>
    </div>
  </section>
</template>
<script>
  import Datepicker from 'vue-date'
  const api = 'http://localhost:8080/api/v1'
  export default {
    name: 'bucket',
    data () {
      return {
        state: {
          date: new Date().toISOString()
//          .slice(0, 10).replace(/\. /g, '-')
        },
        SaveModalActive: false,
        formProps: {
          email: 'evan@you.com',
          password: 'testing'
        },
        asset: '',
        assetTable: {
          showCheckedOnly: false,
          loading: true,
          ex: 'poloniex',
          data: [],
          checkedRows: []
        },
        currency: 'BTC',
        perPage: 10,
        // local datas
        localDataTable: {
          data: []
        }
      }
    },
    methods: {
      formatDate (value, row) {
        return `<span class="tag is-success">${new Date(value).toLocaleDateString()}</span>`
      },
      save () {
        let data = this.assetTable.checkedRows
        let date = Math.floor(new Date(this.state.date) / 1000).toString()
        for (let i = 0; i < data.length; i++) {
          let form = new FormData()
          form.set('ex', data[i].ex)
          form.set('base', data[i].currency)
          form.set('pair', data[i].coin)
          form.set('start', date)
          this.$http.post(api + '/bucket/assets', form)
        }
        this.localDataTable.data = []
        this.$http.get(api + '/bucket/assets').then((response) => {
          let data = response.data
          for (let i = 0; i < data.length; i++) {
            let v = data[i]
            let item = {ex: v.Ex, coin: v.Pair + '/' + v.Base, start: new Date(v.First).toTimeString(), end: new Date(v.Last).toTimeString(), status: 'Load BackData', running: !v.Stop}
            this.localDataTable.data.push(item)
          }
        })
        this.SaveModalActive = false
      }
    },
    computed: {
      filteredDataArray () {
        return this.assetTable.data.filter((item) => {
          return (
            item.currency === (this.currency) &&
            item.ex === this.assetTable.ex &&
            item.coin.toLowerCase().includes(this.asset.toLowerCase()) &&
            (this.assetTable.showCheckedOnly ? this.assetTable.checkedRows.includes(item) : true)
          )
        })
      }
    },
    created () {
      // server sent event
      let evtSource = new EventSource(api + '/sse/bucket')
      let p = this
      evtSource.onmessage = function (e) {
        let v = JSON.parse(e.data).Data
        for (let i = 0; i < p.localDataTable.data.length; i++) {
          let data = p.localDataTable.data[i]
          // http://localhost:8000/#/bucket
          if (data.ex.includes(v.Exchange) && data.coin.includes(v.Pair + '/' + v.Base)) {
            p.localDataTable.data[i] = {ex: v.Exchange, coin: v.Pair + '/' + v.Base, start: new Date(v.First).toLocaleString(), end: new Date(v.Last).toLocaleString(), status: v.Type, running: !v.Stop}
          }
        }
      }
      this.$http.get(api + '/bucket/assets').then((response) => {
        let data = response.data
        for (let i = 0; i < data.length; i++) {
          let v = data[i]
          let item = {ex: v.Exchange, coin: v.Pair + '/' + v.Base, start: new Date(v.First).toLocaleString(), end: new Date(v.Last).toLocaleString(), status: 'Load BackData', running: !v.Stop}
          this.localDataTable.data.push(item)
        }
      })
      // get poloniex data
      this.$http.get('http://poloniex.com/public?command=returnTicker').then((response) => {
        let keys = Object.keys(response.data)
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i].toString()
          let item = response.data[key]
          let currencypair = key.match(/(?!_)([A-Z0-9]*)/g)
          let per = Math.floor(item.percentChange * 100)
          this.assetTable.data.push({
            'currency': currencypair[0],
            'coin': currencypair[1],
            'price': item.last,
            'volume': Math.floor(item.baseVolume),
            'change': per,
            'ex': 'poloniex'
          })
        }
        this.assetTable.loading = false
      })
      // get bittrex data
      this.$http.get('https://bittrex.com/api/v1.1/public/getmarketsummaries').then((response) => {
        let datas = response.data.result
        for (let i = 0; i < datas.length; i++) {
          let item = datas[i]
          let currencypair = item.MarketName.match(/(?!-)([A-Z0-9]*)/g)
          this.assetTable.data.push({
            'currency': currencypair[0],
            'coin': currencypair[1],
            'price': item.Last,
            'volume': Math.floor(item.BaseVolume),
            'change': Math.floor(item.Last / item.PrevDay * 100 - 100),
            'ex': 'bittrex'
          })
        }
      })
    },
    components: {
      Datepicker
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .date-picker .input {
    box-shadow: none;
    border: none;
  }
  .title{
    text-align: left;
  }
</style>
