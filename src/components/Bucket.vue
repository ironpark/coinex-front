<template>
  <section class="section">
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
        <a class="button is-medium is-primary">
          Save changes
        </a>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'bucket',
  data () {
    return {
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
        data: [
          {ex: 'Poloniex', coin: 'SC/BTC', start: '2013-02-01', end: '2017-06-23', status: 'Load BackData', running: true},
          {ex: 'Poloniex', coin: 'DGB/BTC', start: '2013-02-01', end: '2017-06-23', status: 'Stop', running: false},
          {ex: 'Poloniex', coin: 'STR/BTC', start: '2015-03-01', end: '2017-06-23', status: 'RealTime Data', running: true},
          {ex: 'Poloniex', coin: 'XRP/BTC', start: '2017-06-01', end: '2017-06-23', status: 'Load BackData', running: true},
          {ex: 'Bittrex', coin: 'ARK/BTC', start: '2012-01-01', end: '2017-06-23', status: 'Stop', running: false}
        ]
      }
    }
  },
  methods: {
    formatDate (value, row) {
      return `<span class="tag is-success">${new Date(value).toLocaleDateString()}</span>`
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
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title{
    text-align: left;
  }
</style>
