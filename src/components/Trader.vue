<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-spaced is-2">Traders</h1>
      <hr>
      <b-field grouped>
        <b-field label="Exchange">
          <b-select placeholder="Select..." v-model="exchange" >
            <option v-for="option in exchanges" :value="option.name.toLowerCase()" :key="option.id">
              {{ option.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Currency">
          <b-select placeholder="Select..." v-model="currency">
            <option v-for="option in currencys" :value="option.name" :key="option.id">
              {{ option.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Assets">
          <b-select placeholder="Select..." v-model="asset">
            <option v-for="option in assets" :value="option.name" :key="option.id">
              {{ option.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Strategy">
          <b-select placeholder="Select..." v-model="strategy">
            <option v-for="option in strategys" :value="option.name" :key="option.id">
              {{ option.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Edit">
          <b-switch v-model="tradeTable.edit"></b-switch>
        </b-field>
        <b-field label="Action">
          <div class="field has-addons">
            <p class="control">
              <a :class="tradeTable.edit?'button':'button is-static'">
                <b-icon icon="add" class="is-small" ></b-icon>
                <span>Add</span>
              </a>
            </p>
            <p class="control">
              <a :class="tradeTable.edit?'button':'button is-static'">
                <b-icon icon="delete" class="is-small" ></b-icon>
                <span>Delete</span>
              </a>
            </p>
            <p class="control">
              <a :class="tradeTable.edit?'button':'button is-static'">
                <b-icon icon="settings" class="is-small" ></b-icon>
                <span>Setting</span>
              </a>
            </p>
          </div>
        </b-field>

      </b-field>
      <b-table
        :data="tradeTable.data"
        :bordered="false"
        :striped="false"
        :narrowed="false"
        :checkable="tradeTable.edit"
        :loading="tradeTable.loading"
        :paginated="!tradeTable.showCheckedOnly"
        :mobile-cards="true"
        :per-page="perPage"
        :default-sort="tradeTable.data.volume"
        :checked-rows.sync="tradeTable.checkedRows">

        <template scope="props">
          <b-table-column field="coin" label="Exchange" width="60">
            {{ props.row.ex }}
          </b-table-column>

          <b-table-column field="price" label="Coins">
            {{ props.row.price }}
          </b-table-column>

          <b-table-column field="price" label="Asset">
            {{ props.row.volume }}
          </b-table-column>

          <b-table-column field="volume" label="24h Trades">
            {{ props.row.volume }}
          </b-table-column>

          <b-table-column field="change" label="Winning rate" sortable>
            {{ props.row.change+'%' }}
            <b-icon
              :type="props.row.change < 0 ? 'is-danger' : 'is-primary'"
              :icon="props.row.change < 0 ? 'arrow_drop_down' : 'arrow_drop_up'">
            </b-icon>
          </b-table-column>

          <b-table-column field="change" label="Profit AVG" sortable>
            {{ props.row.change+'%' }}
            <b-icon
              :type="props.row.change < 0 ? 'is-danger' : 'is-primary'"
              :icon="props.row.change < 0 ? 'arrow_drop_down' : 'arrow_drop_up'">
            </b-icon>
          </b-table-column>
          <b-table-column field="change" label="Day Profit" sortable>
            {{ props.row.change+'%' }}
            <b-icon
              :type="props.row.change < 0 ? 'is-danger' : 'is-primary'"
              :icon="props.row.change < 0 ? 'arrow_drop_down' : 'arrow_drop_up'">
            </b-icon>
          </b-table-column>
          <b-table-column field="change" label="Total Profit" sortable>
            {{ props.row.change+'%' }}
            <b-icon
              :type="props.row.change < 0 ? 'is-danger' : 'is-primary'"
              :icon="props.row.change < 0 ? 'arrow_drop_down' : 'arrow_drop_up'">
            </b-icon>
          </b-table-column>
          <b-table-column field="change" label="Strategy" sortable>
            <b-select placeholder="Select..." v-model="currency" :disabled="!tradeTable.edit">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
            </b-select>
          </b-table-column>

        </template>
      </b-table>

    </div>
  </section>
</template>
<script>
  export default {
    name: 'bucket',
    data () {
      return {
        exchange: 'poloniex',
        asset: 'ETH',
        currency: 'BTC',
        strategy: 'Open/Close Cross',
        exchanges: [{'name': 'Poloniex'}, {'name': 'Bittrex'}],
        currencys: [{'name': 'ETH'}, {'name': 'BTC'}, {'name': 'USDT'}],
        assets: [{'name': 'ETH'}, {'name': 'BTC'}],
        strategys: [{'name': 'Open/Close Cross'}, {'name': 'Sma'}],
        tradeTable: {
          edit: false,
          showCheckedOnly: false,
          loading: true,
          ex: 'poloniex',
          data: [],
          checkedRows: []
        },
        perPage: 10
      }
    },
    methods: {
      formatDate (value, row) {
        return `<span class="tag is-success">${new Date(value).toLocaleDateString()}</span>`
      }
    },
    computed: {
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
          this.tradeTable.data.push({
            'currency': currencypair[0],
            'coin': currencypair[1],
            'price': item.last,
            'volume': Math.floor(item.baseVolume),
            'change': per,
            'ex': 'poloniex'
          })
        }
        this.tradeTable.loading = false
      })
      // get bittrex data
      this.$http.get('https://bittrex.com/api/v1.1/public/getmarketsummaries').then((response) => {
        let datas = response.data.result
        for (let i = 0; i < datas.length; i++) {
          let item = datas[i]
          let currencypair = item.MarketName.match(/(?!-)([A-Z0-9]*)/g)
          this.tradeTable.data.push({
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
