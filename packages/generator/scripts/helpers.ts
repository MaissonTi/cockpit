import fs from 'fs';
import { NodePlopAPI } from 'plop';
import {
  ActionReplace,
  ConfigReplace,
  EnumImport,
  EnumVerboRoute,
  PlopType,
} from './types';

export default function (plop: NodePlopAPI) {
  plop.setHelper('verbo', value => {
    const verbo = EnumVerboRoute[value || 'POST'];
    return `${verbo}`;
  });

  plop.setHelper('public', value => {
    return value ? `@Public()` : '';
  });

  plop.setHelper('or', function (value, fallback) {
    return value || fallback;
  });
}

export function injectModule(
  plopType: PlopType,
  modulePath: string,
  imports: EnumImport[],
  files: ActionReplace[],
) {
  const { plop, answers } = plopType;

  try {
    const fileContent = fs.readFileSync(modulePath, 'utf8');
    let updatedContent = addImports(imports, fileContent);
    updatedContent = replaceFileContent(updatedContent, files);
    fs.writeFileSync(
      modulePath,
      plop.renderString(updatedContent, answers),
      'utf8',
    );

    return 'Arquivo atualizado com sucesso.';
  } catch (error) {
    throw new Error(`Erro ao adicionar o ${imports}: ${error.message}`);
  }
}

