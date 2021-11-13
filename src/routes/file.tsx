import * as React from 'react';
import Loading from '../components/loading';
import Loadable from "react-loadable";
import { useEffect, useState } from 'react';
import { useCollection } from '../hook/useCollection';
import { message, Popconfirm, Image } from 'antd';
import 'antd/lib/image/style/index.less'
import _ from "lodash";

export interface IFileProps {
}
const collectionName = "File"

const LoadableProList = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "pro-list" */
      /* webpackMode: "lazy" */
      "@ant-design/pro-list"
    ),
  loading: Loading,
});

export default function File(props: IFileProps) {
  const [data, setData]: any = useState([])
  const [page, setPage] = useState({ current: 1, pageSize: 10 })
  const [total, setTotal] = useState(0)
  const { find, remove } = useCollection(collectionName);
  const { app } = window["_tcb"];

  useEffect(() => {
    reGetData();
    return () => {
    }
  }, [page])

  const removeFile = (id, fileID) => {
    app.deleteFile({
      fileList: [fileID]
    }).then((res) => {
      res.fileList.forEach((el) => {
        if (el.code === "SUCCESS") {
          remove(id, () => {
            message.info('删除成功');
            reGetData();
          })
        } else {
        }
      });
    });
  }

  const reGetData = async () => {
    let _data: any = await find({ current: page.current, pageSize: page.pageSize }, {});
    let data = _.map(_data.data, (d) => {
      return {
        actions: [<Popconfirm
          key="link_del"
          placement="top"
          title={
            <div style={{ marginLeft: "8px" }}>
              <h4>删除数据</h4>
              <label style={{ color: "red" }}>
                将删除此数据，且删除后不可恢复
              </label>
              ，你还要继续吗？
            </div>
          }
          onConfirm={async () => {
            removeFile(d._id, d.fileID)
          }}
        >
          <a>删除</a>
        </Popconfirm>],
        content: (<Image
          src={`${d.url}?imageView2/5/w/300/h/300`}
          preview={{
            src: `${d.url}`,
          }}

        />),
      }
    })
    setData(data);
  };

  return (
    <LoadableProList<any>
      pagination={{
        defaultPageSize: page.pageSize,
        showSizeChanger: false,
        total: total,
        onChange: (page, pageSize) => {
          setPage({ current: page, pageSize: pageSize })
        }
      }}
      grid={{ gutter: 8, column: 8 }}
      metas={{
        content: {},
        actions: { cardActionProps: 'actions' },
      }}
      dataSource={data}
    />
  );
}
