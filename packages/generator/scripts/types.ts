import { NodePlopAPI } from "plop"

export enum EnumVerboRoute {
  GET = "@Get()",
  POST = "@Post()",
  PUT = "@Put()",
  DELETE = "@Delete()"
}

export enum EnumPrefix {
  Module = "Module",
  UseCase = "UseCase",
  UseCaseInterface = "UseCaseInterface",
  UseCaseController = "UseCaseController",
  Controller = "Controller",
  Repository = "Repository",
  Providers = "Providers",
  Dtos = 'Dtos'
}

export enum EnumImport {
  Module = "Module",
  UseCase = "UseCase",
  UseCaseInterface = "UseCaseInterface",
  Controller = "Controller",
  Repository = "Repository",
  Providers = "Providers",
  Dtos = 'Dtos',
  UseCaseInterfaceFolder = "UseCaseInterfaceFolder",
  UseCaseFolder = "UseCaseFolder",
  RepositoryFolder = "RepositoryFolder"
}

export type ConfigReplace = {
  name: string
  regex: RegExp
  template: Function
}

export enum ActionReplace {
  Imports = "Imports",
  Controllers = "Controllers",
  ControllersAdd = "ControllersAdd",
  ControllersAddConstructor = "ControllersAddConstructor",
  Providers = "Providers",
  Exports = "Exports",
  ProvidersFactory = "ProvidersFactory",
  ExportsFactory = "ExportsFactory",
  ProvidersRepoFactory = "ProvidersRepoFactory",
  ExportsRepo = "ExportsRepo",
  ProvidersRepo = "ProvidersRepo",
}

export type PlopType = {
  plop: NodePlopAPI
  answers: any
}
