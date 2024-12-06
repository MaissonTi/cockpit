import path from "path";
import { NodePlopAPI } from "plop";
import { injectModule } from "../helpers";
import { ActionReplace, EnumImport, PlopType } from "../types";

const ROOT_MONOREPO = path.resolve("..", "..");

export default function (plop: NodePlopAPI) {

  plop.setActionType('add-crud', (answers) => {
    addModuleController({plop, answers})
    addModuleUserCase({plop, answers})
    addModuleRepository({plop, answers})
    return 'CRUD criado com sucesso.';
  });

}

function addModuleController({ plop, answers}: PlopType){
  const modulePathController = path.resolve(ROOT_MONOREPO, "apps/backend/src/presentation/_presentation.module.ts")
  injectModule({ plop, answers}, modulePathController, [EnumImport.Controller], [ActionReplace.Controllers] )
}

function addModuleUserCase({ plop, answers}: PlopType){
  let pathUrl = "apps/backend/src/app/usecases/_usecases.module.ts"
  const modulePathUsecases = path.resolve(ROOT_MONOREPO, pathUrl)
  injectModule({ plop, answers}, modulePathUsecases, [EnumImport.Module], [ActionReplace.Imports, ActionReplace.Exports]);
}

function addModuleRepository({ plop, answers}: PlopType){
  const modulePathRepo = path.resolve(ROOT_MONOREPO, "apps/backend/src/infra/database/_database.module.ts")
  injectModule({ plop, answers}, modulePathRepo, [EnumImport.Repository], [ActionReplace.ProvidersRepo, ActionReplace.ExportsRepo]);
}
