import { NodePlopAPI } from 'plop';
import { PlopType } from './types';

export default function (plop: NodePlopAPI) {
  plop.setActionType('add-partial', answers => {
    usecaseOnlyRepoImport({ plop, answers });
    usecaseOnlyRepoConstructor({ plop, answers });

    return 'Partial adicionado com sucesso.';
  });
}

export function usecaseOnlyRepoConstructor(plopType: PlopType): void {
  const { plop, answers } = plopType;
  let value = 'constructor() {}\n';
  if (answers?.is_connection_repository) {
    value =
      'constructor(private readonly {{ camelCase selected_module }}Repository: I{{ pascalCase selected_module }}Repository) {}\n';
  }
  plop.setPartial(
    'usecaseOnlyRepoConstructor',
    plop.renderString(value, answers),
  );
}

export function usecaseOnlyRepoImport(plopType: PlopType): void {
  const { plop, answers } = plopType;
  let value = '\n';
  if (answers?.is_connection_repository) {
    value = `import { I{{ pascalCase selected_module }}Repository } from '@/domain/protocols/database/repositories/{{ kebabCase selected_module }}.repository.interface';\n`;
  }
  plop.setPartial('usecaseOnlyRepoImport', plop.renderString(value, answers));
}
