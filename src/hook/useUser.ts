import { useState } from "react";
import useSWR from "swr";

export function useUser() {
  const { data: user, mutate: setUser } = useSWR(
    "USER",
    () => {
      const { auth } = window["_tcb"];
      return auth.currentUser;
    },
    { fallbackData: null }
  );

  const [loading, setLoading] = useState(false);
  const touch = (cb) => {
    const { auth } = window["_tcb"];
    setUser(auth.currentUser, false);
    cb();
  };
  const login = async (username, password, cb) => {
    const { app, auth } = window["_tcb"];
    try {
      setLoading(true);
      const dataRes: any = await app.callFunction({
        name: "auth",
        data: { username, password },
      });
      const { ticket, adminNum } = dataRes.result;
      if (ticket) {
        auth
          .customAuthProvider()
          .signIn(ticket)
          .then((res) => {
            const user = auth.currentUser;
            user!.update({ nickName: username });
            user!.updateUsername(username);
            setUser(user, false);
            if (adminNum === 0) {
              app
                .callFunction({
                  name: "auth",
                  data: { uid: user!.uid },
                })
                .then(() => {
                  cb(null, user);
                });
            } else {
              cb(null, user);
            }
          })
          .catch((err) => {
            cb(err, null);
          });
      } else {
        cb(new Error(`用户名或密码错误`), null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    const { auth } = window["_tcb"];
    auth.signOut();
    setUser(null, false);
  };
  return {
    user,
    touch,
    login,
    logout,
    loading,
  };
}
