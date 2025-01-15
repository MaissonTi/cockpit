import { NodePlopAPI } from 'plop';
import crud from './commands/crud.plop';
import usecase from './commands/usecase.plop';
import init from './scripts';

export default function (plop: NodePlopAPI) {
  init(plop);
  crud(plop);
  usecase(plop);
}
