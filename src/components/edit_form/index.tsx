import { UploadOutlined } from '@ant-design/icons';
import { FormDialog, FormItem, FormLayout, Input, Upload as AntUpload } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { Button, message } from 'antd';
import * as React from 'react';
import { useCollection } from '../../hook/useCollection';
import _ from 'lodash';
import { nanoid } from 'nanoid'
import { imgFields } from '../../utils';

export interface IEditFormProps {
    schema
    children
    title
    collectionName
    onSuccess?
    id?
}
const Upload = (props) => {

    const { add, remove } = useCollection('File');

    const { app } = window["_tcb"];
    props = _.merge({}, props, {
        onRemove(file) {
            remove(file.response.id, () => {
                app.deleteFile({
                    fileList: [file.response.fileID]
                }).then((res) => {
                    res.fileList.forEach((el) => {
                        if (el.code === "SUCCESS") {
                            message.info('删除成功');
                        } else {
                        }
                    });
                });
            })
            return true;
        },
        customRequest({
            action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess,
            withCredentials,
        }) {
            app.uploadFile({
                cloudPath: `upload/${nanoid()}.${file.name.split('.').pop()}`,
                filePath: file,
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress({ percent: percentCompleted }, file);
                }
            }).then((result) => {
                add({ url: _.head(result.download_url.split('?')), fileID: result.fileID }, (res) => {
                    message.success('上传成功');
                    onSuccess({ url: _.head(result.download_url.split('?')), fileID: result.fileID, id: res.id }, file);
                })
            });
            return {
                abort() {
                    console.log('upload progress is aborted.');
                },
            };
        }
    })
    return (
        <AntUpload {...props}>
            <Button icon={<UploadOutlined />}>{props.textContent}</Button>
        </AntUpload>
    )
}


const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input, Upload
    },
})
export default function EditForm(props: IEditFormProps) {
    const { schema, children, title, collectionName, onSuccess, id } = props;

    const { add, findById, update } = useCollection(collectionName);

    const zipImgField = (data) => {
        let res = {}
        _.forIn(data, (v, k) => {
            if (_.indexOf(imgFields, k) > -1 && v.length > 0) {
                res[k] = [
                    {
                        name: v[0].name,
                        size: v[0].size,
                        url: v[0].url,
                        response: {
                            fileID: v[0].response.fileID,
                            id: v[0].response.id,
                        },
                    }
                ]
            } else {
                res[k] = v;
            }
        })
        return res
    }

    let handleClick = () => {

        FormDialog(title, () => {
            return (
                <FormLayout labelCol={6} wrapperCol={10}>
                    <SchemaField schema={schema} />
                    <FormDialog.Footer>
                    </FormDialog.Footer>
                </FormLayout>
            )
        }).forOpen((payload, next) => {
            if (id != null) {
                findById(id, (err, data) => {
                    next({
                        initialValues: data,
                    })
                })
            } else {
                next();
            }
        }).forConfirm((payload, next) => {

            let data = zipImgField(payload.values)

            if (id != null) {
                update(id, data, () => {
                    next(payload)
                    onSuccess && onSuccess()
                })
            } else {
                add(data, () => {
                    next(payload)
                    onSuccess && onSuccess()
                })
            }
        }).forCancel((payload, next) => {
            next(payload)
        }).open().then()
    }
    return React.cloneElement(children, { onClick: handleClick })
}
