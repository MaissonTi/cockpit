import path from "path";
import { NodePlopAPI } from "plop";
import { injectModule } from "../helpers";
import { ActionReplace, EnumImport, PlopType } from "../types";

const ROOT_MONOREPO = path.resolve("..", "..");

export default function (plop: NodePlopAPI) {

  plop.setActionType('add-usecase', (answers) => {

    if(answers.selected_module){
      addUseCaseInModule({plop, answers})
      if(answers.is_connection_controller){
        addUseCaseInController({plop, answers})
      }
    }else{
      addModuleUserCase({plop, answers})
      if(answers.create_controller){
        addModuleController({plop, answers})
      }
    }
    return 'Módulo adicionado com sucesso.';
  });

}

function addModuleUserCase({ plop, answers}: PlopType){
  let pathUrl = "apps/backend/src/app/usecases/_usecases.module.ts"
  const modulePathUsecases = path.resolve(ROOT_MONOREPO, pathUrl)
  injectModule({ plop, answers}, modulePathUsecases, [EnumImport.Module], [ActionReplace.Imports, ActionReplace.Exports]);
}

function addModuleController({ plop, answers}: PlopType){
  const modulePathController = path.resolve(ROOT_MONOREPO, "apps/backend/src/presentation/_presentation.module.ts")
  injectModule({ plop, answers}, modulePathController, [EnumImport.Controller], [ActionReplace.Controllers] )
}

function addUseCaseInController({ plop, answers}: PlopType){
  let pathUrl = `apps/backend/src/presentation/http/controllers/${answers.selected_module}.controller.ts`
  const modulePathUsecases = path.resolve(ROOT_MONOREPO, pathUrl)
  injectModule({ plop, answers}, modulePathUsecases, [EnumImport.UseCaseFolder, EnumImport.UseCaseInterfaceFolder, EnumImport.Dtos], [ActionReplace.ControllersAddConstructor, ActionReplace.ControllersAdd]);
}

function addUseCaseInModule({ plop, answers}: PlopType){
  let pathUrl = `apps/backend/src/app/usecases/${answers.selected_module}/_${answers.selected_module}.module.ts`
  const modulePathUsecases = path.resolve(ROOT_MONOREPO, pathUrl)
  if(answers.is_connection_repository){
    return injectModule({ plop, answers}, modulePathUsecases, [EnumImport.UseCase], [ActionReplace.ProvidersRepoFactory, ActionReplace.ExportsFactory]);
  }

  return injectModule({ plop, answers}, modulePathUsecases, [EnumImport.UseCase], [ActionReplace.ProvidersFactory, ActionReplace.ExportsFactory]);
}

