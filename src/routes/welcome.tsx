import * as React from 'react';
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import Loadable from "react-loadable";
import Loading from '../components/loading';
import { Button, message, Popconfirm, Space, Table, Tooltip, Image } from 'antd';
import 'antd/lib/image/style/index.less'
import EditForm from '../components/edit_form';
import _ from "lodash";
import { useCollection } from '../hook/useCollection';
import { useRef } from 'react';
import { genColumns } from '../utils';

export interface IWelcomeProps {
}

const collectionName = "Project"
const schema = {
  "type": "object",
  "properties": {
    "title": {
      "title": "标题",
      "type": "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      "x-validator": [],
      "x-component-props": {},
      "x-decorator-props": {},
      "required": true,
      "_designableId": "kwyefnfw9nd",
      "x-index": 0,
      "x-designable-id": "7g0m427yn2i",
      "name": "title"
    },
    "subTitle": {
      "title": "副标题",
      "type": "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      "x-validator": [],
      "x-component-props": {},
      "x-decorator-props": {},
      "required": true,
      "_designableId": "kwyefnfw9nd",
      "x-index": 1,
      "x-designable-id": "vbcacear2kp",
      "name": "subTitle"
    },
    "image": {
      "type": "Array<object>",
      "title": "图片",
      "x-decorator": "FormItem",
      "x-component": "Upload",
      "x-component-props": {
        "textContent": "Upload",
        "accept": "image/gif,image/jpeg,image/jpg,image/png,image/svg"
      },
      "x-validator": [],
      "x-decorator-props": {},
      "x-designable-id": "rc893efqbdy",
      "x-index": 2,
      "name": "image"
    }
  },
  "x-designable-id": "d20c5jo3baz"
}

const LoadableProTable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "pro-table" */
      /* webpackMode: "lazy" */
      "@ant-design/pro-table"
    ),
  loading: Loading,
});

export default function Welcome(props: IWelcomeProps) {

  let actionRef: any = useRef<ActionType>();
  const { find, remove, batchRemove } = useCollection(collectionName);
  const reGetData = async () => {
    actionRef.current!.reload();
  };

  let columns = genColumns({
    schema, reGetData, collectionName, remove
  });

  return (
    <LoadableProTable
      actionRef={actionRef}
      columns={columns}
      request={(params, sorter, filter) => {
        return find(params, sorter);
      }}
      rowSelection={{}}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return (
          <Space size={16}>
            <Popconfirm
              key="link_del"
              placement="topRight"
              title={
                <div style={{ marginLeft: "8px" }}>
                  <h4>删除数据</h4>
                  <label style={{ color: "red" }}>
                    将删除选中的{selectedRowKeys.length}条数据，且删除后不可恢复
                  </label>
                  ，你还要继续吗？
                </div>
              }
              onConfirm={async () => {
                batchRemove(selectedRowKeys, () => {
                  actionRef.current!.clearSelected();
                  message.success(`${selectedRowKeys.length}条数据删除成功`);
                  reGetData();
                })
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      }}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showQuickJumper: true,
      }}
      search={{ filterType: 'light' }}
      dateFormatter="string"
      // headerTitle="表格标题"
      toolBarRender={() => [
        <EditForm schema={schema} title="创建" collectionName={collectionName} onSuccess={reGetData}>
          <Button type="primary" key="primary" >
            创建
          </Button>
        </EditForm>
      ]}>
    </LoadableProTable>
  );
}