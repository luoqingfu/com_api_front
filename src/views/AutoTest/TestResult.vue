<template>
  <div>
    <a-input-search
      placeholder="请输入搜索的项目名称"
      style="width: 200px"
      v-model="search_key"
      @search="onSearch()"
    />

    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <!-- <a
          type="dashed"
          @click="showDeleteConfirm(record.id)"
          style="color: red"
          >删除</a
        > -->
        <a type="dashed" @click="showTestSummaryDetails(record.id)">查看详情</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import service from "../../api";
import { serializeData } from "../../utils/common";
const columns = [
  {
    title: "报告id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "所属项目",
    dataIndex: "project",
    scopedSlots: { customRender: "project" },
    width: 150,
    align: "center",
  },
  {
    title: "用例数量",
    dataIndex: "test_case_amount",
    ellipsis: true,
    width: 100,
    align: "center",
  },
  {
    title: "成功数量",
    dataIndex: "success_amount",
    ellipsis: true,
    width: 100,
    align: "center",
  },
  {
    title: "错误数量",
    dataIndex: "fail_amount",
    ellipsis: true,
    width: 100,
    align: "center",
  },
  {
    title: "跳过数量",
    dataIndex: "skip_amount",
    ellipsis: true,
    width: 100,
    align: "center",
  },
  {
    title: "测试开始时间",
    dataIndex: "test_start_time",
    ellipsis: true,
  },
  {
    title: "花费时间",
    dataIndex: "test_spend_time",
    ellipsis: true,
    width: 100,
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      pagination: {
        defaultPageSize: 20,
      },
      loading: false,
      columns,
      project: [],
      search_key: "",
      visible: false,
      confirmLoading: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },

  computed: {},

  mounted() {
    this.fetch();
  },
  created() {
    service.get_project().then((res) => (this.project = res.data));
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: 20,
        page: pagination.current,
      });
    },
    fetch(params = {}) {
      this.loading = true;
      let obj = {
        ...params,
      };
      service.project_get_testsummary(obj).then((rsp) => {
        const pagination = { ...this.pagination };
        pagination.total = rsp.total;
        this.loading = false;
        this.data = this.change_to_name(rsp.data);
        this.pagination = pagination;
      });
    },
    //搜索接口
    onSearch() {
      let re = {
        projectName: this.search_key,
      };
      service.project_get_testsummary(re).then((rsp) => {
        if (rsp.code === 200) {
          this.data = this.change_to_name(rsp.data);
        } else {
          this.data = [];
        }
      });
    },
    //把id和flag改变为对应的中文
    change_to_name(raw_data) {
      let length = Object.keys(raw_data).length;
      for (let i = 0; i < length; i++) {
        let project_id = raw_data[i]["project"];
        let project_length = Object.keys(this.project).length;
        //使用id来获取projectname
        for (let t = 0; t < project_length; t++) {
          if (this.project[t]["id"] == project_id) {
            raw_data[i]["project"] = this.project[t]["project_name"];
          }
        }
      }
      let handle_data = raw_data;
      return handle_data;
    },
    //删除弹窗暂时未用到
    showDeleteConfirm(del_key) {
      let _that = this;
      this.$confirm({
        title: "确定需要删除该项目吗？",
        // content: "删除？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          let re = {
            id: del_key,
          };
          //逻辑删除
          service.project_del(serializeData(re)).then((res) => {
            if (res.code === 200) {
              let success_msg = res.message;
              _that.destroyAll();
              _that.$message.success(success_msg, 2);
              _that.reload();
            } else {
              let err_msg = res.message;
              _that.destroyAll();
              _that.message.error(err_msg, 2);
              _that.reload();
            }
          });
        },
        onCancel() {
          console.log("Cancel");
          _that.destroyAll();
        },
      });
    },
    destroyAll() {
      this.$destroyAll();
    },
    showModal() {
      this.visible = true;
    },
    //跳转到测试报告详情
    showTestSummaryDetails(test_summary_key) {
      this.$router.push({
        //预留跳转
        path: "/testResultDetail",
        query: { summary_id: test_summary_key },
        //取参数 this.$route.params.id
      });
    },
  },
};
</script>
