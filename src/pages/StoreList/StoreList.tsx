import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import LazyLoad from "../../components/common/LazyLoad";
import { Store, upsertStores } from "../../state/features/storeSlice";
import { useFetchStores } from "../../hooks/useFetchStores";
import {
  StoresContainer,
  MyStoresCard,
  MyStoresCheckbox,
  WelcomeRow,
  WelcomeFont,
  WelcomeSubFont,
  WelcomeCol,
  QShopLogo,
  LogoRow,
  StoresRow
} from "./StoreList-styles";
import { Grid, Skeleton, useTheme } from "@mui/material";
import { StoreCard } from "../Store/StoreCard/StoreCard";
import { withTimeout } from "../../utils/withTimeout";
import { TIMEOUT } from "../../constants/timeout";
import QShopLogoLight from "../../assets/img/RMT-logo-2.png";
import QShopLogoDark from "../../assets/img/RMT-logo-2.png";
import DefaultStoreImage from "../../assets/img/RMT-logo-2.png";
import { STORE_BASE } from "../../constants/identifiers";

export const StoreList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const user = useSelector((state: RootState) => state.auth.user);

  const [filterUserStores, setFilterUserStores] = useState<boolean>(false);

  // TODO: Need skeleton at first while the data is being fetched
  // Will rerender and replace if the hashmap wasn't found initially
  const hashMapStores = useSelector(
    (state: RootState) => state.store.hashMapStores
  );

  // Fetch My Stores from Redux
  const myStores = useSelector((state: RootState) => state.store.myStores);
  const stores = useSelector((state: RootState) => state.store.stores);

  const { getStore, checkAndUpdateResource } = useFetchStores();

  const getUserStores = useCallback(async () => {
    try {
      const offset = stores.length;
      const query = STORE_BASE;
      // Fetch list of user stores' resources from Qortal blockchain
      const url = `/arbitrary/resources/search?service=STORE&query=${query}&limit=20&mode=ALL&prefix=true&includemetadata=false&offset=${offset}&reverse=true`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      // Data returned from that endpoint of the API
      // tags, category, categoryName are not being used at the moment
      const structureData = responseData.map((storeItem: any): Store => {
        return {
          title: storeItem?.metadata?.title,
          category: storeItem?.metadata?.category,
          categoryName: storeItem?.metadata?.categoryName,
          tags: storeItem?.metadata?.tags || [],
          description: storeItem?.metadata?.description,
          created: storeItem.created,
          updated: storeItem.updated,
          owner: storeItem.name,
          id: storeItem.identifier
        };
      });
      // Add stores to localstate & guard against duplicates
      const copiedStores: Store[] = [...stores];
      structureData.forEach((storeItem: Store) => {
        const index = stores.findIndex((p: Store) => p.id === storeItem.id);
        if (index !== -1) {
          copiedStores[index] = storeItem;
        } else {
          copiedStores.push(storeItem);
        }
      });
      dispatch(upsertStores(copiedStores));
      // Get the store raw data from getStore API Call only if the hashmapStore doesn't have the store or if the store is more recently updated than the existing store
      for (const content of structureData) {
        if (content.owner && content.id) {
          const res = checkAndUpdateResource({
            id: content.id,
            updated: content.updated
          });
          // If the store is not already inside the hashmap, fetch the store raw data. We wrap this function in a timeout util function because stores with errors will hang the app and take a long time to load. With this, the max load time will be of 5 seconds for an error store.
          if (res) {
            getStore(content.owner, content.id, content);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [stores]);

  // Get all stores on mount or if user changes
  const getStores = useCallback(async () => {
    await getUserStores();
  }, [getUserStores, user?.name]);

  // Filter to show only the user's stores

  const handleFilterUserStores = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterUserStores(event.target.checked);
  };

  // Memoize the filtered stores to prevent rerenders
  const filteredStores = useMemo(() => {
    if (filterUserStores) {
      return myStores;
    } else {
      return stores;
    }
  }, [filterUserStores, stores, myStores, user?.name]);

  return (
    <>
      <StoresContainer container>
        <WelcomeRow item xs={12}>
          <LogoRow>
            <QShopLogo
              src={
                theme.palette.mode === "dark" ? QShopLogoLight : QShopLogoDark
              }
              alt="Q-Shop Logo"
            />
            <WelcomeCol>
              <WelcomeFont><center>RMT-Shops ⛰</center></WelcomeFont>
              <WelcomeSubFont>
                Create a shop and sell goods/services or find and buy items with RMT points.
              </WelcomeSubFont>
            </WelcomeCol>
          </LogoRow>
          <WelcomeCol>
            {user && (
              <MyStoresCard>
                <MyStoresCheckbox
                  checked={filterUserStores}
                  onChange={handleFilterUserStores}
                  inputProps={{ "aria-label": "controlled" }}
                />
                See My Shops
              </MyStoresCard>
            )}
          </WelcomeCol>
        </WelcomeRow>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {filteredStores.length > 0 &&
              filteredStores
                // Get rid of the Bester shop (test shop)
                .filter((store: Store) => store.owner !== "Bester")
                .map((store: Store) => {
                  let storeItem = store;
                  let hasHash = false;
                  const existingStore = hashMapStores[store.id];

                  // Check in case hashmap data isn't there yet due to async API calls.
                  // If it's not there, component will rerender once it receives the metadata
                  if (existingStore) {
                    storeItem = existingStore;
                    hasHash = true;
                  }
                  const storeId = storeItem?.id || "";
                  const storeOwner = storeItem?.owner || "";
                  const storeTitle = storeItem?.title || "Invalid Shop";
                  const storeLogo = storeItem?.logo || DefaultStoreImage;
                  const storeDescription = storeItem?.description || "";
                  if (!hasHash) {
                    return (
                      <StoresRow
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={3}
                        key={storeId}
                      >
                        <Skeleton
                          variant="rectangular"
                          style={{
                            width: "100%",
                            height: "460px",
                            paddingBottom: "10px",
                            objectFit: "contain",
                            visibility: "visible",
                            borderRadius: "8px"
                          }}
                        />
                      </StoresRow>
                    );
                  } else {
                    return (
                      <StoreCard
                        storeTitle={storeTitle || ""}
                        storeLogo={storeLogo || ""}
                        storeDescription={storeDescription || ""}
                        storeId={storeId || ""}
                        storeOwner={storeOwner || ""}
                        key={storeId}
                        userName={user?.name || ""}
                      />
                    );
                  }
                })}
            <LazyLoad onLoadMore={getStores}></LazyLoad>
          </Grid>
        </Grid>
      </StoresContainer>
    </>
  );
};
