import { createApp, App as Application } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/style/common.scss";
import ElementPlus from "element-plus";
import i18n from "./i18n";
// import "@/style/element-reset.scss";
// import directive from "@/common/directive";
import EMQSelect from "@/components/EmqSelect.vue";

function globalComponents(app: Application) {
  app.component(EMQSelect.name, EMQSelect);
}

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(globalComponents)
  .mount("#app");
