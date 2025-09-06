export const tools = [
  // ... existing tools ...
  {
    name: "UI Component Library",
    path: "/ui-component-library",
    description: "Browse and use beautiful UI components from the uiverse-io/galaxy repository",
    category: "UI Design",
    component: lazy(() => import("./UiComponentLibrary")),
  },
  // ... existing tools ...
];