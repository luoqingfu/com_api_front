<template>
  <div>
    <a-input-search
      placeholder="请输入搜索的url"
      style="width: 200px"
      v-model="search_key"
      @search="onSearch"
    />
    <a-button @click="refresh_data()">刷新</a-button>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <a>修改&nbsp;&nbsp;</a>
        <a-divider type="vertical" />
        <a
          type="dashed"
          @click="showDeleteConfirm(record.id)"
          style="color: red"
          >删除</a
        >
        <!-- <a @click="api_del(record.id)" style="color: red">删除</a> -->
      </span>
    </a-table>
  </div>
</template>
<script>
import service from "../../api";
import { serializeData } from "../../utils/common";
const columns = [
  {
    title: "接口id",
    dataIndex: "id",
    key: "id",
    //隐藏id列
    colSpan: 0,
    customRender: (value) => {
      let obj = {
        children: value,
        attrs: {},
      };
      obj.attrs.colSpan = 0;
      return obj;
    },
  },
  {
    title: "接口名称",
    dataIndex: "api_name",
    scopedSlots: { customRender: "api_name" },
  },
  {
    title: "Url",
    dataIndex: "url",
    ellipsis: true,
  },
  {
    title: "请求方式",
    dataIndex: "api_method",
    ellipsis: true,
  },
  {
    title: "请求参数",
    dataIndex: "request_data",
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    ellipsis: true,
  },
  {
    title: "项目",
    dataIndex: "project",
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "flag",
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
      service.get_api(obj).then((rsp) => {
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
        url: this.search_key,
      };
      service.search_api(re).then((rsp) => {
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
        //根据flag匹配该接口的状态
        if (raw_data[i]["flag"] === "1") {
          raw_data[i]["flag"] = "可执行";
        } else if (raw_data[i]["flag"] === "2") {
          raw_data[i]["flag"] = "不可执行";
        } else {
          raw_data[i]["flag"] = "未知";
        }
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
    showDeleteConfirm(del_key) {
      this.$confirm({
        title: "确定需要删除该条接口吗？",
        // content: "删除？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          let re = {
            id: del_key,
          };
          //逻辑删除
          service.delete_api(serializeData(re)).then((res) => {
            if (res.code === 200) {
              this.reload();
            } else {
              console.log(res.message);
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    refresh_data() {
      this.reload();
    },
  },
};
</script>
