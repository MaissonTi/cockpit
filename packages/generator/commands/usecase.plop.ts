import fs from "fs";
import path from "path";
import { ActionType, NodePlopAPI } from 'plop';

const ROOT_MONOREPO = path.resolve("..", "..");

export default function (plop: NodePlopAPI) {

	plop.setGenerator('Create UseCase', {
		description: 'Create a new UseCase package inside `./backend` folder',
		prompts: [
      {
        type: "input",
        name: "usecase_name",
        message: "Qual é o nome do usecase?",
        validate: function (value) {
          if ((/^[A-Za-z\s-]+$/).test(value)) {
            return true;
          }
          return 'Nome do usecase inválido';
        }
      },
      {
        type: 'confirm',
        name: 'is_connection_module',
        message: 'Deseja vincular usecase a um módulo existente?',
        default: true,
      },
      {
        type: 'list',
        name: 'selected_module',
        message: 'Selecione uma pasta de módulo:',
        when: (answers) => answers.is_connection_module,
        choices: () => {
          const directoryPath = path.resolve(ROOT_MONOREPO, 'apps/backend/src/app/usecases');
          return fs.readdirSync(directoryPath).filter((file) => {
            return fs.statSync(path.join(directoryPath, file)).isDirectory();
          });
        },
      },
      {
        type: 'confirm',
        name: 'is_connection_repository',
        message: 'Deseja adicionar repository do modulo no usecase?',
        default: true,
        when: (answers) => answers.is_connection_module,
      },
      {
        type: 'confirm',
        name: 'is_connection_controller',
        message: 'Deseja adicionar nova rota ao controller do modulo?',
        default: true,
        when: (answers) => answers.is_connection_module,
      },
      {
        type: 'list',
        name: 'selected_verbo',
        message: 'Selecione o verbo',
        when: (answers) => answers.create_controller || answers.is_connection_controller,
        choices: () => {
          return ['GET', 'POST', 'PUT', 'DELETE'];
        },
      },
      {
        type: 'confirm',
        name: 'is_public_router',
        message: 'Rota publica?',
        when: (answers) => answers.create_controller,
        default: true,
      },
      {
        type: 'confirm',
        name: 'create_controller',
        message: 'Deseja criar controller?',
        default: true,
        when: (answers) => !answers.is_connection_module,
      },
    ],
		actions: function(data) {
      let actions: ActionType[] = [];
      actions.push({ type: 'add-partial' })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/backend/src/app/usecases", "{{ kebabCase (or selected_module usecase_name) }}", "{{kebabCase usecase_name}}.usecase.ts"),
        templateFile: "templates/backend/usecase-only/usecase.ts.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/backend/src/domain/usecases", "{{ kebabCase (or selected_module usecase_name) }}", "{{kebabCase usecase_name}}.usecase.interface.ts"),
        templateFile: "templates/backend/usecase-only/usecase.interface.ts.hbs",
        skipIfExists: true,
      })

      if(!(data?.is_connection_module)){
        actions.push({
          type: "add",
          path: path.resolve(ROOT_MONOREPO, "apps/backend/src/app/usecases", "{{ kebabCase (or selected_module usecase_name) }}", "_{{kebabCase usecase_name}}.module.ts"),
          templateFile: "templates/backend/usecase-only/usecase.module.ts.hbs",
          skipIfExists: true,
        })
      }

      if(data?.create_controller){
        actions.push({
          type: "add",
          path: path.resolve(ROOT_MONOREPO, "apps/backend/src/presentation/http/controllers", "{{kebabCase usecase_name}}.controller.ts"),
          templateFile: "templates/backend/usecase-only/usecase.controller.ts.hbs",
          skipIfExists: true,
        })

        actions.push({
          type: "add",
          path: path.resolve(ROOT_MONOREPO, "apps/backend/src/presentation/http/dtos", "{{kebabCase usecase_name}}.dto.ts"),
          templateFile: "templates/backend/usecase-only/usecase.dto.ts.hbs",
          skipIfExists: true,
        })
      }

      actions.push({ type: 'add-usecase' })

      actions.push({ type: 'format-code-back' })

      return actions;
    }
	});
}
