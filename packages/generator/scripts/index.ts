import { NodePlopAPI } from 'plop';
import addCrud from './commands/add-crud.plop';
import addUsecase from './commands/add-usecase.plop';
import execSync from './commands/exec-sync.plop';
import helpers from './helpers';
import partial from './partial';

export default function (plop: NodePlopAPI) {
  helpers(plop)
  partial(plop)
  addCrud(plop)
  addUsecase(plop)
  execSync(plop)
};

