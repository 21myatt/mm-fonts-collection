import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type RoutePath = "/" | "/open-source-fonts" | "/word-art" | "/text-2-png";

interface RouterContextValue {
  path: RoutePath;
  navigate: (path: RoutePath) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const appPath = (path: string) =>
  basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;

const browserPath = (path: RoutePath) => `${basePath}${path === "/" ? "/" : path}`;

const normalizePath = (path: string): RoutePath => {
  const pathWithoutBase = appPath(path);
  if (pathWithoutBase === "/open-source-fonts") return "/open-source-fonts";
  if (pathWithoutBase === "/word-art") return "/word-art";
  if (pathWithoutBase === "/text-2-png") return "/text-2-png";
  return "/";
};

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<RoutePath>(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((nextPath: RoutePath) => {
    const nextBrowserPath = browserPath(nextPath);
    if (window.location.pathname !== nextBrowserPath) {
      window.history.pushState(null, "", nextBrowserPath);
    }
    setPath(nextPath);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("useRouter must be used inside RouterProvider");
  return value;
}
