<template>
  <section class="section">
    <div class="container">
    </div>
    <div class="container">
      <b-field grouped>
        <b-field label="Exchange">
          <b-select placeholder="Select...">
            <option value="Poloniex">Poloniex</option>
            <option value="Bittrex">Bittrex</option>
          </b-select>
        </b-field>
        <b-field label="Currency">
          <b-select placeholder="Select...">
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </b-select>
        </b-field>
        <b-field label="Asset">
          <b-select placeholder="Select...">
            <option value="john">John</option>
            <option value="brok">Brok</option>
          </b-select>
        </b-field>
      </b-field>
      <b-table
        :data="tableData"
        :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :checkable="isCheckable"
        :mobile-cards="hasMobileCards"
        :paginated="isPaginated"
        :per-page="perPage"
        :pagination-simple="isPaginationSimple"
        default-sort="user.first_name"
        :selected.sync="selected"
        :checked-rows.sync="checkedRows">

        <template scope="props">
          <b-table-column field="id" label="ID" width="40" sortable numeric>
            {{ props.row.id }}
          </b-table-column>

          <b-table-column field="user.first_name" label="First Name" sortable>
            {{ props.row.user.first_name }}
          </b-table-column>

          <b-table-column field="user.last_name" label="Last Name" sortable>
            {{ props.row.user.last_name }}
          </b-table-column>

          <b-table-column field="date" label="Date" sortable>
          <span v-html="formatDate(props.row.date)"></span>
          </b-table-column>

          <b-table-column field="gender" label="Gender">
            <b-icon
              pack="fa"
              :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
            </b-icon>
            {{ props.row.gender }}
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
      tableData: [
        {'id': 1, 'user': {'first_name': 'Jesse', 'last_name': 'Simmons'}, 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
        {'id': 2, 'user': {'first_name': 'John', 'last_name': 'Jacobs'}, 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
        {'id': 3, 'user': {'first_name': 'Tina', 'last_name': 'Gilbert'}, 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
        {'id': 4, 'user': {'first_name': 'Clarence', 'last_name': 'Flores'}, 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
        {'id': 5, 'user': {'first_name': 'Anne', 'last_name': 'Lee'}, 'date': '2016-12-06 14:38:38', 'gender': 'Female'}
      ],
      checkedRows: [],
      selected: {},
      isBordered: true,
      isStriped: true,
      isNarrowed: true,
      isCheckable: true,
      hasMobileCards: true,
      isPaginated: true,
      isPaginationSimple: true,
      perPage: 10
    }
  },
  methods: {
    formatDate (value, row) {
      return `<span class="tag is-success">${new Date(value).toLocaleDateString()}</span>`
    }
//    clearSelected() {
//      this.selected = {}
//    },
//    clearCheckedRows() {
//      this.checkedRows = []
//    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
