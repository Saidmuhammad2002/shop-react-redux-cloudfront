import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<AvailableProduct[]>(
        `${API_PATHS.bff}/products`
      );
      return res.data;
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_PATHS.bff}/products/${id}`
      );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) => {
    const method = values.id ? "put" : "post";
    const url = values.id
      ? `${API_PATHS.bff}/products/${values.id}`
      : `${API_PATHS.bff}/products`;
    return axios({
      method,
      url,
      data: values,
      // headers: {
      //   Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      // },
    });
  });
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/products/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
