<template>
  <div class="dashboard-editor-container">
    <div class="filter-container">
      <el-select v-model="query_model.query_department_id" clearable placeholder="请选择区县" style="width: 150px" class="filter-item" @change="syncGetGrid">
        <el-option v-for="item in select_options_department" :key="item.id" :label="item.department_name" :value="item.id" />
      </el-select>
      <el-select v-model="query_model.query_grid_id" placeholder="请选择网格" class="filter-item" style="width: 150px" @change="syncGetLogin">
        <el-option v-for="item in select_options_grid" :key="item.id" :label="item.grid_name" :value="item.id" />
      </el-select>
      <el-select v-model="query_model.query_login_id" placeholder="请选择支局" class="filter-item" style="width: 150px" @change="syncGetVillage">
        <el-option v-for="item in select_options_login" :key="item.id" :label="item.login_name" :value="item.id" />
      </el-select>
      <el-select v-model="query_model.query_village_id" placeholder="请选择行政村" class="filter-item" style="width: 150px" @change="syncGetCountry">
        <el-option v-for="item in select_options_village" :key="item.id" :label="item.village_name" :value="item.id" />
      </el-select>
      <el-select v-model="query_model.query_country_id" placeholder="请选择自然屯" class="filter-item" style="width: 150px">
        <el-option v-for="item in select_options_country" :key="item.id" :label="item.country_name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getPieChartData">
        查看指定区域
      </el-button>
    </div>
    <panel-group :panel-group-data="panelGroupData" @handleSetPieChartData="handleSetPieChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart :chart-data="pieChartData" />
    </el-row>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
// 在列表界面中的筛选逻辑可言移植到此处
import { fetchDepartmentList, fetchGridList, fetchLoginList, fetchVillageList, fetchCountryList } from '@/api/huzhu'
import { fetchPieChartData } from '@/api/piechart'

export default {
  name: 'LtcDashboard',
  components: {
    PanelGroup,
    PieChart
  },
  directives: { waves },
  data() {
    return {
      query_model: {
        query_department_id: '',
        query_grid_id: '',
        query_login_id: '',
        query_village_id: '',
        query_country_id: ''
      },
      select_options_department: [],
      select_options_grid: [],
      select_options_login: [],
      select_options_village: [],
      select_options_country: [],

      pieChartData: {
        title_text: '全市数据分布图',
        title_subtext: '宽带',
        legend_data: ['联通', '移动', '电信', '广电', '无'],
        series_data: []
      },
      panelGroupData: {
        kd_count: 0,
        yd_count: 0,
        iptv_count: 0,
        gh_count: 0
      },
      kd_series_data_by_http: [],
      gh_series_data_by_http: [],
      iptv_series_data_by_http: []
    }
  },
  created() {
    this.getPieChartData()
    this.getSelectDepartmentData()
  },
  methods: {
    getSelectDepartmentData() {
      fetchDepartmentList().then(response => {
        this.select_options_department = response.data.items
      }
      )
    },
    syncGetGrid() {
      this.query_model.query_grid_id = ''
      this.query_model.query_login_id = ''
      this.query_model.query_village_id = ''
      this.query_model.query_country_id = ''
      this.select_options_grid = []
      this.select_options_login = []
      this.select_options_village = []
      this.select_options_country = []
      if (this.query_model.query_department_id === '') {
        return
      }
      fetchGridList(this.query_model.query_department_id).then(response => {
        this.select_options_grid = response.data.items
      })
    },
    syncGetLogin() {
      this.query_model.query_login_id = ''
      this.query_model.query_village_id = ''
      this.query_model.query_country_id = ''
      this.select_options_login = []
      this.select_options_village = []
      this.select_options_country = []
      fetchLoginList(this.query_model.query_grid_id).then(response => {
        this.select_options_login = response.data.items
      })
    },
    syncGetVillage() {
      this.query_model.query_village_id = ''
      this.query_model.query_country_id = ''
      this.select_options_village = []
      this.select_options_country = []
      fetchVillageList(this.query_model.query_login_id).then(response => {
        this.select_options_village = response.data.items
      })
    },
    syncGetCountry() {
      this.query_model.query_country_id = ''
      this.select_options_country = []
      fetchCountryList(this.query_model.query_village_id).then(response => {
        this.select_options_country = response.data.items
      })
    },
    getPieChartData() {
      fetchPieChartData(this.query_model).then(response => {
        this.kd_series_data_by_http = response.data.items.kd_count
        this.gh_series_data_by_http = response.data.items.gh_count
        this.iptv_series_data_by_http = response.data.items.iptv_count
        this.panelGroupData.kd_count = 0
        this.kd_series_data_by_http.forEach(item => {
          this.panelGroupData.kd_count = this.panelGroupData.kd_count + item.value
        })
        this.panelGroupData.gh_count = 0
        this.gh_series_data_by_http.forEach(item => {
          this.panelGroupData.gh_count = this.panelGroupData.gh_count + item.value
        })
        this.panelGroupData.iptv_count = 0
        this.iptv_series_data_by_http.forEach(item => {
          this.panelGroupData.iptv_count = this.panelGroupData.iptv_count + item.value
        })
        // 默认进入页面首先显示宽度饼图
        var tempTitle = this.generateTitle()
        this.pieChartData.title_text = tempTitle || '全市数据分布图'
        this.pieChartData.title_subtext = '宽带'
        this.pieChartData.series_data = this.kd_series_data_by_http
      })
    },
    handleSetPieChartData(type) {
      var tempTitle = this.generateTitle()
      this.pieChartData.title_text = tempTitle || '全市数据分布图'
      if (type === 'kd') {
        this.pieChartData.title_subtext = '宽带'
        this.pieChartData.series_data = this.kd_series_data_by_http
      }
      if (type === 'yd') {
        this.pieChartData.title_subtext = '移网'
      }
      if (type === 'iptv') {
        this.pieChartData.title_subtext = 'IPTV'
        this.pieChartData.series_data = this.iptv_series_data_by_http
      }
      if (type === 'gh') {
        this.pieChartData.title_subtext = '固话'
        this.pieChartData.series_data = this.gh_series_data_by_http
      }
    },
    generateTitle() {
      var tempTitle = ''
      if (this.query_model.query_department_id !== '') {
        tempTitle = this.select_options_department.find(item => {
          return item.id === this.query_model.query_department_id
        }).department_name
      }
      if (this.query_model.query_grid_id !== '') {
        tempTitle = tempTitle + '-' + this.select_options_grid.find(item => {
          return item.id === this.query_model.query_grid_id
        }).grid_name
      }
      if (this.query_model.query_login_id !== '') {
        tempTitle = tempTitle + '-' + this.select_options_login.find(item => {
          return item.id === this.query_model.query_login_id
        }).login_name
      }
      if (this.query_model.query_village_id !== '') {
        tempTitle = tempTitle + '-' + this.select_options_village.find(item => {
          return item.id === this.query_model.query_village_id
        }).village_name
      }
      if (this.query_model.query_country_id !== '') {
        tempTitle = tempTitle + '-' + this.select_options_country.find(item => {
          return item.id === this.query_model.query_country_id
        }).country_name
      }
      return tempTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>

