<template>
  <section class="section">
    <div class="container">
    </div>
    <span>Selected: {{ currency }}</span>
    <div class="container">
      <b-field grouped>
        <b-field label="Exchange">
          <b-select placeholder="Select...">
            <option selected value="Poloniex">Poloniex</option>
            <option value="Bittrex">Bittrex</option>
          </b-select>
        </b-field>
        <b-field label="Currency">
          <b-select placeholder="Select..." v-model="currency" @change="loadAssets()">
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </b-select>
        </b-field>
      </b-field>
      <label>Assets</label>
      <b-table
        :data="tableData"
        :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :checkable="true"
        :mobile-cards="hasMobileCards"
        :paginated="isPaginated"
        :per-page="perPage"
        :pagination-simple="isPaginationSimple"
        :default-sort="tableData.volume"
        :selected.sync="tableData.selected"
        :checked-rows.sync="checkedRows">

        <template scope="props">
          <b-table-column field="coin" label="Coin" width="40" sortable numeric>
            {{ props.row.coin }}
          </b-table-column>

          <b-table-column field="price" label="Price" sortable>
            {{ props.row.price }}
          </b-table-column>

          <b-table-column field="volume" label="Volume" sortable>
            {{ props.row.volume }}
          </b-table-column>

          <b-table-column field="change" label="Change" sortable>
            {{ props.row.change }}
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>
<script>
export default {
  name: 'hello',
  data () {
    return {
      currency: 'ETH',
      coin: ' ',
      tableData: [],
      checkedRows: [],
      selected: {},
      isBordered: true,
      isStriped: true,
      isNarrowed: false,
      hasMobileCards: true,
      isPaginated: true,
      isPaginationSimple: true,
      perPage: 15
    }
  },
  methods: {
    formatDate (value, row) {
      return `<span class="tag is-success">${new Date(value).toLocaleDateString()}</span>`
    },
    loadAssets () {
      this.tableData = []
      const route = 'https://poloniex.com/public?command=returnTicker'
      this.$http.get(route).then((response) => {
        let keys = Object.keys(response.data)
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i].toString()
          let item = response.data[key]
          let coinName = this.currency + '_'
          if (key.includes(coinName)) {
            this.tableData.push({'coin': key.replace(coinName, ''), 'price': item.last, 'volume': item.baseVolume, 'change': item.percentChange})
          }
        }
      })
    }
  },
  computed: {
    filteredDataArray () {
      return this.tableData.filter((option) => {
        return option
            .toString()
            .toLowerCase()
            .indexOf(this.coin.toLowerCase()) >= 0
      })
    }
  },
  watch: {
//    currency: function (newQuestion) {
//      this.loadAssets(newQuestion)
//    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
