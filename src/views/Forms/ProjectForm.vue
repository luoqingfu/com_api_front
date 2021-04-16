<template>
  <div>
    <a-input-search
      placeholder="请输入搜索的项目名称"
      style="width: 200px"
      v-model="search_key"
      @search="onSearch"
    />
    <a-button type="primary" @click="showModal"> 新建项目 </a-button>
    <a-modal
      title="新建项目"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="项目名称">
          <a-input
            v-decorator="[
              'project_name',
              {
                rules: [{ required: true, message: '请输入项目名称' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="根url">
          <a-input
            v-decorator="[
              'base_url',
              {
                rules: [{ required: true, message: '请输入根url' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="版本号">
          <a-input
            v-decorator="[
              'version',
              { rules: [{ required: true, message: '请输入版本号' }] },
            ]"
            placeholder="请输入版本号"
            >>
          </a-input>
        </a-form-item>
        <a-form-item label="项目类型">
          <a-select
            v-decorator="[
              'type',
              {
                rules: [{ required: true, message: '选择是项目类型' }],
              },
            ]"
            placeholder="选择是项目类型"
          >
            <a-select-option value="1"> APP </a-select-option>
            <a-select-option value="2"> WEB </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目描述">
          <a-input v-decorator="['description']" />
        </a-form-item>
        <a-form-item label="项目状态">
          <a-select
            v-decorator="[
              'status',
              {
                rules: [{ required: true, message: '选择是项目类型' }],
              },
            ]"
          >
            <a-select-option value="1">项目可用</a-select-option>
            <a-select-option value="2">项目不可用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
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
    title: "项目id",
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
    title: "项目名称",
    dataIndex: "project_name",
    scopedSlots: { customRender: "project_name" },
  },
  {
    title: "版本号",
    dataIndex: "version",
    ellipsis: true,
  },
  {
    title: "项目类型",
    dataIndex: "type",
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "status",
    ellipsis: true,
  },
  {
    title: "项目根域名",
    dataIndex: "base_url",
    ellipsis: true,
  },
  {
    title: "描述",
    dataIndex: "description",
    ellipsis: true,
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
        defaultPageSize: 10,
      },
      loading: false,
      columns,
      project: [],
      search_key: "",
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      send_request_test_data: "",
    };
  },

  computed: {},

  mounted() {
    this.fetch();
  },
  // created() {
  //   service.get_project().then((res) => (this.project = res.data));
  // },
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
      service.get_project(obj).then((rsp) => {
        const pagination = { ...this.pagination };
        pagination.total = rsp.total;
        this.loading = false;
        //存储原始的project数据
        this.project = rsp.data;
        this.data = this.change_to_name(rsp.data);
        this.pagination = pagination;
      });
    },
    //搜索接口
    onSearch() {
      let re = {
        projectName: this.search_key,
      };
      service.project_search(re).then((rsp) => {
        if (rsp.code === 200) {
          this.data = this.change_to_name(rsp.data);
        } else {
          this.data = [];
        }
      });
    },
    //把项目类型和状态改变为对应的中文
    change_to_name(raw_data) {
      let length = Object.keys(raw_data).length;
      for (let i = 0; i < length; i++) {
        //根据flag匹配该接口的状态
        if (raw_data[i]["status"] === "1") {
          raw_data[i]["status"] = "有效";
        } else if (raw_data[i]["status"] === "2") {
          raw_data[i]["status"] = "无效";
        } else {
          raw_data[i]["status"] = "未知";
        }
        //根据type匹配项目名称
        let project_type = raw_data[i]["type"];
        if (project_type === "1") {
          raw_data[i]["type"] = "APP";
        } else if (project_type === "2") {
          raw_data[i]["type"] = "WEB";
        } else {
          raw_data[i]["type"] = "未知";
        }
        // let project_length = Object.keys(this.project).length;
        // //使用id来获取projectname
        // for (let t = 0; t < project_length; t++) {
        //   if (this.project[t]["id"] == project_type) {
        //     raw_data[i]["project"] = this.project[t]["project_name"];
        //   }
        // }
      }
      let handle_data = raw_data;
      return handle_data;
    },
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
    //新建项目后弹出弹窗
    handleOk(e) {
      let _that = this;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          //请求新建项目接口
          service.project_create(serializeData(values)).then((rsp) => {
            if (rsp.code === 200) {
              //只有code=200时才关闭弹窗
              _that.$message.success(rsp.message, 2);
              _that.confirmLoading = true;
              setTimeout(() => {
                _that.visible = false;
                _that.confirmLoading = false;
                _that.reload();
              }, 1000);
            } else {
              _that.$message.error(rsp.message, 2);
            }
          });
        }
      });
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
};
</script>
