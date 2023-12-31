<template>
  <div>
    <SearchForm
      ref="searchForm"
      :loading="loading"
      :options="searchOptions"
      @search="search"
      @reset="search"
    />

    <!--Info列表-->
    <AntTable
      v-model="selectedKeys"
      row-key="race_id"
      :loading="loading"
      :data-source="races"
      :pagination="pagination"
      :columns="tableColumns"
      @change="changePage"
    >
      <template #header>
        <a-button-group>
          <a-button v-if="$has('race:add')" type="primary" @click="addRace">
            Add Module
          </a-button>
          <a-button
            v-if="$has('race:delete')"
            :disabled="!selectedKeys.length"
            @click="batchDelete"
          >
            Delete ({{ selectedKeys.length }})
          </a-button>
          <a-button
            v-if="$has('race:export')"
            :loading="exporting"
            @click="exportAll"
          >
            Export
          </a-button>
        </a-button-group>
      </template>
      <!-- action 插槽用于渲染每一行记录的Operation按钮 -->
      <template #action="record">
        <a-space>
          <!-- 成绩录入 -->
          <a-tooltip v-if="isStudent || $has('record:add')" title="register">
            <a @click="goToMyModule">
              <a-icon type="plus-circle" />
            </a>
          </a-tooltip>

<!--          &lt;!&ndash;Edit&ndash;&gt;-->
<!--          <a v-if="$has('race:update')" @click="editRace(record)">-->
<!--            <a-icon type="edit" />-->
<!--          </a>-->

<!--          &lt;!&ndash;Delete&ndash;&gt;-->
<!--          <a-popconfirm-->
<!--            v-if="$has('race:delete')"-->
<!--            title="Confirm Delete？"-->
<!--            placement="left"-->
<!--            @confirm="deleteRace(record)"-->
<!--          >-->
<!--            <template #icon>-->
<!--              <a-icon type="question-circle-o" style="color: orange" />-->
<!--            </template>-->
<!--            <a><a-icon type="delete" /></a>-->
<!--          </a-popconfirm>-->
        </a-space>
      </template>
    </AntTable>
  </div>
</template>

<script>
import { raceLevelMap, raceLevels } from '@/utils/const';
import { exportData } from '@/utils/excel';
import EditRace from '@/components/edit/EditRace';
import AddRecord from '@/components/record/AddRecord';

export default {
  name: 'Race',
  metaInfo: {
    title: 'Course Management',
  },
  data() {
    return {
      selectedKeys: [],
      loading: false,
      exporting: false,
      races: [
        {
          id:0,
          title:'module1',
          progress:20,
          startdate:'2023/09/20',
          enddate:'2023/09/21',
        }
      ],
      current: 1,
      pageSize: 10,
      total: 0,
      tableColumns: createTableColumns.call(this),
      searchOptions: createSearchOptions.call(this),
    };
  },
  computed: {
    pagination() {
      return {
        current: this.current,
        pageSize: this.pageSize,
        total: this.total,
      };
    },
    isStudent() {
      return this.$store.state.user.identity === 'student' || false;
    },
  },
  mounted() {
    this.$watch(() => [this.pageSize, this.current], this.getData, { immediate: true });
  },
  methods: {
    changePage({ pageSize, current }) {
      Object.assign(this, { pageSize, current });
    },
    goToMyModule(){
      this.$router.replace('/race/mymodules');
    },
    search() {
      this.current = 1;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$api.getRaceList({
        ...this.$refs.searchForm.getResult(),
        offset: this.current,
        limit: this.pageSize,

      }).then(data => {
        this.races = data.data;
        this.total = data.count;
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || 'Failed to read data');
      }).finally(() => {
        this.loading = false;
      });
    },
    addRace() {
      let vnode;
      this.$confirm({
        title: 'Add Module',
        content: h => (vnode = <EditRace />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addRace(values).then(data => {
            this.$message.success(data.msg);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || 'Failed Add');
            throw e;
          });
        },
      });
    },
    editRace(race) {
      let vnode;
      this.$confirm({
        title: 'Edit Module',
        content: h => (vnode = <EditRace data={race} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          values.race_id = race.race_id;
          return this.$api.updateRace(values).then(data => {
            this.$message.success(data.msg);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || 'Failed Edit');
            throw e;
          });
        },
      });
    },
    deleteRace(race) {
      this.loading = true;
      this.$api.deleteRace([race.race_id]).then(data => {
        this.$message.success(data.msg);
        this.getData();
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || 'Delete失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    batchDelete() {
      this.$modal.confirm({
        title: `确认Delete选中的${this.selectedKeys.length}项数据?`,
        onOk: () => this.$api.deleteRace(this.selectedKeys)
          .then(() => {
            this.$message.success('DeleteSuccess!');
            this.selectedKeys.splice(0);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || 'Delete失败!');
            throw e;
          }),
      });
    },
    addRecord(race) {
      let vnode;
      this.$confirm({
        title: '成绩录入',
        content: h => (vnode = <AddRecord />),
        onOk: async () => {
          const form = vnode.componentInstance;
          const values = await form.validate();
          return this.$api.addRecord({
            race_id: race.race_id,
            sid: this.$store.state.user.account,
            score: values.score,
            tid: values.tid,
          }).then(data => {
            this.$message.success(data.msg);
          }).catch(e => {
            this.$message.error(e.msg || '系统错误');
            throw e;
          });
        },
      });
    },
    exportAll() {
      this.exporting = true;
      this.$api.getRaceList(this.query).then(data => {
        return exportExcel(data.data);
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '导出失败');
      }).finally(() => {
        this.exporting = false;
      });
    },
  },
};

function createTableColumns() {
  return [
    { title: 'Module ID', dataIndex: 'race_id' },
    { title: 'Module Name', dataIndex: 'title' },
    { title: 'Progress(%)', dataIndex: 'progress' },
    { title: 'Start Date', dataIndex: 'startdate' },
    { title: 'End Date', dataIndex: 'enddate' },
    {
      title: 'Options',
      align: 'center',
      scopedSlots: {
        customRender: 'action',
      },
    },
  ];
}

function exportExcel(data) {
  const header = createTableColumns().map(v => v.title);
  header.pop(); // 去掉最后一栏Operation栏
  return exportData({
    name: '赛事Info',
    data,
    header,
    keyMap: {
      title: '赛事Name',
      level: ['级别', level => raceLevelMap[level]],
      sponsor: '主办方',
      type: '类别',
      description: 'Description',
      location: '地点',
      date: '举办时间',
      create_time: 'Create Date',
      update_time: 'Update Date',
    },
  });
}

function createSearchOptions() {
  return [
    {
      label: 'Module Name',
      key: 'title',
      default: '',
      component: 'input',
    },
    // {
    //   label: '主办方',
    //   key: 'sponsor',
    //   default: '',
    //   component: 'input',
    // },
    // {
    //   label: '地点',
    //   key: 'location',
    //   default: '',
    //   component: 'input',
    // },
    // {
    //   label: '类别',
    //   key: 'type',
    //   default: undefined,
    //   component: 'select',
    //   props: {
    //     options: ['A', 'B', 'C', 'D', 'E', 'F'].map(key => ({
    //       label: key,
    //       value: key,
    //     })),
    //   },
    // },
    // {
    //   label: '级别',
    //   key: 'level',
    //   default: undefined,
    //   component: 'select',
    //   props: {
    //     options: raceLevels,
    //   },
    // },
    {
      label: 'Module Date',
      key: 'date',
      default: () => [],
      mapper: ({ date }) => date.join('~'),
      component: 'range-picker',
    },
  ];
}
</script>
