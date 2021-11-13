import _ from "lodash";

export function useCollection(name) {
  const collectionName = _.capitalize(name);

  const find = async (params, sorter) => {
    const { current, pageSize, ...querys } = params;
    const { app, auth } = window["_tcb"];
    const db = app.database();


    return new Promise(async (resolve, reject) => {
      try {
        let queryLink = db.collection(collectionName);
        if (_.toPairs(sorter).length > 0) {
          let orderObj = _.toPairs(sorter);
          let orderKey = orderObj[0][0];
          let orderDirection = orderObj[0][1] == "ascend" ? "asc" : "desc";
          queryLink = queryLink.orderBy(orderKey, orderDirection);
        } else {
          queryLink = queryLink.orderBy("created", "desc");
        }
        if (_.toPairs(querys).length > 0) {
          let whereArr = _.toPairs(querys);
          let whereObj = {};
          whereArr.forEach((q) => {
            whereObj[q[0]] = new db.RegExp({
              regexp: `.*${q[1]}.*`,
              options: "i",
            });
          });
          queryLink = queryLink.where(whereObj);
        }

        const countRes = await queryLink.count();
        const total = countRes.total;

        const dataRes = await queryLink
          .limit(pageSize)
          .skip((current - 1) * pageSize)
          .get();
        const data = dataRes.data;
        resolve({
          data,
          total,
          success: true,
        });
      } catch (error) {
        reject({
          data: [],
          total: 0,
          success: false,
        });
      }
    });
  };

  const findById = async (id, cb) => {
    const { app, auth } = window["_tcb"];
    // const uid = auth.currentUser.uid;
    const db = app.database();
    const dataRes = await db
      .collection(collectionName)
      .where({ _id: id })
      .get();
    if (dataRes.data.length > 0) {
      cb(null, dataRes.data[0]);
    } else {
      cb(new Error("无法找到这条数据"), null);
    }
  };

  const add = async (data, cb) => {
    const { app, auth } = window["_tcb"];
    const db = app.database();
    data.uid = auth.currentUser.uid;
    data.created = new Date().getTime();
    data.updated = new Date().getTime();
    let res = await db.collection(collectionName).add(data);
    cb(res);
  };

  const update = async (id, data, cb) => {
    const { app, auth } = window["_tcb"];
    const db = app.database();
    const uid = auth.currentUser.uid;
    data.updated = new Date().getTime();
    delete data._id;
    delete data._openid;
    const dataRes = await db
      .collection(collectionName)
      .where({ _id: id })
      .update(data);
    cb();
  };

  const remove = async (id, cb) => {
    const { app, auth } = window["_tcb"];
    const db = app.database();
    const uid = auth.currentUser.uid;
    await db.collection(collectionName).where({ _id: id }).remove();
    cb();
  };


  const batchRemove = async (ids, cb) => {
    const { app, auth } = window["_tcb"];
    const db = app.database();
    await db.collection(collectionName).where({ _id: db.command.in(ids) }).remove();
    cb();
  };

  return {
    find,
    findById,
    add,
    update,
    remove,
    batchRemove
  };
}
