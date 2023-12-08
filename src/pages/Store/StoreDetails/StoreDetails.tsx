import { FC } from "react";
import moment from "moment";
import EmailIcon from "@mui/icons-material/Email";
import {
  CardRow,
  Divider,
  EmailUser,
  StoreLogo,
  IconsRow,
  HeaderRow,
  CardDetailsContainer,
  StoreTitle,
  StoreDescription,
} from "./StoreDetails-styles";
import { OwnerSVG } from "../../../assets/svgs/OwnerSVG";
import { useTheme } from "@mui/material";
import { CalendarSVG } from "../../../assets/svgs/CalendarSVG";
import { CloseIconModal } from "../StoreReviews/StoreReviews-styles";
import { DescriptionSVG } from "../../../assets/svgs/DescriptionSVG";
import { LocationSVG } from "../../../assets/svgs/LocationSVG";
import { ShippingSVG } from "../../../assets/svgs/ShippingSVG";

interface StoreDetailsProps {
  storeTitle: string;
  storeImage: string;
  storeOwner: string;
  storeDescription: string;
  dateCreated: number;
  location: string;
  shipsTo: string;
  setOpenStoreDetails: (open: boolean) => void;
}

export const StoreDetails: FC<StoreDetailsProps> = ({
  storeTitle,
  storeImage,
  storeDescription,
  storeOwner,
  dateCreated,
  location,
  shipsTo,
  setOpenStoreDetails,
}) => {
  const theme = useTheme();
  return (
    <>
      <HeaderRow>
        <StoreLogo src={storeImage} alt={`${storeTitle}-logo`} />
        <StoreTitle>{storeTitle}</StoreTitle>
        <CloseIconModal
          onClickFunc={() => setOpenStoreDetails(false)}
          color={theme.palette.text.primary}
          height={"24"}
          width={"24"}
        />
      </HeaderRow>
      <Divider />
      <CardDetailsContainer>
        <CardDetailsContainer style={{ gap: "15px" }}>
          <CardRow>
            <IconsRow>
              <OwnerSVG
                width={"22"}
                height={"22"}
                color={theme.palette.text.primary}
              />
              Store Owner
            </IconsRow>
            {storeOwner}
          </CardRow>
          <CardRow>
            <IconsRow>
              <DescriptionSVG
                width={"22"}
                height={"22"}
                color={theme.palette.text.primary}
              />
              Store Description
            </IconsRow>
            <StoreDescription>{storeDescription}</StoreDescription>
          </CardRow>
          <CardRow>
            <IconsRow>
              <CalendarSVG
                width={"22"}
                height={"22"}
                color={theme.palette.text.primary}
              />
              Date Created
            </IconsRow>
            {moment(dateCreated).format("llll")}
          </CardRow>
          <CardRow>
            <IconsRow>
              <LocationSVG
                color={theme.palette.text.primary}
                width={"22px"}
                height={"22px"}
              />
              Shop Location
            </IconsRow>
            {location}
          </CardRow>
          <CardRow>
            <IconsRow>
              <ShippingSVG
                color={theme.palette.text.primary}
                width={"22px"}
                height={"22px"}
              />
              Ships To
            </IconsRow>
            {shipsTo}
          </CardRow>
          <CardRow>
            <IconsRow>
              <EmailIcon
                sx={{
                  color: theme.palette.text.primary,
                  width: "22px",
                  height: "22px",
                }}
              />
              Email
            </IconsRow>
            <EmailUser
              href={`qortal://APP/Q-Mail/to/${storeOwner}`}
              className="qortal-link"
            >
              Message {storeOwner} on Q-Mail
            </EmailUser>
          </CardRow>
        </CardDetailsContainer>
      </CardDetailsContainer>
    </>
  );
};
