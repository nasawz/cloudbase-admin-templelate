import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,

} from "react-router-dom";
import Layout from './layout';
import Login from './routes/login';

import cloudbase from '@cloudbase/js-sdk';
import { useUser } from './hook/useUser';
import RequireAuth from './components/require_auth';
import Welcome from './routes/welcome';
import File from './routes/file';

function App() {

  const [inited, setInited] = useState(false);
  const { touch } = useUser();
  const { REACT_APP_TCB_ENV_ID } = process.env;



  useEffect(() => {
    const app = cloudbase.init({
      env: `${REACT_APP_TCB_ENV_ID}`,
    });
    const auth = app.auth({ persistence: 'local' });
    window['_tcb'] = { app, auth };
    touch(() => {
      setInited(true);
    });
  }, []);

  if (!inited) {
    return <div></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/console/welcome" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/console" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
        <Route path="welcome" element={<Welcome />} />
          <Route path="file" element={<File />} />
          <Route index element={<Welcome />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;