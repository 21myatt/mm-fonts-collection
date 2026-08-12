import HomePage from "./pages/HomePage";
import OpenSourceFontsPage from "./pages/OpenSourceFontsPage";
import TextToPngPage from "./pages/TextToPngPage";
import WordArtPage from "./pages/WordArtPage";
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
  if (path === "/open-source-fonts") return <OpenSourceFontsPage />;
  if (path === "/word-art") return <WordArtPage />;
  if (path === "/text-2-png") return <TextToPngPage />;
  return <HomePage />;
}

export default App;
