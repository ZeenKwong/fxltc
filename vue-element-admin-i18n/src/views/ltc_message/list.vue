<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listHuzhuQuery.query_department_id" clearable placeholder="请选择区县" style="width: 150px" class="filter-item" @change="syncGetGrid">
        <el-option v-for="item in select_model_data.department_model_data" :key="item.id" :label="item.department_name" :value="item.id" />
      </el-select>
      <el-select v-model="listHuzhuQuery.query_grid_id" placeholder="请选择网格" class="filter-item" style="width: 150px" @change="syncGetLogin">
        <el-option v-for="item in select_model_data.grid_model_data" :key="item.id" :label="item.grid_name" :value="item.id" />
      </el-select>
      <el-select v-model="listHuzhuQuery.query_login_id" placeholder="请选择支局" class="filter-item" style="width: 150px" @change="syncGetVillage">
        <el-option v-for="item in select_model_data.login_model_data" :key="item.id" :label="item.login_name" :value="item.id" />
      </el-select>
      <el-select v-model="listHuzhuQuery.query_village_id" placeholder="请选择行政村" class="filter-item" style="width: 150px" @change="syncGetCountry">
        <el-option v-for="item in select_model_data.village_model_data" :key="item.id" :label="item.village_name" :value="item.id" />
      </el-select>
      <el-select v-model="listHuzhuQuery.query_country_id" placeholder="请选择自然屯" class="filter-item" style="width: 150px">
        <el-option v-for="item in select_model_data.country_model_data" :key="item.id" :label="item.country_name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateHuzhu">
        添加户主
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listHuzhu"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="区县" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.department_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网格" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.grid_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支局" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.login_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行政村" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.village_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自然屯" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.country_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="户主id" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="户主姓名" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hz_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入情况" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度品牌" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.kd_brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IPTV品牌" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.iptv_brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="固话品牌" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gh_brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联通宽度类型" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unicom_kd_name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <app-link :to="generateHuzhuMemberUrl(row)">
            <el-button type="success" size="small">
              家庭成员
            </el-button>
          </app-link> -->
          <el-button type="success" size="small" @click="generateHuzhuMemberUrl(row)">
            家庭成员
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listHuzhuQuery.page" :limit.sync="listHuzhuQuery.limit" @pagination="getListHuzhuByQuery" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm_huzhu" :rules="huzhu_rules" :model="huzhu_model" label-width="100px">
        <el-form-item label="区县" prop="department_select_data">
          <el-select v-model="huzhu_model.department_select_data" placeholder="请选择区县" @change="syncGetGrid">
            <el-option v-for="item in select_model_data_for_dialog.department_model_data" :key="item.id" :label="item.department_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="网格" prop="grid_select_data">
          <el-select v-model="huzhu_model.grid_select_data" placeholder="请选择网格" @change="syncGetLogin">
            <el-option v-for="item in select_model_data_for_dialog.grid_model_data" :key="item.id" :label="item.grid_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="支局" prop="login_select_data">
          <el-select v-model="huzhu_model.login_select_data" placeholder="请选择支局" @change="syncGetVillage">
            <el-option v-for="item in select_model_data_for_dialog.login_model_data" :key="item.id" :label="item.login_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="行政村" prop="village_select_data">
          <el-select v-model="huzhu_model.village_select_data" placeholder="请选择行政村" @change="syncGetCountry">
            <el-option v-for="item in select_model_data_for_dialog.village_model_data" :key="item.id" :label="item.village_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="自然屯" prop="country_select_data">
          <el-select v-model="huzhu_model.country_select_data" placeholder="请选择自然屯">
            <el-option v-for="item in select_model_data_for_dialog.country_model_data" :key="item.id" :label="item.country_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="户主名称" prop="hz_name">
          <el-input v-model="huzhu_model.hz_name" />
        </el-form-item>
        <el-form-item label="宽度品牌" prop="kd_brand_select_data">
          <el-select v-model="huzhu_model.kd_brand_select_data" placeholder="请选择宽带品牌">
            <el-option v-for="item in select_model_data_for_dialog.kd_brand_model_data" :key="item.id" :label="item.brand_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="IPTV品牌" prop="iptv_brand_select_data">
          <el-select v-model="huzhu_model.iptv_brand_select_data" placeholder="请选择IPTV品牌">
            <el-option v-for="item in select_model_data_for_dialog.iptv_brand_model_data" :key="item.id" :label="item.brand_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="固话品牌" prop="gh_brand_select_data">
          <el-select v-model="huzhu_model.gh_brand_select_data" placeholder="请选择固话品牌">
            <el-option v-for="item in select_model_data_for_dialog.gh_brand_model_data" :key="item.id" :label="item.brand_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收入情况">
          <el-input v-model="huzhu_model.income" type="number" />
        </el-form-item>
        <el-form-item label="联通宽带类型">
          <el-select v-model="huzhu_model.unicom_kd" placeholder="请选联通宽带类型">
            <el-option label="单宽带" value="1" />
            <el-option label="融合宽带" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createHuzhuBean():updateHuzhuBean()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { fetchDepartmentList, fetchGridList, fetchLoginList, fetchVillageList,
  fetchCountryList, fetchBrandList, createHuzhuBean, getListHuzhu,
  getListHuzhuByQuery, getSelectOpionsForUpdate, updateHuzhuBean } from '@/api/huzhu'

