<template>
  <table>
    <thead>
      <tr>
        <td v-for="column of columns" :key="column.name">
          {{ column.name }}
        </td>
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
</template>

<script>
export default {
  name: 'Table',
  props: {
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