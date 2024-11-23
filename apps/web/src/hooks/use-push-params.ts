import { usePathname, useRouter, useSearchParams } from "next/navigation";

//interface AnyFields { [key: string]: unknown }

interface Route<T extends Record<string, unknown>> {
  path?: string,
  search?: T | string
  noClearParams?: boolean
}

export function usePushParams<T extends Record<string, unknown>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  async function back(){
    router.back();
  }

  async function push({ path, search }: Route<T>){
    if(search && typeof search === 'string'){
      search = _stringToJsonParams(search);
    }

    const content = new URLSearchParams(search as Record<string, string>).toString();

    if(!path && !search){
      throw new Error('You must provide a path or search');
    }

    if(path && !search ){
      router.push(path);
      return
    }

    router.push(path ? `${path}?${content}` : `${pathname}?${content}`);
  }

  async function clear(search?: (keyof T)[]) {
    const result = new URLSearchParams(searchParams);

    result.forEach((_, key) => {
      if(search?.includes(key) || !search){
        result.delete(key);
      }
    });

    if(result.size === 0){
      router.push(pathname);
    }else{
      router.push(`${pathname}?${result.toString()}`);
    }

  }

  function _stringToJsonParams(params: string): T{
    const result = new URLSearchParams(params);

    const obj = {} as T;

    result.forEach((_, key) => {
      if(key) obj[key as keyof T] = result.get(key) as T[keyof T];
    });

    return obj;
  }

  return [push, searchParams, back, clear] as const
}
