import { Image, Transformation } from "cloudinary-react";
import { useRecordContext, NumberInput } from "react-admin";
import FilterIcon from "@mui/icons-material/Filter";

export const SmallImageField = ({ width }) => {
  const record = useRecordContext();
  if (record && record.image && record.image.s3_url) {
    const imageUrl = new URL(record.image.s3_url);
    const imageKey = imageUrl.pathname.substring(1);
    const body = {
      bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      key: imageKey,
      edits: {
        resize: {
          width: width,
          fit: "contain",
        },
      },
    };
    const imageRequest = JSON.stringify(body);
    const url = `${process.env.REACT_APP_CLOUDFRONT_API_ENDPOINT}/${btoa(
      imageRequest
    )}`;
    return (
      <span>
        <img src={url} />
      </span>
    );
  }
  return record && record.image ? (
    <span>
      <Image publicId={record.image.public_id} secure="true">
        <Transformation width={width} crop="fill" />
        <Transformation fetchFormat="auto" quality="80" />
      </Image>
    </span>
  ) : null;
};

export const DimensionsField = () => {
  const record = useRecordContext();

  if (record && record.dimensions) {
    if (record.dimensions.diameter) {
      return <span>&oslash; {record.dimensions.diameter} cm</span>;
    }
    if (record.dimensions.depth) {
      return (
        <span>
          {record.dimensions.height}x{record.dimensions.width}x
          {record.dimensions.depth} cm
        </span>
      );
    }
    return (
      <span>
        {record.dimensions.height}x{record.dimensions.width} cm
      </span>
    );
  }
  return null;
};

export const YearField = () => {
  const record = useRecordContext();

  if (record.isDateUnknown) {
    return <span>unbekannt</span>;
  }
  if (record.isDateNotExact) {
    return <span>ca. {new Date(record.publishedDate).getFullYear()}</span>;
  }
  if (record.publishedDateAlternative) {
    return (
      <span>
        {new Date(record.publishedDate).getFullYear()}
        {record.dateDivider}
        {new Date(record.publishedDateAlternative).getFullYear()}
      </span>
    );
  }
  if (record.publishedDate) {
    return <span>{new Date(record.publishedDate).getFullYear()}</span>;
  }
  return <span></span>;
};

export const ImagesField = () => {
  const record = useRecordContext();
  return record && record.images && record.images.length > 1 ? (
    <span>
      <FilterIcon />
    </span>
  ) : (
    <span></span>
  );
};

export const DimensionsInput = () => {
  const record = useRecordContext();

  return (
    <span>
      <NumberInput source="dimensions.height" label="Höhe" />
      <NumberInput source="dimensions.width" label="Breite" />
      <NumberInput source="dimensions.depth" label="Tiefe" />
      <NumberInput source="dimensions.diameter" label="Durchmesser" />
    </span>
  );
};

export const LocationNameField = () => {
  const record = useRecordContext();
  if (record && record.name) {
    return <span>Lagerort: {record.name}</span>;
  }
  if (record && record.name == "") {
    return <span>Lagerort eingeben</span>;
  }
  return null;
};

export const LocationButtonAdd = () => {
  const record = useRecordContext();
  return record && record.locations && record.locations.length ? (
    <p>zum Ändern klicken</p>
  ) : (
    <CreateLocationButton record={record} />
  );
};