function configToReplace(module: ActionReplace) {
  const mapperRegExp = new Map<ActionReplace, ConfigReplace>();

  mapperRegExp.set(ActionReplace.Imports, {
    name: 'imports',
    regex: /(imports:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName?.trim()}, {{ pascalCase usecase_name }}Module]`;
    },
  });

  mapperRegExp.set(ActionReplace.Exports, {
    name: 'exports',
    regex: /(exports:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}, {{ pascalCase usecase_name }}Module]`;
    },
  });

  mapperRegExp.set(ActionReplace.ProvidersRepo, {
    name: 'imports',
    regex: /(providers:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName?.trim()}, {{ pascalCase usecase_name }}Repository.toFactory()]`;
    },
  });

  mapperRegExp.set(ActionReplace.ExportsRepo, {
    name: 'exports',
    regex: /(exports:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}, {{ pascalCase usecase_name }}Repository.name]`;
    },
  });

  mapperRegExp.set(ActionReplace.ExportsFactory, {
    name: 'exports',
    regex: /(exports:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}, {{ pascalCase usecase_name }}UseCase.name]`;
    },
  });

  mapperRegExp.set(ActionReplace.Controllers, {
    name: 'controllers',
    regex: /(controllers:\s*\[)([^\]]*)\]/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}, {{ pascalCase usecase_name }}Controller]`;
    },
  });

  mapperRegExp.set(ActionReplace.ControllersAddConstructor, {
    name: 'constructor',
    regex: /(constructor\([\s\S]*?,)\s*(?=\n\s*\))/,
    template: (match, start, existingName, end) => {
      return `${start}
        @Inject({{ pascalCase usecase_name }}UseCase.name)
        private readonly {{ camelCase usecase_name }}UseCase: I{{ pascalCase usecase_name }}UseCase,
      `;
    },
  });

  mapperRegExp.set(ActionReplace.ControllersAdd, {
    name: 'router',
    regex: /import[\s\S]*?(?=}\s*$)/,
    template: (match, start, existingContent, end) => {
      return `${match}
          {{ verbo selected_verbo }}
          async execute(@Body() { name }: {{ pascalCase selected_module }}RequestDTO): Promise<{{ pascalCase selected_module }}ResponseDTO> {
            const result = await this.{{ camelCase usecase_name }}UseCase.execute({ value: name });
            return { name: result };
          }`;
    },
  });

  mapperRegExp.set(ActionReplace.ProvidersFactory, {
    name: 'providers',
    regex: /(providers:\s*\[\s*)((?:[^{}]*?{[^{}]*?}[^{}]*?)*)(\s*\])/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}
          {
            inject: [],
            provide: {{ pascalCase usecase_name }}UseCase.name,
            useFactory: () => new {{ pascalCase usecase_name }}UseCase(),
          },
      ${end}`;
    },
  });

  mapperRegExp.set(ActionReplace.ProvidersRepoFactory, {
    name: 'providers',
    regex: /(providers:\s*\[\s*)((?:[^{}]*?{[^{}]*?}[^{}]*?)*)(\s*\])/,
    template: (match, start, existingName, end) => {
      return `${start}${existingName.trim()}
          {
            inject: [{{ pascalCase selected_module }}Repository.name],
            provide: {{ pascalCase usecase_name }}UseCase.name,
            useFactory: ({{ camelCase selected_module }}Repository: {{ pascalCase selected_module }}Repository) => new {{ pascalCase usecase_name }}UseCase({{ camelCase selected_module }}Repository),
          },
      ${end}`;
    },
  });

  return mapperRegExp.get(module);
}

function replaceFileContent(fileContent: string, modules: ActionReplace[]) {
  let updatedContent = fileContent;

  modules.forEach((module: ActionReplace) => {
    const item = configToReplace(module);
    if (item) {
      const { regex, name, template } = item;
      updatedContent = updatedContent.replace(
        regex,
        (match, start, existingName, end) => {
          return template(match, start, existingName, end);
        },
      );
    }
  });

  return updatedContent;
}

function addImports(imports: EnumImport[], fileContent: string) {
  let updatedContent = fileContent;

  imports.map(importsName => {
    const mapperImport = new Map<EnumImport, string>();
    mapperImport.set(
      EnumImport.Module,
      `import { {{ pascalCase usecase_name }}Module } from './{{ kebabCase usecase_name }}/_{{ kebabCase usecase_name }}.module';\n`,
    );
    mapperImport.set(
      EnumImport.Controller,
      `import { {{ pascalCase usecase_name }}Controller } from './http/controllers/{{ kebabCase usecase_name }}.controller';\n`,
    );
    mapperImport.set(
      EnumImport.Repository,
      `import { {{ pascalCase usecase_name }}Repository } from './prisma/repositories/{{ kebabCase usecase_name }}.repository';\n`,
    );
    mapperImport.set(
      EnumImport.UseCase,
      `import { {{ pascalCase usecase_name }}UseCase } from './{{ kebabCase usecase_name }}.usecase';\n`,
    );

    mapperImport.set(
      EnumImport.RepositoryFolder,
      `import { {{ pascalCase selected_module }}Repository } from '@/infra/database/prisma/repositories/{{ kebabCase (or selected_module usecase_name) }}.repository';\n`,
    );
    mapperImport.set(
      EnumImport.UseCaseInterfaceFolder,
      `import { I{{ pascalCase usecase_name }}UseCase } from '@/domain/usecases/{{ kebabCase (or selected_module usecase_name) }}/{{ kebabCase usecase_name }}.usecase.interface';\n`,
    );
    mapperImport.set(
      EnumImport.UseCaseFolder,
      `import { {{ pascalCase usecase_name }}UseCase } from '@/app/usecases/{{ kebabCase (or selected_module usecase_name) }}/{{ kebabCase usecase_name }}.usecase';\n`,
    );
    mapperImport.set(
      EnumImport.Dtos,
      `import { {{ pascalCase usecase_name }}InputDTO, {{ pascalCase usecase_name }}OutputDTO } from '../dtos/{{ kebabCase usecase_name }}.dto';\n`,
    );

    const lastImportPattern = /import\s+.*;\n/g;
    const lastImportMatch = updatedContent.match(lastImportPattern);
    const lastImportIndex = lastImportMatch
      ? lastImportMatch?.index || 0 + lastImportMatch[0].length
      : 0;

    const newImportStatement = mapperImport.get(importsName);

    updatedContent = [
      updatedContent.slice(0, lastImportIndex),
      newImportStatement,
      updatedContent.slice(lastImportIndex),
    ].join('');
  });

  return updatedContent;
}
