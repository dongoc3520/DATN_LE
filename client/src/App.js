import "./App.css";
import { Fragment, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import DefaultLayout from "./Layouts/DefaultLayout";
import { getCookie } from "./Cookie";
import Authen from "./pages/authen/Authen";
import NotFound from "./pages/NotFound/NotFound";
import { DataProvider } from "./DataContext";

const token = getCookie("token");

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          {token ? (
            <>
              <Routes>
                {publicRoutes.map((route, index) => {
                  const Page = route.Component;
                  let Layout = DefaultLayout;
                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    />
                  );
                })}
                <Route path="*" element={<NotFound />} />,
              </Routes>
              {/* <Route path="*" element={<NotFound />} />, */}
            </>
          ) : (
            <>
              <Authen />
            </>
          )}
        </div>
      </Router>
    </DataProvider>
  );
}
export default App;
