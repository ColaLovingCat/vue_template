import type { SystemInfos } from "@/commons/types/datas.types";

const appConfigs: SystemInfos = {
  name: "Demo System",
  loginMode: "sso-only",
  azure: "request",
  azureAuto: false,
  azureConfigs: {
    host: "https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/oauth2/v2.0/authorize",
    client_id: "ec12a58c-3742-415a-bf6e-7116beb38af6",
    scope: "api://ec12a58c-3742-415a-bf6e-7116beb38af6/sso",
    response_type: "code",
  },
};

export default appConfigs;
