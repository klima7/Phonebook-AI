import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  {
    path: "/login",
    id: "login",
    file: "routes/login.tsx"
  },
  {
    path: "/register",
    id: "register",
    file: "routes/register.tsx"
  }
] satisfies RouteConfig;
