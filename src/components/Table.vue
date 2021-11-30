<template>
  <div>
    <h3>{{ title }}</h3>
    <table>
      <thead>
      <tr>
        <th v-for="column of columns" :key="column.name">
          {{ column.name }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row of values" :key="row[keyField]">
        <td v-for="column of columns" :key="column.name">
          {{ row[column.field] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    title: String,
    keyField: {
      type: String,
      default: 'id',
    },
    values: Array,
    columns: Array,
  }
}
</script>

<style scoped>
table {
  height: fit-content;
}
</style>