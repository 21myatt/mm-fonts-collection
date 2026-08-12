import HomePage from "./pages/HomePage";
import OpenSourceFontsPage from "./pages/OpenSourceFontsPage";
import { RouterProvider, useRouter } from "./router";

function App() {
  return (
    <RouterProvider>
      <AppRoute />
    </RouterProvider>
  );
}

function AppRoute() {
  const { path } = useRouter();
  return path === "/open-source-fonts" ? <OpenSourceFontsPage /> : <HomePage />;
}

export default App;
