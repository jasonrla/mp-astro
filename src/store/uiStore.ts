import { signal } from "@preact/signals-react";

export const isSidebarOpen = signal(false);

export const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

export const closeSidebar = () => {
  isSidebarOpen.value = false;
};

export const openSidebar = () => {
  isSidebarOpen.value = true;
};
