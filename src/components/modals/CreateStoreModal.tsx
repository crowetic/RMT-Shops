import { FC, ChangeEvent, useState, useEffect } from "react";
import { Typography, Modal, FormControl, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleCreateStoreModal } from "../../state/features/globalSlice";
import ImageUploader from "../common/ImageUploader";
import {
  ModalTitle,
  StoreLogoPreview,
  AddLogoButton,
  AddLogoIcon,
  TimesIcon,
  LogoPreviewRow,
  CustomInputField,
  ModalBody,
  ButtonRow,
  CancelButton,
  CreateButton
} from "./CreateStoreModal-styles";

export interface onPublishParam {
  title: string;
  description: string;
  shipsTo: string;
  location: string;
  storeIdentifier: string;
  logo: string;
}

interface CreateStoreModalProps {
  open: boolean;
  closeCreateStoreModal: boolean;
  setCloseCreateStoreModal: (val: boolean) => void;
  onPublish: (param: onPublishParam) => Promise<void>;
  username: string;
}

const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  open,
  closeCreateStoreModal,
  setCloseCreateStoreModal,
  onPublish,
  username
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [shipsTo, setShipsTo] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [storeIdentifier, setStoreIdentifier] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const handlePublish = async (): Promise<void> => {
    try {
      setErrorMessage("");
      if (!logo) {
        setErrorMessage("A logo is required");
        return;
      }
      await onPublish({
        title,
        description,
        shipsTo,
        location,
        storeIdentifier,
        logo
      });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleClose = (): void => {
    setTitle("");
    setDescription("");
    setErrorMessage("");
    dispatch(toggleCreateStoreModal(false));
  };

  const handleInputChangeId = (event: ChangeEvent<HTMLInputElement>) => {
    // Replace any non-alphanumeric and non-space characters with an empty string
    // Replace multiple spaces with a single dash and remove any dashes that come one after another
    let newValue = event.target.value
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (newValue.toLowerCase().includes("post")) {
      // Replace the 'post' string with an empty string
      newValue = newValue.replace(/post/gi, "");
    }
    if (newValue.toLowerCase().includes("q-shop")) {
      // Replace the 'q-shop' string with an empty string
      newValue = newValue.replace(/q-shop/gi, "");
    }
    setStoreIdentifier(newValue);
  };

  // Close modal when closeCreateStoreModal is true and reset closeCreateStoreModal to false. This is done once the data container is created inside the GlobalWrapper createStore function.
  useEffect(() => {
    if (closeCreateStoreModal) {
      handleClose();
      setCloseCreateStoreModal(false);
    }
  }, [closeCreateStoreModal]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalBody>
        <ModalTitle id="modal-title">Create Shop</ModalTitle>
        {!logo ? (
          <ImageUploader onPick={(img: string) => setLogo(img)}>
            <AddLogoButton>
              Add Shop Logo
              <AddLogoIcon
                sx={{
                  height: "25px",
                  width: "auto"
                }}
              ></AddLogoIcon>
            </AddLogoButton>
          </ImageUploader>
        ) : (
          <LogoPreviewRow>
            <StoreLogoPreview src={logo} alt="logo" />
            <TimesIcon
              color={theme.palette.text.primary}
              onClickFunc={() => setLogo(null)}
              height={"32"}
              width={"32"}
            ></TimesIcon>
          </LogoPreviewRow>
        )}

        <CustomInputField
          id="modal-title-input"
          label="qortal://URL-PREVIEW"
          value={`/${username}/${storeIdentifier}`}
          // onChange={(e) => setTitle(e.target.value)}
          fullWidth
          disabled={true}
          variant="filled"
        />

        <CustomInputField
          id="modal-shopId-input"
          label="SHOP ID (this will be part of your qortal://url)"
          value={storeIdentifier}
          onChange={handleInputChangeId}
          fullWidth
          inputProps={{ maxLength: 25 }}
          required
          variant="filled"
        />

        <CustomInputField
          id="modal-title-input"
          label="SHOP TITLE: (your title)"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          fullWidth
          required
          variant="filled"
          inputProps={{ maxLength: 50 }}
        />

        <CustomInputField
          id="modal-description-input"
          label="DESCRIPTION: (of your shop)"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
          variant="filled"
        />

        <CustomInputField
          id="modal-location-input"
          label="LOCATION: (shop location)"
          value={location}
          onChange={(e: any) => setLocation(e.target.value)}
          fullWidth
          required
          variant="filled"
        />

        <CustomInputField
          id="modal-shipsTo-input"
          label="SHOP SHIPS TO: (country/region/state)"
          value={shipsTo}
          onChange={(e: any) => setShipsTo(e.target.value)}
          fullWidth
          required
          variant="filled"
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}></FormControl>
        {errorMessage && (
          <Typography color="error" variant="body1">
            {errorMessage}
          </Typography>
        )}
        <ButtonRow>
          <CancelButton variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </CancelButton>
          <CreateButton variant="contained" onClick={handlePublish}>
            Publish NEW Shop
          </CreateButton>
        </ButtonRow>
      </ModalBody>
    </Modal>
  );
};

export default CreateStoreModal;
