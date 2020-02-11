<template>
  <div>
    <el-form :ref="searchJson.id" :inline="true" :model="searchJson.searchItems">

      <el-form-item v-for="(searchItem,index) in searchJson.searchItems" :key="index" :label="searchItem.label">

        <span v-if="searchItem.type==='view'">{{searchItem.value}}</span>

        <el-input v-if="searchItem.type==='input'" v-model="searchItem.value"></el-input>

        <el-select v-if="searchItem.type==='select'" v-model="searchItem.value" placeholder="">
          <el-option v-for="(option,oindex) in searchItem.options" :key="oindex" :label="option.label" :value="option.value"></el-option>
        </el-select>

      </el-form-item>

      <slot></slot>

      <el-form-item>
        <el-button type="primary" @click="searchJson.onSearch">查询</el-button>
        <el-button v-if="searchJson.onClear" type="primary" @click="searchJson.onClear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['searchJson']
}
</script>
