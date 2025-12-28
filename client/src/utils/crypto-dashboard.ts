export enum Crypto_Action_Type {
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
  SET_PAGE = "SET_PAGE",
  SET_MARKET_CAP_FILTER = "SET_MARKET_CAP_FILTER",
  SET_IS_TABLE_LOADING = "SET_IS_TABLE_LOADING",
}

export type CryptoState = {
  searchQuery: string;
  page: number;
  marketCapFilter: string;
  isTableLoading: boolean;
};

export type CryptoAction = {
  type: Crypto_Action_Type;
  payload: {
    searchQuery?: string;
    page?: number;
    marketCapFilter?: string;
    isTableLoading?: boolean;
  };
};

export const cryptoInitialState: CryptoState = {
  searchQuery: "",
  page: 1,
  marketCapFilter: "all",
  isTableLoading: true,
};

export const cryptoReducer = (
  state: CryptoState,
  action: CryptoAction
): CryptoState => {
  switch (action.type) {
    case Crypto_Action_Type.SET_SEARCH_QUERY: {
      return {
        ...state,
        searchQuery: action.payload.searchQuery || "",
        page: 1,
        isTableLoading: true,
      };
    }
    case Crypto_Action_Type.SET_PAGE: {
      return {
        ...state,
        page: action.payload.page || 1,
        isTableLoading: true,
      };
    }
    case Crypto_Action_Type.SET_MARKET_CAP_FILTER: {
      return {
        ...state,
        marketCapFilter: action.payload.marketCapFilter || "all",
        isTableLoading: true,
      };
    }
    case Crypto_Action_Type.SET_IS_TABLE_LOADING: {
      return {
        ...state,
        isTableLoading: !!action.payload.isTableLoading,
      };
    }
  }
};

export const getCryptoFetchUri = (state?: CryptoState): string => {
  const updatedUri = new URLSearchParams();

  if (state?.searchQuery) {
    updatedUri.append("searchTerm", state.searchQuery);
  }

  if (state?.page !== undefined) {
    updatedUri.append("page", state.page.toString());
  }

  if (state?.marketCapFilter !== undefined) {
    updatedUri.append("marketCapFilter", state.marketCapFilter);
  }

  return updatedUri.toString();
};
