<template>
  <div>
    <a-input-search
      placeholder="请输入搜索的url"
      style="width: 200px"
      v-model="search_key"
      @search="onSearch"
    />
    <a-button type="primary" @click="showModal"> 新建接口 </a-button>
    <a-modal
      title="新建接口"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="接口名称">
          <a-input
            v-decorator="[
              'api_name',
              {
                rules: [{ required: true, message: '请输入接口名称' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="接口路径">
          <a-input
            v-decorator="[
              'url',
              {
                rules: [{ required: true, message: '请输入接口路径' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="请求方法">
          <a-select
            v-decorator="[
              'api_method',
              {
                rules: [{ required: true, message: '选择接口请求方法' }],
              },
            ]"
            placeholder="选择接口请求方法"
          >
            <a-select-option value="get"> get </a-select-option>
            <a-select-option value="post"> post </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否执行">
          <a-select
            v-decorator="[
              'flag',
              {
                rules: [{ required: true, message: '选择是否执行该接口' }],
              },
            ]"
            placeholder="选择是否执行该接口"
          >
            <a-select-option value="1"> 执行 </a-select-option>
            <a-select-option value="2"> 不执行 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="请求参数">
          <a-input v-decorator="['request_data']" />
        </a-form-item>
        <a-form-item label="请选择项目">
          <a-select
            v-decorator="[
              'project',
              {
                rules: [{ required: true, message: '请选择项目' }],
              },
            ]"
            placeholder="请选择项目"
          >
            <!-- 遍历project取出id -->
            <a-select-option
              v-for="item in project"
              :key="item.project_name"
              :value="item.id"
            >
              {{ item.project_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- @click="refresh_data()">刷新</!-->
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="record.flag === '执行'" @click="edit_api_status(2, record.id)"
          >设为不执行</a
        >
        <a
          v-else-if="record.flag === '不执行'"
          @click="edit_api_status(1, record.id)"
          >设为执行</a
        >
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
          raw_data[i]["flag"] = "执行";
        } else if (raw_data[i]["flag"] === "2") {
          raw_data[i]["flag"] = "不执行";
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
      let _that = this;
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
    //修改接口状态1是执行，2是不执行
    edit_api_status(flag_key, id_key) {
      let _that = this;
      let re = { flag: flag_key, id: id_key };
      service.edit_api(serializeData(re)).then((res) => {
        if (res.code === 200) {
          _that.$message.success(res.message, 2);
          _that.reload();
        } else {
          _that.$message.error(res.message, 2);
          _that.reload();
        }
      });
    },
    showModal() {
      this.visible = true;
    },
    //点击ok后弹出弹窗
    handleOk(e) {
      let _that = this;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          //请求新建api接口
          service.create_api(serializeData(values)).then((rsp) => {
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