// import AppLink from '@/layout/components/Sidebar/Link'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listHuzhu: null,
      listHuzhuQuery: {
        page: 1,
        limit: 10,
        query_department_id: '',
        query_grid_id: '',
        query_login_id: '',
        query_village_id: '',
        query_country_id: ''
      },
      select_model_data: {
        department_select_data: '',
        department_model_data: [],
        grid_select_data: '',
        grid_model_data: [],
        login_select_data: '',
        login_model_data: [],
        village_select_data: '',
        village_model_data: [],
        country_select_data: '',
        country_model_data: []
      },
      select_model_data_for_dialog: {
        department_model_data: [],
        grid_model_data: [],
        login_model_data: [],
        village_model_data: [],
        country_model_data: [],

        kd_brand_model_data: [],
        iptv_brand_model_data: [],
        gh_brand_model_data: []
      },

      huzhu_model: {
        huzhu_id: '',
        department_select_data: '',
        grid_select_data: '',
        login_select_data: '',
        village_select_data: '',
        country_select_data: '',
        hz_name: '',
        kd_brand_select_data: '',
        iptv_brand_select_data: '',
        gh_brand_select_data: '',
        income: undefined,
        unicom_kd: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },

      huzhu_rules: {
        department_select_data: [{ required: true, message: '请选择区县', trigger: 'change' }],
        grid_select_data: [{ required: true, message: '请选择网格', trigger: 'change' }],
        login_select_data: [{ required: true, message: '请选择支局', trigger: 'change' }],
        village_select_data: [{ required: true, message: '请选择行政村', trigger: 'change' }],
        country_select_data: [{ required: true, message: '请选择自然屯', trigger: 'change' }],
        hz_name: [{ required: true, message: '请输入户主名称', trigger: 'blur' }],
        kd_brand_select_data: [{ required: true, message: '请选择宽带品牌', trigger: 'change' }],
        iptv_brand_select_data: [{ required: true, message: '请选择IPTV品牌', trigger: 'change' }],
        gh_brand_select_data: [{ required: true, message: '请选择固话品牌', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getListHuzhu()
    this.getSelectDepartmentData()
    this.syncGetBrandList()
  },
  methods: {
    getSelectDepartmentData() {
      fetchDepartmentList().then(response => {
        if (this.dialogFormVisible) {
          this.select_model_data_for_dialog.department_model_data = response.data.items
        } else {
          this.select_model_data.department_model_data = response.data.items
          this.select_model_data_for_dialog.department_model_data = response.data.items
        }
      }
      ).catch()
    },

    syncGetGrid(department_id) {
      if (!this.dialogFormVisible) {
        // 变更区县时，需要先把下面各级select中的值清空
        this.listHuzhuQuery.query_grid_id = ''
        this.select_model_data.grid_model_data = []
        this.listHuzhuQuery.query_login_id = ''
        this.select_model_data.login_model_data = []
        this.listHuzhuQuery.query_village_id = ''
        this.select_model_data.village_model_data = []
        this.listHuzhuQuery.query_country_id = ''
        this.select_model_data.country_model_data = []
      } else {
        // 修改了再编辑户主时切换区县，其他已选择的项没有被清除的问题
        this.huzhu_model.grid_select_data = ''
        this.huzhu_model.login_select_data = ''
        this.huzhu_model.village_select_data = ''
        this.huzhu_model.country_select_data = ''
        this.select_model_data_for_dialog.grid_model_data = []
        this.select_model_data_for_dialog.login_model_data = []
        this.select_model_data_for_dialog.village_model_data = []
        this.select_model_data_for_dialog.country_model_data = []
      }
      if (department_id === '') {
        return
      }

      fetchGridList(department_id).then(response => {
        if (this.dialogFormVisible) {
          this.select_model_data_for_dialog.grid_model_data = response.data.items
        } else {
          this.select_model_data.grid_model_data = response.data.items
        }
      })
    },

    syncGetLogin(grid_id) {
      if (!this.dialogFormVisible) {
        this.listHuzhuQuery.query_login_id = ''
        this.select_model_data.login_model_data = []
        this.listHuzhuQuery.query_village_id = ''
        this.select_model_data.village_model_data = []
        this.listHuzhuQuery.query_country_id = ''
        this.select_model_data.country_model_data = []
      } else {
        this.huzhu_model.login_select_data = ''
        this.huzhu_model.village_select_data = ''
        this.huzhu_model.country_select_data = ''
        this.select_model_data_for_dialog.login_model_data = []
        this.select_model_data_for_dialog.village_model_data = []
        this.select_model_data_for_dialog.country_model_data = []
      }

      fetchLoginList(grid_id).then(response => {
        if (this.dialogFormVisible) {
          this.select_model_data_for_dialog.login_model_data = response.data.items
        } else {
          this.select_model_data.login_model_data = response.data.items
        }
      })
    },

    syncGetVillage(login_id) {
      if (!this.dialogFormVisible) {
        this.listHuzhuQuery.query_village_id = ''
        this.select_model_data.village_model_data = []
        this.listHuzhuQuery.query_country_id = ''
        this.select_model_data.country_model_data = []
      } else {
        this.huzhu_model.village_select_data = ''
        this.huzhu_model.country_select_data = ''
        this.select_model_data_for_dialog.village_model_data = []
        this.select_model_data_for_dialog.country_model_data = []
      }

      fetchVillageList(login_id).then(response => {
        if (this.dialogFormVisible) {
          this.select_model_data_for_dialog.village_model_data = response.data.items
        } else {
          this.select_model_data.village_model_data = response.data.items
        }
      })
    },

    syncGetCountry(village_id) {
      if (!this.dialogFormVisible) {
        this.listHuzhuQuery.query_country_id = ''
        this.select_model_data.country_model_data = []
      } else {
        this.huzhu_model.country_select_data = ''
        this.select_model_data_for_dialog.select_model_data_for_dialog = []
      }
      fetchCountryList(village_id).then(response => {
        if (this.dialogFormVisible) {
          this.select_model_data_for_dialog.country_model_data = response.data.items
        } else {
          this.select_model_data.country_model_data = response.data.items
        }
      })
    },

    syncGetBrandList() {
      fetchBrandList().then(response => {
        this.select_model_data_for_dialog.kd_brand_model_data = response.data.items1
        this.select_model_data_for_dialog.iptv_brand_model_data = response.data.items2
        this.select_model_data_for_dialog.gh_brand_model_data = response.data.items3
      }).catch()
    },

    getListHuzhu() {
      this.listLoading = true
      getListHuzhu(this.listHuzhuQuery).then(response => {
        this.listHuzhu = response.data.items.list
        this.total = response.data.items.total
        this.listLoading = false
      }).catch(
        this.listLoading = false
      )
    },
    getListHuzhuByQuery() {
      this.listLoading = true
      getListHuzhuByQuery(this.listHuzhuQuery).then(response => {
        this.listHuzhu = response.data.items.list
        this.total = response.data.items.total
        this.listLoading = false
      }).catch(
        this.listLoading = false
      )
    },
    handleFilter() {
      this.listHuzhuQuery.page = 1
      this.getListHuzhuByQuery()
    },

    resetHuzhu_model() {
      this.huzhu_model = {
        huzhu_id: '',
        department_select_data: '',
        grid_select_data: '',
        login_select_data: '',
        village_select_data: '',
        country_select_data: '',
        hz_name: '',
        kd_brand_select_data: '',
        iptv_brand_select_data: '',
        gh_brand_select_data: '',
        income: undefined,
        unicom_kd: ''
      }
      this.select_model_data_for_dialog.grid_model_data = []
      this.select_model_data_for_dialog.login_model_data = []
      this.select_model_data_for_dialog.village_model_data = []
      this.select_model_data_for_dialog.country_model_data = []
    },

    handleCreateHuzhu() {
      this.resetHuzhu_model()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_huzhu'].clearValidate()
      })
    },

    createHuzhuBean() {
      this.$refs['dataForm_huzhu'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          createHuzhuBean(this.huzhu_model).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getListHuzhu()
          }).catch(() => {
          })
        }
      })
    },
    handleUpdate(row) {
      this.huzhu_model.huzhu_id = row.id
      this.huzhu_model.department_select_data = row.department_select_data - 0
      this.huzhu_model.grid_select_data = row.grid_select_data - 0
      this.huzhu_model.login_select_data = row.login_select_data - 0
      this.huzhu_model.village_select_data = row.village_select_data - 0
      this.huzhu_model.country_select_data = row.country_select_data - 0
      this.huzhu_model.hz_name = row.hz_name
      this.huzhu_model.kd_brand_select_data = row.kd_brand
      this.huzhu_model.iptv_brand_select_data = row.iptv_brand
      this.huzhu_model.gh_brand_select_data = row.gh_brand
      this.huzhu_model.income = row.income

      if (row.unicom_kd === null || row.unicom_kd === 0) {
        this.huzhu_model.unicom_kd = ''
      } else {
        this.huzhu_model.unicom_kd = row.unicom_kd + ''
      }

      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      // 发起请求获取各个select的备选项
      getSelectOpionsForUpdate(this.huzhu_model).then(response => {
        this.select_model_data_for_dialog.grid_model_data = response.data.items.grid_model_data
        this.select_model_data_for_dialog.login_model_data = response.data.items.login_model_data
        this.select_model_data_for_dialog.village_model_data = response.data.items.village_model_data
        this.select_model_data_for_dialog.country_model_data = response.data.items.country_model_data
      }).catch()
      this.$nextTick(() => {
        this.$refs['dataForm_huzhu'].clearValidate()
      })
    },
    updateHuzhuBean() {
      this.$refs['dataForm_huzhu'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          this.dialogFormVisible = false
          updateHuzhuBean(this.huzhu_model).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getListHuzhu()
          })
        }
      })
    },

    generateHuzhuMemberUrl(row) {
      // return '/ltc_message/list_huzhu_cy/' + row.id
      this.$router.push({ name: 'listCy', params: { huzhu_id: row.id }})
    }
  }
}
</script>
