"use client";

import { z } from "zod";
import { Loader2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQuery, useMutation } from "@tanstack/react-query";
import UserService from "@/services/user.service";
import { UserListSkeleton } from "./user-list-skeleton";
import { UserListRow, RetrunAction } from "./user-list-row";
import { Pagination } from "@/components/composition/pagination";
import { usePushParams } from "@/hooks/use-push-params";

import { useAlertDialog } from "@/hooks/use-alert";
import { queryClient } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import { UserListFilters } from "./user-list-filters";

export default function UserList() {
  const { alertDialog, dismiss } = useAlertDialog();
  const [push, searchParams] = usePushParams<{
    page: string;
  }>();

  const currentPage = z.coerce
    .number()
    .transform((page) => page)
    .parse(searchParams.get("page") ?? "1");

  const {
    data: result,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user-list-page", currentPage, searchParams.get("name")],
    queryFn: () =>
      UserService.list({
        currentPage: currentPage,
        perPage: 10,
        filters: {
          name: searchParams.get("name") || "",
        },
      }),
  });

  const { mutateAsync: userDelete } = useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-list-page", currentPage, searchParams.get("name")],
      });
    },
  });

  function handlePaginate(pageIndex: number) {
    const result = new URLSearchParams(searchParams);
    result.set("page", String(pageIndex));

    push({ search: result.toString() });
  }

  function handleEdit(values: { id: string }) {
    push({ path: `/users/form/${values.id}` });
  }

  function handleDelete(values: { id: string }) {
    alertDialog({
      title: "Edit User",
      isAsync: true,
      callback: async (typeAction) => {
        if (typeAction === "confirm") {
          await userDelete(values?.id);
          dismiss();
        }
      },
    });
  }

  function handleAction({
    type,
    values,
  }: RetrunAction & { values: { id: string } }) {
    const hashmap: Map<string, () => void> = new Map();
    hashmap.set("edit", () => handleEdit(values));
    hashmap.set("delete", () => handleDelete(values));

    const actionFn = hashmap.get(type);
    if (actionFn) {
      actionFn();
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Usuarios
            {isFetching && (
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <Button onClick={() => push({ path: `/users/form` })}> Criar </Button>
        </div>

        <div className="space-y-2.5">
          <UserListFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dt criado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !result && <UserListSkeleton />}

                {result?.data &&
                  result.data.map((user) => {
                    return (
                      <UserListRow
                        key={user.id}
                        data={user}
                        onAction={handleAction}
                      />
                    );
                  })}

                {result && result.total === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={currentPage}
              totalCount={result?.total}
              perPage={result?.perPage}
              lastPage={result?.lastPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}
