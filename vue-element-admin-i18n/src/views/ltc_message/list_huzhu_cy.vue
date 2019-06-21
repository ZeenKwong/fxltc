<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateHuzhuCY">
        添加成员
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="cy_list"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="成员id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cy_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关系类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.relation_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机品牌1" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone1_brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机品牌2" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone2_brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入情况" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uple }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdateHuzhuCY(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm_huzhu_cy" :rules="huzhu_cy_rules" :model="huzhu_cy_model" label-width="100px">
        <el-form-item label="成员名称" prop="cy_name">
          <el-input v-model="huzhu_cy_model.cy_name" />
        </el-form-item>
        <el-form-item label="关系类型" prop="relation">
          <el-select v-model="huzhu_cy_model.relation" placeholder="请选择关系类型">
            <el-option v-for="item in cy_select_options_relations" :key="item.id" :label="item.relation_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="huzhu_cy_model.age" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="huzhu_cy_model.sex" placeholder="请选联性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机卡1品牌" prop="phone1_brand">
          <el-select v-model="huzhu_cy_model.phone1_brand" placeholder="请选择手机卡1品牌">
            <el-option v-for="item in cy_select_options_phone1_brand" :key="item.id" :label="item.brand_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机卡2品牌" prop="phone2_brand">
          <el-select v-model="huzhu_cy_model.phone2_brand" placeholder="请选择手机卡2品牌">
            <el-option v-for="item in cy_select_options_phone2_brand" :key="item.id" :label="item.brand_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="消费水平" prop="uple">
          <el-input v-model="huzhu_cy_model.uple" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createHuzhuCYBean():updateHuzhuCYBean()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { fetchHuzhuCyList, fetchSelectOpionsForHuzhuCyAddEdit,
  createHuzhuCYBean, updateHuzhuCYBean } from '@/api/huzhu_cy'

export default {
  // name: 'listCy',
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      cy_list: [],
      cy_select_options_phone1_brand: [],
      cy_select_options_phone2_brand: [],
      cy_select_options_relations: [],

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      huzhu_cy_model: {
        id: '',
        cy_name: '',
        hz_id: '',
        relation: '',
        age: '',
        sex: '',
        phone1_brand: '',
        phone2_brand: '',
        uple: ''
      },

      huzhu_cy_rules: {
        cy_name: [{ required: true, message: '请输入成员名称', trigger: 'blur' }],
        relation: [{ required: true, message: '请选择关系类型', trigger: 'change' }],
        phone1_brand: [{ required: true, message: '请选择手机卡1品牌', trigger: 'change' }],
        phone2_brand: [{ required: true, message: '请选择手机卡2品牌', trigger: 'change' }]
      }
    }
  },

  created() {
  },

  mounted() {
    this.getHuzhuCyList()
    this.getSelectOpionsForHuzhuCyAddEdit()
  },

  methods: {
    getHuzhuCyList() {
      // this.huzhu_cy_model.hz_id = this.$route.params.pathMatch.substr(1)
      console.log(this.$route.params.huzhu_id)
      // console.log(this.huzhu_cy_model.hz_id)
      fetchHuzhuCyList(this.$route.params.huzhu_id).then(response => {
        this.cy_list = response.data.items
      })
    },
    getSelectOpionsForHuzhuCyAddEdit() {
      fetchSelectOpionsForHuzhuCyAddEdit().then(response => {
        this.cy_select_options_phone1_brand = response.data.items.brand_list1
        this.cy_select_options_relations = response.data.items.relation_list
        this.cy_select_options_phone2_brand = response.data.items.brand_list2
      })
    },

    reset_Huzhu_cy_model() {
      this.huzhu_cy_model = {
        id: '',
        cy_name: '',
        hz_id: this.$route.params.pathMatch.substr(1),
        relation: '',
        age: '',
        sex: '',
        phone1_brand: '',
        phone2_brand: '',
        uple: ''
      }
    },

    handleCreateHuzhuCY() {
      this.reset_Huzhu_cy_model()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_huzhu_cy'].clearValidate()
      })
    },

    handleUpdateHuzhuCY(row) {
      this.huzhu_cy_model.id = row.id
      this.huzhu_cy_model.cy_name = row.cy_name
      this.huzhu_cy_model.hz_id = row.hz_id
      this.huzhu_cy_model.relation = row.relation
      this.huzhu_cy_model.age = row.age
      if (row.sex === null || row.sex === 0) {
        this.huzhu_cy_model.sex = ''
      } else {
        this.huzhu_cy_model.sex = row.sex + ''
      }
      this.huzhu_cy_model.phone1_brand = row.phone1_brand - 0
      this.huzhu_cy_model.phone2_brand = row.phone2_brand - 0
      this.huzhu_cy_model.uple = row.uple

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },

    createHuzhuCYBean() {
      this.$refs['dataForm_huzhu_cy'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          createHuzhuCYBean(this.huzhu_cy_model).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getHuzhuCyList()
          })
        }
      })
    },
    updateHuzhuCYBean() {
      this.$refs['dataForm_huzhu_cy'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          updateHuzhuCYBean(this.huzhu_cy_model).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getHuzhuCyList()
          })
        }
      })
    }
  }
}
</script>

