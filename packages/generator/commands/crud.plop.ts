import path from "path";
import { ActionType, NodePlopAPI } from 'plop';

const ROOT_MONOREPO = path.resolve("..", "..");

export default function (plop: NodePlopAPI) {
	plop.setGenerator('Create CRUD', {
		description: 'Create a new CRUD package inside `./api` folder',
		prompts: [
      {
        type: "input",
        name: "usecase_name",
        message: "Informe o nome do model?",
        validate: function (value) {
          if ((/^[A-Za-z\s-]+$/).test(value)) {
            return true;
          }
          return 'Nome do model inválido';
        }
      }
    ],
    actions: function(data) {
      let actions: ActionType[] = [];
      
      // #### Model ####
      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/domain/models", "{{kebabCase usecase_name}}.model.ts"),
        templateFile: "templates/backend/crud/model.hbs",
        skipIfExists: true,
      })

      // #### Database ####
      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/domain/protocols/database/repositories", "{{kebabCase usecase_name}}.repository.interface.ts"),
        templateFile: "templates/backend/crud/database/repository.interface.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/infra/database/prisma/repositories", "{{kebabCase usecase_name}}.repository.ts"),
        templateFile: "templates/backend/crud/database/repository.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/infra/database/prisma/mapper", "{{kebabCase usecase_name}}.mapper.ts"),
        templateFile: "templates/backend/crud/database/mapper.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "append",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/infra/database/prisma", "schema.prisma"),
        templateFile: "templates/backend/crud/database/prisma.hbs",
      })

      // #### UseCase's ####
      actions.push({
        type: "addMany",
        destination: path.resolve(ROOT_MONOREPO, "apps/api/src/app/usecases", "{{kebabCase usecase_name}}"),
        base: "templates/backend/crud/usecase",
        templateFiles: "templates/backend/crud/usecase/*.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "addMany",
        destination: path.resolve(ROOT_MONOREPO, "apps/api/src/domain/usecases", "{{kebabCase usecase_name}}"),
        base: "templates/backend/crud/usecase.interface",
        templateFiles: "templates/backend/crud/usecase.interface/*.hbs",
        skipIfExists: true,
      })

      // #### UseCase's Tests ####
      actions.push({
        type: "addMany",
        destination: path.resolve(ROOT_MONOREPO, "apps/api/test/unit/app/usecases", "{{kebabCase usecase_name}}"),
        base: "templates/backend/crud/usecase.test",
        templateFiles: "templates/backend/crud/usecase.test/*.usecase.spec.ts.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/test/_mock/model", "{{kebabCase usecase_name}}.mock.ts"),
        templateFile: "templates/backend/crud/usecase.test/mock.ts.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/test/_mock/repository", "{{kebabCase usecase_name}}.repository.mock.ts"),
        templateFile: "templates/backend/crud/usecase.test/repository.mock.ts.hbs",
        skipIfExists: true,
      })

      // #### Controller's ####
      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/presentation/http/controllers", "{{kebabCase usecase_name}}.controller.ts"),
        templateFile: "templates/backend/crud/http/controller.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/presentation/http/dtos", "{{kebabCase usecase_name}}.dto.ts"),
        templateFile: "templates/backend/crud/http/dtos.hbs",
        skipIfExists: true,
      })

      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/src/presentation/http/presenters", "{{kebabCase usecase_name}}.presenter.ts"),
        templateFile: "templates/backend/crud/http/presenter.hbs",
        skipIfExists: true,
      })

      // #### Client ####
      actions.push({
        type: "add",
        path: path.resolve(ROOT_MONOREPO, "apps/api/.http", "{{kebabCase usecase_name}}.http"),
        templateFile: "templates/backend/crud/http/client.http.hbs",
        skipIfExists: true,
      })

      // #### Utils ####
      actions.push({ type: 'add-crud' })

      actions.push({ type: 'format-code-back' })

      actions.push({ type: 'prisma-generate' })

      return actions;
    }
	});
}
