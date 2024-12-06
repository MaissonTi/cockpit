import { execSync } from 'node:child_process';
import path from "path";
import { NodePlopAPI } from 'plop';

const ROOT_MONOREPO = path.resolve("..", "..");

export default function (plop: NodePlopAPI) {
  plop.setActionType('format-code-back', () => {
    console.log('Executando formatação...');
    execSync('npm run format:gen && npm run lint', {
      cwd: path.resolve(ROOT_MONOREPO, "apps/api"),
      stdio: 'inherit'
    });
    return 'Formatação concluída com sucesso!';
  });

  plop.setActionType('prisma-generate', () => {
    console.log('Executando generate...');
    execSync('npm run prisma:generate', {
      cwd: path.resolve(ROOT_MONOREPO, "apps/api"),
      stdio: 'inherit'
    });
    return 'Generate concluído com sucesso!';
  });
}


