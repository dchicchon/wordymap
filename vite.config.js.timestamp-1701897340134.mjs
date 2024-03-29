// vite.config.js
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
var vite_config_default = defineConfig({
  base: "/wordymap/",
  plugins: [react(), VitePWA({
    registerType: "autoUpdate", devOptions: { enabled: true }, manifest: {

    }
  })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGFuaWVsY2hpY2Nob24vQ29kZS9yZWFjdFByb2plY3RzL3JlYWN0LXdvcmR5bWFwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGFuaWVsY2hpY2Nob24vQ29kZS9yZWFjdFByb2plY3RzL3JlYWN0LXdvcmR5bWFwL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kYW5pZWxjaGljY2hvbi9Db2RlL3JlYWN0UHJvamVjdHMvcmVhY3Qtd29yZHltYXAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy93b3JkeW1hcC8nLFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgVml0ZVBXQSh7IHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLCBkZXZPcHRpb25zOiB7IGVuYWJsZWQ6IHRydWUgfSB9KV1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVWLFNBQVMsb0JBQW9CO0FBQ3BYLFNBQVMsZUFBZTtBQUV4QixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxRQUFRLEVBQUUsY0FBYyxjQUFjLFlBQVksRUFBRSxTQUFTLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDM0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
